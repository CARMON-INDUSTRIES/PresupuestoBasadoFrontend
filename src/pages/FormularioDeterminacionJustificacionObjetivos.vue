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

const ROUTE_AFTER_SAVE = '/formulario-cobertura'

const router = useRouter()
const loading = ref(false)

const form = ref({
  objetivosEspecificos: '',
  relacionOtrosProgramas: '',
})

onMounted(async () => {
  try {
    const { data } = await api.get('/DeterminacionJustificacionObjetivos/borrador')
    form.value = data
    console.log('📥 Borrador cargado:', data)
  } catch (error) {
    console.warn('No se pudo cargar el borrador:', error)
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
        console.log('💾 Autosave ejecutado')
        await api.put('/DeterminacionJustificacionObjetivos/autosave', form.value)
      } catch (err) {
        console.warn('❌ Error en autosave:', err)
      }
    }, 1000)
  },
  { deep: true },
)

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
    Notify.create({
      type: 'positive',
      message: 'Datos guardados automáticamente.',
    })

    router.push(ROUTE_AFTER_SAVE)
  } catch (err) {
    Notify.create({
      type: 'negative',
      message: 'Error al continuar.',
      err,
    })
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
