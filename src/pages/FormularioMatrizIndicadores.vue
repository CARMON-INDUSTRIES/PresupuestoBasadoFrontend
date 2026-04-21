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

      <q-card-actions align="right" class="q-mt-md">
        <q-btn
          label="Pantalla Anterior"
          color="primary"
          text-color="white"
          rounded
          unelevated
          class="registrar"
          to="formulario-estructura-analitica"
          :loading="loading"
        />
        <q-btn
          color="primary"
          label="Siguiente"
          rounded
          class="submit-btn"
          :loading="loading"
          @click="guardarMatriz"
        />
      </q-card-actions>

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

function construirEstructura(objetivo) {
  const estructura = []

  estructura.push(`Fin: ${objetivo.fin || ''}`)
  estructura.push(`Propósito: ${objetivo.objetivoCentral || ''}`)

  objetivo.componentes?.forEach((c, ci) => {
    estructura.push(`Componente: ${c?.nombre || `Componente ${ci + 1}`}`)
    c.medios?.forEach((m, mi) => {
      estructura.push(`Actividad: ${m || `Actividad ${mi + 1}`}`)
    })
  })

  return estructura
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

      if (res?.data?.id || res?.data?.Id) {
        matrizId.value = res.data.id ?? res.data.Id
      }

      console.log('💾 Autosave guardado', matrizId.value)
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

    let borrador = null

    try {
      const res = await api.get('/MatrizIndicadores/ultimo')
      borrador = res.data
    } catch {
      console.warn('No hay borrador previo')
    }

    if (borrador && Array.isArray(borrador.filas)) {
      matrizId.value = borrador.id ?? borrador.Id

      function normalizarNivel(nivel) {
        if (!nivel) return ''
        if (nivel.startsWith('Fin')) return 'Fin'
        if (nivel.startsWith('Propósito')) return 'Propósito'
        if (nivel.startsWith('Componente')) return 'Componente'
        if (nivel.startsWith('Actividad')) return 'Actividad'
        return nivel
      }

      const estructuraNueva = construirEstructura(objetivo).map(normalizarNivel)
      const estructuraBorrador = borrador.filas.map((f) => normalizarNivel(f.nivel))

      const coincide =
        estructuraNueva.length === estructuraBorrador.length &&
        estructuraNueva.every((val, i) => val === estructuraBorrador[i])

      if (!coincide) {
        console.warn('Estructura cambió, regenerando')
        filas.value = nuevasFilas
      } else {
        filas.value = borrador.filas
      }
    } else {
      filas.value = nuevasFilas
    }
  } catch (error) {
    console.error('Error al iniciar MIR:', error)
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
      if (res?.data?.id || res?.data?.Id) {
        matrizId.value = res.data.id ?? res.data.Id
      }
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
  if (nivel.startsWith('Fin')) return ['Contribuir a un objetivo superior']
  if (nivel.startsWith('Propósito'))
    return ['Sujeto beneficiario', 'Verbo en presente', 'Resultado logrado']
  if (nivel.startsWith('Componente')) return ['Producto o servicio', 'Verbo en participio']
  if (nivel.startsWith('Actividad')) return ['Acción', 'Proceso']
  return ['Texto general']
}

function abrirModal(row) {
  filaSeleccionada.value = row
  labelsNarrativos.value = obtenerLabelsParaNivel(row.nivel)

  const partes = (row.resumenNarrativo || '').split(' ')
  camposNarrativos.value = labelsNarrativos.value.map((_, i) => partes[i] ?? '')

  indicadoresTemp.value = row.indicadores || ''
  mediosTemp.value = row.medios || ''
  supuestosTemp.value = row.supuestos || ''

  modalVisible.value = true
}

function guardarNarrativo() {
  if (!filaSeleccionada.value) return

  filaSeleccionada.value.resumenNarrativo = camposNarrativos.value.join(' ')
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
.submit-btn {
  font-weight: 900;
  font-size: 0.8rem;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}

.registrar {
  font-weight: 900;
  font-size: 0.8rem;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
