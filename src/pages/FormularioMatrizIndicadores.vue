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
              <span class="text-grey-7">{{ textoBaseNivel(props.row.nivel) }}</span>
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

const usuario = ref({})
const filas = ref([])
const matrizId = ref(null)

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

function textoBaseNivel(nivel) {
  if (!nivel) return ''
  if (nivel.startsWith('Fin')) return 'Fin'
  if (nivel.startsWith('Propósito')) return 'Propósito'
  if (nivel.startsWith('Componente')) return 'Componente'
  if (nivel.startsWith('Actividad')) return 'Actividad'
  return nivel
}

function crearFila(nivel) {
  return {
    nivel,
    resumenNarrativo: '',
    indicadores: '',
    medios: '',
    supuestos: '',
  }
}

let autosaveTimer = null
async function autosave() {
  clearTimeout(autosaveTimer)

  autosaveTimer = setTimeout(async () => {
    try {
      const matrizPayload = {
        Id: matrizId.value ?? 0,
        UnidadResponsable: usuario.value.nombreMatriz || usuario.value.cargo || '',
        UnidadPresupuestal: usuario.value.unidadesPresupuestales || '',
        ProgramaSectorial: usuario.value.programaSectorial || '',
        ProgramaPresupuestario: usuario.value.programaPresupuestario || '',
        ResponsableMIR: usuario.value.nombreCompleto || '',
        Filas: filas.value,
      }

      const res = await api.post('/MatrizIndicadores/borrador', matrizPayload)

      if (res?.data?.id) matrizId.value = res.data.id

      console.log('💾 Autosave (borrador) guardado en servidor', matrizId.value)
    } catch (err) {
      console.warn('⚠ Autosave falló:', err)
    }
  }, 700)
}

onMounted(async () => {
  try {
    const me = await api.get('/Cuentas/me')
    usuario.value = me.data || {}

    const objetivoRes = await api.get('/ArbolObjetivos/ultimo')
    const objetivo = objetivoRes.data || { componentes: [] }

    const nuevasFilas = []
    nuevasFilas.push(crearFila(`Fin: ${objetivo.fin || ''}`))
    nuevasFilas.push(crearFila(`Propósito: ${objetivo.objetivoCentral || ''}`))

    objetivo.componentes?.forEach((c, ci) => {
      nuevasFilas.push(crearFila(`Componente: ${c?.nombre || `Componente ${ci + 1}`}`))
      c.medios?.forEach((m, mi) => {
        nuevasFilas.push(crearFila(`Actividad: ${m || `Actividad ${mi + 1}`}`))
      })
    })

    try {
      const borradorRes = await api.get('/MatrizIndicadores/ultimo')
      const borrador = borradorRes.data

      if (borrador) {
        matrizId.value = borrador.id
        if (Array.isArray(borrador.filas) && borrador.filas.length === nuevasFilas.length) {
          filas.value = borrador.filas
        } else {
          filas.value = nuevasFilas
        }
      } else {
        filas.value = nuevasFilas
      }
    } catch (err) {
      filas.value = nuevasFilas
      console.error('Error al iniciar componente MIR:', err)
    }
  } catch (error) {
    console.error('Error al iniciar componente MIR:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar datos iniciales de la MIR' })
  }
})

watch(
  filas,
  () => {
    autosave()
  },
  { deep: true },
)

async function guardarMatriz() {
  loading.value = true
  try {
    const matrizPayload = {
      UnidadResponsable: usuario.value.nombreMatriz || usuario.value.cargo || '',
      UnidadPresupuestal: usuario.value.unidadesPresupuestales || '',
      ProgramaSectorial: usuario.value.programaSectorial || '',
      ProgramaPresupuestario: usuario.value.programaPresupuestario || '',
      ResponsableMIR: usuario.value.nombreCompleto || '',
      Filas: filas.value,
    }

    if (matrizId.value) {
      await api.put(`/MatrizIndicadores/${matrizId.value}`, {
        id: matrizId.value,
        ...matrizPayload,
      })
      Notify.create({ type: 'positive', message: 'Matriz actualizada correctamente' })
    } else {
      const res = await api.post('/MatrizIndicadores', matrizPayload)
      if (res?.data?.id) matrizId.value = res.data.id
      Notify.create({ type: 'positive', message: 'Matriz creada correctamente' })
    }

    router.push('/formulario-ficha-tecnica-1')
  } catch (error) {
    console.error('Error al guardar MIR:', error)
    Notify.create({ type: 'negative', message: 'Error al guardar la MIR' })
  } finally {
    loading.value = false
  }
}

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

  autosave()
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
