<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Cobertura</h1>

          <p class="page-subtitle">
            Define la población potencial, población objetivo, cuantificación y mecanismos de
            actualización del programa.
          </p>
        </div>

        <!-- AUTOSAVE -->
        <div class="autosave-status">
          <q-chip color="green-1" text-color="green-9" icon="cloud_done" class="autosave-chip">
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

        <q-step :name="5" title="Objetivos" icon="fact_check" done />

        <q-step :name="6" title="Cobertura" icon="groups" active />

        <q-step :name="7" title="Intervención" icon="schema" />
      </q-stepper>

      <!-- FORM -->
      <q-form @submit.prevent="submitForm">
        <q-card class="modern-card">
          <!-- TITULO -->
          <q-card-section class="q-pb-none">
            <div class="section-title">Cobertura y población objetivo</div>

            <div class="section-description">
              Describe la población potencial, objetivo y los mecanismos utilizados para su
              identificación y actualización.
            </div>
          </q-card-section>

          <!-- CONTENIDO -->
          <q-card-section class="form-column">
            <!-- POBLACION POTENCIAL -->
            <div class="question-block">
              <div class="question-title">
                4.1 Identificación y caracterización de la población potencial
              </div>

              <div class="question-helper">
                Describe la población o área de enfoque que presenta la necesidad o problemática que
                el programa atenderá.
              </div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.identificacionCaracterizacionPoblacionPotencial"
                type="textarea"
                autogrow
                class="modern-input"
                placeholder="Describe la población potencial..."
              >
                <template v-slot:prepend>
                  <q-icon name="people" color="primary" />
                </template>
              </q-input>
            </div>

            <!-- POBLACION OBJETIVO -->
            <div class="question-block">
              <div class="question-title">
                4.2 Identificación y caracterización de la población objetivo
              </div>

              <div class="question-helper">
                Especifica la población que el programa planea atender directamente.
              </div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.identificacionCaracterizacionPoblacionObjetivo"
                type="textarea"
                autogrow
                class="modern-input"
                placeholder="Describe la población objetivo..."
              >
                <template v-slot:prepend>
                  <q-icon name="people_outline" color="primary" />
                </template>
              </q-input>
            </div>

            <!-- UNIDAD DE MEDIDA -->
            <div class="question-block">
              <div class="question-title">Unidad de medida</div>

              <div class="question-helper">
                Ejemplo: personas, mujeres, familias, productores, estudiantes, etc.
              </div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.unidadMedida"
                class="modern-input"
                placeholder="Ingrese la unidad de medida..."
              >
                <template v-slot:prepend>
                  <q-icon name="straighten" color="primary" />
                </template>
              </q-input>
            </div>

            <!-- CUANTIFICACION -->
            <div class="stats-section">
              <div class="section-mini-title">4.3 Cuantificación de las poblaciones</div>

              <div class="stats-grid">
                <q-input
                  outlined
                  bg-color="white"
                  v-model.number="form.cuantificacionPoblacionPotencial"
                  type="number"
                  min="0"
                  class="modern-input"
                  label="Población potencial"
                >
                  <template v-slot:prepend>
                    <q-icon name="groups" color="primary" />
                  </template>
                </q-input>

                <q-input
                  outlined
                  bg-color="white"
                  v-model.number="form.cuantificacionPoblacionObjetivo"
                  type="number"
                  min="0"
                  class="modern-input"
                  label="Población objetivo"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" color="primary" />
                  </template>
                </q-input>

                <q-input
                  outlined
                  bg-color="white"
                  v-model.number="form.cuantificacionPoblacionAtendidaAnterior"
                  type="number"
                  min="0"
                  class="modern-input"
                  label="Población atendida anteriormente"
                >
                  <template v-slot:prepend>
                    <q-icon name="history" color="primary" />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- FRECUENCIA -->
            <div class="question-block">
              <div class="question-title">4.4 Frecuencia de actualización de la población</div>

              <div class="question-helper">
                Selecciona la periodicidad con la que se actualizará la información.
              </div>

              <q-select
                outlined
                bg-color="white"
                v-model="form.frecuenciaActualizacion"
                :options="frecuencias"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                label="Seleccione la frecuencia"
                class="modern-input"
              >
                <template v-slot:prepend>
                  <q-icon name="update" color="primary" />
                </template>
              </q-select>
            </div>

            <!-- PROCESO POTENCIAL -->
            <div class="question-block">
              <div class="question-title">Proceso de identificación de la población potencial</div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.procesoIdentificacionPoblacionPotencial"
                type="textarea"
                autogrow
                class="modern-input"
                placeholder="Describe el proceso..."
              >
                <template v-slot:prepend>
                  <q-icon name="settings" color="primary" />
                </template>
              </q-input>
            </div>

            <!-- PROCESO OBJETIVO -->
            <div class="question-block">
              <div class="question-title">Proceso de identificación de la población objetivo</div>

              <q-input
                outlined
                bg-color="white"
                v-model="form.procesoIdentificacionPoblacionObjetivo"
                type="textarea"
                autogrow
                class="modern-input"
                placeholder="Describe el proceso..."
              >
                <template v-slot:prepend>
                  <q-icon name="settings_applications" color="primary" />
                </template>
              </q-input>
            </div>
          </q-card-section>

          <!-- ALERTA -->
          <q-card-section>
            <q-banner rounded class="info-banner">
              <template v-slot:avatar>
                <q-icon name="info" />
              </template>

              La información se guarda automáticamente mientras escribes.
            </q-banner>
          </q-card-section>

          <!-- BOTONES -->
          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="/formulario-determinacion-justificacion"
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

const ROUTE_AFTER_SAVE = '/formulario-diseno-intervencion'

const router = useRouter()
const loading = ref(false)

const frecuencias = [
  { label: 'Mensual', value: 'Mensual' },
  { label: 'Trimestral', value: 'Trimestral' },
  { label: 'Semestral', value: 'Semestral' },
  { label: 'Anual', value: 'Anual' },
]

const form = ref({
  identificacionCaracterizacionPoblacionPotencial: '',
  identificacionCaracterizacionPoblacionObjetivo: '',
  cuantificacionPoblacionPotencial: null,
  cuantificacionPoblacionObjetivo: null,
  cuantificacionPoblacionAtendidaAnterior: null,
  unidadMedida: '',
  frecuenciaActualizacion: '',
  procesoIdentificacionPoblacionPotencial: '',
  procesoIdentificacionPoblacionObjetivo: '',
})

onMounted(async () => {
  try {
    const { data } = await api.get('/Cobertura/borrador')

    if (data) {
      form.value = { ...form.value, ...data }
      //console.log('📥 Borrador cargado:', data)
    }
  } catch (error) {
    console.warn('⚠ No se pudo cargar el borrador:', error)
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
        //console.log('Autosave ejecutado')
        await api.put('/Cobertura/autosave', form.value)
      } catch (err) {
        console.warn(' Error en autosave:', err)
      }
    }, 1000)
  },
  { deep: true },
)

function validarFormulario() {
  if (!form.value.unidadMedida?.trim()) {
    return 'La unidad de medida es obligatoria'
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
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Error al continuar.',
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

.section-mini-title {
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 18px;
}

.stats-section {
  background: #f9fafb;
  border-radius: 18px;
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
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
