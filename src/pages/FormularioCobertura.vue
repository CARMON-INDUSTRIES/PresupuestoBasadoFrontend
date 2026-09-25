<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Cobertura</h1>

          <p class="page-subtitle">
            Define la población potencial, población objetivo, cuantificación y mecanismos de
            actualización del programa.
          </p>
        </div>

        <div class="autosave-status">
          <q-chip color="green-1" text-color="green-9" icon="cloud_done" class="autosave-chip">
            Autoguardado activo
          </q-chip>
        </div>
      </div>

      <q-stepper flat bordered animated color="primary" class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" done />

        <q-step :name="2" title="Clasificación" icon="dashboard" done />

        <q-step :name="3" title="Antecedentes" icon="history_edu" done />

        <q-step :name="4" title="Problema" icon="warning" done />

        <q-step :name="5" title="Objetivos" icon="fact_check" done />

        <q-step :name="6" title="Cobertura" icon="groups" active />

        <q-step :name="7" title="Intervención" icon="schema" />
      </q-stepper>

      <q-form @submit.prevent="submitForm">
        <q-card class="modern-card">
          <q-card-section class="q-pb-none">
            <div class="section-title">Cobertura y población objetivo</div>

            <div class="section-description">
              Describe la población potencial, objetivo y los mecanismos utilizados para su
              identificación y actualización.
            </div>
          </q-card-section>

          <FormularioCoberturaSection3 />

          <q-card-section>
            <q-banner rounded class="info-banner">
              <template v-slot:avatar>
                <q-icon name="info" />
              </template>

              La información se guarda automáticamente mientras escribes.
            </q-banner>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="/formulario-determinacion-justificacion"
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
import { useFormularioCobertura } from 'src/composables/pages/useFormularioCobertura'
import FormularioCoberturaSection3 from 'src/components/sections/FormularioCobertura/FormularioCoberturaSection3.vue'
const state = useFormularioCobertura()
provide('FormularioCobertura', state)
const { loading, submitForm } = state
</script>

<style scoped src="src/css/pages/FormularioCobertura.css" />
