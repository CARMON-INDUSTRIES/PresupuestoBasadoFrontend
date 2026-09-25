<template>
  <div class="row q-col-gutter-xl justify-center q-mb-xl">
    <div
      v-for="(comp, cIndex) in arbolObjetivos.componentes"
      :key="'res-' + cIndex"
      class="col-12 col-md-6 col-lg-3"
    >
      <div class="tree-card tree-effect">
        <div class="tree-label">Efectos</div>

        <div
          v-for="(res, rIndex) in comp.resultados"
          :key="'resultado-' + cIndex + '-' + rIndex"
          class="q-mb-md"
        >
          <q-input
            v-model="arbolObjetivos.componentes[cIndex].resultados[rIndex]"
            filled
            autogrow
            :label="`Efecto ${rIndex + 1}`"
            class="modern-input"
          />

          <div class="tree-reference">
            Basado en:
            {{ arbolProblemas.componentes[cIndex]?.resultados?.[rIndex] || '—' }}
          </div>
        </div>

        <div class="connector"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioArbolObjetivos')
  },
}
</script>
<style scoped src="src/css/pages/FormularioArbolObjetivos.css" />
