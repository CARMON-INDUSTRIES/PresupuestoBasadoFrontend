<template>
  <q-card-section>
    <div class="text-h6 q-mb-md">Datos del Indicador y Fórmula</div>

    <div class="row q-col-gutter-md">
      <div class="col-6">
        <q-input v-model="localIndicador.resultadoEsperado" label="Resultado esperado" filled />
      </div>
      <div class="col-3">
        <q-input v-model="localIndicador.numerador" label="Numerador" filled />
      </div>
      <div class="col-3">
        <q-input v-model="localIndicador.denominador" label="Denominador" filled />
      </div>
    </div>

    <div class="q-mt-md text-center">
      <div class="text-subtitle2 q-mb-xs">Vista previa fórmula:</div>
      <div class="q-pa-sm bg-white text-black" style="display: inline-block; min-width: 300px">
        <strong>{{ siglas.resultadoEsperado || 'RE' }}</strong> =
        <strong>{{ siglas.numerador || 'NUM' }}</strong> /
        <strong>{{ siglas.denominador || 'DEN' }}</strong>
      </div>
    </div>

    <q-input
      v-model="localIndicador.descripcion"
      label="Descripción"
      filled
      type="textarea"
      autogrow
      class="q-mt-md"
    />
    <q-input v-model="localIndicador.fuentes" label="Fuentes" filled type="textarea" autogrow />
  </q-card-section>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  indicador: Object,
  siglas: Object,
})
const emit = defineEmits(['update:indicador'])

const localIndicador = reactive({ ...props.indicador })
watch(localIndicador, (val) => emit('update:indicador', val), { deep: true })
</script>
