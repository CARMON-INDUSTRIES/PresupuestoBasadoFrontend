<template>
  <q-card-section class="form-column">
    <FormularioCoberturaSection2 />

    <div class="question-block">
      <div class="question-title">
        4.2 Identificación y caracterización de la población objetivo
      </div>

      <div class="question-helper">
        Especifica la población que el programa planea atender directamente.
      </div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.identificacionCaracterizacionPoblacionObjetivo"
        type="textarea"
        autogrow
        class="modern-input"
        placeholder="Describe la población objetivo..."
      >
        <template v-slot:prepend>
          <q-icon name="people_outline" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="question-block">
      <div class="question-title">Unidad de medida</div>

      <div class="question-helper">
        Ejemplo: personas, mujeres, familias, productores, estudiantes, etc.
      </div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.unidadMedida"
        class="modern-input"
        placeholder="Ingrese la unidad de medida..."
      >
        <template v-slot:prepend>
          <q-icon name="straighten" color="primary" />
        </template>
      </q-input>
    </div>

    <FormularioCoberturaSection1 />

    <div class="question-block">
      <div class="question-title">4.4 Frecuencia de actualización de la población</div>

      <div class="question-helper">
        Selecciona la periodicidad con la que se actualizará la información.
      </div>

      <q-select
        outlined
        bg-color="white"
        v-model="form.frecuenciaActualizacion"
        :options="frecuencias"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        label="Seleccione la frecuencia"
        class="modern-input"
      >
        <template v-slot:prepend>
          <q-icon name="update" color="primary" />
        </template>
      </q-select>
    </div>

    <div class="question-block">
      <div class="question-title">Proceso de identificación de la población potencial</div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.procesoIdentificacionPoblacionPotencial"
        type="textarea"
        autogrow
        class="modern-input"
        placeholder="Describe el proceso..."
      >
        <template v-slot:prepend>
          <q-icon name="settings" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="question-block">
      <div class="question-title">Proceso de identificación de la población objetivo</div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.procesoIdentificacionPoblacionObjetivo"
        type="textarea"
        autogrow
        class="modern-input"
        placeholder="Describe el proceso..."
      >
        <template v-slot:prepend>
          <q-icon name="settings_applications" color="primary" />
        </template>
      </q-input>
    </div>
  </q-card-section>
</template>
<script>
import { inject } from 'vue'
import FormularioCoberturaSection2 from './FormularioCoberturaSection2.vue'
import FormularioCoberturaSection1 from './FormularioCoberturaSection1.vue'

export default {
  components: { FormularioCoberturaSection2, FormularioCoberturaSection1 },
  setup() {
    return inject('FormularioCobertura')
  },
}
</script>
<style scoped src="src/css/pages/FormularioCobertura.css" />
