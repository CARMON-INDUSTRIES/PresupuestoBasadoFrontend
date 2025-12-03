<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1200px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center">Matriz de Indicadores para Resultados</div>
      </q-card-section>

      <q-markup-table flat bordered class="q-mb-lg">
        <tbody>
          <tr>
            <td class="bg-primary text-white text-weight-bold">Programa Presupuestario:</td>
            <td>{{ usuario.programaPresupuestario || '' }}</td>
            <td class="bg-primary text-white text-weight-bold" style="width: 30%">
              Unidad Responsable:
            </td>
            <td>{{ usuario.nombreMatriz || usuario.cargo || '' }}</td>
          </tr>
          <tr>
            <td class="bg-primary text-white text-weight-bold">Responsable:</td>
            <td>{{ usuario.nombreCompleto || '' }}</td>

            <td class="bg-primary text-white text-weight-bold" style="width: 30%">
              Unidad Presupuestal Responsable de la Elaboración de la MIR:
            </td>
            <td>{{ usuario.unidadesPresupuestales || '' }}</td>
          </tr>
        </tbody>
      </q-markup-table>

      <q-table
        flat
        bordered
        separator="cell"
        :rows="filas"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <template v-if="props.col.name === 'nivel'">
              <span class="text-grey-7">{{ props.row.nivel }}</span>
            </template>

            <template v-else-if="props.col.name === 'resumenNarrativo'">
              <div class="row items-center no-wrap">
                <div class="col">
                  <span v-if="props.row.resumenNarrativo">{{ props.row.resumenNarrativo }}</span>
                  <span v-else class="text-grey-6">Sin capturarㅤ</span>
                </div>
                <div class="col-auto">
                  <q-btn
                    size="sm"
                    flat
                    color="primary"
                    icon="note_add"
                    label="Capturar"
                    @click="abrirModal(props.row)"
                  />
                </div>
              </div>
            </template>

            <template v-else>
              {{ props.row[props.col.name] }}
            </template>
          </q-td>
        </template>
      </q-table>

      <div class="q-mt-md text-right">
        <q-btn color="primary" label="Siguiente" :loading="loading" @click="guardarMatriz" />
      </div>

      <q-dialog v-model="modalVisible" persistent>
        <q-card style="min-width: 520px">
          <q-card-section class="q-pb-none">
            <div class="text-h6">Captura — {{ filaSeleccionada?.nivel }}</div>
            <div class="text-caption text-grey-7">
              Complete los campos de acuerdo con la sintaxis y lineamientos.
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-mb-md" v-for="(campo, idx) in camposNarrativos" :key="idx">
              <q-input
                v-model="camposNarrativos[idx]"
                :label="labelsNarrativos[idx]"
                filled
                autogrow
              />
            </div>

            <q-input
              v-model="indicadoresTemp"
              label="Indicadores (solo nombre)"
              type="textarea"
              filled
              autogrow
              class="q-mb-md"
            />

            <q-input
              v-model="mediosTemp"
              label="Medios de verificación"
              type="textarea"
              filled
              autogrow
              class="q-mb-md"
            />

            <q-input v-model="supuestosTemp" label="Supuestos" type="textarea" filled autogrow />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn flat label="Guardar" color="primary" @click="guardarNarrativo" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)

const BASE_STORAGE_KEY = 'mirMatrizIndicadores'
let userName = null
let storageKey = BASE_STORAGE_KEY

const usuario = ref({})
const filas = ref([])

const modalVisible = ref(false)
const filaSeleccionada = ref(null)
const camposNarrativos = ref([])
const labelsNarrativos = ref([])
const indicadoresTemp = ref('')
const mediosTemp = ref('')
const supuestosTemp = ref('')

const columns = [
  { name: 'nivel', label: 'Nivel', align: 'left' },
  { name: 'resumenNarrativo', label: 'Resumen Narrativo' },
  { name: 'indicadores', label: 'Indicadores (solo nombre)' },
  { name: 'medios', label: 'Medios de verificación' },
  { name: 'supuestos', label: 'Supuestos' },
]

// ------------------------------
//       MULTIUSUARIO
// ------------------------------
async function resolveUserName() {
  let user = localStorage.getItem('userNameActual')

  if (user) return user

  try {
    const { data } = await api.get('/Cuentas/me')
    user = data?.userName || data?.username || null
    if (user) localStorage.setItem('userNameActual', user)
    return user
  } catch {
    return null
  }
}

// ------------------------------
//  Crear estructura de la MIR
// ------------------------------
function crearFila(nivel) {
  return {
    nivel,
    resumenNarrativo: '',
    indicadores: '',
    medios: '',
    supuestos: '',
  }
}

// ------------------------------
//       ON MOUNTED
// ------------------------------
onMounted(async () => {
  userName = await resolveUserName()
  storageKey = userName ? `${BASE_STORAGE_KEY}_${userName}` : BASE_STORAGE_KEY

  console.log('✔ Usuario detectado:', userName)
  console.log('✔ Usando storage key:', storageKey)

  try {
    const me = await api.get('/Cuentas/me')
    usuario.value = me.data || {}

    const objetivoRes = await api.get('/ArbolObjetivos/ultimo')
    const objetivo = objetivoRes.data || { componentes: [] }

    const f = []
    f.push(crearFila(`Fin: ${objetivo.fin || ''}`))
    f.push(crearFila(`Propósito: ${objetivo.objetivoCentral || ''}`))

    objetivo.componentes?.forEach((c, ci) => {
      f.push(crearFila(`Componente: ${c?.nombre || `Componente ${ci + 1}`}`))

      c.medios?.forEach((m, mi) => {
        f.push(crearFila(`Actividad: ${m || `Actividad ${mi + 1}`}`))
      })
    })

    filas.value = f

    // Cargar versión específica del usuario si existe
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      filas.value = JSON.parse(saved)
      console.log('✔ MIR cargada desde:', storageKey)
    }
  } catch (error) {
    console.error('Error al cargar MIR:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar la MIR desde Árbol de Objetivos' })
  }
})

// ------------------------------
// Guardado automático por usuario
// ------------------------------
watch(
  filas,
  (newVal) => {
    localStorage.setItem(storageKey, JSON.stringify(newVal))
  },
  { deep: true },
)

// ------------------------------
//         GUARDAR API
// ------------------------------
async function guardarMatriz() {
  loading.value = true
  try {
    const payload = {
      matriz: {
        unidadResponsable: usuario.value.nombreMatriz || usuario.value.cargo,
        unidadPresupuestal: usuario.value.unidadesPresupuestales,
        programaSectorial: usuario.value.programaSectorial,
        programaPresupuestario: usuario.value.programaPresupuestario,
      },
      filas: filas.value,
    }

    await api.post('/MatrizIndicadores', payload)

    // Registrar última ruta por usuario
    if (userName) {
      localStorage.setItem(`ultimaRutaRegistro_${userName}`, '/formulario-matriz-indicadores')
    } else {
      localStorage.setItem('ultimaRutaRegistro', '/formulario-matriz-indicadores')
    }

    Notify.create({ type: 'positive', message: 'Matriz guardada correctamente' })
    router.push('/formulario-ficha-tecnica-1')
  } catch (error) {
    console.error('❌ Error al guardar MIR:', error)
    Notify.create({ type: 'negative', message: 'Error al guardar la MIR' })
  } finally {
    loading.value = false
  }
}

// ------------------------------
// Modal para narrativos
// ------------------------------
function obtenerLabelsParaNivel(nivel) {
  if (nivel.startsWith('Fin'))
    return ['Contribuir a un objetivo superior (ej: mejorar calidad de vida)']
  if (nivel.startsWith('Propósito'))
    return ['Sujeto beneficiario', 'Verbo en presente', 'Resultado logrado']
  if (nivel.startsWith('Componente'))
    return ['Producto o servicio proporcionado', 'Verbo en pasado participio']
  if (nivel.startsWith('Actividad'))
    return ['Sustantivo derivado de verbo', 'Complemento (acciones o procesos)']
  return ['Texto general']
}

function abrirModal(row) {
  filaSeleccionada.value = row
  labelsNarrativos.value = obtenerLabelsParaNivel(row.nivel)
  const partes = (row.resumenNarrativo || '').split(' | ')
  camposNarrativos.value = labelsNarrativos.value.map((_, i) => partes[i] ?? '')
  indicadoresTemp.value = row.indicadores || ''
  mediosTemp.value = row.medios || ''
  supuestosTemp.value = row.supuestos || ''
  modalVisible.value = true
}

function guardarNarrativo() {
  if (!filaSeleccionada.value) return
  filaSeleccionada.value.resumenNarrativo = camposNarrativos.value.join(' | ')
  filaSeleccionada.value.indicadores = indicadoresTemp.value
  filaSeleccionada.value.medios = mediosTemp.value
  filaSeleccionada.value.supuestos = supuestosTemp.value
}
</script>

<style scoped>
.q-markup-table td.bg-primary {
  background: #7f1d35 !important;
}
.q-markup-table td {
  vertical-align: middle;
}
.q-table .q-td {
  white-space: normal !important;
  word-break: break-word;
}
</style>
