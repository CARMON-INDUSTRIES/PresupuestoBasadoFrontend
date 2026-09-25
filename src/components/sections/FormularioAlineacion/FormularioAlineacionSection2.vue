<template>
  <q-select
    outlined
    bg-color="white"
    v-model="form.lineasAccion"
    :options="lineasAccion"
    label="Líneas de acción"
    multiple
    emit-value
    map-options
    class="modern-input"
    :loading="loadingLineas"
    :disable="!form.estrategias.length"
  >
    <template v-slot:prepend>
      <q-icon name="track_changes" color="primary" />
    </template>

    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{
            form.estrategias.length
              ? 'No hay líneas de acción disponibles'
              : 'Selecciona estrategias primero'
          }}
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
