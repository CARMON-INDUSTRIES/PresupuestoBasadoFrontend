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

        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <q-input v-model="form.user" label="Usuario" filled stack-label required>
                <template #prepend>
                  <q-icon name="person" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.password"
                label="Contraseña"
                :type="mostrarPasswordRegistro ? 'text' : 'password'"
                filled
                stack-label
                required
              >
                <template #prepend>
                  <q-icon name="lock" color="primary" />
                </template>

                <template #append>
                  <q-icon
                    :name="mostrarPasswordRegistro ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="mostrarPasswordRegistro = !mostrarPasswordRegistro"
                  />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.rol"
                :options="roles"
                label="Rol"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                filled
                stack-label
                required
              >
                <template #prepend>
                  <q-icon name="security" color="primary" />
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.unidadAdministrativaId"
                :options="unidades"
                label="Unidad Administrativa"
                option-value="id"
                option-label="unidad"
                emit-value
                map-options
                filled
                stack-label
                required
              >
                <template #prepend>
                  <q-icon name="domain" color="primary" />
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-select
                v-model="form.EntidadId"
                :options="entidad"
                label="Entidad Federal"
                option-value="id"
                option-label="nombre"
                emit-value
                map-options
                filled
                stack-label
                required
              >
                <template #prepend>
                  <q-icon name="apartment" color="primary" />
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>

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
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const mostrarPassword = ref(false)
const mostrarPasswordRegistro = ref(false)

const form = ref({
  user: '',
  password: '',
  rol: '',
  unidadAdministrativaId: null,
  EntidadId: null,
})

const roles = [
  { label: 'Administador', value: 'Administador' },
  { label: 'Usuario', value: 'Usuario' },
]

const unidades = ref([])
const entidad = ref([])
const loading = ref(false)

const mostrarLogin = ref(true)
const passwordAcceso = ref('')

const PASSWORD_CORRECTA = 'Wishyouwerehere.1950'

function validarAcceso() {
  if (passwordAcceso.value === PASSWORD_CORRECTA) {
    mostrarLogin.value = false
  } else {
    Notify.create({
      type: 'negative',
      message: 'Contraseña incorrecta',
    })
  }
}

onMounted(async () => {
  try {
    const res = await api.get('/UnidadAdministrativa')
    unidades.value = res.data
  } catch (error) {
    console.error('Error al cargar unidades:', error)
  }

  try {
    const ent = await api.get('/Entidad')
    entidad.value = ent.data
  } catch (error) {
    console.error('Error al cargar entidades:', error)
  }
})

async function registrarUsuario() {
  loading.value = true
  try {
    await api.post('/Cuentas/Registro', form.value)
    Notify.create({ type: 'positive', message: 'Usuario registrado exitosamente' })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al registrar',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.registro-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background: linear-gradient(135deg, #691b31 0%, #7f2944 50%, #8f3651 100%);
}

.registro-card {
  width: 100%;
  max-width: 1100px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

.login-dialog {
  min-width: 420px;
  border-radius: 18px;
}

.registrar-btn {
  min-width: 260px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 12px 30px;
  transition: all 0.3s ease;
}

.registrar-btn:hover {
  transform: translateY(-2px);
}

:deep(.q-field--filled .q-field__control) {
  border-radius: 12px;
}

:deep(.q-select),
:deep(.q-input) {
  transition: all 0.25s ease;
}

:deep(.q-select:hover),
:deep(.q-input:hover) {
  transform: translateY(-1px);
}

.text-primary {
  color: #691b31 !important;
}

@media (max-width: 768px) {
  .registro-card {
    margin: 10px;
  }

  .login-dialog {
    min-width: 90%;
  }

  .registrar-btn {
    width: 100%;
  }
}
</style>
