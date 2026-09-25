<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Diseño de la Intervención Pública</h1>
          <p class="page-subtitle">
            Define los componentes, actividades y resultados esperados del programa.
          </p>
        </div>

        <div class="autosave-status">
          <q-chip
            v-if="autosaveLoading"
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

      <!-- STEPPER -->
      <q-stepper flat bordered color="primary" animated class="modern-stepper">
        <q-step :name="1" title="Alineación" icon="account_tree" done />
        <q-step :name="2" title="Clasificación" icon="dashboard" done />
        <q-step :name="3" title="Antecedentes" icon="history_edu" done />
        <q-step :name="4" title="Problema" icon="report_problem" done />
        <q-step :name="5" title="Objetivos" icon="flag" done />
        <q-step :name="6" title="Cobertura" icon="groups" done />
        <q-step :name="7" title="Intervención" icon="design_services" active />
      </q-stepper>

      <!-- CARD -->
      <FormularioDisenoIntervencionSection3 />
    </div>

    <!-- MODAL -->
    <q-dialog v-model="showModal" persistent>
      <q-card class="modal-card">
        <q-card-section class="modal-header">
          <div class="row items-center justify-between">
            <div>
              <div class="modal-title">
                {{ modoEdicion ? 'Editar componente' : 'Nuevo componente' }}
              </div>

              <div class="modal-subtitle">Configura actividades y resultados esperados.</div>
            </div>

            <q-btn flat round dense icon="close" color="grey-7" v-close-popup />
          </div>
        </q-card-section>

        <q-separator />

        <FormularioDisenoIntervencionSection1 />

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />

          <q-btn
            unelevated
            :label="modoEdicion ? 'Actualizar componente' : 'Guardar componente'"
            class="primary-btn"
            @click="guardarComponente()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useFormularioDisenoIntervencion } from 'src/composables/pages/useFormularioDisenoIntervencion'
import FormularioDisenoIntervencionSection1 from 'src/components/sections/FormularioDisenoIntervencion/FormularioDisenoIntervencionSection1.vue'
import FormularioDisenoIntervencionSection3 from 'src/components/sections/FormularioDisenoIntervencion/FormularioDisenoIntervencionSection3.vue'
const state = useFormularioDisenoIntervencion()
provide('FormularioDisenoIntervencion', state)
const { showModal, modoEdicion, autosaveLoading, guardarComponente } = state
</script>

<style scoped src="src/css/pages/FormularioDisenoIntervencion.css" />
