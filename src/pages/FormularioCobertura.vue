<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <!-- Título -->
        <q-card-section>
          <div class="form-title">Cobertura</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <!-- Campos del formulario -->
        <q-card-section class="q-gutter-md">
          <!-- 4.1 -->
          <q-input
            filled
            v-model="form.identificacionCaracterizacionPoblacionPotencial"
            label="4.1 Identificación y caracterización de la población potencial.- Identifique y especifique la población o área de enfoque que presenta la necesidad y/o problema."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="people" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.identificacionCaracterizacionPoblacionObjetivo"
            label="4.2 Identificación y caracterización de la población objetivo.- Identifique y especifique la población o área de enfoque que el programa tiene planeado atender."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="people_outline" />
            </template>
          </q-input>

          <!-- Unidad de medida -->
          <q-input
            filled
            v-model="form.unidadMedida"
            label="Unidad de medida (ejemplo: hombres, mujeres, familias)"
            type="text"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="straighten" />
            </template>
          </q-input>

          <!-- 4.3 Cuantificación -->
          <div class="text-subtitle1 q-mt-md">4.3 Cuantificación de las poblaciones</div>

          <q-input
            filled
            v-model.number="form.cuantificacionPoblacionPotencial"
            label="4.3.1 Población potencial"
            type="number"
            min="0"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="people_alt" />
            </template>
          </q-input>

          <q-input
            filled
            v-model.number="form.cuantificacionPoblacionObjetivo"
            label="4.3.2 Población objetivo"
            type="number"
            min="0"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            filled
            v-model.number="form.cuantificacionPoblacionAtendidaAnterior"
            label="4.3.3 Población atendida en el ejercicio fiscal anterior"
            type="number"
            min="0"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="history" />
            </template>
          </q-input>

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
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="update" />
            </template>
          </q-select>

          <!-- 4.5 Procesos -->
          <q-input
            filled
            v-model="form.procesoIdentificacionPoblacionPotencial"
            label="Proceso de identificación de la población potencial"
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="settings" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.procesoIdentificacionPoblacionObjetivo"
            label="Proceso de identificación de la población objetivo"
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="settings_applications" />
            </template>
          </q-input>
        </q-card-section>

        <!-- Botón -->
        <q-card-actions align="right">
          <q-btn
            color="primary"
            text-color="white"
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
  frecuenciaActualizacion: '',
  procesoIdentificacionPoblacionPotencial: '',
  procesoIdentificacionPoblacionObjetivo: '',
})

async function submitForm() {
  loading.value = true
  try {
    await api.post('/Cobertura', form.value)
    localStorage.setItem('ultimaRutaRegistro', '/formulario-diseno-intervencion')
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

/* Título más grande y destacado */
.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #691b31;
}

/* Mayor redondez de bordes en todos los campos */
.q-field__control {
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Botón con tus valores y texto blanco */
.submit-btn {
  font-weight: 900;
  font-size: 0.8rem;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
