<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Programa Social</h1>
          <p class="page-subtitle">
            Define las características del programa y su clasificación operativa.
          </p>
        </div>
      </div>

      <q-stepper flat bordered color="primary" animated class="modern-stepper">
        <q-step :name="1" title="Intervención" icon="widgets" done />
        <q-step :name="2" title="Programa Social" icon="groups" active />
        <q-step :name="3" title="Continuar" icon="arrow_forward" />
      </q-stepper>

      <FormularioReglasOperacionDetalleSection1 />
    </div>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useFormularioReglasOperacionDetalle } from 'src/composables/pages/useFormularioReglasOperacionDetalle'
import FormularioReglasOperacionDetalleSection1 from 'src/components/sections/FormularioReglasOperacionDetalle/FormularioReglasOperacionDetalleSection1.vue'
const state = useFormularioReglasOperacionDetalle()
provide('FormularioReglasOperacionDetalle', state)
</script>

<style scoped src="src/css/pages/FormularioReglasOperacionDetalle.css" />
