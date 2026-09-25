<template>
  <div class="question-block">
    <div class="question-title">2.2 Actores involucrados</div>

    <div class="question-helper">
      Describe organizaciones, empresas, grupos o individuos relacionados con la problemática.
    </div>

    <div class="actors-grid">
      <q-card class="actor-card positive-card">
        <q-card-section>
          <div class="actor-title">Beneficiados</div>

          <q-input
            outlined
            bg-color="white"
            v-model="form.causaBeneficiados"
            type="textarea"
            autogrow
            class="modern-textarea"
          >
            <template v-slot:prepend>
              <q-icon name="emoji_people" color="positive" />
            </template>
          </q-input>
        </q-card-section>
      </q-card>

      <q-card class="actor-card negative-card">
        <q-card-section>
          <div class="actor-title">Opositores</div>

          <q-input
            outlined
            bg-color="white"
            v-model="form.causaOpositores"
            type="textarea"
            autogrow
            class="modern-textarea"
          >
            <template v-slot:prepend>
              <q-icon name="thumb_down" color="negative" />
            </template>
          </q-input>
        </q-card-section>
      </q-card>

      <q-card class="actor-card info-card">
        <q-card-section>
          <div class="actor-title">Ejecutores</div>

          <q-input
            outlined
            bg-color="white"
            v-model="form.causaEjecutores"
            type="textarea"
            autogrow
            class="modern-textarea"
          >
            <template v-slot:prepend>
              <q-icon name="construction" color="primary" />
            </template>
          </q-input>
        </q-card-section>
      </q-card>

      <q-card class="actor-card neutral-card">
        <q-card-section>
          <div class="actor-title">Indiferentes</div>

          <q-input
            outlined
            bg-color="white"
            v-model="form.causaIndiferentes"
            type="textarea"
            autogrow
            class="modern-textarea"
          >
            <template v-slot:prepend>
              <q-icon name="remove_circle_outline" color="grey" />
            </template>
          </q-input>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioIdentificacionProblema')
  },
}
</script>
<style scoped src="src/css/pages/FormularioIdentificacionProblema.css" />
