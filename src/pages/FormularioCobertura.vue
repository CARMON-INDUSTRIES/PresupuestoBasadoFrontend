<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">4. Cobertura</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <!-- 4.1 -->
          <q-input
            filled
            v-model="form.identificacionCaracterizacionPoblacionPotencial"
            label="4.1 Identificación y caracterización de la población potencial.- Identifique y especifique la población o área de enfoque
que presenta la necesidad y/o problema (Debe incluir sus características particulares, socioeconómicas y/o demográficas)."
            type="textarea"
          />
          <q-input
            filled
            v-model="form.identificacionCaracterizacionPoblacionObjetivo"
            label="4.2 Identificación y caracterización de la población objetivo.- Identifique y especifique la población o área de enfoque
que el programa tiene planeado o programado atender durante el ejercicio fiscal. Debe incluir sus características
particulares, socioeconómicas y/o demográficas."
            type="textarea"
          />

          <!-- Unidad de medida -->
          <q-input
            filled
            v-model="form.unidadMedida"
            label="Unidad de medida (ejemplo: hombres, mujeres, familias)"
            type="text"
          />

          <!-- 4.3 Título -->
          <div class="text-subtitle1 q-mt-md">4.3 Cuantificación de las poblaciones</div>

          <!-- Solo números -->
          <q-input
            filled
            v-model.number="form.cuantificacionPoblacionPotencial"
            label="4.3.1 Población potencial"
            type="number"
            min="0"
          />
          <q-input
            filled
            v-model.number="form.cuantificacionPoblacionObjetivo"
            label="4.3.2 Población objetivo"
            type="number"
            min="0"
          />
          <q-input
            filled
            v-model.number="form.cuantificacionPoblacionAtendidaAnterior"
            label="4.3.3 Población atendida en el ejercicio fiscal anterior"
            type="number"
            min="0"
          />

          <!-- 4.4 Frecuencia de actualización -->
          <div class="text-subtitle1 q-mt-md">4.4 Frecuencia de actualización de la población</div>
          <q-select
            filled
            v-model="form.frecuenciaActualizacion"
            :options="frecuencias"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            label="Seleccione la frecuencia"
          />

          <!-- 4.5 -->
          <q-input
            filled
            v-model="form.procesoIdentificacionPoblacionPotencial"
            label="Proceso de identificación de la población potencial"
            type="textarea"
          />
          <q-input
            filled
            v-model="form.procesoIdentificacionPoblacionObjetivo"
            label="Proceso de identificación de la población objetivo"
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

const frecuencias = [
  { label: 'Mensual', value: 'Mensual' },
  { label: 'Trimestral', value: 'Trimestral' },
  { label: 'Semestral', value: 'Semestral' },
  { label: 'Anual', value: 'Anual' },
]

const form = ref({
  identificacionCaracterizacionPoblacionPotencial: '',
  identificacionCaracterizacionPoblacionObjetivo: '',
  cuantificacionPoblacionPotencial: null,
  cuantificacionPoblacionObjetivo: null,
  cuantificacionPoblacionAtendidaAnterior: null,
  unidadMedida: '',
  frecuenciaActualizacion: '', // string plano
  procesoIdentificacionPoblacionPotencial: '',
  procesoIdentificacionPoblacionObjetivo: '',
})

async function submitForm() {
  loading.value = true
  try {
    await api.post('/Cobertura', form.value)
    router.push('/formulario-diseno-intervencion')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar Cobertura',
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
