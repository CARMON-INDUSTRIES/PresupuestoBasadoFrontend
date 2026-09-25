<template>
  <q-card-section>
    <div class="section-title">Clasificación de Involucrados</div>

    <div class="form-grid q-mt-md">
      <q-card flat class="actor-card beneficiarios-card">
        <q-card-section>
          <div class="actor-title">
            <q-icon name="emoji_people" />
            Beneficiarios
          </div>

          <q-input
            :model-value="resumen.causaBeneficiados || ''"
            type="textarea"
            filled
            autogrow
            readonly
            rounded
            class="modern-input"
          />
        </q-card-section>
      </q-card>

      <q-card flat class="actor-card opositores-card">
        <q-card-section>
          <div class="actor-title">
            <q-icon name="thumb_down" />
            Opositores
          </div>

          <q-input
            :model-value="resumen.causaOpositores || ''"
            type="textarea"
            filled
            autogrow
            readonly
            rounded
            class="modern-input"
          />
        </q-card-section>
      </q-card>

      <q-card flat class="actor-card ejecutores-card">
        <q-card-section>
          <div class="actor-title">
            <q-icon name="construction" />
            Ejecutores
          </div>

          <q-input
            :model-value="resumen.causaEjecutores || ''"
            type="textarea"
            filled
            autogrow
            readonly
            rounded
            class="modern-input"
          />
        </q-card-section>
      </q-card>

      <q-card flat class="actor-card indiferentes-card">
        <q-card-section>
          <div class="actor-title">
            <q-icon name="remove_circle_outline" />
            Indiferentes
          </div>

          <q-input
            :model-value="resumen.causaIndiferentes || ''"
            type="textarea"
            filled
            autogrow
            readonly
            rounded
            class="modern-input"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-card-section>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioAnalisisInvolucrados')
  },
}
</script>
<style scoped src="src/css/pages/FormularioAnalisisInvolucrados.css" />
