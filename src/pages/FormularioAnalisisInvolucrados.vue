<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Análisis de Involucrados</h1>
        <p class="page-subtitle">
          Consulta de actores relacionados con el problema central identificado.
        </p>
      </div>

      <q-card flat class="modern-card">
        <q-card-section>
          <div class="section-title">Problema Central</div>

          <q-input
            :model-value="resumen.problemaCentral || ''"
            type="textarea"
            filled
            autogrow
            readonly
            rounded
            class="modern-input q-mt-md"
          >
            <template v-slot:prepend>
              <q-icon name="report_problem" color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-separator spaced />

        <FormularioAnalisisInvolucradosSection1 />

        <q-card-actions align="right" class="q-pa-lg actions-container">
          <q-btn
            label="Pantalla Anterior"
            color="primary"
            text-color="white"
            rounded
            unelevated
            class="secondary-btn"
            to="/PoblacionAreaEnfoquePotencial"
            icon="arrow_back"
          />

          <q-btn
            color="primary"
            text-color="white"
            label="Continuar"
            rounded
            unelevated
            class="primary-btn"
            icon="arrow_forward"
            @click="irArbolProblemas"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useFormularioAnalisisInvolucrados } from 'src/composables/pages/useFormularioAnalisisInvolucrados'
import FormularioAnalisisInvolucradosSection1 from 'src/components/sections/FormularioAnalisisInvolucrados/FormularioAnalisisInvolucradosSection1.vue'
const state = useFormularioAnalisisInvolucrados()
provide('FormularioAnalisisInvolucrados', state)
const { resumen, irArbolProblemas } = state
</script>

<style scoped src="src/css/pages/FormularioAnalisisInvolucrados.css" />
