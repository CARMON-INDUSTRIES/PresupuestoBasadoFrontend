<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-sm">
      <q-card flat bordered class="q-pa-md" style="max-width: 1000px; margin: auto">
        <!-- Título -->
        <q-card-section>
          <div class="form-title">Diseño de la Intervención Pública</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <!-- Botón para abrir modal -->
        <q-card-section class="q-gutter-md">
          <q-btn color="secondary" label="Agregar Componente" @click="showModal = true" rounded />

          <!-- Lista de componentes -->
          <div v-if="form.componentes.length" class="q-mt-md">
            <div
              v-for="(comp, cIdx) in form.componentes"
              :key="cIdx"
              class="q-pa-sm bg-grey-2 q-mb-sm rounded-borders"
            >
              <div class="text-subtitle2"><q-icon name="widgets" /> {{ comp.nombre }}</div>

              <!-- Acciones: solo mostrar nombre -->
              <div
                v-for="(accion, aIdx) in comp.acciones"
                :key="aIdx"
                class="q-ml-md row items-center"
              >
                <strong class="col"> <q-icon name="task_alt" /> {{ accion.descripcion }} </strong>
              </div>

              <!-- Resultado: convertir a string si es objeto -->
              <div class="q-ml-md q-mt-sm">
                <em
                  ><q-icon name="flare" />
                  {{
                    typeof comp.resultado === 'string' ? comp.resultado : comp.resultado.descripcion
                  }}</em
                >
              </div>
            </div>
          </div>

          <!-- Textareas principales -->
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

        <!-- Botón guardar -->
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

    <!-- Modal de componentes -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section>
          <div class="form-title">Nuevo Componente</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <!-- Nombre del componente -->
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

          <!-- Acciones -->
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
              <!-- Nombre de la actividad -->
              <q-input
                class="col-8"
                v-model="accion.nombre"
                filled
                rounded
                dense
                placeholder="Nombre de la actividad"
              />

              <!-- Cantidad -->
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

          <!-- Resultado único del componente -->
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

          <!-- Botón nuevo componente -->
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)
const showModal = ref(false)

// Formulario principal
const form = ref({
  componentes: [],
  etapasIntervencion: '',
  escenariosFuturosEsperar: '',
})

// Nuevo componente en modal
const nuevoComponente = ref({
  nombre: '',
  acciones: [{ nombre: '', cantidad: 0 }],
  resultado: '',
})

// Índice del próximo componente
const proximoIndiceComp = computed(() => form.value.componentes.length + 1)

/**
 * Agregar o actualizar un componente en el formulario
 */
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

  //  Se agrega al array de componentes existentes
  form.value.componentes.push(componenteFinal)

  // Resetear modal
  nuevoComponente.value = { nombre: '', acciones: [{ nombre: '', cantidad: 0 }], resultado: '' }

  if (!continuar) showModal.value = false
}

/**
 * Enviar formulario al backend
 */
async function submitForm() {
  loading.value = true
  try {
    const payload = {
      ...form.value,
      componentes: form.value.componentes.map((c) => ({
        ...c,
        resultado: typeof c.resultado === 'string' ? { descripcion: c.resultado } : c.resultado,
      })),
    }

    await api.post('/DisenoIntervencionPublica', payload)
    localStorage.setItem('ultimaRutaRegistro', '/formulario-reglas-operacion-detalle')
    router.push('/Formulario-reglas-operacion-detalle')
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

/**
 * Para pintar acciones en el árbol: solo nombres
 */
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
