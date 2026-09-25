<template>
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
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('DatosBasicosIndicador')
  },
}
</script>
<style scoped src="src/css/pages/DatosBasicosIndicador.css" />
