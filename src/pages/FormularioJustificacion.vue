<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">Justificación del Programa Presupuestario</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            filled
            v-model="form.relevanciaSocial"
            label="Relevancia social"
            type="textarea"
          />
          <q-input
            filled
            v-model="form.alineacionPlaneacion"
            label="Alineación con la planeación nacional y estatal"
            type="textarea"
          />
          <q-input
            filled
            v-model="form.contribucionSolucion"
            label="Contribución a la solución del problema"
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
import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'
const router = useRouter()
const loading = ref(false)
const form = ref({ relevanciaSocial: '', alineacionPlaneacion: '', contribucionSolucion: '' })
const { guardarDatos } = useFormularioPersistente({
  form,
  storageKey: 'FormularioJustificacion',
  load: async () => (await api.get('/JustificacionPrograma/ultimo')).data,
  save: async (data) => (await api.post('/JustificacionPrograma', data)).data,
})
async function submitForm() {
  if (loading.value) return
  loading.value = true
  try {
    await guardarDatos()
    Notify.create({ type: 'positive', message: 'Datos guardados correctamente' })
    await router.push('/formulario-poblacion')
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
