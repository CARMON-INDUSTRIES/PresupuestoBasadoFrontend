<template>
  <div>
    <DatosBasicosIndicadorSection1 />

    <q-card-section>
      <div class="text-h6 q-mb-md">Línea Base</div>
      <div class="row q-col-gutter-md">
        <div class="col-3">
          <q-input
            :model-value="modelValue.lineaBaseValor"
            @update:model-value="updateField('lineaBaseValor', $event)"
            type="number"
            label="Valor (num)"
            filled
          />
        </div>
        <div class="col-3">
          <q-input
            :model-value="modelValue.lineaBaseUnidad"
            @update:model-value="updateField('lineaBaseUnidad', $event)"
            label="Unidad de medida (texto)"
            filled
          />
        </div>
        <div class="col-3">
          <q-select
            :model-value="modelValue.lineaBaseAnio"
            @update:model-value="updateField('lineaBaseAnio', $event)"
            :options="anios"
            label="Año"
            filled
          />
        </div>
        <div class="col-3">
          <q-select
            :model-value="modelValue.lineaBasePeriodo"
            @update:model-value="updateField('lineaBasePeriodo', $event)"
            :options="periodos"
            label="Periodo"
            filled
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="lineasAccion.length">
      <div class="text-h6 q-mb-md">Líneas de Acción</div>

      <q-markup-table flat bordered>
        <thead>
          <tr>
            <th>Línea de Acción</th>
            <th>Tipo</th>
            <th>Seleccionar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="la in lineasAccion" :key="la.id">
            <td>{{ la.lineaAccion || la.nombre }}</td>
            <td>{{ la.tipo }}</td>
            <td>
              <q-radio
                :model-value="modelValue.lineaAccionSeleccionada"
                @update:model-value="updateField('lineaAccionSeleccionada', $event)"
                :val="la.id"
                color="primary"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </div>
</template>

<script setup>
import { provide, toRefs } from 'vue'
import {
  useDatosBasicosIndicador,
  propsOptions,
  emitsOptions,
} from 'src/composables/pages/useDatosBasicosIndicador'
import DatosBasicosIndicadorSection1 from 'src/components/sections/DatosBasicosIndicador/DatosBasicosIndicadorSection1.vue'
const pageProps = defineProps(propsOptions)
const pageEmit = defineEmits(emitsOptions)
const state = useDatosBasicosIndicador(pageProps, pageEmit)
provide('DatosBasicosIndicador', { ...toRefs(pageProps), ...state })
const { periodos, anios, updateField } = state
</script>

<style scoped src="src/css/pages/DatosBasicosIndicador.css" />
