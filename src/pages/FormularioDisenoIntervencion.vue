<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-sm">
      <q-card flat bordered class="q-pa-md" style="max-width: 1000px; margin: auto">
        <q-card-section>
          <div class="form-title">Diseño de la Intervención Pública</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-btn color="secondary" label="Agregar Componente" @click="showModal = true" rounded />

          <div v-if="form.componentes.length" class="q-mt-md">
            <div
              v-for="(comp, cIdx) in form.componentes"
              :key="cIdx"
              class="q-pa-sm bg-grey-2 q-mb-sm rounded-borders"
            >
              <div class="text-subtitle2"><q-icon name="widgets" /> {{ comp.nombre }}</div>

              <div
                v-for="(accion, aIdx) in comp.acciones"
                :key="aIdx"
                class="q-ml-md row items-center"
              >
                <strong class="col"> <q-icon name="task_alt" /> {{ accion.descripcion }} </strong>
              </div>

              <div class="q-ml-md q-mt-sm">
                <em>
                  <q-icon name="flare" />
                  {{
                    typeof comp.resultado === 'string' ? comp.resultado : comp.resultado.descripcion
                  }}
                </em>
              </div>
            </div>
          </div>

          <q-input
            filled
            v-model="form.etapasIntervencion"
            label="5.2 Establecimiento de los cursos de acción..."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="directions_run" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.escenariosFuturosEsperar"
            label="5.3 Definir escenarios futuros a esperar..."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="visibility" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            text-color="white"
            label="Continuar"
            type="submit"
            rounded
            unelevated
            class="submit-btn"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-form>

    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section>
          <div class="form-title">Nuevo Componente</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            v-model="nuevoComponente.nombre"
            filled
            rounded
            :label="`Componente ${proximoIndiceComp}`"
            placeholder="Ej. Infraestructura básica"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="widgets" />
            </template>
          </q-input>

          <div
            v-for="(accion, aIdx) in nuevoComponente.acciones"
            :key="'accion-' + aIdx"
            class="q-mb-md"
          >
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle2">
                <q-icon name="task_alt" /> Actividad {{ proximoIndiceComp }}.{{ aIdx + 1 }}
              </div>
              <q-btn
                v-if="nuevoComponente.acciones.length > 1"
                dense
                flat
                round
                icon="delete"
                color="negative"
                @click="nuevoComponente.acciones.splice(aIdx, 1)"
              />
            </div>

            <div class="row q-col-gutter-md">
              <q-input
                class="col-8"
                v-model="accion.nombre"
                filled
                rounded
                dense
                placeholder="Nombre de la actividad"
              />
              <q-input
                class="col-4"
                v-model.number="accion.cantidad"
                type="number"
                filled
                rounded
                dense
                placeholder="Cantidad"
              />
            </div>
            <q-separator class="q-my-sm" />
          </div>

          <q-btn
            flat
            icon="add"
            label="Agregar actividad"
            @click="nuevoComponente.acciones.push({ nombre: '', cantidad: 0 })"
          />

          <div class="q-mt-md">
            <div class="text-caption q-mb-xs">Efecto</div>
            <q-input
              v-model="nuevoComponente.resultado"
              filled
              rounded
              dense
              :label="`${proximoIndiceComp}.1.1`"
              placeholder="Efecto del componente"
            />
          </div>

          <q-btn
            flat
            icon="add_circle"
            color="secondary"
            label="Crear otro componente"
            class="q-mt-md"
            @click="guardarComponente(true)"
          />
        </q-card-section>

        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Guardar Componente" color="primary" @click="guardarComponente()" />
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

// ID del registro (backend)
const registroId = ref(null)

// =====================
//        FORM
// =====================
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

// =====================
//     BORRADOR
// =====================
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

// =====================
//     AUTOSAVE
// =====================
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

// =====================
//  COMPONENTES
// =====================
function guardarComponente(continuar = false) {
  if (!nuevoComponente.value.nombre?.trim()) {
    Notify.create({ type: 'warning', message: 'El componente debe tener un nombre' })
    return
  }

  const compIndex = proximoIndiceComp.value

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

  form.value.componentes.push(componenteFinal)

  nuevoComponente.value = {
    nombre: '',
    acciones: [{ nombre: '', cantidad: 0 }],
    resultado: '',
  }

  if (!continuar) showModal.value = false
}

// =====================
//   GUARDADO FINAL
// =====================
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
.q-card {
  max-width: 1000px;
  margin: auto;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #691b31;
}

.q-field__control {
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  font-weight: 900;
  font-size: 0.8rem;
  padding: 12px 40px;
}
</style>
