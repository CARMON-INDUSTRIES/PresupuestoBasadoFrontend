<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Identificación y Descripción del Problema</h1>

          <p class="page-subtitle">
            Define el problema central, actores involucrados, causas, efectos y evolución de la
            problemática.
          </p>
        </div>

        <div class="autosave-status">
          <q-chip
            v-if="saving"
            color="orange-1"
            text-color="orange-9"
            icon="sync"
            class="autosave-chip"
          >
            Guardando...
          </q-chip>

          <q-chip
            v-else
            color="green-1"
            text-color="green-9"
            icon="check_circle"
            class="autosave-chip"
          >
            Autoguardado activo
          </q-chip>
        </div>
      </div>

      <q-stepper flat bordered animated color="primary" class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" done />

        <q-step :name="2" title="Clasificación" icon="dashboard" done />

        <q-step :name="3" title="Antecedentes" icon="history_edu" done />

        <q-step :name="4" title="Problema" icon="warning" active />

        <q-step :name="5" title="Justificación" icon="fact_check" />

        <q-step :name="6" title="Metas" icon="track_changes" />
      </q-stepper>

      <q-form @submit.prevent="submitForm">
        <q-card class="modern-card">
          <q-card-section class="q-pb-none">
            <div class="section-title">Diagnóstico del problema público</div>

            <div class="section-description">
              Captura la información relacionada con la problemática que atiende el programa
              presupuestario.
            </div>
          </q-card-section>

          <FormularioIdentificacionProblemaSection2 />

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
              to="/formulario-antecedente"
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
import { useFormularioIdentificacionProblema } from 'src/composables/pages/useFormularioIdentificacionProblema'
import FormularioIdentificacionProblemaSection2 from 'src/components/sections/FormularioIdentificacionProblema/FormularioIdentificacionProblemaSection2.vue'
const state = useFormularioIdentificacionProblema()
provide('FormularioIdentificacionProblema', state)
const { loading, submitForm, saving } = state
</script>

<style scoped src="src/css/pages/FormularioIdentificacionProblema.css" />
