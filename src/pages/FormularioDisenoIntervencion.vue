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
      </div>

      <!-- STEPPER -->

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
const { showModal, modoEdicion, guardarComponente } = state
</script>

<style scoped src="src/css/pages/FormularioDisenoIntervencion.css" />
