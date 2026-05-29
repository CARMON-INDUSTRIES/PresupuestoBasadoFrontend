<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Programa Social</h1>
          <p class="page-subtitle">
            Define las características del programa y su clasificación operativa.
          </p>
        </div>
      </div>

      <!-- STEPPER -->
      <q-stepper flat bordered color="primary" animated class="modern-stepper">
        <q-step :name="1" title="Intervención" icon="widgets" done />
        <q-step :name="2" title="Programa Social" icon="groups" active />
        <q-step :name="3" title="Continuar" icon="arrow_forward" />
      </q-stepper>

      <!-- CARD -->
      <q-form @submit.prevent="guardarDetalle">
        <q-card class="modern-card">
          <q-card-section>
            <div class="section-title">¿Es un programa social?</div>
            <p class="page-subtitle">
              Selecciona las características que aplican al programa presupuestario.
            </p>
          </q-card-section>

          <q-card-section class="form-grid">
            <!-- REGLAS -->
            <div class="option-card">
              <div class="option-title">
                <q-icon name="gavel" color="primary" size="24px" />
                Sujeto a reglas de operación
              </div>

              <div class="option-description">
                Programas sujetos a lineamientos específicos y reglas de operación oficiales.
              </div>

              <q-option-group
                v-model="form.SujetoReglasOperacion"
                :options="opcionesSiNo"
                type="radio"
                inline
                color="primary"
                class="modern-radio"
              />
            </div>

            <!-- SUBSIDIOS -->
            <div class="option-card">
              <div class="option-title">
                <q-icon name="volunteer_activism" color="primary" size="24px" />
                Otros subsidios
              </div>

              <div class="option-description">
                Subsidios otorgados mediante convenios y no sujetos a reglas de operación.
              </div>

              <q-option-group
                v-model="form.OtrosSubsidios"
                :options="opcionesSiNo"
                type="radio"
                inline
                color="primary"
                class="modern-radio"
              />
            </div>

            <!-- SERVICIOS -->
            <div class="option-card">
              <div class="option-title">
                <q-icon name="miscellaneous_services" color="primary" size="24px" />
                Prestación de servicios públicos
              </div>

              <div class="option-description">
                Actividades realizadas para satisfacer demandas de la sociedad.
              </div>

              <q-option-group
                v-model="form.PrestacionServiciosPublicos"
                :options="opcionesSiNo"
                type="radio"
                inline
                color="primary"
                class="modern-radio"
              />
            </div>

            <!-- BIENES -->
            <div class="option-card">
              <div class="option-title">
                <q-icon name="inventory_2" color="primary" size="24px" />
                Provisión de bienes públicos
              </div>

              <div class="option-description">
                Actividades enfocadas en crear o elaborar bienes públicos.
              </div>

              <q-option-group
                v-model="form.ProvisionBienesPublicos"
                :options="opcionesSiNo"
                type="radio"
                inline
                color="primary"
                class="modern-radio"
              />
            </div>
          </q-card-section>

          <!-- ACTIONS -->
          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="formulario-diseno-intervencion"
              :loading="loading"
            />

            <q-btn
              label="Continuar"
              type="submit"
              class="primary-btn"
              unelevated
              :loading="loading"
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

const STORAGE_KEY = 'formularioProgramaSocial'
const router = useRouter()

const opcionesSiNo = [
  { label: 'Sí', value: 'Sí' },
  { label: 'No', value: 'No' },
]

const form = ref({
  SujetoReglasOperacion: null,
  OtrosSubsidios: null,
  PrestacionServiciosPublicos: null,
  ProvisionBienesPublicos: null,
})

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    form.value = JSON.parse(saved)
    console.log('Datos cargados desde localStorage:', form.value)
  }
})

watch(
  form,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true },
)

async function guardarDetalle() {
  try {
    const payload = { ...form.value }
    delete payload.Id

    await api.post('/ReglasOperacionDetalle', payload)

    Notify.create({ type: 'positive', message: 'Detalle guardado correctamente' })
    localStorage.setItem('ultimaRutaRegistro', '/formulario-programa-social')
    router.push('/formulario-programa-social')
  } catch (err) {
    console.error('Error al guardar detalle:', err)
    Notify.create({ type: 'negative', message: 'Error al guardar detalle' })
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
  font-size: 1.2rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.option-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 22px;
  transition: all 0.2s ease;
}

.option-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.option-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 10px;
}

.option-description {
  color: #6b7280;
  font-size: 0.92rem;
  line-height: 1.5;
  margin-bottom: 18px;
}

.modern-radio {
  padding-top: 8px;
}

.actions-container {
  gap: 12px;
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

.secondary-btn:hover {
  opacity: 0.95;
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

  .content-wrapper {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
