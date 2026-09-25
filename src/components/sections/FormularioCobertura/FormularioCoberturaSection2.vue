<template>
  <div class="question-block">
    <div class="question-title">4.1 Identificación y caracterización de la población potencial</div>

    <div class="question-helper">
      Describe la población o área de enfoque que presenta la necesidad o problemática que el
      programa atenderá.
    </div>

    <q-input
      outlined
      bg-color="white"
      v-model="form.identificacionCaracterizacionPoblacionPotencial"
      type="textarea"
      autogrow
      class="modern-input"
      placeholder="Describe la población potencial..."
    >
      <template v-slot:prepend>
        <q-icon name="people" color="primary" />
      </template>
    </q-input>
  </div>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioCobertura')
  },
}
</script>
<style scoped src="src/css/pages/FormularioCobertura.css" />
