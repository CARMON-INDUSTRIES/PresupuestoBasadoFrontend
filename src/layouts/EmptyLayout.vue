<template>
  <q-layout view="hHh lpR fFf">
    <!-- Navbar -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-pl-md q-pr-md">
        <!-- Título -->
        <q-toolbar-title class="text-h6 text-weight-bold">
          Sistema de Presupuesto Basado en Resultados
        </q-toolbar-title>

        <!-- Botón Resúmenes -->
        <q-btn
          flat
          dense
          icon="summarize"
          label="Resúmenes"
          class="q-ml-md text-white"
          @click="$router.push('/resumenes')"
          style="transition: color 0.2s"
          @mouseover="hoverRes = true"
          @mouseleave="hoverRes = false"
          :style="{ color: hoverRes ? '#FFD700' : 'white' }"
        />

        <!-- Botón Programación Metas -->
        <q-btn
          flat
          dense
          icon="event_note"
          label="Programación Metas"
          class="q-ml-md text-white"
          @click="$router.push('/programacion-metas')"
          style="transition: color 0.2s"
          @mouseover="hoverMetas = true"
          @mouseleave="hoverMetas = false"
          :style="{ color: hoverMetas ? '#FFD700' : 'white' }"
        />
      </q-toolbar>
    </q-header>

    <!-- Contenido principal -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const hoverRes = ref(false)
const hoverMetas = ref(false)
</script>

<style scoped>
.q-header {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
