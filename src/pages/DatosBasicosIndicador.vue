<template>
  <div>
    <q-card-section>
      <div class="text-h6 q-mb-md">Ficha Técnica del Indicador</div>
      <q-card flat bordered class="q-pa-md">
        <div class="text-subtitle1 q-mb-md text-primary">
          Nombre del Indicador:
          <span class="text-black">{{ modelValue.indicadores || 'Sin nombre' }}ㅤ</span>
          <span class="text-caption text-grey-9">({{ modelValue.nivel }})</span>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-select
              :model-value="modelValue.dimension"
              @update:model-value="updateField('dimension', $event)"
              :options="dimensiones"
              label="Dimensión a Medir"
              filled
            />
          </div>
          <div class="col-6">
            <q-select
              :model-value="modelValue.sentido"
              @update:model-value="updateField('sentido', $event)"
              :options="sentidos"
              label="Sentido"
              filled
            />
          </div>
        </div>

        <q-input
          :model-value="modelValue.definicion"
          @update:model-value="updateField('definicion', $event)"
          type="textarea"
          label="Definición (qué mide y para qué)"
          filled
          autogrow
          class="q-mt-md"
        />

        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-4">
            <q-input
              :model-value="modelValue.unidadMedida"
              @update:model-value="updateField('unidadMedida', $event)"
              label="Unidad de medida del resultado"
              filled
              disable
            />
          </div>
          <div class="col-4">
            <q-input
              :model-value="modelValue.rangoValor"
              @update:model-value="updateField('rangoValor', $event)"
              label="Rango de valor"
              filled
              disable
            />
          </div>
          <div class="col-4">
            <q-select
              :model-value="modelValue.frecuenciaMedicion"
              @update:model-value="updateField('frecuenciaMedicion', $event)"
              :options="frecuencias"
              label="Frecuencia de medición"
              filled
            />
          </div>
        </div>

        <q-input
          :model-value="modelValue.cobertura"
          @update:model-value="updateField('cobertura', $event)"
          label="Cobertura"
          filled
          disable
          class="q-mt-md"
        />
      </q-card>
    </q-card-section>

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
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  lineasAccion: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const dimensiones = ['Eficiencia', 'Eficacia', 'Calidad', 'Economía']
const sentidos = ['Ascendente', 'Descendente']
const frecuencias = ['Mensual', 'Trimestral', 'Semestral', 'Anual']
const periodos = ['Primer trimestre', 'Segundo trimestre', 'Tercer trimestre', 'Cuarto trimestre']
const currentYear = new Date().getFullYear()
const anios = [currentYear, currentYear - 1, currentYear - 2]

function updateField(field, value) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>

<style scoped>
.q-markup-table td {
  vertical-align: middle;
}
</style>
