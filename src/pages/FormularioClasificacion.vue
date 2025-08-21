<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">Clasificación Funcional</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input filled v-model="form.finalidad" label="Finalidad" type="text" />
          <q-input filled v-model="form.funcion" label="Función" type="text" />
          <q-input filled v-model="form.subfuncion" label="Subfunción" type="text" />

          <q-select filled v-model="form.anioOperando" :options="anios" label="Año Operando" />

          <q-select
            filled
            v-model="form.entregaBienes"
            :options="opcionesEntregaBienes"
            label="Entrega de Bienes o Servicios"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" label="Guardar y finalizar" type="submit" :loading="loading" />
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

const anioActual = new Date().getFullYear()
const anios = [anioActual - 1, anioActual, anioActual + 1]

const opcionesEntregaBienes = [
  'Población General',
  'Administración Pública',
  'Población General y Administración Pública',
]

const form = ref({
  finalidad: '',
  funcion: '',
  subfuncion: '',
  anioOperando: anioActual,
  entregaBienes: '',
})

async function submitForm() {
  loading.value = true
  try {
    await api.post('/ClasificacionFuncional', form.value)
    router.push('/resumen-final')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar la clasificación',
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
