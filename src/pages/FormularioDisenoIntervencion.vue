<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Diseño de la Intervención Pública</h1>
          <p class="page-subtitle">
            Define los componentes, actividades y resultados esperados del programa.
          </p>
        </div>

        <div class="autosave-chip">
          <q-chip
            :color="autosaveLoading ? 'orange' : 'positive'"
            text-color="white"
            icon="cloud_done"
          >
            {{ autosaveLoading ? 'Guardando...' : 'Guardado automático' }}
          </q-chip>
        </div>
      </div>

      <!-- STEPPER -->
      <q-stepper flat bordered color="primary" animated class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" done />
        <q-step :name="2" title="Clasificación" icon="dashboard" done />
        <q-step :name="3" title="Antecedentes" icon="history_edu" done />
        <q-step :name="4" title="Problema" icon="report_problem" done />
        <q-step :name="5" title="Objetivos" icon="flag" done />
        <q-step :name="6" title="Cobertura" icon="groups" done />
        <q-step :name="7" title="Intervención" icon="design_services" active />
      </q-stepper>

      <!-- CARD -->
      <q-form @submit.prevent="submitForm">
        <q-card class="modern-card">
          <q-card-section class="q-pb-none">
            <div class="section-title">Componentes y diseño operativo</div>

            <div class="section-description">
              Agrega los componentes principales, actividades y efectos esperados del programa
              presupuestario.
            </div>
          </q-card-section>

          <q-card-section class="form-grid">
            <!-- BOTON AGREGAR -->
            <div class="full-width row justify-between items-center q-mb-md">
              <div class="text-subtitle1 text-weight-medium text-primary">
                Componentes registrados
              </div>

              <q-btn
                color="primary"
                icon="add"
                label="Agregar componente"
                unelevated
                rounded
                class="primary-btn"
                @click="showModal = true"
              />
            </div>

            <!-- EMPTY STATE -->
            <div v-if="!form.componentes.length" class="empty-components full-width">
              <q-icon name="inventory_2" size="60px" color="grey-5" />
              <div class="text-h6 q-mt-md text-grey-7">No hay componentes registrados</div>

              <div class="text-body2 text-grey-6 q-mt-sm">
                Agrega componentes para comenzar a estructurar la intervención.
              </div>
            </div>

            <!-- COMPONENTES -->
            <div
              v-for="(comp, cIdx) in form.componentes"
              :key="cIdx"
              class="component-card full-width"
            >
              <div class="component-header">
                <div class="row items-center q-gutter-sm">
                  <q-avatar color="primary" text-color="white" icon="widgets" />

                  <div>
                    <div class="component-title">
                      {{ comp.nombre }}
                    </div>

                    <div class="component-subtitle">
                      {{ comp.acciones.length }} actividades registradas
                    </div>
                  </div>
                </div>

                <div class="row q-gutter-sm">
                  <q-btn
                    dense
                    round
                    flat
                    icon="edit"
                    color="primary"
                    @click="editarComponente(comp, cIdx)"
                  >
                    <q-tooltip>Editar componente</q-tooltip>
                  </q-btn>

                  <q-btn
                    dense
                    round
                    flat
                    icon="delete"
                    color="negative"
                    @click="form.componentes.splice(cIdx, 1)"
                  >
                    <q-tooltip>Eliminar componente</q-tooltip>
                  </q-btn>
                </div>
              </div>

              <!-- ACTIVIDADES -->
              <div class="activities-container">
                <div v-for="(accion, aIdx) in comp.acciones" :key="aIdx" class="activity-item">
                  <div class="activity-icon">
                    <q-icon name="task_alt" />
                  </div>

                  <div class="activity-content">
                    <div class="activity-title">
                      {{ accion.descripcion }}
                    </div>

                    <div class="activity-qty">Cantidad programada: {{ accion.cantidad }}</div>
                  </div>
                </div>
              </div>

              <!-- EFECTO -->
              <q-banner rounded class="effect-banner">
                <template v-slot:avatar>
                  <q-icon name="flare" />
                </template>

                <strong>Efecto esperado:</strong>

                {{
                  typeof comp.resultado === 'string' ? comp.resultado : comp.resultado.descripcion
                }}
              </q-banner>
            </div>

            <!-- ETAPAS -->
            <q-input
              outlined
              bg-color="white"
              v-model="form.etapasIntervencion"
              label="5.2 Establecimiento de los cursos de acción"
              type="textarea"
              autogrow
              class="modern-input full-width"
            >
              <template v-slot:prepend>
                <q-icon name="directions_run" color="primary" />
              </template>
            </q-input>

            <!-- ESCENARIOS -->
            <q-input
              outlined
              bg-color="white"
              v-model="form.escenariosFuturosEsperar"
              label="5.3 Escenarios futuros esperados"
              type="textarea"
              autogrow
              class="modern-input full-width"
            >
              <template v-slot:prepend>
                <q-icon name="visibility" color="primary" />
              </template>
            </q-input>
          </q-card-section>

          <!-- ACTIONS -->
          <q-card-actions align="between" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              icon="arrow_back"
              flat
              class="back-btn"
              to="/formulario-cobertura"
              :loading="loading"
            />

            <q-btn
              label="Continuar"
              icon-right="arrow_forward"
              type="submit"
              unelevated
              class="primary-btn"
              :loading="loading"
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>

    <!-- MODAL -->
    <q-dialog v-model="showModal" persistent>
      <q-card class="modal-card">
        <q-card-section class="modal-header">
          <div class="row items-center justify-between">
            <div>
              <div class="modal-title">
                {{ modoEdicion ? 'Editar componente' : 'Nuevo componente' }}
              </div>

              <div class="modal-subtitle">Configura actividades y resultados esperados.</div>
            </div>

            <q-btn flat round dense icon="close" color="grey-7" v-close-popup />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg">
          <!-- NOMBRE -->
          <q-input
            v-model="nuevoComponente.nombre"
            outlined
            bg-color="white"
            :label="`Componente ${proximoIndiceComp}`"
            class="modern-input q-mb-lg"
          >
            <template v-slot:prepend>
              <q-icon name="widgets" color="primary" />
            </template>
          </q-input>

          <!-- ACTIVIDADES -->
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-medium">Actividades</div>

            <q-btn
              flat
              icon="add"
              color="primary"
              label="Agregar actividad"
              @click="
                nuevoComponente.acciones.push({
                  nombre: '',
                  cantidad: 0,
                })
              "
            />
          </div>

          <div
            v-for="(accion, aIdx) in nuevoComponente.acciones"
            :key="'accion-' + aIdx"
            class="activity-editor"
          >
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle2 text-primary">
                Actividad {{ proximoIndiceComp }}.{{ aIdx + 1 }}
              </div>

              <q-btn
                v-if="nuevoComponente.acciones.length > 1"
                dense
                round
                flat
                icon="delete"
                color="negative"
                @click="nuevoComponente.acciones.splice(aIdx, 1)"
              />
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-8">
                <q-input
                  outlined
                  bg-color="white"
                  v-model="accion.nombre"
                  label="Nombre de la actividad"
                  class="modern-input"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  bg-color="white"
                  type="number"
                  min="0"
                  v-model.number="accion.cantidad"
                  label="Cantidad"
                  class="modern-input"
                />
              </div>
            </div>
          </div>

          <!-- EFECTO -->
          <div class="q-mt-lg">
            <div class="text-subtitle1 text-weight-medium q-mb-sm">Efecto esperado</div>

            <q-input
              outlined
              bg-color="white"
              v-model="nuevoComponente.resultado"
              :label="`${proximoIndiceComp}.1.1`"
              type="textarea"
              autogrow
              class="modern-input"
            >
              <template v-slot:prepend>
                <q-icon name="flare" color="primary" />
              </template>
            </q-input>
          </div>

          <!-- QUICK ACTION -->
          <div class="row justify-end q-mt-lg">
            <q-btn
              flat
              icon="add_circle"
              color="secondary"
              label="Guardar y crear otro"
              @click="guardarComponente(true)"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />

          <q-btn
            unelevated
            :label="modoEdicion ? 'Actualizar componente' : 'Guardar componente'"
            class="primary-btn"
            @click="guardarComponente()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)
const autosaveLoading = ref(false)
const showModal = ref(false)
const modoEdicion = ref(false)
const indiceEditando = ref(null)

const registroId = ref(null)

const form = ref({
  componentes: [],
  etapasIntervencion: '',
  escenariosFuturosEsperar: '',
})

const nuevoComponente = ref({
  nombre: '',
  acciones: [{ nombre: '', cantidad: 0 }],
  resultado: '',
})

const proximoIndiceComp = computed(() => form.value.componentes.length + 1)

async function cargarBorrador() {
  try {
    const { data } = await api.get('/DisenoIntervencionPublica/borrador')

    registroId.value = data.id
    form.value.componentes = data.componentes || []
    form.value.etapasIntervencion = data.etapasIntervencion || ''
    form.value.escenariosFuturosEsperar = data.escenariosFuturosEsperar || ''
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
    await api.put('/DisenoIntervencionPublica/autosave', {
      id: registroId.value,
      ...form.value,
      componentes: form.value.componentes.map((c) => ({
        ...c,
        resultado: typeof c.resultado === 'string' ? { descripcion: c.resultado } : c.resultado,
      })),
    })
  } catch (err) {
    console.warn('Autosave falló', err)
  } finally {
    autosaveLoading.value = false
  }
}

function editarComponente(comp, index) {
  modoEdicion.value = true
  indiceEditando.value = index

  nuevoComponente.value = {
    nombre: comp.nombre.replace(/^\d+\.\s*/, ''),

    acciones: comp.acciones.map((a) => ({
      nombre: a.descripcion.replace(/^\d+\.\d+\s*/, ''),
      cantidad: a.cantidad,
    })),

    resultado:
      typeof comp.resultado === 'string'
        ? comp.resultado.replace(/^\d+\.\d+\.\d+\s*/, '')
        : comp.resultado.descripcion.replace(/^\d+\.\d+\.\d+\s*/, ''),
  }

  showModal.value = true
}

function guardarComponente(continuar = false) {
  if (!nuevoComponente.value.nombre?.trim()) {
    Notify.create({
      type: 'warning',
      message: 'El componente debe tener un nombre',
    })
    return
  }

  const compIndex = modoEdicion.value ? indiceEditando.value + 1 : proximoIndiceComp.value

  const componenteFinal = {
    nombre: `${compIndex}. ${nuevoComponente.value.nombre.trim()}`,

    acciones: nuevoComponente.value.acciones.map((accion, aIdx) => ({
      descripcion: `${compIndex}.${aIdx + 1} ${accion.nombre.trim()}`,
      cantidad: accion.cantidad ?? 0,
    })),

    resultado: {
      descripcion: `${compIndex}.1.1 ${nuevoComponente.value.resultado.trim()}`,
    },
  }

  if (modoEdicion.value) {
    form.value.componentes[indiceEditando.value] = componenteFinal
  } else {
    form.value.componentes.push(componenteFinal)
  }

  nuevoComponente.value = {
    nombre: '',
    acciones: [{ nombre: '', cantidad: 0 }],
    resultado: '',
  }

  modoEdicion.value = false
  indiceEditando.value = null

  if (!continuar) {
    showModal.value = false
  }
}

async function submitForm() {
  loading.value = true

  try {
    await api.put(`/DisenoIntervencionPublica/${registroId.value}`, {
      id: registroId.value,
      ...form.value,
      componentes: form.value.componentes.map((c) => ({
        ...c,
        resultado: typeof c.resultado === 'string' ? { descripcion: c.resultado } : c.resultado,
      })),
    })

    Notify.create({
      type: 'positive',
      message: 'Diseño de la Intervención Pública guardado correctamente',
    })

    router.push('/formulario-reglas-operacion-detalle')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message:
        error.response?.data?.message || 'Error al guardar Diseño de la Intervención Pública',
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
  margin-bottom: 12px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modern-input {
  transition: all 0.2s ease;
}

.modern-input:hover {
  transform: translateY(-1px);
}

.component-btn {
  background: #691b31;
  color: white;
  border-radius: 14px;
  padding: 12px 22px;
  font-weight: 700;
  font-size: 0.95rem;
}

.component-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 18px;
  transition: all 0.2s ease;
}

.component-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.component-title {
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.activity-item {
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  margin-top: 10px;
  border-left: 4px solid #c5a46d;
  color: #374151;
}

.effect-box {
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fef7ed;
  color: #9a3412;
  font-style: italic;
  font-weight: 500;
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

.modern-dialog {
  border-radius: 24px;
  overflow: hidden;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #691b31;
}

.dialog-section {
  padding-top: 20px;
}

.activity-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px;
}

.activity-title {
  font-weight: 700;
  color: #374151;
}

.add-btn {
  border-radius: 12px;
  font-weight: 700;
}

.autosave-chip {
  background: #ecfdf3;
  color: #027a48;
  font-weight: 600;
  border-radius: 10px;
}

.success-banner {
  background: #ecfdf3;
  color: #027a48;
  border-radius: 14px;
}

.warning-banner {
  background: #fffbeb;
  color: #b54708;
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
  .secondary-btn,
  .component-btn {
    width: 100%;
  }

  .content-wrapper {
    padding: 16px;
  }
}
</style>
