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
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-4">
              <q-input v-model="form.NuevoUserName" label="Nombre de Usuario" outlined stack-label>
                <template #prepend>
                  <q-icon name="person" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="form.email"
                label="Correo Electrónico"
                type="email"
                outlined
                stack-label
              >
                <template #prepend>
                  <q-icon name="mail" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model="form.nombreCompleto" label="Nombre Completo" outlined stack-label>
                <template #prepend>
                  <q-icon name="badge" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model="form.cargo" label="Cargo" outlined stack-label>
                <template #prepend>
                  <q-icon name="work" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-input v-model="form.coordinador" label="Coordinador" outlined stack-label>
                <template #prepend>
                  <q-icon name="supervisor_account" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="form.unidadesPresupuestales"
                label="Unidades Presupuestales"
                outlined
                stack-label
              >
                <template #prepend>
                  <q-icon name="account_balance" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="form.programaPresupuestario"
                label="Programa Presupuestario"
                outlined
                stack-label
              >
                <template #prepend>
                  <q-icon name="assignment" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model="form.nombreMatriz"
                label="Programa Presupuestal"
                outlined
                stack-label
              >
                <template #prepend>
                  <q-icon name="description" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-4">
              <q-select
                v-model="form.unidadAdministrativaId"
                :options="unidades"
                label="Unidad Administrativa"
                option-value="id"
                option-label="unidad"
                emit-value
                map-options
                outlined
                stack-label
              >
                <template #prepend>
                  <q-icon name="domain" color="primary" />
                </template>
              </q-select>
            </div>
          </div>

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
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const abrirModal = ref(false)
const nuevaPassword = ref('')
const confirmarPassword = ref('')
const loading = ref(false)

const form = ref({
  User: '',
  NuevoUserName: '',
  email: '',
  nombreCompleto: '',
  cargo: '',
  coordinador: '',
  unidadesPresupuestales: '',
  programaPresupuestario: '',
  nombreMatriz: '',
  unidadAdministrativaId: null,
})

const unidades = ref([])
const entidad = ref([])

onMounted(async () => {
  try {
    const userNameActual = localStorage.getItem('userNameActual')

    if (userNameActual) {
      try {
        form.value.User = JSON.parse(userNameActual)
      } catch {
        form.value.User = userNameActual
      }
    }

    localStorage.removeItem('usuarioBasico')

    const [resUnidades, resEntidades] = await Promise.all([
      api.get('/UnidadAdministrativa'),
      api.get('/Entidad'),
    ])

    unidades.value = resUnidades.data
    entidad.value = resEntidades.data
  } catch (err) {
    console.error('Error cargando datos:', err)
  }
})

async function registrarUsuario() {
  if (!form.value.User) {
    Notify.create({ type: 'negative', message: 'No se encontró el usuario actual' })
    return
  }

  loading.value = true
  try {
    await api.put('/Cuentas/ActualizarPerfil', form.value)

    Notify.create({ type: 'positive', message: 'Usuario actualizado exitosamente' })

    localStorage.setItem(
      'userNameActual',
      JSON.stringify(form.value.NuevoUserName || form.value.User),
    )
  } catch (err) {
    console.error('error catastrofico', err)
    Notify.create({ type: 'negative', message: 'Error al actualizar usuario' })
  } finally {
    loading.value = false
  }
}

async function cambiarPassword() {
  if (!form.value.User) {
    Notify.create({ type: 'negative', message: 'No se encontró el usuario actual' })
    return
  }

  try {
    await api.put(`/Cuentas/CambiarPassword`, {
      user: form.value.User,
      password: nuevaPassword.value,
    })

    Notify.create({ type: 'positive', message: 'Contraseña actualizada correctamente' })
    abrirModal.value = false
  } catch (err) {
    console.error('error catastrofico', err)
    Notify.create({ type: 'negative', message: 'Error al cambiar contraseña' })
  }
}
</script>

<style scoped>
.perfil-page {
  background: linear-gradient(135deg, #691b31 0%, #7f1d35 100%);
  min-height: 100vh;
}

.perfil-card {
  max-width: 1200px;
  margin: auto;
  border-radius: 20px;
  background: white;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
}

.perfil-header {
  padding: 24px;
}

.guardar-btn {
  font-weight: 700;
  padding: 12px 30px;
  min-width: 220px;
}

.password-card {
  width: 450px;
  border-radius: 18px;
}

.q-field {
  margin-bottom: 10px;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 12px;
}

:deep(.q-btn) {
  transition: all 0.25s ease;
}

:deep(.q-btn:hover) {
  transform: translateY(-2px);
}

:deep(.q-card) {
  overflow: hidden;
}
</style>
