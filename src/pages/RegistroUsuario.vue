<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="registrarUsuario" class="q-gutter-md">
      <q-card flat bordered class="q-pa-lg" style="max-width: 1200px; height: 550px; margin: auto">
        <q-card-section>
          <div class="text-h5 text-center text-primary">Registro de Usuario</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Primera fila -->
            <div class="col-6">
              <q-input v-model="form.user" label="Usuario" filled stack-label required>
                <template #prepend><q-icon name="person" /></template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input
                v-model="form.password"
                label="Contraseña"
                type="text"
                filled
                stack-label
                required
              >
                <template #prepend><q-icon name="lock" /></template>
              </q-input>
            </div>

            <div class="col-6">
              <q-select
                v-model="form.rol"
                :options="roles"
                label="Rol"
                option-label="label"
                option-value="value"
                filled
                stack-label
                emit-value
                map-options
                required
              >
                <template #prepend><q-icon name="security" /></template>
              </q-select>
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

            <div class="col-6">
              <q-select
                v-model="form.EntidadId"
                :options="entidad"
                label="Entidad Federal"
                option-value="id"
                option-label="nombre"
                filled
                stack-label
                emit-value
                map-options
                required
              >
                <template #prepend><q-icon name="apartment" /></template>
              </q-select>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Registrar" color="primary" type="submit" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

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
    console.error('❌ Error al registrar usuario:', error)
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
.q-page {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
