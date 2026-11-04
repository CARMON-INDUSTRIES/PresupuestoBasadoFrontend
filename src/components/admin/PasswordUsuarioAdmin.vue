<template>
  <q-expansion-item label="Restablecer contraseña" icon="lock_reset">
    <q-form class="q-pa-md q-gutter-sm" @submit="restablecer">
      <p>
        Asigna una contraseña nueva y comunícala al usuario por un medio privado. Sus sesiones
        anteriores se cerrarán.
      </p>
      <q-input
        v-model="password"
        type="password"
        autocomplete="new-password"
        label="Nueva contraseña"
        maxlength="128"
        :disable="guardando"
        :rules="[(v) => v.length >= 6 || 'Mínimo 6 caracteres']"
      />
      <q-input
        v-model="confirmacion"
        type="password"
        autocomplete="new-password"
        label="Repetir contraseña"
        maxlength="128"
        :disable="guardando"
        :rules="[(v) => v === password || 'Las contraseñas no coinciden']"
      />
      <q-checkbox
        v-model="confirmado"
        :disable="guardando"
        :label="`Confirmo restablecer el acceso de ${usuario.userName}`"
      />
      <q-banner v-if="error" role="alert" class="bg-red-1 text-negative">{{ error }}</q-banner>
      <q-btn
        type="submit"
        label="Restablecer"
        color="primary"
        :loading="guardando"
        :disable="!confirmado"
      />
    </q-form>
  </q-expansion-item>
</template>
<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'
import { errorAdmin } from 'src/services/admin'
const props = defineProps({ usuario: { type: Object, required: true } })
const emit = defineEmits(['guardado', 'ocupado'])
const password = ref(''),
  confirmacion = ref(''),
  error = ref('')
const confirmado = ref(false),
  guardando = ref(false)
async function restablecer() {
  if (
    guardando.value ||
    !confirmado.value ||
    password.value.length < 6 ||
    password.value !== confirmacion.value
  )
    return
  guardando.value = true
  emit('ocupado', true)
  error.value = ''
  try {
    await api.post(`/admin/usuarios/${encodeURIComponent(props.usuario.id)}/restablecer-password`, {
      nuevaPassword: password.value,
    })
    Notify.create({
      type: 'positive',
      message: 'Contraseña restablecida. El usuario debe iniciar sesión nuevamente.',
    })
    confirmado.value = false
    emit('guardado')
  } catch (e) {
    error.value = errorAdmin(e)
  } finally {
    password.value = ''
    confirmacion.value = ''
    guardando.value = false
    emit('ocupado', false)
  }
}
</script>
