<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="form-title">Clasificación Funcional</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-select
            filled
            v-model="form.subfuncionId"
            :options="subfunciones"
            label="Subfunción"
            rounded
            emit-value
            map-options
            @update:model-value="onSubfuncionChange"
          >
            <template v-slot:prepend>
              <q-icon name="subdirectory_arrow_right" />
            </template>
          </q-select>

          <q-select
            filled
            v-model="form.funcionId"
            :options="funciones"
            label="Función"
            rounded
            disable
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="work" />
            </template>
          </q-select>

          <q-select
            filled
            v-model="form.finalidadId"
            :options="finalidades"
            label="Finalidad"
            rounded
            disable
            emit-value
            map-options
          >
            <template v-slot:prepend>
              <q-icon name="star" />
            </template>
          </q-select>

          <q-select
            filled
            v-model="form.anioOperando"
            :options="anios"
            label="Año Operando"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" />
            </template>
          </q-select>

          <q-select
            filled
            v-model="form.entregaBienes"
            :options="opcionesEntregaBienes"
            label="Entrega de Bienes o Servicios"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="handshake" />
            </template>
          </q-select>
        </q-card-section>

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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)

const STORAGE_KEY = 'clasificacionFuncionalForm_v1'

const anioActual = new Date().getFullYear()
const anios = [anioActual - 1, anioActual, anioActual + 1]
const opcionesEntregaBienes = [
  'Población General',
  'Administración Pública',
  'Población General y Administración Pública',
]

const form = ref({
  subfuncionId: null,
  subfuncion: '',
  funcionId: null,
  funcion: '',
  finalidadId: null,
  finalidad: '',
  anioOperando: anioActual,
  entregaBienes: '',
})

const subfunciones = ref([])
const funciones = ref([])
const finalidades = ref([])

async function cargarSubfunciones() {
  try {
    const { data } = await api.get('/ClasificadorFuncional/subfunciones')
    subfunciones.value = data.map((x) => ({ label: x.nombre, value: x.id }))
  } catch (err) {
    console.error('Error cargando subfunciones', err)
    Notify.create({ type: 'negative', message: 'Error cargando subfunciones' })
  }
}

const onSubfuncionChange = async (subfuncionId) => {
  form.value.funcionId = null
  form.value.funcion = ''
  form.value.finalidadId = null
  form.value.finalidad = ''
  funciones.value = []
  finalidades.value = []

  if (!subfuncionId) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value))
    return
  }

  try {
    const { data } = await api.get(`/ClasificadorFuncional/subfuncion/${subfuncionId}/jerarquia`)

    // data debe traer: subfuncionId/subfuncionNombre/funcionId/funcionNombre/finalidadId/finalidadNombre
    form.value.subfuncionId = subfuncionId
    form.value.subfuncion = data.subfuncionNombre ?? data.subfuncionNombre ?? form.value.subfuncion
    form.value.funcionId = data.funcionId
    form.value.funcion = data.funcionNombre
    form.value.finalidadId = data.finalidadId
    form.value.finalidad = data.finalidadNombre

    funciones.value = [{ label: data.funcionNombre, value: data.funcionId }]
    finalidades.value = [{ label: data.finalidadNombre, value: data.finalidadId }]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value))
  } catch (err) {
    console.error('Error al cargar jerarquía', err)
    Notify.create({ type: 'negative', message: 'Error cargando función y finalidad' })
  }
}

function restaurarFormulario() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw)

    form.value.anioOperando = parsed.anioOperando ?? form.value.anioOperando
    form.value.entregaBienes = parsed.entregaBienes ?? form.value.entregaBienes

    if (parsed.subfuncionId) {
      form.value.subfuncionId = parsed.subfuncionId
    }
    if (parsed.subfuncion) form.value.subfuncion = parsed.subfuncion
    if (parsed.funcionId) form.value.funcionId = parsed.funcionId
    if (parsed.funcion) form.value.funcion = parsed.funcion
    if (parsed.finalidadId) form.value.finalidadId = parsed.finalidadId
    if (parsed.finalidad) form.value.finalidad = parsed.finalidad

    if (form.value.subfuncionId) {
      onSubfuncionChange(form.value.subfuncionId)
    } else if (form.value.subfuncion) {
      const found = subfunciones.value.find((s) => s.label === form.value.subfuncion)
      if (found) {
        onSubfuncionChange(found.value)
      }
    }
  } catch (err) {
    console.warn('No se pudo parsear el storage:', err)
  }
}

watch(
  form,
  (newVal) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
    } catch (err) {
      console.error('Error guardando en localStorage', err)
    }
  },
  { deep: true },
)

async function submitForm() {
  loading.value = true
  try {
    await api.post('/ClasificacionFuncional', {
      Subfuncion: form.value.subfuncion,
      Funcion: form.value.funcion,
      Finalidad: form.value.finalidad,
      AnioOperando: form.value.anioOperando,
      EntregaBienes: form.value.entregaBienes,
    })

    Notify.create({ type: 'positive', message: 'Clasificación guardada correctamente' })

    localStorage.setItem('ultimaRutaRegistro', '/formulario-antecedente')
    router.push('/formulario-antecedente')
  } catch (error) {
    console.error('Error enviar Clasificación:', error)
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar la clasificación',
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await cargarSubfunciones()
  restaurarFormulario()
})
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
  font-size: 0.8rem;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
