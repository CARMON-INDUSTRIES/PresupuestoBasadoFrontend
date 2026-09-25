<template>
  <q-page padding class="perfil-page">
    <q-card flat class="perfil-card">
      <q-card-section class="perfil-header">
        <div class="row items-center justify-between">
          <div>
            <div class="text-h5 text-weight-bold text-primary">Mi Perfil</div>
            <div class="text-subtitle2 text-grey-7">Usuario: {{ form.User }}</div>
          </div>

          <q-btn
            color="secondary"
            icon="lock_reset"
            label="Cambiar contraseña"
            rounded
            unelevated
            @click="abrirModal = true"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="registrarUsuario">
          <RegistroUsuarioDetalleSection1 />

          <div class="row justify-end q-mt-xl">
            <q-btn
              label="Guardar Cambios"
              icon="save"
              color="primary"
              rounded
              unelevated
              class="guardar-btn"
              type="submit"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-dialog v-model="abrirModal">
      <q-card class="password-card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Cambiar Contraseña</div>
        </q-card-section>

        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-md">
            Incluya mayúsculas, números y un carácter especial.
          </div>

          <q-input
            v-model="nuevaPassword"
            type="password"
            label="Nueva contraseña"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model="confirmarPassword"
            type="password"
            label="Confirmar contraseña"
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            label="Guardar"
            color="primary"
            rounded
            :disable="!nuevaPassword || nuevaPassword !== confirmarPassword"
            @click="cambiarPassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useRegistroUsuarioDetalle } from 'src/composables/pages/useRegistroUsuarioDetalle'
import RegistroUsuarioDetalleSection1 from 'src/components/sections/RegistroUsuarioDetalle/RegistroUsuarioDetalleSection1.vue'
const state = useRegistroUsuarioDetalle()
provide('RegistroUsuarioDetalle', state)
const {
  abrirModal,
  nuevaPassword,
  confirmarPassword,
  loading,
  form,
  registrarUsuario,
  cambiarPassword,
} = state
</script>

<style scoped src="src/css/pages/RegistroUsuarioDetalle.css" />
