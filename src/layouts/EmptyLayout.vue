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

        <!-- Botón Cerrar Sesión -->
        <q-btn
          flat
          dense
          icon="logout"
          label="Cerrar sesión"
          class="q-ml-md text-white"
          @click="cerrarSesion"
          style="transition: color 0.2s"
          @mouseover="hoverLogout = true"
          @mouseleave="hoverLogout = false"
          :style="{ color: hoverLogout ? '#FFD700' : 'white' }"
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
import api from 'src/boot/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const hoverRes = ref(false)
const hoverMetas = ref(false)
const hoverLogout = ref(false)

async function cerrarSesion() {
  try {
    await api.post('/Cuentas/logout') // Llama al endpoint simulado
    localStorage.removeItem('jwt-token') // o donde tengas tu token
    router.push('/login') // redirige al login
  } catch (err) {
    console.error('Error al cerrar sesión:', err)
  }
}
</script>

<style scoped>
.q-header {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
