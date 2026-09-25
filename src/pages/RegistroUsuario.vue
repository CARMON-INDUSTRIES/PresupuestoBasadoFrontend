<template>
  <q-dialog v-model="mostrarLogin" persistent>
    <q-card class="login-dialog">
      <q-card-section class="text-center">
        <q-icon name="lock" size="50px" color="primary" />
        <div class="text-h6 q-mt-sm">Acceso restringido</div>
        <div class="text-caption text-grey-7">Ingrese la contraseña de administrador</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="passwordAcceso"
          label="Contraseña"
          :type="mostrarPassword ? 'text' : 'password'"
          filled
          autofocus
          @keyup.enter="validarAcceso"
        >
          <template #prepend>
            <q-icon name="lock" />
          </template>

          <template #append>
            <q-icon
              :name="mostrarPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrarPassword = !mostrarPassword"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Entrar" color="primary" rounded unelevated @click="validarAcceso" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-page class="registro-page">
    <q-form @submit.prevent="registrarUsuario" class="full-width">
      <q-card flat bordered class="registro-card">
        <q-card-section class="text-center">
          <q-icon name="person_add" size="60px" color="primary" />
          <div class="text-h4 text-weight-bold text-primary q-mt-sm">Registro de Usuario</div>
          <div class="text-subtitle2 text-grey-7">
            Alta de usuarios para el Sistema de Presupuesto Basado en Resultados
          </div>
        </q-card-section>

        <q-separator />

        <RegistroUsuarioSection1 />

        <q-card-actions align="center" class="q-pb-lg">
          <q-btn
            label="Registrar Usuario"
            icon="how_to_reg"
            color="primary"
            rounded
            unelevated
            size="lg"
            :loading="loading"
            type="submit"
            class="registrar-btn"
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useRegistroUsuario } from 'src/composables/pages/useRegistroUsuario'
import RegistroUsuarioSection1 from 'src/components/sections/RegistroUsuario/RegistroUsuarioSection1.vue'
const state = useRegistroUsuario()
provide('RegistroUsuario', state)
const { mostrarPassword, loading, mostrarLogin, passwordAcceso, validarAcceso, registrarUsuario } =
  state
</script>

<style scoped src="src/css/pages/RegistroUsuario.css" />
