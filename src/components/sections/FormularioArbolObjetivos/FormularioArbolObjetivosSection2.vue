<template>
  <div class="row q-col-gutter-xl justify-center">
    <div class="col-12">
      <q-btn
        label="Completar campos vacíos con IA"
        icon="auto_awesome"
        color="primary"
        :loading="generandoIA"
        :disable="loading || cargandoDatos || !fuentesListas || generandoIA"
        @click="generarObjetivosAutomaticamente"
      />
    </div>
    <div
      v-for="(comp, cIndex) in arbolObjetivos.componentes"
      :key="'medio-' + cIndex"
      class="col-12 col-md-6 col-lg-3"
    >
      <div class="tree-card tree-medium">
        <div class="tree-label">Medios</div>

        <div
          v-for="(medio, mIndex) in comp.medios"
          :key="'medio-item-' + cIndex + '-' + mIndex"
          class="q-mb-md"
        >
          <q-input
            v-model="arbolObjetivos.componentes[cIndex].medios[mIndex]"
            filled
            autogrow
            :label="`Medio ${mIndex + 1}`"
            class="modern-input"
          />

          <div class="tree-reference">
            Basado en:
            {{ arbolProblemas.componentes[cIndex]?.acciones?.[mIndex]?.descripcion || '—' }}
          </div>
        </div>
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
