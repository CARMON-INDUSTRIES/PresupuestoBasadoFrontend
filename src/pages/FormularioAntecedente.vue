<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">1. Antecedentes</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            filled
            v-model="form.descripcionPrograma"
            label="1.1 Identifique y describa el entorno en el que operará el programa, considerando la situación, problema o necesidad de
                  llevar a cabo una intervención pública."
            type="textarea"
          />
          <q-input
            filled
            v-model="form.contextoHistoricoNormativo"
            label="1.2 Incorpore información estadística y cualitativa, que permita dimensionar y describir de manera general las acciones
                  que se hayan realizado."
            type="textarea"
          />
          <q-input
            filled
            v-model="form.problematicaOrigen"
            label="1.3 Identifique los actores que están involucrados con la atención a dicho problema o necesidad."
            type="textarea"
          />
          <q-input
            filled
            v-model="form.experienciasPrevias"
            label="1.4 Describa la evolución del programa señalando los resultados obtenidos."
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" label="Guardar y continuar" type="submit" :loading="loading" />
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
  descripcionPrograma: '',
  contextoHistoricoNormativo: '',
  problematicaOrigen: '',
  experienciasPrevias: '',
})

async function submitForm() {
  loading.value = true
  try {
    await api.post('/Antecedente', form.value)
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
</script>

<style scoped>
.q-card {
  max-width: 800px;
  margin: auto;
}
</style>
