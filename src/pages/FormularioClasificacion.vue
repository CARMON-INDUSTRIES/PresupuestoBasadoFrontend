<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Clasificación Funcional</h1>

          <p class="page-subtitle">
            Define la estructura funcional y operativa del programa presupuestario.
          </p>
        </div>
      </div>

      <q-stepper flat bordered color="primary" animated class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" done />

        <q-step :name="2" title="Clasificación" icon="dashboard" active />

        <q-step :name="3" title="Antecedentes" icon="history_edu" />

        <q-step :name="4" title="Metas" icon="track_changes" />
      </q-stepper>

      <q-form @submit.prevent="submitForm">
        <q-card class="modern-card">
          <q-card-section class="q-pb-none">
            <div class="section-title">Información funcional</div>

            <div class="section-description">
              Completa los campos relacionados con la clasificación funcional del programa.
            </div>
          </q-card-section>

          <FormularioClasificacionSection1 />

          <q-card-section>
            <q-banner rounded class="info-banner">
              <template v-slot:avatar>
                <q-icon name="info" />
              </template>

              La función y finalidad se completan automáticamente con base en la subfunción
              seleccionada.
            </q-banner>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="/formulario-alineacion"
              :loading="loading"
              icon="arrow_back"
            />

            <q-btn
              label="Continuar"
              class="primary-btn"
              type="submit"
              unelevated
              :loading="loading"
              icon-right="arrow_forward"
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useFormularioClasificacion } from 'src/composables/pages/useFormularioClasificacion'
import FormularioClasificacionSection1 from 'src/components/sections/FormularioClasificacion/FormularioClasificacionSection1.vue'
const state = useFormularioClasificacion()
provide('FormularioClasificacion', state)
const { loading, submitForm } = state
</script>

<style scoped src="src/css/pages/FormularioClasificacion.css" />
