<template>
  <q-page padding>
    <div class="row items-center q-gutter-sm q-mb-md">
      <div class="col">
        <h1 class="text-h5 q-my-none">Administración</h1>
        <p class="text-grey-7 q-mb-none">Usuarios, registros y actividad del sistema.</p>
      </div>
      <q-btn
        outline
        color="primary"
        icon="person_add"
        label="Registrar usuario"
        to="/registro-usuario"
      />
      <q-btn
        flat
        icon="refresh"
        label="Actualizar resumen"
        :loading="cargando"
        @click="cargarResumen"
      />
    </div>
    <q-banner v-if="error" class="bg-red-1 text-negative q-mb-md" role="alert">{{
      error
    }}</q-banner>
    <div class="row q-col-gutter-md q-mb-md">
      <div v-for="tarjeta in tarjetas" :key="tarjeta.key" class="col-12 col-sm-4">
        <q-card flat bordered
          ><q-card-section>
            <div class="text-grey-7">{{ tarjeta.label }}</div>
            <div class="text-h4">{{ resumen?.[tarjeta.key] ?? '—' }}</div>
          </q-card-section></q-card
        >
      </div>
    </div>
    <p class="text-caption text-grey-7">
      Los accesos y modificaciones se cuentan desde la implementación de la auditoría. Primer
      evento: {{ fechaAdmin(resumen?.primerEventoUtc) }}.
    </p>
    <UsuariosAdmin @actualizado="cargarResumen" />
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import UsuariosAdmin from 'src/components/admin/UsuariosAdmin.vue'
import { consultarAdmin, errorAdmin, fechaAdmin } from 'src/services/admin'
const resumen = ref(null)
const error = ref('')
const cargando = ref(false)
const tarjetas = [
  { key: 'usuarios', label: 'Usuarios registrados' },
  { key: 'accesos', label: 'Accesos registrados' },
  { key: 'modificaciones', label: 'Modificaciones registradas' },
]
async function cargarResumen() {
  if (cargando.value) return
  cargando.value = true
  error.value = ''
  try {
    resumen.value = (await consultarAdmin('resumen')).data
  } catch (e) {
    error.value = errorAdmin(e)
  } finally {
    cargando.value = false
  }
}
onMounted(cargarResumen)
</script>
