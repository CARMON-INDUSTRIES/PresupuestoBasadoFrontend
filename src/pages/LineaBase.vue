<template>
  <q-card-section>
    <div class="text-h6 q-mb-md">Línea Base</div>
    <div class="row q-col-gutter-md">
      <div class="col-3">
        <q-input v-model.number="localLineaBase.valor" type="number" label="Valor (num)" filled />
      </div>
      <div class="col-3">
        <q-input v-model="localLineaBase.unidad" label="Unidad de medida (texto)" filled />
      </div>
      <div class="col-3">
        <q-select v-model="localLineaBase.anio" :options="anios" label="Año" filled />
      </div>
      <div class="col-3">
        <q-select v-model="localLineaBase.periodo" :options="periodos" label="Periodo" filled />
      </div>
    </div>
  </q-card-section>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  lineaBase: Object,
  anios: Array,
  periodos: Array,
})
const emit = defineEmits(['update:lineaBase'])

const localLineaBase = reactive({ ...props.lineaBase })
watch(localLineaBase, (val) => emit('update:lineaBase', val), { deep: true })
</script>
