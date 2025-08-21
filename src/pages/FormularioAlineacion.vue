<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">Alineación</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-select
            filled
            v-model="form.tipo"
            :options="['Municipio', 'Estado']"
            label="Tipo de alineación"
          />

          <q-input filled v-model="form.acuerdo" label="Acuerdo" type="textarea" />
          <q-input filled v-model="form.objetivo" label="Objetivo" type="textarea" />
          <q-input filled v-model="form.estrategia" label="Estrategia" type="textarea" />
          <q-input filled v-model="form.lineaAccion" label="Línea de acción" type="textarea" />
          <q-select filled v-model="form.ramo" :options="ramos" label="Tipo de ramo" />
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

const ramos = ['Recurso Propio', 'Recurso Estatal', 'Recurso Federal']

const form = ref({
  tipo: '', // 'Municipio' o 'Estado'
  ramo: '',
  acuerdo: '',
  objetivo: '',
  estrategia: '',
  lineaAccion: '',
})

async function submitForm() {
  loading.value = true
  try {
    const endpoint = form.value.tipo === 'Estado' ? '/AlineacionEstado' : '/AlineacionMunicipio'

    await api.post(endpoint, {
      ramo: form.value.ramo,
      acuerdo: form.value.acuerdo,
      objetivo: form.value.objetivo,
      estrategia: form.value.estrategia,
      lineaAccion: form.value.lineaAccion,
    })

    localStorage.setItem('tipoAlineacion', form.value.tipo)
    router.push('/formulario-clasificacion') // redirige al siguiente formulario
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar la alineación',
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
