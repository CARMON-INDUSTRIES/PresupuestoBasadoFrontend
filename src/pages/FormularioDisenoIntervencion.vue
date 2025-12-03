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
              <div class="row items-center justify-between">
                <div class="text-subtitle2"><q-icon name="widgets" /> {{ comp.nombre }}</div>

                <!-- 🔥 Botón editar -->
                <q-btn
                  dense
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="editarComponente(cIdx)"
                />
              </div>

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

    <!-- MODAL NUEVO COMPONENTE -->
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
            @click="
              nuevoComponente.acciones.push({
                nombre: '',
                cantidad: 0,
              })
            "
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

    <!-- 🔥 MODAL EDITAR COMPONENTE -->
    <q-dialog v-model="showEditModal" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section>
          <div class="form-title">Editar Componente</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input
            v-model="componenteEdit.nombre"
            filled
            rounded
            label="Nombre del componente"
            class="q-mb-md"
          />

          <div
            v-for="(accion, aIdx) in componenteEdit.acciones"
            :key="'edit-accion-' + aIdx"
            class="q-mb-md"
          >
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle2">Actividad {{ aIdx + 1 }}</div>

              <q-btn
                v-if="componenteEdit.acciones.length > 1"
                dense
                flat
                round
                icon="delete"
                color="negative"
                @click="componenteEdit.acciones.splice(aIdx, 1)"
              />
            </div>

            <div class="row q-col-gutter-md">
              <q-input
                class="col-8"
                v-model="accion.descripcion"
                filled
                rounded
                dense
                placeholder="Descripción"
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
            @click="componenteEdit.acciones.push({ descripcion: '', cantidad: 0 })"
          />

          <div class="q-mt-md">
            <div class="text-caption q-mb-xs">Efecto</div>
            <q-input v-model="componenteEdit.resultado.descripcion" filled rounded dense />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat color="negative" label="Cancelar" v-close-popup />
          <q-btn flat color="primary" label="Guardar cambios" @click="guardarEdicionComponente" />
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

const BASE_STORAGE_KEY = 'disenoIntervencionPublica'
const ROUTE_AFTER_SAVE = '/formulario-reglas-operacion-detalle'

const router = useRouter()
const loading = ref(false)
const showModal = ref(false)

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

// ------------------------------
//     EDICIÓN DE COMPONENTES
// ------------------------------

const showEditModal = ref(false)
const componenteEdit = ref({})
const editIndex = ref(-1)

function editarComponente(index) {
  editIndex.value = index
  componenteEdit.value = JSON.parse(JSON.stringify(form.value.componentes[index]))
  showEditModal.value = true
}

function guardarEdicionComponente() {
  if (!componenteEdit.value.nombre.trim()) {
    Notify.create({ type: 'warning', message: 'El componente debe tener un nombre' })
    return
  }

  // Actualizar en el array principal
  form.value.componentes[editIndex.value] = JSON.parse(JSON.stringify(componenteEdit.value))

  // Guardar en localStorage
  localStorage.setItem(storageKey, JSON.stringify(form.value))

  Notify.create({ type: 'positive', message: 'Componente actualizado' })
  showEditModal.value = false
}

// ------------------------------
//     Multiusuario
// ------------------------------

let userName = null
let storageKey = BASE_STORAGE_KEY

async function resolveUserName() {
  let user = localStorage.getItem('userNameActual')
  if (user) return user

  try {
    const { data } = await api.get('/Cuentas/me')
    user = data?.userName || data?.username || null
    if (user) localStorage.setItem('userNameActual', user)
    return user
  } catch {
    return null
  }
}

onMounted(async () => {
  userName = await resolveUserName()
  storageKey = userName ? `${BASE_STORAGE_KEY}_${userName}` : BASE_STORAGE_KEY

  const saved = localStorage.getItem(storageKey)
  if (saved) {
    try {
      form.value = JSON.parse(saved)
      console.log('✔ Datos cargados desde:', storageKey)
    } catch {
      console.warn('No se pudo parsear localStorage')
    }
  }
})

// Guardado automático
watch(form, (val) => localStorage.setItem(storageKey, JSON.stringify(val)), { deep: true })

// ------------------------------------------
//               GUARDADO API
// ------------------------------------------

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

    const res = await api.post('/DisenoIntervencionPublica', payload)

    if (userName) {
      localStorage.setItem(`ultimaRutaRegistro_${userName}`, ROUTE_AFTER_SAVE)
    } else {
      localStorage.setItem('ultimaRutaRegistro', ROUTE_AFTER_SAVE)
    }

    Notify.create({
      type: 'positive',
      message: res.data?.message || 'Diseño de intervención guardado correctamente',
    })

    router.push(ROUTE_AFTER_SAVE)
  } catch (error) {
    let mensaje = 'Error al guardar Diseño de la Intervención Pública'

    if (error?.response) {
      const status = error.response.status
      if (status === 400) mensaje = 'Datos inválidos'
      else if (status === 401) mensaje = 'Sesión expirada, inicia sesión nuevamente'
      else if (status === 403) mensaje = 'No tienes permisos'
      else if (status === 500) mensaje = 'Error interno del servidor'
      else mensaje = error.response.data?.message || mensaje
    }

    Notify.create({ type: 'negative', message: mensaje })
  } finally {
    loading.value = false
  }
}
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
