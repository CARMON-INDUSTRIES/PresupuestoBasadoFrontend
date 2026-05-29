<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Análisis de Involucrados</h1>
        <p class="page-subtitle">
          Consulta de actores relacionados con el problema central identificado.
        </p>
      </div>

      <q-card flat class="modern-card">
        <q-card-section>
          <div class="section-title">Problema Central</div>

          <q-input
            :model-value="resumen.problemaCentral || ''"
            type="textarea"
            filled
            autogrow
            readonly
            rounded
            class="modern-input q-mt-md"
          >
            <template v-slot:prepend>
              <q-icon name="report_problem" color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-separator spaced />

        <q-card-section>
          <div class="section-title">Clasificación de Involucrados</div>

          <div class="form-grid q-mt-md">
            <q-card flat class="actor-card beneficiarios-card">
              <q-card-section>
                <div class="actor-title">
                  <q-icon name="emoji_people" />
                  Beneficiarios
                </div>

                <q-input
                  :model-value="resumen.causaBeneficiados || ''"
                  type="textarea"
                  filled
                  autogrow
                  readonly
                  rounded
                  class="modern-input"
                />
              </q-card-section>
            </q-card>

            <q-card flat class="actor-card opositores-card">
              <q-card-section>
                <div class="actor-title">
                  <q-icon name="thumb_down" />
                  Opositores
                </div>

                <q-input
                  :model-value="resumen.causaOpositores || ''"
                  type="textarea"
                  filled
                  autogrow
                  readonly
                  rounded
                  class="modern-input"
                />
              </q-card-section>
            </q-card>

            <q-card flat class="actor-card ejecutores-card">
              <q-card-section>
                <div class="actor-title">
                  <q-icon name="construction" />
                  Ejecutores
                </div>

                <q-input
                  :model-value="resumen.causaEjecutores || ''"
                  type="textarea"
                  filled
                  autogrow
                  readonly
                  rounded
                  class="modern-input"
                />
              </q-card-section>
            </q-card>

            <q-card flat class="actor-card indiferentes-card">
              <q-card-section>
                <div class="actor-title">
                  <q-icon name="remove_circle_outline" />
                  Indiferentes
                </div>

                <q-input
                  :model-value="resumen.causaIndiferentes || ''"
                  type="textarea"
                  filled
                  autogrow
                  readonly
                  rounded
                  class="modern-input"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg actions-container">
          <q-btn
            label="Pantalla Anterior"
            color="primary"
            text-color="white"
            rounded
            unelevated
            class="secondary-btn"
            to="/PoblacionAreaEnfoquePotencial"
            icon="arrow_back"
          />

          <q-btn
            color="primary"
            text-color="white"
            label="Continuar"
            rounded
            unelevated
            class="primary-btn"
            icon="arrow_forward"
            @click="irArbolProblemas"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()

const resumen = ref({
  problemaCentral: '',
  causaBeneficiados: '',
  causaOpositores: '',
  causaEjecutores: '',
  causaIndiferentes: '',
})

async function cargarDatos() {
  try {
    const res = await api.get('/IdentificacionDescripcionProblema/ultimo')
    resumen.value = {
      problemaCentral: res.data.problemaCentral,
      causaBeneficiados: res.data.causaBeneficiados,
      causaOpositores: res.data.causaOpositores,
      causaEjecutores: res.data.causaEjecutores,
      causaIndiferentes: res.data.causaIndiferentes,
    }
    console.log('Datos Anexo 3:', resumen.value)
  } catch (err) {
    console.error('Error al cargar datos del Anexo 3:', err)
    Notify.create({ type: 'negative', message: 'Error al cargar datos del Anexo 3' })
  }
}

function irArbolProblemas() {
  localStorage.setItem('ultimaRutaRegistro', '/formulario-arbol-problemas')
  router.push('/formulario-arbol-problemas')
}

onMounted(() => {
  cargarDatos()
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
  color: #6b7280;
  margin-top: 8px;
  font-size: 1rem;
}

.modern-card {
  border-radius: 24px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
  border: none;
  background: white;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.modern-input {
  transition: all 0.2s ease;
}

.modern-input:hover {
  transform: translateY(-1px);
}

.actor-card {
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  background: #fafafa;
  transition: all 0.2s ease;
}

.actor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.actor-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 14px;
  color: #374151;
}

.beneficiarios-card {
  border-left: 5px solid #10b981;
}

.opositores-card {
  border-left: 5px solid #ef4444;
}

.ejecutores-card {
  border-left: 5px solid #3b82f6;
}

.indiferentes-card {
  border-left: 5px solid #9ca3af;
}

.primary-btn {
  background: #c5a46d;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.primary-btn:hover {
  opacity: 0.95;
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

.q-field__control {
  border-radius: 14px;
  background: #fff;
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

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
