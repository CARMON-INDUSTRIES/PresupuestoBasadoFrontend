<template>
  <div class="q-mt-md">
    <q-markup-table flat bordered>
      <thead>
        <tr>
          <th>Sigla</th>
          <th>Unidad de medida</th>
          <th>Descripción</th>
          <th>Fuente</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ siglas.resultadoEsperado || 'RE' }}</td>
          <td>
            <q-input
              :model-value="modelValue.unidadMedida"
              @update:model-value="updateField('unidadMedida', $event)"
              dense
              filled
              placeholder="Unidad"
            />
          </td>
          <td>{{ modelValue.resultadoEsperado }}</td>
          <td>
            <q-input
              :model-value="modelValue.fuentes.resultadoEsperado"
              @update:model-value="updateFuente('resultadoEsperado', $event)"
              dense
              filled
              placeholder="Fuente"
            />
          </td>
        </tr>

        <tr>
          <td>{{ siglas.numerador || 'NUM' }}</td>
          <td>
            <q-input
              :model-value="modelValue.unidadMedida"
              @update:model-value="updateField('unidadMedida', $event)"
              dense
              filled
              placeholder="Unidad"
            />
          </td>
          <td>{{ modelValue.numerador }}</td>
          <td>
            <q-input
              :model-value="modelValue.fuentes.numerador"
              @update:model-value="updateFuente('numerador', $event)"
              dense
              filled
              placeholder="Fuente"
            />
          </td>
        </tr>

        <tr>
          <td>{{ siglas.denominador || 'DEN' }}</td>
          <td>
            <q-input
              :model-value="modelValue.unidadMedida"
              @update:model-value="updateField('unidadMedida', $event)"
              dense
              filled
              placeholder="Unidad"
            />
          </td>
          <td>{{ modelValue.denominador }}</td>
          <td>
            <q-input
              :model-value="modelValue.fuentes.denominador"
              @update:model-value="updateFuente('denominador', $event)"
              dense
              filled
              placeholder="Fuente"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormulaIndicador')
  },
}
</script>
<style scoped src="src/css/pages/FormulaIndicador.css" />
