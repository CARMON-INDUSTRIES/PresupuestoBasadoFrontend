<template>
  <q-form @submit.prevent="submitForm">
    <q-card class="modern-card">
      <!-- HEADER CARD -->
      <q-card-section class="q-pb-none">
        <div class="section-title">Objetivos del programa presupuestario</div>

        <div class="section-description">
          Captura los objetivos específicos y analiza la relación del programa con otros programas
          presupuestarios.
        </div>
      </q-card-section>

      <!-- FORM CONTENT -->
      <q-card-section class="form-column">
        <!-- OBJETIVOS -->
        <div class="question-block">
          <div class="question-title">3.1 Objetivos específicos del programa</div>

          <div class="question-helper">
            Define los objetivos específicos que atenderá el programa. Debe existir congruencia con
            el árbol de objetivos.
          </div>

          <q-input
            outlined
            bg-color="white"
            v-model="form.objetivosEspecificos"
            type="textarea"
            autogrow
            class="modern-textarea"
            placeholder="Describe los objetivos específicos del programa..."
          >
            <template v-slot:prepend>
              <q-icon name="flag" color="primary" />
            </template>
          </q-input>
        </div>

        <!-- RELACION PROGRAMAS -->
        <div class="question-block">
          <div class="question-title">3.2 Relación y vinculación con otros programas</div>

          <div class="question-helper">
            Identifica programas presupuestarios relacionados, complementarios o que pudieran
            duplicar objetivos.
          </div>

          <q-input
            outlined
            bg-color="white"
            v-model="form.relacionOtrosProgramas"
            type="textarea"
            autogrow
            class="modern-textarea"
            placeholder="Describe programas relacionados o similares..."
          >
            <template v-slot:prepend>
              <q-icon name="link" color="primary" />
            </template>
          </q-input>
        </div>
      </q-card-section>

      <!-- INFO -->
      <q-card-section>
        <q-banner rounded class="info-banner">
          <template v-slot:avatar>
            <q-icon name="info" />
          </template>

          La información se guarda automáticamente mientras escribes.
        </q-banner>
      </q-card-section>

      <!-- ACTIONS -->
      <q-card-actions align="right" class="q-pa-lg actions-container">
        <q-btn
          label="Pantalla anterior"
          class="secondary-btn"
          unelevated
          to="/formulario-identificacion-problema"
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
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioDeterminacionJustificacionObjetivos')
  },
}
</script>
<style scoped src="src/css/pages/FormularioDeterminacionJustificacionObjetivos.css" />
