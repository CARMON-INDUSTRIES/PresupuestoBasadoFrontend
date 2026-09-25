<template>
  <q-card-section class="form-grid">
    <q-select
      outlined
      bg-color="white"
      v-model="form.tipo"
      :options="['Municipio', 'Estado']"
      label="Tipo de alineación"
      class="modern-input"
      @update:model-value="onTipoChange"
    >
      <template v-slot:prepend>
        <q-icon name="location_city" color="primary" />
      </template>
    </q-select>

    <q-select
      outlined
      bg-color="white"
      v-model="form.acuerdo"
      :options="acuerdos"
      label="Acuerdo"
      emit-value
      map-options
      class="modern-input"
      @update:model-value="onAcuerdoChange"
      :loading="loadingAcuerdos"
      :disable="!form.tipo"
    >
      <template v-slot:prepend>
        <q-icon name="article" color="primary" />
      </template>

      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            {{ form.tipo ? 'No hay acuerdos disponibles' : 'Selecciona un tipo primero' }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-select
      outlined
      bg-color="white"
      v-model="form.objetivo"
      :options="objetivos"
      label="Objetivo"
      emit-value
      map-options
      class="modern-input"
      @update:model-value="onObjetivoChange"
      :loading="loadingObjetivos"
      :disable="!form.acuerdo"
    >
      <template v-slot:prepend>
        <q-icon name="flag" color="primary" />
      </template>

      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            {{ form.acuerdo ? 'No hay objetivos disponibles' : 'Selecciona un acuerdo primero' }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <FormularioAlineacionSection1 />

    <FormularioAlineacionSection2 />

    <q-select
      v-if="form.tipo === 'Municipio'"
      outlined
      bg-color="white"
      v-model="form.ramo"
      :options="ramos"
      label="Tipo de ramo"
      class="modern-input"
    >
      <template v-slot:prepend>
        <q-icon name="account_balance" color="primary" />
      </template>
    </q-select>
  </q-card-section>
</template>
<script>
import { inject } from 'vue'
import FormularioAlineacionSection1 from './FormularioAlineacionSection1.vue'
import FormularioAlineacionSection2 from './FormularioAlineacionSection2.vue'

export default {
  components: { FormularioAlineacionSection1, FormularioAlineacionSection2 },
  setup() {
    return inject('FormularioAlineacion')
  },
}
</script>
<style scoped src="src/css/pages/FormularioAlineacion.css" />
