<template>
  <q-card-section>
    <div class="section-title">Magnitud del Problema</div>

    <div class="form-grid q-mt-md">
      <q-input
        class="modern-input full-width"
        :model-value="resumen.cobertura?.unidadMedida || ''"
        label="Unidad de Medida"
        filled
        readonly
        rounded
      >
        <template v-slot:prepend>
          <q-icon name="straighten" color="primary" />
        </template>
      </q-input>

      <q-input
        class="modern-input"
        :model-value="String(resumen.cobertura?.cuantificacionPoblacionPotencial ?? '')"
        label="Población Potencial"
        filled
        readonly
        rounded
      >
        <template v-slot:prepend>
          <q-icon name="people_alt" color="primary" />
        </template>
      </q-input>

      <q-input
        class="modern-input"
        :model-value="String(resumen.cobertura?.cuantificacionPoblacionObjetivo ?? '')"
        label="Población Objetivo"
        filled
        readonly
        rounded
      >
        <template v-slot:prepend>
          <q-icon name="person" color="primary" />
        </template>
      </q-input>

      <q-input
        class="modern-input"
        :model-value="String(resumen.cobertura?.cuantificacionPoblacionAtendidaAnterior ?? '')"
        label="Población Atendida Ejercicio Fiscal Anterior"
        filled
        readonly
        rounded
      >
        <template v-slot:prepend>
          <q-icon name="history" color="primary" />
        </template>
      </q-input>
    </div>
  </q-card-section>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('PoblacionAreaEnfoquePotencial')
  },
}
</script>
<style scoped src="src/css/pages/PoblacionAreaEnfoquePotencial.css" />
