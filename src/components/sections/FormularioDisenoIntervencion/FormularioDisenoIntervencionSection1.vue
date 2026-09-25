<template>
  <q-card-section class="q-pa-lg">
    <!-- NOMBRE -->
    <q-input
      v-model="nuevoComponente.nombre"
      outlined
      bg-color="white"
      :label="`Componente ${proximoIndiceComp}`"
      class="modern-input q-mb-lg"
    >
      <template v-slot:prepend>
        <q-icon name="widgets" color="primary" />
      </template>
    </q-input>

    <!-- ACTIVIDADES -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-subtitle1 text-weight-medium">Actividades</div>

      <q-btn
        flat
        icon="add"
        color="primary"
        label="Agregar actividad"
        @click="
          nuevoComponente.acciones.push({
            nombre: '',
            cantidad: 0,
          })
        "
      />
    </div>

    <div
      v-for="(accion, aIdx) in nuevoComponente.acciones"
      :key="'accion-' + aIdx"
      class="activity-editor"
    >
      <div class="row items-center justify-between q-mb-md">
        <div class="text-subtitle2 text-primary">
          Actividad {{ proximoIndiceComp }}.{{ aIdx + 1 }}
        </div>

        <q-btn
          v-if="nuevoComponente.acciones.length > 1"
          dense
          round
          flat
          icon="delete"
          color="negative"
          @click="nuevoComponente.acciones.splice(aIdx, 1)"
        />
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-input
            outlined
            bg-color="white"
            v-model="accion.nombre"
            label="Nombre de la actividad"
            class="modern-input"
          />
        </div>

        <div class="col-12 col-md-4">
          <q-input
            outlined
            bg-color="white"
            type="number"
            min="0"
            v-model.number="accion.cantidad"
            label="Cantidad"
            class="modern-input"
          />
        </div>
      </div>
    </div>

    <!-- EFECTO -->
    <div class="q-mt-lg">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Efecto esperado</div>

      <q-input
        outlined
        bg-color="white"
        v-model="nuevoComponente.resultado"
        :label="`${proximoIndiceComp}.1.1`"
        type="textarea"
        autogrow
        class="modern-input"
      >
        <template v-slot:prepend>
          <q-icon name="flare" color="primary" />
        </template>
      </q-input>
    </div>

    <!-- QUICK ACTION -->
    <div class="row justify-end q-mt-lg">
      <q-btn
        flat
        icon="add_circle"
        color="secondary"
        label="Guardar y crear otro"
        @click="guardarComponente(true)"
      />
    </div>
  </q-card-section>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioDisenoIntervencion')
  },
}
</script>
<style scoped src="src/css/pages/FormularioDisenoIntervencion.css" />
