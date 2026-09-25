<template>
  <q-form @submit.prevent="submitForm">
    <q-card class="modern-card">
      <q-card-section class="q-pb-none">
        <div class="section-title">Componentes y diseño operativo</div>

        <div class="section-description">
          Agrega los componentes principales, actividades y efectos esperados del programa
          presupuestario.
        </div>
      </q-card-section>

      <q-card-section class="form-grid">
        <!-- BOTON AGREGAR -->
        <div class="full-width row justify-between items-center q-mb-md">
          <div class="text-subtitle1 text-weight-medium text-primary">Componentes registrados</div>

          <q-btn
            color="primary"
            icon="add"
            label="Agregar componente"
            unelevated
            rounded
            class="primary-btn"
            @click="showModal = true"
          />
        </div>

        <!-- EMPTY STATE -->
        <div v-if="!form.componentes.length" class="empty-components full-width">
          <q-icon name="inventory_2" size="60px" color="grey-5" />
          <div class="text-h6 q-mt-md text-grey-7">No hay componentes registrados</div>

          <div class="text-body2 text-grey-6 q-mt-sm">
            Agrega componentes para comenzar a estructurar la intervención.
          </div>
        </div>

        <!-- COMPONENTES -->
        <FormularioDisenoIntervencionSection2 />

        <!-- ETAPAS -->
        <q-input
          outlined
          bg-color="white"
          v-model="form.etapasIntervencion"
          label="5.2 Establecimiento de los cursos de acción"
          type="textarea"
          autogrow
          class="modern-input full-width"
        >
          <template v-slot:prepend>
            <q-icon name="directions_run" color="primary" />
          </template>
        </q-input>

        <!-- ESCENARIOS -->
        <q-input
          outlined
          bg-color="white"
          v-model="form.escenariosFuturosEsperar"
          label="5.3 Escenarios futuros esperados"
          type="textarea"
          autogrow
          class="modern-input full-width"
        >
          <template v-slot:prepend>
            <q-icon name="visibility" color="primary" />
          </template>
        </q-input>
      </q-card-section>

      <!-- ACTIONS -->
      <q-card-actions align="between" class="q-pa-lg actions-container">
        <q-btn
          label="Pantalla anterior"
          icon="arrow_back"
          flat
          class="secondary-btn"
          to="/formulario-cobertura"
          :loading="loading"
        />

        <q-btn
          label="Continuar"
          icon-right="arrow_forward"
          type="submit"
          unelevated
          class="primary-btn"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>
<script>
import { inject } from 'vue'
import FormularioDisenoIntervencionSection2 from './FormularioDisenoIntervencionSection2.vue'

export default {
  components: { FormularioDisenoIntervencionSection2 },
  setup() {
    return inject('FormularioDisenoIntervencion')
  },
}
</script>
<style scoped src="src/css/pages/FormularioDisenoIntervencion.css" />
