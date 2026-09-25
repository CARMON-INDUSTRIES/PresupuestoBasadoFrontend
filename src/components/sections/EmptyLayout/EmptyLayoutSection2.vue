<template>
  <q-drawer v-model="sidebarOpen" side="left" show-if-above bordered :width="400" class="sidebar">
    <div
      class="column full-height"
      style="background-color: #691b31; background-size: cover; background-position: center"
    >
      <div class="column items-center q-my-xl">
        <q-avatar size="120px" class="shadow-4 avatar-border">
          <img :src="previewFoto || fotoActual" alt="" />
        </q-avatar>

        <div class="text-h6 text-weight-bold q-mt-sm text-white">
          {{ nombreUsuario || 'Cargando...' }}
        </div>
      </div>

      <q-separator color="white" inset />

      <q-list class="q-pa-sm sidebar-content">
        <q-item
          clickable
          v-ripple
          @click="goTo('/formulario-alineacion')"
          class="hover-item text-white"
        >
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="goTo('/resumenes')" class="hover-item text-white">
          <q-item-section avatar><q-icon name="summarize" /></q-item-section>
          <q-item-section>Resúmenes PDF</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="goTo('/registro-usuario-detalle')"
          class="hover-item text-white"
        >
          <q-item-section avatar><q-icon name="person" /></q-item-section>
          <q-item-section>Datos Personales</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="goTo('/programacion-metas')"
          class="hover-item text-white"
        >
          <q-item-section avatar><q-icon name="event_note" /></q-item-section>
          <q-item-section>Programación Metas</q-item-section>
        </q-item>

        <q-separator color="white" inset class="q-my-sm" />

        <q-expansion-item
          icon="settings"
          label="Configuración"
          dense
          expand-separator
          class="text-white hover-item"
        >
          <q-list dense>
            <q-item clickable v-ripple @click="abrirCambiarPassword">
              <q-item-section avatar><q-icon name="lock" /></q-item-section>
              <q-item-section>Cambiar contraseña</q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="abrirCambiarFoto">
              <q-item-section avatar><q-icon name="photo_camera" /></q-item-section>
              <q-item-section>Foto de perfil</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <q-separator color="white" inset class="q-my-sm" />

        <q-expansion-item
          icon="description"
          label="Registro del Programa"
          dense
          expand-separator
          class="text-white hover-item"
        >
          <EmptyLayoutSection1 />
        </q-expansion-item>

        <q-separator color="white" inset class="q-my-sm" />

        <q-item clickable v-ripple @click="cerrarSesion" class="hover-item text-white">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section>Cerrar sesión</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-drawer>
</template>
<script>
import { inject } from 'vue'
import EmptyLayoutSection1 from './EmptyLayoutSection1.vue'

export default {
  components: { EmptyLayoutSection1 },
  setup() {
    return inject('EmptyLayout')
  },
}
</script>
<style scoped src="src/css/pages/EmptyLayout.css" />
