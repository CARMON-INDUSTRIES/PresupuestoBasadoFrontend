<template>
  <q-card-section class="form-column">
    <div class="question-block">
      <div class="question-title">2.1 Problema central o necesidad principal</div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.problemaCentral"
        type="textarea"
        autogrow
        class="modern-textarea"
        placeholder="Describe de forma concreta el problema central que atiende el programa..."
      >
        <template v-slot:prepend>
          <q-icon name="report_problem" color="primary" />
        </template>
      </q-input>
    </div>

    <FormularioIdentificacionProblemaSection1 />

    <div class="question-block">
      <div class="question-title">2.3 Causas del problema</div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.involucrados"
        type="textarea"
        autogrow
        class="modern-textarea"
        placeholder="Describe las causas que originan el problema..."
      >
        <template v-slot:prepend>
          <q-icon name="group" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="question-block">
      <div class="question-title">2.4 Efectos del problema</div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.efectos"
        type="textarea"
        autogrow
        class="modern-textarea"
        placeholder="Describe los efectos generados en la población o entorno..."
      >
        <template v-slot:prepend>
          <q-icon name="visibility" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="question-block">
      <div class="question-title">2.5 Evolución histórica del problema</div>

      <q-input
        outlined
        bg-color="white"
        v-model="form.evolucion"
        type="textarea"
        autogrow
        class="modern-textarea"
        placeholder="Describe cómo ha evolucionado la problemática..."
      >
        <template v-slot:prepend>
          <q-icon name="timeline" color="primary" />
        </template>
      </q-input>
    </div>
  </q-card-section>
</template>
<script>
import { inject } from 'vue'
import FormularioIdentificacionProblemaSection1 from './FormularioIdentificacionProblemaSection1.vue'

export default {
  components: { FormularioIdentificacionProblemaSection1 },
  setup() {
    return inject('FormularioIdentificacionProblema')
  },
}
</script>
<style scoped src="src/css/pages/FormularioIdentificacionProblema.css" />
