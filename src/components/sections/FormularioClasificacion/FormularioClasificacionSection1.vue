<template>
  <q-card-section class="form-grid">
    <q-select
      outlined
      bg-color="white"
      v-model="form.subfuncionId"
      :options="subfunciones"
      label="Subfunción"
      emit-value
      map-options
      class="modern-input"
      @update:model-value="onSubfuncionChange"
    >
      <template v-slot:prepend>
        <q-icon name="subdirectory_arrow_right" color="primary" />
      </template>
    </q-select>

    <q-select
      outlined
      bg-color="white"
      v-model="form.funcionId"
      :options="funciones"
      label="Función"
      disable
      emit-value
      map-options
      class="modern-input"
    >
      <template v-slot:prepend>
        <q-icon name="work" color="primary" />
      </template>
    </q-select>

    <q-select
      outlined
      bg-color="white"
      v-model="form.finalidadId"
      :options="finalidades"
      label="Finalidad"
      disable
      emit-value
      map-options
      class="modern-input"
    >
      <template v-slot:prepend>
        <q-icon name="star" color="primary" />
      </template>
    </q-select>

    <q-select
      outlined
      bg-color="white"
      v-model="form.anioOperando"
      :options="anios"
      label="Año Operando"
      class="modern-input"
    >
      <template v-slot:prepend>
        <q-icon name="calendar_today" color="primary" />
      </template>
    </q-select>

    <q-select
      outlined
      bg-color="white"
      v-model="form.entregaBienes"
      :options="opcionesEntregaBienes"
      label="Entrega de Bienes o Servicios"
      class="modern-input full-width"
    >
      <template v-slot:prepend>
        <q-icon name="handshake" color="primary" />
      </template>
    </q-select>
  </q-card-section>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioClasificacion')
  },
}
</script>
<style scoped src="src/css/pages/FormularioClasificacion.css" />
