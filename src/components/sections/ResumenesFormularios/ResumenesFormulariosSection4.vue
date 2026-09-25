<template>
  <q-expansion-item
    icon="account_tree"
    label="Árbol de Problemas y Objetivos"
    expand-separator
    class="expansion-card q-mb-sm"
  >
    <q-card flat class="formato-card">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">
          Anexos 4 y 5: Árbol de Problemas y Objetivos
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          rounded
          unelevated
          icon="download"
          label="Descargar PDF"
          @click="descargarArboles"
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
