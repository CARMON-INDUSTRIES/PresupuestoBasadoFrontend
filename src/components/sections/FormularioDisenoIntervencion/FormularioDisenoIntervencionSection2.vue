<template>
  <div v-for="(comp, cIdx) in form.componentes" :key="cIdx" class="component-card full-width">
    <div class="component-header">
      <div class="row items-center q-gutter-sm">
        <q-avatar color="primary" text-color="white" icon="widgets" />

        <div>
          <div class="component-title">
            {{ comp.nombre }}
          </div>

          <div class="component-subtitle">{{ comp.acciones.length }} actividades registradas</div>
        </div>
      </div>

      <div class="row q-gutter-sm">
        <q-btn dense round flat icon="edit" color="primary" @click="editarComponente(comp, cIdx)">
          <q-tooltip>Editar componente</q-tooltip>
        </q-btn>

        <q-btn
          dense
          round
          flat
          icon="delete"
          color="negative"
          @click="form.componentes.splice(cIdx, 1)"
        >
          <q-tooltip>Eliminar componente</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- ACTIVIDADES -->
    <div class="activities-container">
      <div v-for="(accion, aIdx) in comp.acciones" :key="aIdx" class="activity-item">
        <div class="activity-icon">
          <q-icon name="task_alt" />
        </div>

        <div class="activity-content">
          <div class="activity-title">
            {{ accion.descripcion }}
          </div>

          <div class="activity-qty">Cantidad programada: {{ accion.cantidad }}</div>
        </div>
      </div>
    </div>

    <!-- EFECTO -->
    <q-banner rounded class="effect-banner">
      <template v-slot:avatar>
        <q-icon name="flare" />
      </template>

      <strong>Efecto esperado:</strong>

      {{ typeof comp.resultado === 'string' ? comp.resultado : comp.resultado.descripcion }}
    </q-banner>
  </div>
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
