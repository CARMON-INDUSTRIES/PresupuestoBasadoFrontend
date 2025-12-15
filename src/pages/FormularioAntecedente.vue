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
const autosaveLoading = ref(false)

const registroId = ref(null)

const form = ref({
  descripcionPrograma: '',
  contextoHistoricoNormativo: '',
  problematicaOrigen: '',
  experienciasPrevias: '',
})

async function cargarBorrador() {
  try {
    const { data } = await api.get('/Antecedente/borrador')

    registroId.value = data.id

    form.value.descripcionPrograma = data.descripcionPrograma
    form.value.contextoHistoricoNormativo = data.contextoHistoricoNormativo
    form.value.problematicaOrigen = data.problematicaOrigen
    form.value.experienciasPrevias = data.experienciasPrevias
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
    await api.put('/Antecedente/autosave', {
      id: registroId.value,
      ...form.value,
    })
  } catch (err) {
    console.warn('Autosave falló:', err)
  } finally {
    autosaveLoading.value = false
  }
}

async function submitForm() {
  loading.value = true
  try {
    await api.put(`/Antecedente/${registroId.value}`, {
      id: registroId.value,
      ...form.value,
    })

    Notify.create({
      type: 'positive',
      message: 'Antecedentes guardados correctamente',
    })

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

onMounted(cargarBorrador)
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
