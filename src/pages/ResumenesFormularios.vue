<template>
  <q-page padding class="resumen-page">
    <q-card flat class="resumen-card">
      <q-card-section class="header-section">
        <div class="text-h4 text-center text-weight-bold titulo-principal">Resúmenes Generales</div>

        <div class="text-subtitle2 text-center text-grey-7 q-mt-sm">
          Descarga todos los formatos y anexos generados por el sistema
        </div>
      </q-card-section>

      <q-separator />

      <ResumenesFormulariosSection6 />

      <q-separator class="q-my-lg" />

      <q-card-actions align="center" class="q-pb-xl">
        <q-btn
          color="deep-orange"
          size="lg"
          rounded
          unelevated
          icon="download_for_offline"
          label="Descargar TODOS los PDF"
          @click="descargarTodos"
          class="btn-descargar"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useResumenesFormularios } from 'src/composables/pages/useResumenesFormularios'
import ResumenesFormulariosSection6 from 'src/components/sections/ResumenesFormularios/ResumenesFormulariosSection6.vue'
const state = useResumenesFormularios()
provide('ResumenesFormularios', state)
const { descargarTodos } = state
</script>

<style scoped src="src/css/pages/ResumenesFormularios.css" />
