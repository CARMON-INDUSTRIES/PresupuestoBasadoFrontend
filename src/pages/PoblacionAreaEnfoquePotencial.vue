<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Definición del Problema</h1>
        <p class="page-subtitle">
          Consulta y validación de la información estratégica del programa.
        </p>
      </div>

      <q-card flat class="modern-card">
        <q-card-section>
          <div class="section-title">Resumen del Problema</div>

          <div class="form-grid q-mt-md">
            <q-input
              class="modern-input full-width"
              :model-value="resumen.identificacion?.problemaCentral || ''"
              label="Problema Central o Propósito (2.1)"
              filled
              readonly
              rounded
            >
              <template v-slot:prepend>
                <q-icon name="report_problem" color="primary" />
              </template>
            </q-input>

            <q-input
              class="modern-input"
              :model-value="
                resumen.cobertura?.identificacionCaracterizacionPoblacionPotencial || ''
              "
              label="Población / Área de Enfoque Potencial (4.1)"
              filled
              readonly
              rounded
            >
              <template v-slot:prepend>
                <q-icon name="groups" color="primary" />
              </template>
            </q-input>

            <q-input
              class="modern-input"
              :model-value="resumen.cobertura?.identificacionCaracterizacionPoblacionObjetivo || ''"
              label="Población / Área de Enfoque Objetivo (4.2)"
              filled
              readonly
              rounded
            >
              <template v-slot:prepend>
                <q-icon name="group" color="primary" />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator spaced />

        <PoblacionAreaEnfoquePotencialSection1 />

        <q-separator spaced />

        <q-card-section>
          <div class="section-title">Efecto superior o fin</div>

          <q-input
            v-model="efectoSuperior"
            type="textarea"
            label="Describa el efecto superior o fin"
            filled
            readonly
            rounded
            autogrow
            class="modern-input"
          >
            <template v-slot:prepend>
              <q-icon name="emoji_objects" color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg actions-container">
          <q-btn
            label="Pantalla Anterior"
            color="primary"
            text-color="white"
            rounded
            unelevated
            class="secondary-btn"
            to="/formulario-reglas-operacion"
            :loading="loading"
            icon="arrow_back"
          />

          <q-btn
            label="Continuar"
            class="primary-btn"
            text-color="white"
            :loading="loading"
            rounded
            unelevated
            @click="guardarEfectoSuperior"
            icon="arrow_forward"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { usePoblacionAreaEnfoquePotencial } from 'src/composables/pages/usePoblacionAreaEnfoquePotencial'
import PoblacionAreaEnfoquePotencialSection1 from 'src/components/sections/PoblacionAreaEnfoquePotencial/PoblacionAreaEnfoquePotencialSection1.vue'
const state = usePoblacionAreaEnfoquePotencial()
provide('PoblacionAreaEnfoquePotencial', state)
const { resumen, efectoSuperior, loading, guardarEfectoSuperior } = state
</script>

<style scoped src="src/css/pages/PoblacionAreaEnfoquePotencial.css" />
