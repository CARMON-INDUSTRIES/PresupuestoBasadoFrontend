<template>
  <q-select
    outlined
    bg-color="white"
    v-model="form.estrategias"
    :options="estrategias"
    label="Estrategias"
    multiple
    emit-value
    map-options
    class="modern-input"
    @update:model-value="onEstrategiasChange"
    :loading="loadingEstrategias"
    :disable="!form.objetivo"
  >
    <template v-slot:prepend>
      <q-icon name="lightbulb" color="primary" />
    </template>

    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ form.objetivo ? 'No hay estrategias disponibles' : 'Selecciona un objetivo primero' }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioAlineacion')
  },
}
</script>
<style scoped src="src/css/pages/FormularioAlineacion.css" />
