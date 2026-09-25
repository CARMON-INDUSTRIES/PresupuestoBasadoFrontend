<template>
  <q-card-section class="form-column">
    <div class="question-block">
      <div class="question-title">1.1 Entorno operativo del programa</div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.descripcionPrograma"
        type="textarea"
        autogrow
        class="modern-textarea"
        placeholder="Describe la situación, problemática o necesidad que motiva la intervención pública..."
      >
        <template v-slot:prepend>
          <q-icon name="description" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="question-block">
      <div class="question-title">1.2 Información estadística y cualitativa</div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.contextoHistoricoNormativo"
        type="textarea"
        autogrow
        class="modern-textarea"
        placeholder="Incorpora datos, estadísticas y antecedentes relevantes..."
      >
        <template v-slot:prepend>
          <q-icon name="bar_chart" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="question-block">
      <div class="question-title">1.3 Actores involucrados</div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.problematicaOrigen"
        type="textarea"
        autogrow
        class="modern-textarea"
        placeholder="Describe los actores responsables o relacionados con la atención del problema..."
      >
        <template v-slot:prepend>
          <q-icon name="group" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="question-block">
      <div class="question-title">1.4 Evolución y resultados del programa</div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.experienciasPrevias"
        type="textarea"
        autogrow
        class="modern-textarea"
        placeholder="Describe la evolución histórica y resultados obtenidos..."
      >
        <template v-slot:prepend>
          <q-icon name="history" color="primary" />
        </template>
      </q-input>
    </div>
  </q-card-section>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioAntecedente')
  },
}
</script>
<style scoped src="src/css/pages/FormularioAntecedente.css" />
