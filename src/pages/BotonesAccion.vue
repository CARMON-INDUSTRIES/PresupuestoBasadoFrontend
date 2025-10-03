<template>
  <q-card-actions align="right">
    <q-btn color="primary" label="Guardar y Continuar" @click="$emit('guardar')" />
  </q-card-actions>
</template>

<script setup>
defineEmits(['guardar'])
</script>
