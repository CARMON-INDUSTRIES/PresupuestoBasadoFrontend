<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <!-- Título -->
        <q-card-section>
          <div class="form-title">3. Determinación y Justificación de los Objetivos</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <!-- Campos del formulario -->
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

        <!-- Botón -->
        <q-card-actions align="right">
          <q-btn
            color="primary"
            text-color="white"
            label="Guardar y continuar"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)

const form = ref({
  objetivosEspecificos: '',
  relacionOtrosProgramas: '',
})

async function submitForm() {
  loading.value = true
  try {
    await api.post('/DeterminacionJustificacionObjetivos', form.value)
    localStorage.setItem('ultimaRutaRegistro', '/formulario-cobertura')
    router.push('/formulario-cobertura')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Error al guardar Determinación y Justificación de Objetivos',
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

/* Título más grande y destacado */
.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #691b31;
}

/* Mayor redondez de bordes en todos los campos */
.q-field__control {
  border-radius: 12px;
}

/* Botón con tus valores y texto blanco */
.submit-btn {
  font-weight: 900;
  font-size: 0.8rem;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
