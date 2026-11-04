<template>
  <div class="q-gutter-md">
    <div>
      Estado: <strong>{{ usuario.activa ? 'Activa' : 'Deshabilitada' }}</strong>
    </div>
    <div>Rol actual: {{ usuario.roles?.join(', ') || 'Sin rol' }}</div>
    <div class="row items-center q-gutter-sm">
      <q-select
        v-model="rol"
        :options="['Usuario', 'Administrador']"
        label="Nuevo rol"
        style="min-width: 200px"
        :disable="ocupado"
      />
      <q-btn
        label="Actualizar rol"
        color="primary"
        :disable="ocupado || !rol"
        @click="accion = 'rol'"
      />
      <q-btn
        :label="usuario.activa ? 'Desactivar cuenta' : 'Activar cuenta'"
        outline
        :disable="ocupado"
        @click="accion = 'estado'"
      />
    </div>
    <q-banner v-if="error" role="alert" class="bg-red-1 text-negative">{{ error }}</q-banner>
    <PasswordUsuarioAdmin :usuario="usuario" @guardado="emit('guardado')" @ocupado="ocupacion" />
    <q-dialog :model-value="!!accion" persistent>
      <q-card>
        <q-card-section class="text-h6">Confirmar cambio de {{ usuario.userName }}</q-card-section>
        <q-card-section>{{
          accion === 'rol'
            ? `Se reemplazarán sus roles por ${rol}.`
            : usuario.activa
              ? 'La cuenta no podrá acceder al sistema y sus sesiones se cerrarán.'
              : 'La cuenta podrá iniciar sesión nuevamente.'
        }}</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" :disable="ocupado" @click="accion = ''" />
          <q-btn color="primary" label="Confirmar" :loading="ocupado" @click="guardar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'
import { errorAdmin } from 'src/services/admin'
import PasswordUsuarioAdmin from './PasswordUsuarioAdmin.vue'
const props = defineProps({ usuario: { type: Object, required: true } })
const emit = defineEmits(['guardado', 'ocupado'])
const rol = ref(props.usuario.roles?.[0] || 'Usuario')
const accion = ref(''),
  error = ref(''),
  ocupado = ref(false)
function ocupacion(valor) {
  ocupado.value = valor
  emit('ocupado', valor)
}
async function guardar() {
  if (ocupado.value || !accion.value) return
  ocupacion(true)
  error.value = ''
  try {
    if (accion.value === 'rol')
      await api.put('/Cuentas/ActualizarRol', { user: props.usuario.userName, rol: rol.value })
    else
      await api.put(`/admin/usuarios/${encodeURIComponent(props.usuario.id)}/estado`, {
        activa: !props.usuario.activa,
      })
    Notify.create({ type: 'positive', message: 'Acceso actualizado.' })
    emit('guardado')
  } catch (e) {
    error.value = errorAdmin(e)
  } finally {
    accion.value = ''
    ocupacion(false)
  }
}
</script>
