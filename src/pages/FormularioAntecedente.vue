<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Antecedentes</h1>

          <p class="page-subtitle">
            Documenta el contexto histórico, normativo y operativo del programa presupuestario.
          </p>
        </div>

        <div class="autosave-status">
          <q-chip
            v-if="autosaveLoading"
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

      <q-stepper flat bordered color="primary" animated class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" done />

        <q-step :name="2" title="Clasificación" icon="dashboard" done />

        <q-step :name="3" title="Antecedentes" icon="history_edu" active />

        <q-step :name="4" title="Problema" icon="warning" />

        <q-step :name="5" title="Metas" icon="track_changes" />
      </q-stepper>

      <q-form @submit.prevent="submitForm">
        <q-card class="modern-card">
          <q-card-section class="q-pb-none">
            <div class="section-title">Información general del programa</div>

            <div class="section-description">
              Describe el entorno, antecedentes y evolución del programa presupuestario.
            </div>
          </q-card-section>

          <q-card-section class="form-column">
            <div class="question-block">
              <div class="question-title">1.1 Entorno operativo del programa</div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.descripcionPrograma"
                type="textarea"
                autogrow
                class="modern-textarea"
                placeholder="Describe la situación, problemática o necesidad que motiva la intervención pública..."
              >
                <template v-slot:prepend>
                  <q-icon name="description" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="question-block">
              <div class="question-title">1.2 Información estadística y cualitativa</div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.contextoHistoricoNormativo"
                type="textarea"
                autogrow
                class="modern-textarea"
                placeholder="Incorpora datos, estadísticas y antecedentes relevantes..."
              >
                <template v-slot:prepend>
                  <q-icon name="bar_chart" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="question-block">
              <div class="question-title">1.3 Actores involucrados</div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.problematicaOrigen"
                type="textarea"
                autogrow
                class="modern-textarea"
                placeholder="Describe los actores responsables o relacionados con la atención del problema..."
              >
                <template v-slot:prepend>
                  <q-icon name="group" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="question-block">
              <div class="question-title">1.4 Evolución y resultados del programa</div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.experienciasPrevias"
                type="textarea"
                autogrow
                class="modern-textarea"
                placeholder="Describe la evolución histórica y resultados obtenidos..."
              >
                <template v-slot:prepend>
                  <q-icon name="history" color="primary" />
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
              to="/formulario-clasificacion"
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
const autosaveLoading = ref(false)

const registroId = ref(null)

const form = ref({
  descripcionPrograma: '',
  contextoHistoricoNormativo: '',
  problematicaOrigen: '',
  experienciasPrevias: '',
})

async function cargarBorrador() {
  try {
    const { data } = await api.get('/Antecedente/borrador')

    registroId.value = data.id

    form.value.descripcionPrograma = data.descripcionPrograma
    form.value.contextoHistoricoNormativo = data.contextoHistoricoNormativo
    form.value.problematicaOrigen = data.problematicaOrigen
    form.value.experienciasPrevias = data.experienciasPrevias
  } catch (err) {
    console.error('Error al cargar borrador', err)
  }
}

let autosaveTimer = null

watch(
  form,
  () => {
    clearTimeout(autosaveTimer)

    autosaveTimer = setTimeout(() => {
      guardarAuto()
    }, 1200)
  },
  { deep: true },
)

async function guardarAuto() {
  if (!registroId.value) return

  autosaveLoading.value = true

  try {
    await api.put('/Antecedente/autosave', {
      id: registroId.value,
      ...form.value,
    })
  } catch (err) {
    console.warn('Autosave falló:', err)
  } finally {
    autosaveLoading.value = false
  }
}

async function submitForm() {
  loading.value = true
  try {
    await api.put(`/Antecedente/${registroId.value}`, {
      id: registroId.value,
      ...form.value,
    })

    Notify.create({
      type: 'positive',
      message: 'Antecedentes guardados correctamente',
    })

    router.push('/formulario-identificacion-problema')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar antecedentes',
    })
  } finally {
    loading.value = false
  }
}

onMounted(cargarBorrador)
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
  gap: 10px;
}

.question-title {
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
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
