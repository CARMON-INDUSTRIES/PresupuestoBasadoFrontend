<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Identificación y Descripción del Problema</h1>

          <p class="page-subtitle">
            Define el problema central, actores involucrados, causas, efectos y evolución de la
            problemática.
          </p>
        </div>

        <div class="autosave-status">
          <q-chip
            v-if="saving"
            color="orange-1"
            text-color="orange-9"
            icon="sync"
            class="autosave-chip"
          >
            Guardando...
          </q-chip>

          <q-chip
            v-else
            color="green-1"
            text-color="green-9"
            icon="check_circle"
            class="autosave-chip"
          >
            Autoguardado activo
          </q-chip>
        </div>
      </div>

      <q-stepper flat bordered animated color="primary" class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" done />

        <q-step :name="2" title="Clasificación" icon="dashboard" done />

        <q-step :name="3" title="Antecedentes" icon="history_edu" done />

        <q-step :name="4" title="Problema" icon="warning" active />

        <q-step :name="5" title="Justificación" icon="fact_check" />

        <q-step :name="6" title="Metas" icon="track_changes" />
      </q-stepper>

      <q-form @submit.prevent="submitForm">
        <q-card class="modern-card">
          <q-card-section class="q-pb-none">
            <div class="section-title">Diagnóstico del problema público</div>

            <div class="section-description">
              Captura la información relacionada con la problemática que atiende el programa
              presupuestario.
            </div>
          </q-card-section>

          <q-card-section class="form-column">
            <div class="question-block">
              <div class="question-title">2.1 Problema central o necesidad principal</div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.problemaCentral"
                type="textarea"
                autogrow
                class="modern-textarea"
                placeholder="Describe de forma concreta el problema central que atiende el programa..."
              >
                <template v-slot:prepend>
                  <q-icon name="report_problem" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="question-block">
              <div class="question-title">2.2 Actores involucrados</div>

              <div class="question-helper">
                Describe organizaciones, empresas, grupos o individuos relacionados con la
                problemática.
              </div>

              <div class="actors-grid">
                <q-card class="actor-card positive-card">
                  <q-card-section>
                    <div class="actor-title">Beneficiados</div>

                    <q-input
                      outlined
                      bg-color="white"
                      v-model="form.causaBeneficiados"
                      type="textarea"
                      autogrow
                      class="modern-textarea"
                    >
                      <template v-slot:prepend>
                        <q-icon name="emoji_people" color="positive" />
                      </template>
                    </q-input>
                  </q-card-section>
                </q-card>

                <q-card class="actor-card negative-card">
                  <q-card-section>
                    <div class="actor-title">Opositores</div>

                    <q-input
                      outlined
                      bg-color="white"
                      v-model="form.causaOpositores"
                      type="textarea"
                      autogrow
                      class="modern-textarea"
                    >
                      <template v-slot:prepend>
                        <q-icon name="thumb_down" color="negative" />
                      </template>
                    </q-input>
                  </q-card-section>
                </q-card>

                <q-card class="actor-card info-card">
                  <q-card-section>
                    <div class="actor-title">Ejecutores</div>

                    <q-input
                      outlined
                      bg-color="white"
                      v-model="form.causaEjecutores"
                      type="textarea"
                      autogrow
                      class="modern-textarea"
                    >
                      <template v-slot:prepend>
                        <q-icon name="construction" color="primary" />
                      </template>
                    </q-input>
                  </q-card-section>
                </q-card>

                <q-card class="actor-card neutral-card">
                  <q-card-section>
                    <div class="actor-title">Indiferentes</div>

                    <q-input
                      outlined
                      bg-color="white"
                      v-model="form.causaIndiferentes"
                      type="textarea"
                      autogrow
                      class="modern-textarea"
                    >
                      <template v-slot:prepend>
                        <q-icon name="remove_circle_outline" color="grey" />
                      </template>
                    </q-input>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div class="question-block">
              <div class="question-title">2.3 Causas del problema</div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.involucrados"
                type="textarea"
                autogrow
                class="modern-textarea"
                placeholder="Describe las causas que originan el problema..."
              >
                <template v-slot:prepend>
                  <q-icon name="group" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="question-block">
              <div class="question-title">2.4 Efectos del problema</div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.efectos"
                type="textarea"
                autogrow
                class="modern-textarea"
                placeholder="Describe los efectos generados en la población o entorno..."
              >
                <template v-slot:prepend>
                  <q-icon name="visibility" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="question-block">
              <div class="question-title">2.5 Evolución histórica del problema</div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.evolucion"
                type="textarea"
                autogrow
                class="modern-textarea"
                placeholder="Describe cómo ha evolucionado la problemática..."
              >
                <template v-slot:prepend>
                  <q-icon name="timeline" color="primary" />
                </template>
              </q-input>
            </div>
          </q-card-section>

          <q-card-section>
            <q-banner rounded class="info-banner">
              <template v-slot:avatar>
                <q-icon name="info" />
              </template>

              La información se guarda automáticamente mientras escribes.
            </q-banner>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="/formulario-antecedente"
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

const ROUTE_AFTER_SAVE = '/formulario-determinacion-justificacion'
const router = useRouter()

const loading = ref(false)
const saving = ref(false)

const form = ref({
  id: null,
  problemaCentral: '',
  involucrados: '',
  causaBeneficiados: '',
  causaOpositores: '',
  causaEjecutores: '',
  causaIndiferentes: '',
  efectos: '',
  evolucion: '',
})

async function cargarBorrador() {
  loading.value = true
  try {
    const { data } = await api.get('/IdentificacionDescripcionProblema/borrador')
    form.value = data
  } catch (err) {
    console.error('Error al cargar borrador:', err)
    Notify.create({ type: 'negative', message: 'No se pudo cargar el borrador' })
  } finally {
    loading.value = false
  }
}

let autosaveTimer = null

async function autoSave() {
  saving.value = true
  try {
    const { data } = await api.put('/IdentificacionDescripcionProblema/autosave', form.value)
    form.value = data
  } catch (err) {
    console.error('Error en autosave:', err)
  } finally {
    saving.value = false
  }
}

watch(
  form,
  () => {
    clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(autoSave, 1500)
  },
  { deep: true },
)

onMounted(() => {
  cargarBorrador()
})

function validarFormulario() {
  if (!form.value.problemaCentral.trim()) return 'Debes escribir el problema central'
  if (!form.value.involucrados.trim()) return 'Debes capturar a los involucrados'
  return null
}

async function submitForm() {
  const errorValidacion = validarFormulario()
  if (errorValidacion) {
    Notify.create({ type: 'warning', message: errorValidacion })
    return
  }

  loading.value = true
  try {
    await api.put('/IdentificacionDescripcionProblema/autosave', form.value)

    localStorage.setItem('ultimaRutaRegistro', ROUTE_AFTER_SAVE)

    Notify.create({
      type: 'positive',
      message: 'Identificación guardada correctamente',
    })

    router.push(ROUTE_AFTER_SAVE)
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Error al guardar el formulario' })
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
  max-width: 1250px;
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

.actors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.actor-card {
  border-radius: 18px;
  box-shadow: none;
  border: 1px solid #e5e7eb;
}

.actor-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: #374151;
}

.positive-card {
  background: #f0fdf4;
}

.negative-card {
  background: #fef2f2;
}

.info-card {
  background: #eff6ff;
}

.neutral-card {
  background: #f9fafb;
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
