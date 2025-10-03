<template>
  <q-card-section v-if="indicadores.length">
    <div class="text-h6 q-mb-md">Seleccionar Indicador</div>
    <div class="row q-col-gutter-sm no-wrap scroll-x">
      <q-btn
        v-for="(ind, index) in indicadores"
        :key="'btn-' + index"
        :label="index + 1 + '. ' + (ind.nivel || 'Sin nivel')"
        flat
        class="q-ma-xs"
        :color="indiceSeleccionado === index ? 'primary' : 'grey-7'"
        text-color="black"
        @click="$emit('update:indiceSeleccionado', index)"
      />
    </div>
  </q-card-section>
</template>

<script setup>
defineProps({
  indicadores: Array,
  indiceSeleccionado: Number,
})
defineEmits(['update:indiceSeleccionado'])
</script>
