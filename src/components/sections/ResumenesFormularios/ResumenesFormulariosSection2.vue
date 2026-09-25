<template>
  <q-expansion-item
    icon="flag"
    label="Formato Alineación de la Matriz de Indicadores"
    expand-separator
    class="expansion-card q-mb-sm"
  >
    <q-card flat class="formato-card">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">
          Formato 1 Alineación de la Matriz de Indicadores Para Resultados al Plan Municipal de
          Desarrollo
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          rounded
          unelevated
          icon="download"
          label="Descargar PDF"
          @click="descargarPdf('FormatoAlineacion')"
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
