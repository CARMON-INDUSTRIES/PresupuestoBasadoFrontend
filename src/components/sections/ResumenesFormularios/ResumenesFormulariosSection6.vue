<template>
  <q-list class="q-pa-md">
    <ResumenesFormulariosSection2 />

    <ResumenesFormulariosSection3 />

    <q-expansion-item
      icon="crisis_alert"
      label="Formato Definición del Problema"
      expand-separator
      class="expansion-card q-mb-sm"
    >
      <q-card flat class="formato-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium">Anexo 2 Definición del Problema</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            rounded
            unelevated
            icon="download"
            label="Descargar PDF"
            @click="descargarPdf('FormatoDefinicionDelProblema')"
          />
        </q-card-actions>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      icon="groups"
      label="Formato Análisis de Involucrados"
      expand-separator
      class="expansion-card q-mb-sm"
    >
      <q-card flat class="formato-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium">Anexo 3 Análisis de Involucrados</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            rounded
            unelevated
            icon="download"
            label="Descargar PDF"
            @click="descargarPdf('FormatoAnalisisDeInvolucrados')"
          />
        </q-card-actions>
      </q-card>
    </q-expansion-item>

    <ResumenesFormulariosSection4 />

    <q-expansion-item
      icon="hub"
      label="Formato Análisis de Alternativas"
      expand-separator
      class="expansion-card q-mb-sm"
    >
      <q-card flat class="formato-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium">Anexo 6 Análisis de Alternativas</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            rounded
            unelevated
            icon="download"
            label="Descargar PDF"
            @click="descargarPdf('FormatoAnalisisInvolucrados')"
          />
        </q-card-actions>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      icon="schema"
      label="Formato Estructura Analítica"
      expand-separator
      class="expansion-card q-mb-sm"
    >
      <q-card flat class="formato-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium">Anexo 7 Estructura Analítica</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            rounded
            unelevated
            icon="download"
            label="Descargar PDF"
            @click="descargarPdf('FormatoEstructuraAnalitica')"
          />
        </q-card-actions>
      </q-card>
    </q-expansion-item>

    <ResumenesFormulariosSection5 />

    <ResumenesFormulariosSection1 />
  </q-list>
</template>
<script>
import { inject } from 'vue'
import ResumenesFormulariosSection2 from './ResumenesFormulariosSection2.vue'
import ResumenesFormulariosSection3 from './ResumenesFormulariosSection3.vue'
import ResumenesFormulariosSection4 from './ResumenesFormulariosSection4.vue'
import ResumenesFormulariosSection5 from './ResumenesFormulariosSection5.vue'
import ResumenesFormulariosSection1 from './ResumenesFormulariosSection1.vue'

export default {
  components: {
    ResumenesFormulariosSection2,
    ResumenesFormulariosSection3,
    ResumenesFormulariosSection4,
    ResumenesFormulariosSection5,
    ResumenesFormulariosSection1,
  },
  setup() {
    return inject('ResumenesFormularios')
  },
}
</script>
<style scoped src="src/css/pages/ResumenesFormularios.css" />
