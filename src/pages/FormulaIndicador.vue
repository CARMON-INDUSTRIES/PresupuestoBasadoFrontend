<template>
  <div>
    <q-card-section>
      <div class="text-h6 q-mb-md">Datos del Indicador y Fórmula</div>
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-input
            :model-value="modelValue.resultadoEsperado"
            @update:model-value="updateField('resultadoEsperado', $event)"
            label="Resultado esperado"
            filled
          />
        </div>
        <div class="col-3">
          <q-input
            :model-value="modelValue.numerador"
            @update:model-value="updateField('numerador', $event)"
            label="Numerador"
            filled
          />
        </div>
        <div class="col-3">
          <q-input
            :model-value="modelValue.denominador"
            @update:model-value="updateField('denominador', $event)"
            label="Denominador"
            filled
          />
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

      <FormulaIndicadorSection1 />
    </q-card-section>

    <!-- CREMA
    <q-card-section>
      <div class="text-h6 q-mb-md">CREMA</div>

      <q-markup-table flat bordered>
        <thead>
          <tr class="bg-grey-3 text-bold">
            <th>Nombre del Indicador</th>
            <th>Claro</th>
            <th>Relevante</th>
            <th>Económico</th>
            <th>Monitoreable</th>
            <th>Adecuado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ modelValue.indicadores }}</td>
            <td>
              <q-checkbox
                :model-value="modelValue.crema.claro"
                @update:model-value="updateCrema('claro', $event)"
                true-value="Sí"
                false-value="No"
              />
            </td>
            <td>
              <q-checkbox
                :model-value="modelValue.crema.relevante"
                @update:model-value="updateCrema('relevante', $event)"
                true-value="Sí"
                false-value="No"
              />
            </td>
            <td>
              <q-checkbox
                :model-value="modelValue.crema.economico"
                @update:model-value="updateCrema('economico', $event)"
                true-value="Sí"
                false-value="No"
              />
            </td>
            <td>
              <q-checkbox
                :model-value="modelValue.crema.monitoreable"
                @update:model-value="updateCrema('monitoreable', $event)"
                true-value="Sí"
                false-value="No"
              />
            </td>
            <td>
              <q-checkbox
                :model-value="modelValue.crema.adecuado"
                @update:model-value="updateCrema('adecuado', $event)"
                true-value="Sí"
                false-value="No"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section> -->
  </div>
</template>

<script setup>
import { provide, toRefs } from 'vue'
import {
  useFormulaIndicador,
  propsOptions,
  emitsOptions,
} from 'src/composables/pages/useFormulaIndicador'
import FormulaIndicadorSection1 from 'src/components/sections/FormulaIndicador/FormulaIndicadorSection1.vue'
const pageProps = defineProps(propsOptions)
const pageEmit = defineEmits(emitsOptions)
const state = useFormulaIndicador(pageProps, pageEmit)
provide('FormulaIndicador', { ...toRefs(pageProps), ...state })
const { updateField } = state
</script>

<style scoped src="src/css/pages/FormulaIndicador.css" />
