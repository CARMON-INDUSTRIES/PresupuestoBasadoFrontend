<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Alineación</h1>
          <p class="page-subtitle">
            Registra la alineación municipal y estatal del programa presupuestario.
          </p>
        </div>
      </div>

      <q-stepper flat bordered color="primary" animated class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" :done="ambasCompletas" active />

        <q-step :name="2" title="Clasificación" icon="dashboard" />

        <q-step :name="3" title="Metas" icon="track_changes" />
      </q-stepper>

      <q-form @submit.prevent="submitForm">
        <q-card class="modern-card">
          <q-card-section class="q-pb-none">
            <div class="section-title">Información de alineación</div>
          </q-card-section>

          <FormularioAlineacionSection3 />

          <q-card-section>
            <q-banner v-if="ambasCompletas" rounded class="success-banner">
              <template v-slot:avatar>
                <q-icon name="check_circle" />
              </template>

              Ambas alineaciones fueron registradas correctamente.
            </q-banner>

            <q-banner v-else rounded class="warning-banner">
              <template v-slot:avatar>
                <q-icon name="info" />
              </template>

              <div v-if="alineacionMunicipalCompleta">Alineación Municipal registrada</div>

              <div v-if="alineacionEstatalCompleta">Alineación Estatal registrada</div>

              <div v-if="!alineacionMunicipalCompleta && !alineacionEstatalCompleta">
                Debes registrar ambas alineaciones (Municipal y Estatal)
              </div>
            </q-banner>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Registrar alineación"
              class="secondary-btn"
              unelevated
              :disable="loading || !puedeRegistrar"
              @click="registrarAlineacion"
            />

            <q-btn
              label="Continuar"
              class="primary-btn"
              type="submit"
              unelevated
              :loading="loading"
              :disable="!ambasCompletas"
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
import { useFormularioAlineacion } from 'src/composables/pages/useFormularioAlineacion'
import FormularioAlineacionSection3 from 'src/components/sections/FormularioAlineacion/FormularioAlineacionSection3.vue'
const state = useFormularioAlineacion()
provide('FormularioAlineacion', state)
const {
  loading,
  alineacionMunicipalCompleta,
  alineacionEstatalCompleta,
  ambasCompletas,
  puedeRegistrar,
  registrarAlineacion,
  submitForm,
} = state
</script>

<style scoped src="src/css/pages/FormularioAlineacion.css" />
