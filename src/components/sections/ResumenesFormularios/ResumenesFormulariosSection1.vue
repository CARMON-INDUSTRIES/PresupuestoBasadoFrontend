<template>
  <q-expansion-item
    icon="monitoring"
    label="Ficha Técnica del Indicador"
    expand-separator
    class="expansion-card"
  >
    <q-card flat class="formato-card">
      <q-card-section>
        <div class="text-subtitle1 text-weight-medium">Ficha Técnica del Indicador</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          icon="download"
          rounded
          unelevated
          label="Descargar PDF"
          class="q-mb-sm"
          @click="descargarTodasLasFichas"
        />

        <q-btn
          v-for="(ficha, index) in fichas"
          :key="ficha.id"
          color="primary"
          outline
          icon="picture_as_pdf"
          :label="`Ficha ${index + 1}`"
          class="q-mb-xs"
          @click="descargarFicha(ficha.id)"
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
