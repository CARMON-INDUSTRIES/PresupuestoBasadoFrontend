<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Determinación y Justificación de los Objetivos</h1>

          <p class="page-subtitle">
            Define los objetivos específicos del programa y su relación con otros programas
            presupuestarios existentes.
          </p>
        </div>

        <!-- AUTOSAVE -->
        <div class="autosave-status">
          <q-chip color="green-1" text-color="green-9" icon="check_circle" class="autosave-chip">
            Autoguardado activo
          </q-chip>
        </div>
      </div>

      <!-- STEPPER -->
      <q-stepper flat bordered animated color="primary" class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" done />

        <q-step :name="2" title="Clasificación" icon="dashboard" done />

        <q-step :name="3" title="Antecedentes" icon="history_edu" done />

        <q-step :name="4" title="Problema" icon="warning" done />

        <q-step :name="5" title="Objetivos" icon="fact_check" active />

        <q-step :name="6" title="Cobertura" icon="groups" />
      </q-stepper>

      <!-- FORM -->
      <q-form @submit.prevent="submitForm">
        <q-card class="modern-card">
          <!-- HEADER CARD -->
          <q-card-section class="q-pb-none">
            <div class="section-title">Objetivos del programa presupuestario</div>

            <div class="section-description">
              Captura los objetivos específicos y analiza la relación del programa con otros
              programas presupuestarios.
            </div>
          </q-card-section>

          <!-- FORM CONTENT -->
          <q-card-section class="form-column">
            <!-- OBJETIVOS -->
            <div class="question-block">
              <div class="question-title">3.1 Objetivos específicos del programa</div>

              <div class="question-helper">
                Define los objetivos específicos que atenderá el programa. Debe existir congruencia
                con el árbol de objetivos.
              </div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.objetivosEspecificos"
                type="textarea"
                autogrow
                class="modern-textarea"
                placeholder="Describe los objetivos específicos del programa..."
              >
                <template v-slot:prepend>
                  <q-icon name="flag" color="primary" />
                </template>
              </q-input>
            </div>

            <!-- RELACION PROGRAMAS -->
            <div class="question-block">
              <div class="question-title">3.2 Relación y vinculación con otros programas</div>

              <div class="question-helper">
                Identifica programas presupuestarios relacionados, complementarios o que pudieran
                duplicar objetivos.
              </div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.relacionOtrosProgramas"
                type="textarea"
                autogrow
                class="modern-textarea"
                placeholder="Describe programas relacionados o similares..."
              >
                <template v-slot:prepend>
                  <q-icon name="link" color="primary" />
                </template>
              </q-input>
            </div>
          </q-card-section>

          <!-- INFO -->
          <q-card-section>
            <q-banner rounded class="info-banner">
              <template v-slot:avatar>
                <q-icon name="info" />
              </template>

              La información se guarda automáticamente mientras escribes.
            </q-banner>
          </q-card-section>

          <!-- ACTIONS -->
          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="/formulario-identificacion-problema"
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
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const ROUTE_AFTER_SAVE = '/formulario-cobertura'

const router = useRouter()
const loading = ref(false)

const form = ref({
  objetivosEspecificos: '',
  relacionOtrosProgramas: '',
})

onMounted(async () => {
  try {
    const { data } = await api.get('/DeterminacionJustificacionObjetivos/borrador')
    form.value = data
  } catch (error) {
    console.warn('No se pudo cargar el borrador:', error)
    Notify.create({
      type: 'warning',
      message: 'No se pudo cargar el borrador guardado.',
    })
  }
})

let autosaveTimeout = null

watch(
  form,
  () => {
    clearTimeout(autosaveTimeout)
    autosaveTimeout = setTimeout(async () => {
      try {
        await api.put('/DeterminacionJustificacionObjetivos/autosave', form.value)
      } catch (err) {
        console.warn('Error en autosave:', err)
      }
    }, 1000)
  },
  { deep: true },
)

function validarFormulario() {
  if (!form.value.objetivosEspecificos?.trim()) {
    return 'Debes capturar los objetivos específicos'
  }
  return null
}

async function submitForm() {
  const error = validarFormulario()
  if (error) {
    Notify.create({ type: 'warning', message: error })
    return
  }

  loading.value = true
  try {
    Notify.create({
      type: 'positive',
      message: 'Datos guardados automáticamente.',
    })

    router.push(ROUTE_AFTER_SAVE)
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: 'Error al continuar.',
      err,
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
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
  max-width: 700px;
}

.autosave-status {
  display: flex;
  align-items: center;
}

.autosave-chip {
  font-weight: 600;
  border-radius: 12px;
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

.form-column {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.question-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-title {
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
}

.question-helper {
  color: #6b7280;
  font-size: 0.9rem;
}

.modern-textarea {
  transition: all 0.2s ease;
}

.modern-textarea:hover {
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
  .page-header {
    flex-direction: column;
  }

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
