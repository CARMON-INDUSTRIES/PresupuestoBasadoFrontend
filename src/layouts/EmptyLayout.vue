<template>
  <q-layout view="hHh lpR fFf">
    <!-- Navbar -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Sistema de Presupuesto Basado en Resultados </q-toolbar-title>

        <!-- Botón Resúmenes -->
        <q-btn
          flat
          dense
          round
          icon="summarize"
          label="Resúmenes"
          class="q-ml-md"
          @click="$router.push('/resumenes')"
        />
      </q-toolbar>
    </q-header>

    <!-- Contenido principal -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
