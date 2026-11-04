<template>
  <div v-if="formSaveStates.length" class="save-states" aria-live="polite" role="status">
    <div v-for="entry in formSaveStates" :key="entry.key" class="save-state">
      <q-icon :name="icons[entry.status.value]" :color="entry.status.value === 'error' ? 'negative' : 'primary'" />
      <span>{{ labels[entry.status.value] }}</span>
      <q-btn v-if="['error', 'pending'].includes(entry.status.value)" flat dense color="primary"
        :label="entry.status.value === 'error' ? 'Reintentar guardado' : 'Guardar ahora'" @click="entry.retry" />
    </div>
  </div>
</template>
<script setup>
import { formSaveStates } from 'src/composables/useFormularioPersistente'
const labels = { loading: 'Recuperando información…', ready: 'Sin cambios pendientes', pending: 'Cambios pendientes de guardar', saving: 'Guardando…', saved: 'Cambios guardados', error: 'No se pudo confirmar el guardado. Vuelve a intentar.' }
const icons = { loading: 'sync', ready: 'info', pending: 'edit', saving: 'sync', saved: 'check_circle', error: 'error_outline' }
</script>
<style scoped>
.save-states { margin: 12px 32px 0; }
.save-state { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-height: 32px; color: #625e62; font-size: .875rem; }
@media(max-width:700px) { .save-states { margin: 12px 16px 0; } }
</style>
