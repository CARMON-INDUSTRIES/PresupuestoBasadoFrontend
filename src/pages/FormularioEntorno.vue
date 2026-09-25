<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">Análisis del Entorno</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            filled
            v-model="form.factoresInternos"
            label="Factores internos"
            type="textarea"
          />
          <q-input
            filled
            v-model="form.factoresExternos"
            label="Factores externos"
            type="textarea"
          />
          <q-input
            filled
            v-model="form.riesgosOportunidades"
            label="Riesgos y oportunidades"
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" label="Finalizar" type="submit" :loading="loading" />
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
import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'
const router = useRouter()
const loading = ref(false)
const form = ref({ factoresInternos: '', factoresExternos: '', riesgosOportunidades: '' })
const { guardarDatos } = useFormularioPersistente({
  form,
  storageKey: 'FormularioEntorno',
  load: async () => (await api.get('/AnalisisEntorno/ultimo')).data,
  save: async (data) => (await api.post('/AnalisisEntorno', data)).data,
})
async function submitForm() {
  if (loading.value) return
  loading.value = true
  try {
    await guardarDatos()
    Notify.create({ type: 'positive', message: 'Datos guardados correctamente' })
    await router.push('/resumen-final')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'No se pudo guardar. Tu borrador se conserva.',
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
