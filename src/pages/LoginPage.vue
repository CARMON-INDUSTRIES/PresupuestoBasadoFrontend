<template>
  <q-page class="q-pa-none" style="min-height: 100vh; display: flex">
    <!-- Lado izquierdo con imagen -->
    <div class="login-image-column">
      <q-img src="/images/login-banner.jpg" fit="cover" style="width: 100%; height: 100%" />
    </div>

    <!-- Lado derecho (formulario) -->
    <div class="login-form-column q-pa-xl flex flex-center">
      <q-card class="q-pa-lg" style="min-width: 320px; max-width: 400px; width: 100%">
        <q-card-section>
          <q-img src="/images/smg.png" style="max-width: 100%" spinner-color="#691B31" />
          <div class="text-h6 text-center">Iniciar Sesión</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="login.user" label="Usuario" filled class="q-mb-md" />
          <q-input v-model="login.password" label="Contraseña" type="password" filled />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="Ingresar" color="primary" @click="handleLogin" :loading="loading" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()
const login = ref({ user: '', password: '' })
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await api.post('/Cuentas/Login', {
      user: login.value.user,
      password: login.value.password,
    })

    const token = res.data.token
    localStorage.setItem('token', token)
    router.push('/formulario-alineacion')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Credenciales inválidas',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-image-column {
  flex: 2;
  background: #691b31;
}

.login-form-column {
  flex: 1;
  background: #f5f5f5;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
</style>
