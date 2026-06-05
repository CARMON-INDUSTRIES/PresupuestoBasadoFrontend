<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Alineación</h1>
          <p class="page-subtitle">
            Registra la alineación municipal y estatal del programa presupuestario.
          </p>
        </div>
      </div>

      <q-stepper flat bordered color="primary" animated class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" :done="ambasCompletas" active />

        <q-step :name="2" title="Clasificación" icon="dashboard" />

        <q-step :name="3" title="Metas" icon="track_changes" />
      </q-stepper>

      <q-form @submit.prevent="submitForm">
        <q-card class="modern-card">
          <q-card-section class="q-pb-none">
            <div class="section-title">Información de alineación</div>
          </q-card-section>

          <q-card-section class="form-grid">
            <q-select
              outlined
              bg-color="white"
              v-model="form.tipo"
              :options="['Municipio', 'Estado']"
              label="Tipo de alineación"
              class="modern-input"
              @update:model-value="onTipoChange"
            >
              <template v-slot:prepend>
                <q-icon name="location_city" color="primary" />
              </template>
            </q-select>

            <q-select
              outlined
              bg-color="white"
              v-model="form.acuerdo"
              :options="acuerdos"
              label="Acuerdo"
              emit-value
              map-options
              class="modern-input"
              @update:model-value="onAcuerdoChange"
              :loading="loadingAcuerdos"
              :disable="!form.tipo"
            >
              <template v-slot:prepend>
                <q-icon name="article" color="primary" />
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{ form.tipo ? 'No hay acuerdos disponibles' : 'Selecciona un tipo primero' }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              outlined
              bg-color="white"
              v-model="form.objetivo"
              :options="objetivos"
              label="Objetivo"
              emit-value
              map-options
              class="modern-input"
              @update:model-value="onObjetivoChange"
              :loading="loadingObjetivos"
              :disable="!form.acuerdo"
            >
              <template v-slot:prepend>
                <q-icon name="flag" color="primary" />
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{
                      form.acuerdo
                        ? 'No hay objetivos disponibles'
                        : 'Selecciona un acuerdo primero'
                    }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              outlined
              bg-color="white"
              v-model="form.estrategias"
              :options="estrategias"
              label="Estrategias"
              multiple
              emit-value
              map-options
              class="modern-input"
              @update:model-value="onEstrategiasChange"
              :loading="loadingEstrategias"
              :disable="!form.objetivo"
            >
              <template v-slot:prepend>
                <q-icon name="lightbulb" color="primary" />
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{
                      form.objetivo
                        ? 'No hay estrategias disponibles'
                        : 'Selecciona un objetivo primero'
                    }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              outlined
              bg-color="white"
              v-model="form.lineasAccion"
              :options="lineasAccion"
              label="Líneas de acción"
              multiple
              emit-value
              map-options
              class="modern-input"
              :loading="loadingLineas"
              :disable="!form.estrategias.length"
            >
              <template v-slot:prepend>
                <q-icon name="track_changes" color="primary" />
              </template>

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{
                      form.estrategias.length
                        ? 'No hay líneas de acción disponibles'
                        : 'Selecciona estrategias primero'
                    }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select
              v-if="form.tipo === 'Municipio'"
              outlined
              bg-color="white"
              v-model="form.ramo"
              :options="ramos"
              label="Tipo de ramo"
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="account_balance" color="primary" />
              </template>
            </q-select>
          </q-card-section>

          <q-card-section>
            <q-banner v-if="ambasCompletas" rounded class="success-banner">
              <template v-slot:avatar>
                <q-icon name="check_circle" />
              </template>

              Ambas alineaciones fueron registradas correctamente.
            </q-banner>

            <q-banner v-else rounded class="warning-banner">
              <template v-slot:avatar>
                <q-icon name="info" />
              </template>

              <div v-if="alineacionMunicipalCompleta">Alineación Municipal registrada</div>

              <div v-if="alineacionEstatalCompleta">Alineación Estatal registrada</div>

              <div v-if="!alineacionMunicipalCompleta && !alineacionEstatalCompleta">
                Debes registrar ambas alineaciones (Municipal y Estatal)
              </div>
            </q-banner>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Registrar alineación"
              class="secondary-btn"
              unelevated
              :disable="loading || !puedeRegistrar"
              @click="registrarAlineacion"
            />

            <q-btn
              label="Continuar"
              class="primary-btn"
              type="submit"
              unelevated
              :loading="loading"
              :disable="!ambasCompletas"
              icon-right="arrow_forward"
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import Swal from 'sweetalert2'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)
const loadingAcuerdos = ref(false)
const loadingObjetivos = ref(false)
const loadingEstrategias = ref(false)
const loadingLineas = ref(false)

const STORAGE_KEY = 'formAlineacion'
const ramos = ['Recurso Propio', 'Recurso Estatal', 'Recurso Federal']

const form = ref({
  tipo: '',
  ramo: '',
  acuerdo: null,
  objetivo: null,
  estrategias: [],
  lineasAccion: [],
})

const acuerdos = ref([])
const objetivos = ref([])
const estrategias = ref([])
const lineasAccion = ref([])

const alineacionMunicipalCompleta = ref(false)
const alineacionEstatalCompleta = ref(false)

const ambasCompletas = computed(() => {
  return alineacionMunicipalCompleta.value && alineacionEstatalCompleta.value
})

const puedeRegistrar = computed(() => {
  return (
    form.value.tipo &&
    form.value.acuerdo &&
    form.value.objetivo &&
    form.value.estrategias.length > 0 &&
    form.value.lineasAccion.length > 0
  )
})

function verificarAlineaciones() {
  const m = localStorage.getItem('alineacionMunicipal')
  const e = localStorage.getItem('alineacionEstatal')
  alineacionMunicipalCompleta.value = !!m
  alineacionEstatalCompleta.value = !!e
}

function labelFromList(list, id) {
  if (id === null || id === undefined) return ''
  if (Array.isArray(id)) {
    return id.map((i) => labelFromList(list, i)).filter(Boolean)
  }
  const found = list.find((x) => x.value === id)
  return found ? found.label : ''
}

const onTipoChange = async (tipo) => {
  form.value.acuerdo = null
  form.value.objetivo = null
  form.value.estrategias = []
  form.value.lineasAccion = []
  acuerdos.value = []
  objetivos.value = []
  estrategias.value = []
  lineasAccion.value = []

  if (!tipo) return

  const endpoint = tipo === 'Estado' ? '/PlanEstatal/acuerdos' : '/PlanMunicipal/acuerdos'

  loadingAcuerdos.value = true
  try {
    const { data } = await api.get(endpoint)

    if (!data || data.length === 0) {
      Notify.create({
        type: 'warning',
        message: `No hay acuerdos disponibles para ${tipo}. Contacta al administrador.`,
        timeout: 3000,
      })
      acuerdos.value = []
      return
    }

    acuerdos.value = data.map((a) => ({
      label: a.nombre ?? a.Nombre,
      value: a.id ?? a.Id,
    }))
  } catch (error) {
    console.error('Error al cargar acuerdos:', error)

    const mensaje =
      error.response?.status === 401
        ? 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
        : error.response?.status === 403
          ? 'No tienes permisos para acceder a estos datos.'
          : `Error al cargar acuerdos de ${tipo}`

    Notify.create({
      type: 'negative',
      message: mensaje,
      timeout: 3000,
    })

    acuerdos.value = []

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      setTimeout(() => router.push('/login'), 1500)
    }
  } finally {
    loadingAcuerdos.value = false
  }
}

const onAcuerdoChange = async (acuerdoId) => {
  form.value.objetivo = null
  form.value.estrategias = []
  form.value.lineasAccion = []
  objetivos.value = []
  estrategias.value = []
  lineasAccion.value = []

  if (!acuerdoId) return

  const endpoint =
    form.value.tipo === 'Estado'
      ? `/PlanEstatal/acuerdo/${acuerdoId}/objetivos`
      : `/PlanMunicipal/acuerdo/${acuerdoId}/objetivos`

  loadingObjetivos.value = true
  try {
    const { data } = await api.get(endpoint)

    if (!data || data.length === 0) {
      Notify.create({
        type: 'warning',
        message: 'No hay objetivos disponibles para este acuerdo.',
        timeout: 3000,
      })
      objetivos.value = []
      return
    }

    objetivos.value = data.map((o) => ({
      label: o.nombre ?? o.Nombre,
      value: o.id ?? o.Id,
    }))
  } catch (error) {
    console.error('Error al cargar objetivos:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar objetivos',
      timeout: 3000,
    })
    objetivos.value = []
  } finally {
    loadingObjetivos.value = false
  }
}

const onObjetivoChange = async (objetivoId) => {
  form.value.estrategias = []
  form.value.lineasAccion = []
  estrategias.value = []
  lineasAccion.value = []

  if (!objetivoId) return

  const endpoint =
    form.value.tipo === 'Estado'
      ? `/PlanEstatal/objetivo/${objetivoId}/estrategias`
      : `/PlanMunicipal/objetivo/${objetivoId}/estrategias`

  loadingEstrategias.value = true
  try {
    const { data } = await api.get(endpoint)

    if (!data || data.length === 0) {
      Notify.create({
        type: 'warning',
        message: 'No hay estrategias disponibles para este objetivo.',
        timeout: 3000,
      })
      estrategias.value = []
      return
    }

    estrategias.value = data.map((e) => ({
      label: e.nombre ?? e.Nombre,
      value: e.id ?? e.Id,
    }))
  } catch (error) {
    console.error('Error al cargar estrategias:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar estrategias',
      timeout: 3000,
    })
    estrategias.value = []
  } finally {
    loadingEstrategias.value = false
  }
}

const onEstrategiasChange = async (selectedIds) => {
  form.value.lineasAccion = []
  lineasAccion.value = []

  if (!selectedIds.length) return

  const promises = selectedIds.map((id) => {
    const endpoint =
      form.value.tipo === 'Estado'
        ? `/PlanEstatal/estrategia/${id}/lineas`
        : `/PlanMunicipal/estrategia/${id}/lineas`
    return api.get(endpoint)
  })

  loadingLineas.value = true
  try {
    const results = await Promise.all(promises)
    const allLineas = results.flatMap((r) => r.data)

    if (allLineas.length === 0) {
      Notify.create({
        type: 'warning',
        message: 'No hay líneas de acción disponibles para estas estrategias.',
        timeout: 3000,
      })
      lineasAccion.value = []
      return
    }

    const unique = []
    const idsSet = new Set()
    allLineas.forEach((l) => {
      const val = l.id ?? l.Id
      if (!idsSet.has(val)) {
        idsSet.add(val)
        unique.push({ label: l.nombre ?? l.Nombre, value: val })
      }
    })
    lineasAccion.value = unique
  } catch (error) {
    console.error('Error al cargar líneas de acción:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar líneas de acción',
      timeout: 3000,
    })
    lineasAccion.value = []
  } finally {
    loadingLineas.value = false
  }
}

onMounted(async () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    Object.assign(form.value, JSON.parse(saved))
    if (form.value.tipo) await onTipoChange(form.value.tipo)
    if (form.value.acuerdo) await onAcuerdoChange(form.value.acuerdo)
    if (form.value.objetivo) await onObjetivoChange(form.value.objetivo)
    if (form.value.estrategias.length) await onEstrategiasChange(form.value.estrategias)
  }
  verificarAlineaciones()
})

watch(
  form,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true },
)

async function registrarAlineacion() {
  if (!puedeRegistrar.value) {
    Notify.create({
      type: 'warning',
      message: 'Por favor completa todos los campos antes de registrar',
    })
    return
  }

  const alineacionConLabels = {
    ...form.value,
    acuerdoLabel: labelFromList(acuerdos.value, form.value.acuerdo),
    objetivoLabel: labelFromList(objetivos.value, form.value.objetivo),
    estrategiasLabels: labelFromList(estrategias.value, form.value.estrategias),
    lineasLabels: labelFromList(lineasAccion.value, form.value.lineasAccion),
    lineasSeleccionadas: form.value.lineasAccion
      .map((id) => {
        const item = lineasAccion.value.find((l) => l.value === id)
        return item ? { id: item.value, nombre: item.label } : null
      })
      .filter(Boolean),
  }

  if (form.value.tipo === 'Municipio') {
    localStorage.setItem('LineaMunicipal', JSON.stringify(alineacionConLabels))
    localStorage.setItem('alineacionMunicipal', JSON.stringify(alineacionConLabels))
    Notify.create({
      type: 'positive',
      message: 'Alineación Municipal registrada correctamente',
    })
  } else if (form.value.tipo === 'Estado') {
    localStorage.setItem('LineaEstatal', JSON.stringify(alineacionConLabels))
    localStorage.setItem('alineacionEstatal', JSON.stringify(alineacionConLabels))
    Notify.create({
      type: 'positive',
      message: ' Alineación Estatal registrada correctamente',
    })
  }

  form.value = {
    tipo: '',
    ramo: '',
    acuerdo: null,
    objetivo: null,
    estrategias: [],
    lineasAccion: [],
  }
  acuerdos.value = []
  objetivos.value = []
  estrategias.value = []
  lineasAccion.value = []
  localStorage.removeItem(STORAGE_KEY)

  verificarAlineaciones()
}

async function submitForm() {
  if (!ambasCompletas.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Falta información',
      text: 'Debes registrar ambas alineaciones (Municipal y Estatal) antes de continuar.',
      confirmButtonColor: '#691b31',
    })
    return
  }

  loading.value = true
  try {
    const alineacionMunicipal = JSON.parse(localStorage.getItem('alineacionMunicipal'))
    const alineacionEstatal = JSON.parse(localStorage.getItem('alineacionEstatal'))

    const alineaciones = [
      { tipo: 'Municipio', data: alineacionMunicipal },
      { tipo: 'Estado', data: alineacionEstatal },
    ]

    for (const alineacion of alineaciones) {
      const endpoint = alineacion.tipo === 'Estado' ? '/AlineacionEstado' : '/AlineacionMunicipio'

      await api.post(endpoint, {
        acuerdo: alineacion.data.acuerdoLabel,
        objetivo: alineacion.data.objetivoLabel,
        estrategia: alineacion.data.estrategiasLabels.join(', '),
        lineaAccion: alineacion.data.lineasLabels.join(', '),
        ramo: alineacion.data.ramo,
      })
    }

    if (alineacionMunicipal?.objetivoLabel) {
      console.log('EFECTO SUPERIOR:', alineacionMunicipal.objetivoLabel)

      await api.post('/EfectoSuperior', {
        descripcion: alineacionMunicipal.objetivoLabel,
      })
    }

    localStorage.removeItem('alineacionMunicipal')
    localStorage.removeItem('alineacionEstatal')
    localStorage.removeItem('LineaMunicipal')
    localStorage.removeItem('LineaEstatal')
    localStorage.removeItem(STORAGE_KEY)

    Notify.create({
      type: 'positive',
      message: 'Alineaciones guardadas correctamente en el sistema',
    })

    router.push('/formulario-clasificacion')
  } catch (error) {
    console.error('Error al guardar alineaciones:', error)
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar las alineaciones',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-container {
  background: #f4f6f9;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1200px;
  margin: auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #691b31;
  margin: 0;
}

.page-subtitle {
  color: #6b7280;
  margin-top: 8px;
  font-size: 1rem;
}

.modern-stepper {
  border-radius: 18px;
  margin-bottom: 24px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
}

.modern-card {
  border-radius: 24px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
  border: none;
  background: white;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.modern-input {
  transition: all 0.2s ease;
}

.modern-input:hover {
  transform: translateY(-1px);
}

.primary-btn {
  background: #c5a46d;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.primary-btn:hover {
  opacity: 0.95;
}

.secondary-btn {
  background: #691b31;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.actions-container {
  gap: 12px;
}

.success-banner {
  background: #ecfdf3;
  color: #027a48;
  border-radius: 14px;
}

.warning-banner {
  background: #fffbeb;
  color: #b54708;
  border-radius: 14px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.7rem;
  }

  .actions-container {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}
</style>
