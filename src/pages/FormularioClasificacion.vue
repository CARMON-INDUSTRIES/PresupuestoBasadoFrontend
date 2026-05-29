<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Clasificación Funcional</h1>

          <p class="page-subtitle">
            Define la estructura funcional y operativa del programa presupuestario.
          </p>
        </div>
      </div>

      <!-- STEPPER -->
      <q-stepper flat bordered color="primary" animated class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" done />

        <q-step :name="2" title="Clasificación" icon="dashboard" active />

        <q-step :name="3" title="Antecedentes" icon="history_edu" />

        <q-step :name="4" title="Metas" icon="track_changes" />
      </q-stepper>

      <!-- FORM -->
      <q-form @submit.prevent="submitForm">
        <!-- CARD -->
        <q-card class="modern-card">
          <q-card-section class="q-pb-none">
            <div class="section-title">Información funcional</div>

            <div class="section-description">
              Completa los campos relacionados con la clasificación funcional del programa.
            </div>
          </q-card-section>

          <!-- FORM GRID -->
          <q-card-section class="form-grid">
            <!-- SUBFUNCION -->
            <q-select
              outlined
              bg-color="white"
              v-model="form.subfuncionId"
              :options="subfunciones"
              label="Subfunción"
              emit-value
              map-options
              class="modern-input"
              @update:model-value="onSubfuncionChange"
            >
              <template v-slot:prepend>
                <q-icon name="subdirectory_arrow_right" color="primary" />
              </template>
            </q-select>

            <!-- FUNCION -->
            <q-select
              outlined
              bg-color="white"
              v-model="form.funcionId"
              :options="funciones"
              label="Función"
              disable
              emit-value
              map-options
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="work" color="primary" />
              </template>
            </q-select>

            <!-- FINALIDAD -->
            <q-select
              outlined
              bg-color="white"
              v-model="form.finalidadId"
              :options="finalidades"
              label="Finalidad"
              disable
              emit-value
              map-options
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="star" color="primary" />
              </template>
            </q-select>

            <!-- AÑO -->
            <q-select
              outlined
              bg-color="white"
              v-model="form.anioOperando"
              :options="anios"
              label="Año Operando"
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="calendar_today" color="primary" />
              </template>
            </q-select>

            <!-- ENTREGA -->
            <q-select
              outlined
              bg-color="white"
              v-model="form.entregaBienes"
              :options="opcionesEntregaBienes"
              label="Entrega de Bienes o Servicios"
              class="modern-input full-width"
            >
              <template v-slot:prepend>
                <q-icon name="handshake" color="primary" />
              </template>
            </q-select>
          </q-card-section>

          <!-- INFO -->
          <q-card-section>
            <q-banner rounded class="info-banner">
              <template v-slot:avatar>
                <q-icon name="info" />
              </template>

              La función y finalidad se completan automáticamente con base en la subfunción
              seleccionada.
            </q-banner>
          </q-card-section>

          <!-- ACTIONS -->
          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="/formulario-alineacion"
              :loading="loading"
              icon="arrow_back"
            />

            <q-btn
              label="Continuar"
              class="primary-btn"
              type="submit"
              unelevated
              :loading="loading"
              icon-right="arrow_forward"
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
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
  margin-top: 8px;
  color: #6b7280;
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
  font-size: 1.3rem;
  font-weight: 700;
  color: #374151;
}

.section-description {
  margin-top: 8px;
  color: #6b7280;
  font-size: 0.95rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.full-width {
  grid-column: 1 / -1;
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

.info-banner {
  background: #eff6ff;
  color: #1d4ed8;
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
