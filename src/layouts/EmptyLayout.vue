<template>
  <q-layout view="hHh lpR fFf">
    <!-- Navbar -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-pl-md q-pr-md">
        <q-toolbar-title class="text-h6 text-weight-bold">
          Sistema de Presupuesto Basado en Resultados
        </q-toolbar-title>

        <q-btn
          flat
          dense
          icon="summarize"
          label="Resúmenes PDF"
          class="q-ml-md text-white"
          @click="$router.push('/resumenes')"
          :style="{ color: hoverRes ? '#FFD700' : 'white' }"
          @mouseover="hoverRes = true"
          @mouseleave="hoverRes = false"
        />

        <q-btn
          flat
          dense
          icon="event_note"
          label="Programación Metas"
          class="q-ml-md text-white"
          @click="$router.push('/programacion-metas')"
          :style="{ color: hoverMetas ? '#FFD700' : 'white' }"
          @mouseover="hoverMetas = true"
          @mouseleave="hoverMetas = false"
        />

        <q-btn
          flat
          dense
          icon="logout"
          label="Cerrar sesión"
          class="q-ml-md text-white"
          @click="cerrarSesion"
          :style="{ color: hoverLogout ? '#FFD700' : 'white' }"
          @mouseover="hoverLogout = true"
          @mouseleave="hoverLogout = false"
        />
      </q-toolbar>
    </q-header>

    <!-- Contenido -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()

const hoverRes = ref(false)
const hoverMetas = ref(false)
const hoverLogout = ref(false)

// 🔹 Lista de todas las rutas del flujo de registro
const rutasRegistro = [
  '/formulario-alineacion',
  '/formulario-identificacion',
  '/formulario-diseno',
  '/formulario-clasificacion',
  '/formulario-actividad',
  '/formulario-ficha-tecnica-1',
]

// 🧩 Guardar última ruta visitada del flujo
router.afterEach((to) => {
  if (rutasRegistro.includes(to.path)) {
    localStorage.setItem('ultimaRutaRegistro', to.path)
  }
})

// 🧭 Función para traducir rutas a texto amigable

//  Cerrar sesión
async function cerrarSesion() {
  try {
    await api.post('/Cuentas/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('formAlineacion')
    localStorage.removeItem('tipoAlineacion')
    localStorage.removeItem('clasificacionFuncionalForm_v1')
    localStorage.removeItem('antecedentesForm_v1')
    localStorage.removeItem('formularioIdentificacionProblema')
    localStorage.removeItem('formularioDeterminacionJustificacion')
    localStorage.removeItem('formularioCobertura')
    localStorage.removeItem('formularioCobertura')
    localStorage.removeItem('disenoIntervencionPublica')
    localStorage.removeItem('formularioProgramaSocial')
    localStorage.removeItem('formularioProgramaSocialCompleto')
    localStorage.removeItem('formularioPadronBeneficiarios')
    localStorage.removeItem('formularioReglasOperacion')
    localStorage.removeItem('formularioArbolObjetivos')
    localStorage.removeItem('anexo6AnalisisAlternativas')
    localStorage.removeItem('mirMatrizIndicadores')

    router.push('/login')
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
