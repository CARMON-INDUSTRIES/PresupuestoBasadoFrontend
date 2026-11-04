<template>
  <q-drawer v-model="sidebarOpen" side="left" show-if-above bordered :width="288" class="sidebar">
    <nav class="column sidebar-body" aria-label="Navegación del sistema">
      <div class="sidebar-profile">
        <q-avatar size="44px" class="avatar-border">
          <img :src="previewFoto || fotoActual" alt="" />
        </q-avatar>

        <div class="profile-name">
          {{ nombreUsuario || 'Cargando...' }}
        </div>
      </div>

      <q-separator inset />

      <q-list class="q-pa-sm sidebar-content">
        <q-item
          v-if="esAdministrador"
          clickable
          v-ripple
          :active="$route.path === '/admin'" active-class="nav-current" @click="goTo('/admin')"
          class="hover-item"
        >
          <q-item-section avatar><q-icon name="admin_panel_settings" /></q-item-section>
          <q-item-section>Administración</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          :active="$route.path === '/formulario-alineacion'" active-class="nav-current" @click="goTo('/formulario-alineacion')"
          class="hover-item"
        >
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="$route.path === '/resumenes'" active-class="nav-current" @click="goTo('/resumenes')" class="hover-item">
          <q-item-section avatar><q-icon name="summarize" /></q-item-section>
          <q-item-section>Resúmenes PDF</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="$route.path === '/registro-usuario-detalle'" active-class="nav-current" @click="goTo('/registro-usuario-detalle')"
          class="hover-item"
        >
          <q-item-section avatar><q-icon name="person" /></q-item-section>
          <q-item-section>Datos Personales</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="$route.path === '/programacion-metas'" active-class="nav-current" @click="goTo('/programacion-metas')"
          class="hover-item"
        >
          <q-item-section avatar><q-icon name="event_note" /></q-item-section>
          <q-item-section>Programación Metas</q-item-section>
        </q-item>

        <q-separator inset class="q-my-sm" />

        <q-expansion-item
          icon="settings"
          label="Configuración"
          dense
          expand-separator
          class="hover-item"
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

        <q-separator inset class="q-my-sm" />

        <q-expansion-item
          icon="description"
          label="Registro del Programa"
          dense
          expand-separator
          class="hover-item"
        >
          <EmptyLayoutSection1 />
        </q-expansion-item>

        <q-separator inset class="q-my-sm" />

        <q-item clickable v-ripple @click="cerrarSesion" class="hover-item">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section>Cerrar sesión</q-item-section>
        </q-item>
      </q-list>
    </nav>
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
