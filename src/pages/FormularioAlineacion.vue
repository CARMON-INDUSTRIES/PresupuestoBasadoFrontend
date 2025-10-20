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

          <!-- Estrategias (multi) -->
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

          <!-- Líneas de acción (multi) -->
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

          <!-- Tipo de ramo (solo municipio) -->
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

        <!-- Botones -->
        <q-card-actions align="right" class="q-gutter-sm">
          <!-- Botón registrar -->
          <q-btn
            label="Registrar alineación"
            color="secondary"
            text-color="white"
            rounded
            unelevated
            @click="registrarAlineacion"
            :disable="loading"
          />

          <!-- Botón continuar -->
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

        <!-- Indicador visual opcional -->
        <q-card-section v-if="ambasCompletas" class="text-positive text-center q-mt-sm">
          Ambas alineaciones (Municipal y Estatal) registradas. Ya puedes continuar.
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import Swal from 'sweetalert2'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)
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

// Listas dinámicas
const acuerdos = ref([])
const objetivos = ref([])
const estrategias = ref([])
const lineasAccion = ref([])

// ✅ Bandera reactiva que controla si ambas alineaciones están completas
const ambasCompletas = ref(false)
function verificarAlineaciones() {
  const m = localStorage.getItem('alineacionMunicipal')
  const e = localStorage.getItem('alineacionEstatal')
  ambasCompletas.value = !!(m && e)
}

// 🧩 Utilidad para sacar etiquetas de listas
function labelFromList(list, id) {
  if (id === null || id === undefined) return ''
  if (Array.isArray(id)) {
    return id.map((i) => labelFromList(list, i)).filter(Boolean)
  }
  const found = list.find((x) => x.value === id)
  return found ? found.label : ''
}

// --- Carga de combos ---
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

// 🧠 Restaurar progreso y revisar si ya hay alineaciones registradas
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

// 💾 Guardar automáticamente cada cambio
watch(
  form,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true },
)

// Registrar alineación (guardando también los labels)
async function registrarAlineacion() {
  if (!form.value.tipo) {
    Notify.create({
      type: 'warning',
      message: 'Selecciona un tipo de alineación antes de registrar',
    })
    return
  }

  const alineacionConLabels = {
    ...form.value,
    acuerdoLabel: labelFromList(acuerdos.value, form.value.acuerdo),
    objetivoLabel: labelFromList(objetivos.value, form.value.objetivo),
    estrategiasLabels: labelFromList(estrategias.value, form.value.estrategias),
    lineasLabels: labelFromList(lineasAccion.value, form.value.lineasAccion),
  }

  if (form.value.tipo === 'Municipio') {
    localStorage.setItem('alineacionMunicipal', JSON.stringify(alineacionConLabels))
    Notify.create({ type: 'positive', message: 'Alineación municipal registrada' })
  } else if (form.value.tipo === 'Estado') {
    localStorage.setItem('alineacionEstatal', JSON.stringify(alineacionConLabels))
    Notify.create({ type: 'positive', message: 'Alineación estatal registrada' })
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

// 📤 Envío del formulario final
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

      // Usamos los labels guardados
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
    localStorage.removeItem(STORAGE_KEY)

    Notify.create({ type: 'positive', message: 'Alineaciones registradas correctamente' })
    router.push('/formulario-clasificacion')
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar las alineaciones',
    })
  } finally {
    loading.value = false
  }
}
</script>
