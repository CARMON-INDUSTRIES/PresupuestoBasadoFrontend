<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">Ramo</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input filled v-model="form.recursoPropio" label="Recurso propio" type="textarea" />
          <q-input filled v-model="form.recursoEstatal" label="Recurso estatal" type="textarea" />
          <q-input filled v-model="form.recursoFederal" label="Recurso federal" type="textarea" />
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
  recursoPropio: '',
  recursoEstatal: '',
  recursoFederal: '',
})

async function submitForm() {
  loading.value = true
  try {
    await api.post('/Ramo', form.value)
    Notify.create({
      type: 'positive',
      message: 'Ramo guardado correctamente',
    })
    localStorage.setItem('ultimaRutaRegistro', '/formulario-clasificacion')
    router.push('/formulario-clasificacion')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar el ramo',
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
