<template>
  <q-page class="q-pa-none flex items-center justify-center login-page">
    <q-card flat class="row no-wrap login-card">
      <div class="col-5 flex flex-center form-side q-pa-xl">
        <q-form @submit.prevent="handleLogin" style="width: 100%; max-width: 320px">
          <div class="flex flex-center q-mb-md">
            <q-img src="/images/smg.png" position="50% 50%" style="width: 100%; height: 100%" />
          </div>

          <div class="text-h5 text-dark text-bold text-center q-mb-sm">Iniciar Sesión</div>
          <div class="text-caption text-grey-7 text-center q-mb-lg">
            Bienvenido, ingresa tus credenciales para continuar
          </div>

          <q-input v-model="login.user" label="Usuario" filled dense class="q-mb-md custom-input">
            <template v-slot:prepend>
              <q-icon name="person" color="grey-7" />
            </template>
          </q-input>

          <q-input
            v-model="login.password"
            :type="showPassword ? 'text' : 'password'"
            label="Contraseña"
            filled
            dense
            class="q-mb-lg custom-input"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="grey-7" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-btn
            label="Ingresar"
            unelevated
            class="full-width custom-btn"
            type="submit"
            :loading="loading"
          />
        </q-form>
      </div>

      <div class="col-7 img-side">
        <q-img
          src="/images/persona.jpg"
          fit="cover"
          position="90% 20%"
          style="width: 100%; height: 100%"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { useLoginPage } from 'src/composables/pages/useLoginPage'

const state = useLoginPage()
const { login, loading, showPassword, handleLogin } = state
</script>

<style scoped lang="scss" src="src/css/pages/LoginPage.scss" />
