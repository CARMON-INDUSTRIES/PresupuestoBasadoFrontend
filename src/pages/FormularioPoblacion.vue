<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">3. Caracterización de la Población Objetivo</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            filled
            v-model="form.grupoPoblacional"
            label="Grupo poblacional objetivo"
            type="textarea"
          />
          <q-input
            filled
            v-model="form.ambitoGeografico"
            label="Ámbito geográfico de atención"
            type="textarea"
          />
          <q-input
            filled
            v-model="form.criteriosSeleccion"
            label="Criterios de selección"
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
  grupoPoblacional: '',
  ambitoGeografico: '',
  criteriosSeleccion: '',
})

async function submitForm() {
  loading.value = true
  try {
    await api.post('/PoblacionObjetivo', form.value)
    router.push('/formulario-entorno') // Ruta siguiente
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar el formulario',
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
