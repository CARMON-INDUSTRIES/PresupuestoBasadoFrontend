<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="form-title">3. Determinación y Justificación de los Objetivos</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            filled
            v-model="form.objetivosEspecificos"
            label="3.1 Especifique los objetivos específicos a los cuales se enfocará el programa propuesto. (Debe ser consistente con el árbol de objetivos)."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="flag" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.relacionOtrosProgramas"
            label="3.2 Relación y vinculación con otros programas presupuestarios.- Identifique si existen otros programas presupuestarios que contribuyan o dupliquen los objetivos planteados."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="link" />
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
  </q-page>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const BASE_STORAGE_KEY = 'formularioDeterminacionJustificacion'
const ROUTE_AFTER_SAVE = '/formulario-cobertura'

const router = useRouter()
const loading = ref(false)

const form = ref({
  objetivosEspecificos: '',
  relacionOtrosProgramas: '',
})

// Resolver userName del usuario actual
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

let userName = null
let storageKey = BASE_STORAGE_KEY

// Cargar datos según usuario
onMounted(async () => {
  userName = await resolveUserName()

  storageKey = userName ? `${BASE_STORAGE_KEY}_${userName}` : BASE_STORAGE_KEY

  const saved = localStorage.getItem(storageKey)
  if (saved) {
    try {
      form.value = JSON.parse(saved)
      console.log('✅ Datos cargados desde localStorage (key):', storageKey)
    } catch (err) {
      console.warn('No se pudo parsear localStorage:', err)
    }
  }
})

// Guardar automáticamente por usuario
watch(
  form,
  (newVal) => {
    localStorage.setItem(storageKey, JSON.stringify(newVal))
  },
  { deep: true },
)

// Validación mínima
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
    const res = await api.post('/DeterminacionJustificacionObjetivos', form.value)

    // Guardar última ruta por usuario
    if (!userName) userName = await resolveUserName()

    if (userName) {
      localStorage.setItem(`ultimaRutaRegistro_${userName}`, ROUTE_AFTER_SAVE)
    } else {
      localStorage.setItem('ultimaRutaRegistro', ROUTE_AFTER_SAVE)
    }

    Notify.create({
      type: 'positive',
      message: res.data?.message || 'Determinación y Justificación guardada correctamente',
    })

    router.push(ROUTE_AFTER_SAVE)
  } catch (error) {
    let mensaje = 'Error al guardar Determinación y Justificación de Objetivos'

    if (error?.response) {
      const status = error.response.status
      if (status === 400) mensaje = 'Datos inválidos. Revisa los campos.'
      else if (status === 401) mensaje = 'Sesión expirada. Inicia sesión nuevamente.'
      else if (status === 403) mensaje = 'No tienes permisos para realizar esta acción.'
      else if (status === 500) mensaje = 'Error interno del servidor.'
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
  max-width: 800px;
  margin: auto;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #691b31;
}

.q-field__control {
  border-radius: 12px;
}

.submit-btn {
  font-weight: 900;
  font-size: 0.8rem;
  padding: 12px 40px;
}
</style>
