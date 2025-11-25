<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-lg" style="max-width: 1200px; margin: auto">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6 text-primary">Usuario: {{ form.user }}</div>
          <q-btn
            color="secondary"
            label="Cambiar contraseña"
            @click="abrirModal = true"
            icon="lock_reset"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="registrarUsuario" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-4">
              <q-input v-model="form.NuevoUserName" label="Nombre de Usuario" filled stack-label>
                <template #prepend><q-icon name="person" /></template>
              </q-input>
            </div>

            <div class="col-4">
              <q-input
                v-model="form.email"
                label="Correo electrónico"
                type="email"
                filled
                stack-label
              >
                <template #prepend><q-icon name="mail" /></template>
              </q-input>
            </div>

            <div class="col-4">
              <q-input v-model="form.nombreCompleto" label="Nombre completo" filled stack-label>
                <template #prepend><q-icon name="badge" /></template>
              </q-input>
            </div>

            <div class="col-4">
              <q-input v-model="form.cargo" label="Cargo" filled stack-label>
                <template #prepend><q-icon name="work" /></template>
              </q-input>
            </div>

            <div class="col-4">
              <q-input v-model="form.coordinador" label="Coordinador" filled stack-label>
                <template #prepend><q-icon name="badge" /></template>
              </q-input>
            </div>

            <div class="col-4">
              <q-input
                v-model="form.unidadesPresupuestales"
                label="Unidades Presupuestales"
                filled
                stack-label
              >
                <template #prepend><q-icon name="domain" /></template>
              </q-input>
            </div>

            <div class="col-4">
              <q-input
                v-model="form.programaPresupuestario"
                label="Programa Presupuestario"
                filled
                stack-label
              >
                <template #prepend><q-icon name="assignment" /></template>
              </q-input>
            </div>

            <div class="col-4">
              <q-input v-model="form.nombreMatriz" label="Nombre Matriz" filled stack-label>
                <template #prepend><q-icon name="description" /></template>
              </q-input>
            </div>
          </div>

          <div class="col-6">
            <q-select
              v-model="form.unidadAdministrativaId"
              :options="unidades"
              label="Unidad Administrativa"
              option-value="id"
              option-label="unidad"
              filled
              stack-label
              emit-value
              map-options
              required
            >
              <template #prepend><q-icon name="domain" /></template>
            </q-select>
          </div>

          <q-card-actions align="right">
            <q-btn label="Registrar" color="primary" type="submit" :loading="loading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>

    <q-dialog v-model="abrirModal">
      <q-card style="width: 400px">
        <q-card-section class="text-h6 text-center"> Cambiar contraseña </q-card-section>
        <q-item-label>ㅤㅤ­Incluya mayuscula, numeros y un carácter especial</q-item-label>
        <q-card-section>
          <q-input
            v-model="nuevaPassword"
            type="password"
            label="Nueva contraseña"
            filled
            stack-label
          />
          <br />
          <q-input
            v-model="confirmarPassword"
            type="password"
            label="Confirmar contraseña"
            filled
            stack-label
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn
            label="Guardar"
            color="primary"
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
    const datosBasicos = localStorage.getItem('usuarioBasico')
    if (datosBasicos) {
      const datos = JSON.parse(datosBasicos)

      Object.assign(form.value, datos)

      if (datos.user && !form.value.User) {
        form.value.User = datos.user
      }
    }

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
      'usuarioBasico',
      JSON.stringify({
        ...form.value,
        User: form.value.NuevoUserName || form.value.User,
      }),
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
