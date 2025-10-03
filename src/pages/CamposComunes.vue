<template>
  <div class="row q-col-gutter-md">
    <div class="col-6">
      <q-select
        v-model="localIndicador.dimension"
        :options="dimensiones"
        label="Dimensión a Medir"
        filled
      />
    </div>
    <div class="col-6">
      <q-select v-model="localIndicador.sentido" :options="sentidos" label="Sentido" filled />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  indicador: Object,
  dimensiones: Array,
  sentidos: Array,
})
const emit = defineEmits(['update:indicador'])

const localIndicador = reactive({ ...props.indicador })
watch(localIndicador, (val) => emit('update:indicador', val), { deep: true })
</script>
