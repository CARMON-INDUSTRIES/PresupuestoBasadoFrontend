<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="navbar">
      <q-toolbar class="q-pl-md q-pr-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="q-mr-md menu-btn"
          @click="sidebarOpen = !sidebarOpen"
        />
        <q-toolbar-title class="text-h6 text-weight-bold">
          Sistema de Presupuesto Basado en Resultados
        </q-toolbar-title>

        <q-space />

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

    <EmptyLayoutSection2 />

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog v-model="dialogCambiarPassword">
      <q-card>
        <q-card-section>
          <div class="text-h6">ㅤㅤ ­ ­­­Cambio de Contraseña</div>
          <div class="text-body-1">Incluya mayúscula, números y un carácter especial</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="passwordActual"
            :type="showPasswordActual ? 'text' : 'password'"
            label="Contraseña actual"
            class="q-mb-md"
          >
            <template #append>
              <q-icon
                :name="showPasswordActual ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPasswordActual = !showPasswordActual"
              />
            </template>
          </q-input>

          <q-input
            filled
            v-model="nuevaPassword"
            :type="showNuevaPassword ? 'text' : 'password'"
            label="Nueva contraseña"
          >
            <template #append>
              <q-icon
                :name="showNuevaPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showNuevaPassword = !showNuevaPassword"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="cambiarPassword" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogCambiarFoto">
      <q-card>
        <q-card-section>
          <div class="text-h6">Cambiar foto de perfil</div>
          <q-uploader
            label="Selecciona una foto"
            accept="image/*"
            :auto-upload="false"
            @added="onFileAdded"
          />

          <div v-if="previewFoto" class="q-mt-md">
            <div>Previsualización:</div>
            <img :src="previewFoto" style="max-width: 100%; border-radius: 8px" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="cambiarFoto" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { provide } from 'vue'
import { useEmptyLayout } from 'src/composables/pages/useEmptyLayout'
import EmptyLayoutSection2 from 'src/components/sections/EmptyLayout/EmptyLayoutSection2.vue'
const state = useEmptyLayout()
provide('EmptyLayout', state)
const {
  sidebarOpen,
  hoverLogout,
  dialogCambiarPassword,
  dialogCambiarFoto,
  passwordActual,
  nuevaPassword,
  showPasswordActual,
  showNuevaPassword,
  previewFoto,
  onFileAdded,
  cambiarFoto,
  cambiarPassword,
  cerrarSesion,
} = state
</script>

<style scoped src="src/css/pages/EmptyLayout.css" />
