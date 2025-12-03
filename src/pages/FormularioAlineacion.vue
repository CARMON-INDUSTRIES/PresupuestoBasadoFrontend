<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="form-title">Alineación</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-select
            filled
            v-model="form.tipo"
            :options="['Municipio', 'Estado']"
            label="Tipo de alineación"
            rounded
            @update:model-value="onTipoChange"
          >
            <template v-slot:prepend>
              <q-icon name="location_city" />
            </template>
          </q-select>

          <q-select
            filled
            v-model="form.acuerdo"
            :options="acuerdos"
            label="Acuerdo"
            rounded
            emit-value
            map-options
            @update:model-value="onAcuerdoChange"
            :loading="loadingAcuerdos"
            :disable="!form.tipo"
          >
            <template v-slot:prepend>
              <q-icon name="article" />
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
            filled
            v-model="form.objetivo"
            :options="objetivos"
            label="Objetivo"
            rounded
            emit-value
            map-options
            @update:model-value="onObjetivoChange"
            :loading="loadingObjetivos"
            :disable="!form.acuerdo"
          >
            <template v-slot:prepend>
              <q-icon name="flag" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  {{
                    form.acuerdo ? 'No hay objetivos disponibles' : 'Selecciona un acuerdo primero'
                  }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            filled
            v-model="form.estrategias"
            :options="estrategias"
            label="Estrategias"
            rounded
            multiple
            emit-value
            map-options
            @update:model-value="onEstrategiasChange"
            :loading="loadingEstrategias"
            :disable="!form.objetivo"
          >
            <template v-slot:prepend>
              <q-icon name="lightbulb" />
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
            filled
            v-model="form.lineasAccion"
            :options="lineasAccion"
            label="Líneas de acción"
            rounded
            multiple
            emit-value
            map-options
            :loading="loadingLineas"
            :disable="!form.estrategias.length"
          >
            <template v-slot:prepend>
              <q-icon name="track_changes" />
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

          <!-- Tipo de ramo -->
          <q-select
            v-if="form.tipo === 'Municipio'"
            filled
            v-model="form.ramo"
            :options="ramos"
            label="Tipo de ramo"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="account_balance" />
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right" class="q-gutter-sm">
          <q-btn
            label="Registrar alineación"
            color="secondary"
            text-color="white"
            rounded
            unelevated
            @click="registrarAlineacion"
            :disable="loading || !puedeRegistrar"
          />

          <q-btn
            label="Continuar"
            color="primary"
            text-color="white"
            type="submit"
            rounded
            unelevated
            class="submit-btn"
            :loading="loading"
            :disable="!ambasCompletas"
          />
        </q-card-actions>

        <q-card-section v-if="ambasCompletas" class="text-positive text-center q-mt-sm">
          Ambas alineaciones (Municipal y Estatal) registradas. Ya puedes continuar.
        </q-card-section>

        <q-card-section v-else class="text-grey-7 text-center q-mt-sm text-caption">
          <div v-if="alineacionMunicipalCompleta">Alineación Municipal registrada</div>
          <div v-if="alineacionEstatalCompleta">Alineación Estatal registrada</div>
          <div v-if="!alineacionMunicipalCompleta && !alineacionEstatalCompleta">
            Debes registrar ambas alineaciones (Municipal y Estatal)
          </div>
        </q-card-section>
      </q-card>
    </q-form>
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

  // Limpiar formulario
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
.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #691b31;
}
</style>
