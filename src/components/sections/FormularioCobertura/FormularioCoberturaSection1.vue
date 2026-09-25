<template>
  <div class="stats-section">
    <div class="section-mini-title">4.3 Cuantificación de las poblaciones</div>

    <div class="stats-grid">
      <q-input
        outlined
        bg-color="white"
        v-model.number="form.cuantificacionPoblacionPotencial"
        type="number"
        min="0"
        class="modern-input"
        label="Población potencial"
      >
        <template v-slot:prepend>
          <q-icon name="groups" color="primary" />
        </template>
      </q-input>

      <q-input
        outlined
        bg-color="white"
        v-model.number="form.cuantificacionPoblacionObjetivo"
        type="number"
        min="0"
        class="modern-input"
        label="Población objetivo"
      >
        <template v-slot:prepend>
          <q-icon name="person" color="primary" />
        </template>
      </q-input>

      <q-input
        outlined
        bg-color="white"
        v-model.number="form.cuantificacionPoblacionAtendidaAnterior"
        type="number"
        min="0"
        class="modern-input"
        label="Población atendida anteriormente"
      >
        <template v-slot:prepend>
          <q-icon name="history" color="primary" />
        </template>
      </q-input>
    </div>
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
