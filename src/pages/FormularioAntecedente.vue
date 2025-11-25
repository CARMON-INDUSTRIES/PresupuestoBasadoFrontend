<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="form-title">Antecedentes</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            filled
            v-model="form.descripcionPrograma"
            label="1.1 Identifique y describa el entorno en el que operará el programa, considerando la situación, problema o necesidad de llevar a cabo una intervención pública."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.contextoHistoricoNormativo"
            label="1.2 Incorpore información estadística y cualitativa, que permita dimensionar y describir de manera general las acciones que se hayan realizado."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="bar_chart" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.problematicaOrigen"
            label="1.3 Identifique los actores que están involucrados con la atención a dicho problema o necesidad."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="group" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.experienciasPrevias"
            label="1.4 Describa la evolución del programa señalando los resultados obtenidos."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="history" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)

const STORAGE_KEY = 'antecedentesForm_v1'

const form = ref({
  descripcionPrograma: '',
  contextoHistoricoNormativo: '',
  problematicaOrigen: '',
  experienciasPrevias: '',
})

function restaurarFormulario() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const data = JSON.parse(raw)
    Object.assign(form.value, data)
  } catch (err) {
    console.warn('No se pudo restaurar el formulario:', err)
  }
}

watch(
  form,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true },
)

async function submitForm() {
  loading.value = true
  try {
    await api.post('/Antecedente', form.value)

    Notify.create({
      type: 'positive',
      message: 'Antecedentes guardados correctamente',
    }) / localStorage.setItem('ultimaRutaRegistro', '/formulario-identificacion-problema')

    router.push('/formulario-identificacion-problema')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar antecedentes',
    })
  } finally {
    loading.value = false
  }
}

onMounted(restaurarFormulario)
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
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
