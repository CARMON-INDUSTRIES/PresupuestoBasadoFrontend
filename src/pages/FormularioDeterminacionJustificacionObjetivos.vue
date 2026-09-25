<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Determinación y Justificación de los Objetivos</h1>

          <p class="page-subtitle">
            Define los objetivos específicos del programa y su relación con otros programas
            presupuestarios existentes.
          </p>
        </div>

        <!-- AUTOSAVE -->
        <div class="autosave-status">
          <q-chip color="green-1" text-color="green-9" icon="check_circle" class="autosave-chip">
            Autoguardado activo
          </q-chip>
        </div>
      </div>

      <!-- STEPPER -->
      <q-stepper flat bordered animated color="primary" class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" done />

        <q-step :name="2" title="Clasificación" icon="dashboard" done />

        <q-step :name="3" title="Antecedentes" icon="history_edu" done />

        <q-step :name="4" title="Problema" icon="warning" done />

        <q-step :name="5" title="Objetivos" icon="fact_check" active />

        <q-step :name="6" title="Cobertura" icon="groups" />
      </q-stepper>

      <!-- FORM -->
      <FormularioDeterminacionJustificacionObjetivosSection1 />
    </div>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useFormularioDeterminacionJustificacionObjetivos } from 'src/composables/pages/useFormularioDeterminacionJustificacionObjetivos'
import FormularioDeterminacionJustificacionObjetivosSection1 from 'src/components/sections/FormularioDeterminacionJustificacionObjetivos/FormularioDeterminacionJustificacionObjetivosSection1.vue'
const state = useFormularioDeterminacionJustificacionObjetivos()
provide('FormularioDeterminacionJustificacionObjetivos', state)
</script>

<style scoped src="src/css/pages/FormularioDeterminacionJustificacionObjetivos.css" />
