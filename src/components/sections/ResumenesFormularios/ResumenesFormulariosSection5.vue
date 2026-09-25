<template>
  <q-expansion-item
    icon="table_chart"
    label="Matriz de Indicadores"
    expand-separator
    class="expansion-card q-mb-sm"
  >
    <q-card flat class="formato-card">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">Matriz de Indicadores para Resultados</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          rounded
          unelevated
          icon="download"
          label="Descargar PDF"
          @click="descargarPdf('FormatoMatriz')"
        />
      </q-card-actions>
    </q-card>
  </q-expansion-item>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('ResumenesFormularios')
  },
}
</script>
<style scoped src="src/css/pages/ResumenesFormularios.css" />
