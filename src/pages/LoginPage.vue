<template>
  <q-page class="q-pa-none flex items-center justify-center login-page">
    <q-card flat class="row no-wrap login-card">
      <!-- Columna izquierda (formulario) -->
      <div class="col-5 flex flex-center form-side q-pa-xl">
        <q-form @submit.prevent="handleLogin" style="width: 100%; max-width: 320px">
          <!-- Logo -->
          <div class="flex flex-center q-mb-md">
            <q-img src="/images/smg.png" position="50% 50%" style="width: 100%; height: 100%" />
          </div>

          <!-- Título -->
          <div class="text-h5 text-dark text-bold text-center q-mb-sm">Iniciar Sesión</div>
          <div class="text-caption text-grey-7 text-center q-mb-lg">
            Bienvenido, ingresa tus credenciales para continuar
          </div>

          <!-- Inputs -->
          <q-input
            v-model="login.user"
            label="Usuario"
            filled
            dense
            class="q-mb-md custom-input"
            @keyup.enter="handleLogin"
          >
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
            @keyup.enter="handleLogin"
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

          <!-- Botón login -->
          <q-btn
            label="Ingresar"
            unelevated
            class="full-width custom-btn"
            type="submit"
            :loading="loading"
          />
        </q-form>
      </div>

      <!-- Columna derecha (imagen decorativa) -->
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()
const login = ref({ user: '', password: '' })
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  if (!login.value.user || !login.value.password) {
    Notify.create({
      type: 'warning',
      message: 'Por favor ingresa usuario y contraseña',
    })
    return
  }

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
.login-page {
  min-height: 100vh;
  background: url('/images/bien.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  max-width: 900px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.25),
    0 4px 10px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-side {
  background: rgba(255, 255, 255, 0.95);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.img-side {
  background: #fff;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.custom-input :deep(.q-field__control:hover),
.custom-input :deep(.q-field__control:focus-within) {
  box-shadow: 0 0 0 2px rgba(105, 27, 49, 0.4);
}

.custom-btn {
  border-radius: 12px;
  font-weight: bold;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #691b31, #8e2a4d);
  color: #fff;
  box-shadow: 0 4px 12px rgba(105, 27, 49, 0.3);
  transition: all 0.2s ease;
}

.custom-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(105, 27, 49, 0.4);
}
</style>
