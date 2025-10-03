<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <!-- Título -->
        <q-card-section>
          <div class="form-title">Alineación</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <!-- Campos del formulario -->
        <q-card-section class="q-gutter-md">
          <!-- Tipo de alineación -->
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

          <!-- Acuerdo -->
          <q-select
            filled
            v-model="form.acuerdo"
            :options="acuerdos"
            label="Acuerdo"
            rounded
            emit-value
            map-options
            @update:model-value="onAcuerdoChange"
          >
            <template v-slot:prepend>
              <q-icon name="article" />
            </template>
          </q-select>

          <!-- Objetivo -->
          <q-select
            filled
            v-model="form.objetivo"
            :options="objetivos"
            label="Objetivo"
            rounded
            emit-value
            map-options
            @update:model-value="onObjetivoChange"
          >
            <template v-slot:prepend>
              <q-icon name="flag" />
            </template>
          </q-select>

          <!-- Estrategias (selección múltiple) -->
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
          >
            <template v-slot:prepend>
              <q-icon name="lightbulb" />
            </template>
          </q-select>

          <!-- Líneas de acción (selección múltiple) -->
          <q-select
            filled
            v-model="form.lineasAccion"
            :options="lineasAccion"
            label="Líneas de acción"
            rounded
            multiple
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="track_changes" />
            </template>
          </q-select>

          <!-- Tipo de ramo (solo si es Municipio) -->
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

        <!-- Botón -->
        <q-card-actions align="right">
          <q-btn
            label="Continuar"
            color="primary"
            text-color="white"
            type="submit"
            rounded
            unelevated
            class="submit-btn"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)

const ramos = ['Recurso Propio', 'Recurso Estatal', 'Recurso Federal']

const form = ref({
  tipo: '',
  ramo: '',
  acuerdo: null,
  objetivo: null,
  estrategias: [], // IDs de estrategias seleccionadas
  lineasAccion: [], // IDs de líneas seleccionadas
})

// Opciones { label, value }
const acuerdos = ref([])
const objetivos = ref([])
const estrategias = ref([])
const lineasAccion = ref([])

// Helper para obtener label por id
function labelFromList(list, id) {
  if (id === null || id === undefined) return ''
  if (Array.isArray(id)) {
    return id.map((i) => labelFromList(list, i)).filter(Boolean)
  }
  const found = list.find((x) => x.value === id)
  return found ? found.label : ''
}

// Tipo de alineación
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
  try {
    const { data } = await api.get(endpoint)
    acuerdos.value = data.map((a) => ({ label: a.nombre ?? a.Nombre, value: a.id ?? a.Id }))
  } catch {
    Notify.create({ type: 'negative', message: 'Error cargando acuerdos' })
  }
}

// Cambio de acuerdo
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
  try {
    const { data } = await api.get(endpoint)
    objetivos.value = data.map((o) => ({ label: o.nombre ?? o.Nombre, value: o.id ?? o.Id }))
  } catch {
    Notify.create({ type: 'negative', message: 'Error cargando objetivos' })
  }
}

// Cambio de objetivo
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
  try {
    const { data } = await api.get(endpoint)
    estrategias.value = data.map((e) => ({ label: e.nombre ?? e.Nombre, value: e.id ?? e.Id }))
  } catch {
    Notify.create({ type: 'negative', message: 'Error cargando estrategias' })
  }
}

// Cambio de estrategias (multi)
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

  try {
    const results = await Promise.all(promises)
    const allLineas = results.flatMap((r) => r.data)
    // eliminar duplicados
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
  } catch {
    Notify.create({ type: 'negative', message: 'Error cargando líneas de acción' })
  }
}

// Submit
async function submitForm() {
  loading.value = true
  try {
    const acuerdoLabel = labelFromList(acuerdos.value, form.value.acuerdo)
    const objetivoLabel = labelFromList(objetivos.value, form.value.objetivo)
    const estrategiaLabels = labelFromList(estrategias.value, form.value.estrategias)
    const lineaLabels = labelFromList(lineasAccion.value, form.value.lineasAccion)

    const endpoint = form.value.tipo === 'Estado' ? '/AlineacionEstado' : '/AlineacionMunicipio'

    await api.post(endpoint, {
      acuerdo: acuerdoLabel,
      objetivo: objetivoLabel,
      estrategia: estrategiaLabels.join(', '),
      lineaAccion: lineaLabels.join(', '),
      ramo: form.value.ramo,
    })

    localStorage.setItem('tipoAlineacion', form.value.tipo)
    Notify.create({ type: 'positive', message: 'Alineación guardada correctamente' })
    router.push('/formulario-clasificacion')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar la alineación',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.q-card {
  max-width: 800px;
  margin: auto;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #691b31;
}

.q-field__control {
  border-radius: 12px;
}

.submit-btn {
  font-weight: 900;
  font-size: 0.9rem;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
