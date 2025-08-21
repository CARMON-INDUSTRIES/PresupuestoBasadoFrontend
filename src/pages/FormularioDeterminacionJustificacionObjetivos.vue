<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">3. Determinación y Justificación de los Objetivos</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            filled
            v-model="form.objetivosEspecificos"
            label="3.1 Especifique los objetivos específicos a los cuales se enfocará el programa propuesto. (Debe ser consistente con el árbol
                   de objetivos)."
            type="textarea"
          />
          <q-input
            filled
            v-model="form.relacionOtrosProgramas"
            label="3.2 Relación y vinculación con otros programas presupuestarios.- Identifique si existen otros programas presupuestarios
                  que contribuyan o dupliquen los objetivos planteados."
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
  objetivosEspecificos: '',
  relacionOtrosProgramas: '',
})

async function submitForm() {
  loading.value = true
  try {
    await api.post('/DeterminacionJustificacionObjetivos', form.value)
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
</style>
