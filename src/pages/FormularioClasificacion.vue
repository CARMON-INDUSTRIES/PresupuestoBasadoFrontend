<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="form-title">Clasificación Funcional</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <!-- Subfunción (selección por id) -->
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

          <!-- Función (deshabilitado, muestra la jerarquía) -->
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

          <!-- Finalidad (deshabilitado, muestra la jerarquía) -->
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

          <!-- Año -->
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

          <!-- Entrega de bienes -->
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

const STORAGE_KEY = 'clasificacionFuncionalForm_v1' // clave en localStorage

const anioActual = new Date().getFullYear()
const anios = [anioActual - 1, anioActual, anioActual + 1]
const opcionesEntregaBienes = [
  'Población General',
  'Administración Pública',
  'Población General y Administración Pública',
]

// Form con ids y nombres separados para evitar problemas con selects
const form = ref({
  subfuncionId: null, // id usado por el select
  subfuncion: '', // nombre para enviar al backend
  funcionId: null,
  funcion: '',
  finalidadId: null,
  finalidad: '',
  anioOperando: anioActual,
  entregaBienes: '',
})

// opciones para selects
const subfunciones = ref([]) // { label, value }
const funciones = ref([]) // { label, value }
const finalidades = ref([]) // { label, value }

// Cargar lista de subfunciones (ids)
async function cargarSubfunciones() {
  try {
    const { data } = await api.get('/ClasificadorFuncional/subfunciones')
    subfunciones.value = data.map((x) => ({ label: x.nombre, value: x.id }))
  } catch (err) {
    console.error('Error cargando subfunciones', err)
    Notify.create({ type: 'negative', message: 'Error cargando subfunciones' })
  }
}

// Al cambiar subfunción (se pasa el id)
const onSubfuncionChange = async (subfuncionId) => {
  // limpiar jerarquía previa
  form.value.funcionId = null
  form.value.funcion = ''
  form.value.finalidadId = null
  form.value.finalidad = ''
  funciones.value = []
  finalidades.value = []

  if (!subfuncionId) {
    // guardar estado en localStorage
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

    // guardar en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value))
  } catch (err) {
    console.error('Error al cargar jerarquía', err)
    Notify.create({ type: 'negative', message: 'Error cargando función y finalidad' })
  }
}

// Restaurar desde localStorage (intenta garantizar que selects muestren valores)
function restaurarFormulario() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw)

    // Restauramos valores básicos
    form.value.anioOperando = parsed.anioOperando ?? form.value.anioOperando
    form.value.entregaBienes = parsed.entregaBienes ?? form.value.entregaBienes

    // Si el objeto contiene ids/nombres, restaurar
    if (parsed.subfuncionId) {
      form.value.subfuncionId = parsed.subfuncionId
    }
    if (parsed.subfuncion) form.value.subfuncion = parsed.subfuncion
    if (parsed.funcionId) form.value.funcionId = parsed.funcionId
    if (parsed.funcion) form.value.funcion = parsed.funcion
    if (parsed.finalidadId) form.value.finalidadId = parsed.finalidadId
    if (parsed.finalidad) form.value.finalidad = parsed.finalidad

    // Si restauramos un subfuncionId, cargamos su jerarquía para asegurar labels
    if (form.value.subfuncionId) {
      // llamamos al endpoint para poblar funcion/finalidad/labels
      onSubfuncionChange(form.value.subfuncionId)
    } else if (form.value.subfuncion) {
      // si no hay id pero sí nombre, buscamos el id entre subfunciones cargadas
      const found = subfunciones.value.find((s) => s.label === form.value.subfuncion)
      if (found) {
        onSubfuncionChange(found.value)
      }
    }
  } catch (err) {
    console.warn('No se pudo parsear el storage:', err)
  }
}

// Guardar cada cambio automaticamente en localStorage
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

// Submit
async function submitForm() {
  loading.value = true
  try {
    // Enviamos nombres (lo que espera tu backend)
    await api.post('/ClasificacionFuncional', {
      Subfuncion: form.value.subfuncion,
      Funcion: form.value.funcion,
      Finalidad: form.value.finalidad,
      AnioOperando: form.value.anioOperando,
      EntregaBienes: form.value.entregaBienes,
    })

    Notify.create({ type: 'positive', message: 'Clasificación guardada correctamente' })

    // limpiar storage y avanzar
    //localStorage.removeItem(STORAGE_KEY)
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
