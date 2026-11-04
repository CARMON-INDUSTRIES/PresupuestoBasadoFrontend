<template>
  <q-dialog :model-value="true" persistent @hide="emit('cerrar')">
    <q-card style="width: 1000px; max-width: 95vw">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ usuario.userName }}</div>
        <q-space /><q-btn
          flat
          label="Cerrar"
          :disable="ocupado || guardando"
          @click="emit('cerrar')"
        />
      </q-card-section>
      <q-tabs v-model="tab" :disable="ocupado || guardando" align="left" active-color="primary">
        <q-tab name="perfil" label="Datos" :disable="ocupado || guardando" />
        <q-tab name="acceso" label="Acceso" :disable="ocupado || guardando" />
        <q-tab name="avance" label="Avance" :disable="ocupado || guardando" />
        <q-tab name="pdf" label="PDF" :disable="ocupado || guardando" />
        <q-tab name="actividad" label="Historial" :disable="ocupado || guardando" />
      </q-tabs>
      <q-tab-panels v-model="tab" keep-alive>
        <q-tab-panel name="perfil">
          <div class="q-mb-md">
            Unidad administrativa: {{ usuario.unidadAdministrativa || 'Sin registrar' }}<br />
            Programa: {{ usuario.programaPresupuestario || 'Sin registrar' }}<br />
            Última modificación: {{ fechaAdmin(usuario.ultimaModificacion) }}
          </div>
          <q-form class="q-gutter-md" @submit="guardar">
            <q-input
              v-model="nombre"
              label="Nombre completo"
              maxlength="200"
              :rules="[requerido]"
              :disable="guardando"
            />
            <q-input
              v-model="cargo"
              label="Cargo"
              maxlength="150"
              :rules="[requerido]"
              :disable="guardando"
            />
            <q-btn
              type="submit"
              label="Guardar datos"
              color="primary"
              :loading="guardando"
              :disable="!cambios"
            />
          </q-form>
          <q-banner v-if="error" role="alert" class="bg-red-1 text-negative q-mt-sm">{{
            error
          }}</q-banner>
        </q-tab-panel>
        <q-tab-panel name="acceso"
          ><AccesoUsuarioAdmin
            :usuario="usuario"
            @guardado="actualizar"
            @ocupado="ocupado = $event"
        /></q-tab-panel>
        <q-tab-panel name="avance"><AvanceUsuarioAdmin :usuario-id="usuario.id" /></q-tab-panel>
        <q-tab-panel name="pdf"
          ><PdfUsuarioAdmin :usuario="usuario" @guardado="actualizar" @ocupado="ocupado = $event"
        /></q-tab-panel>
        <q-tab-panel name="actividad"
          ><ActividadUsuarioAdmin :key="revision" :usuario-id="usuario.id"
        /></q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, ref } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'
import { errorAdmin, fechaAdmin } from 'src/services/admin'
import ActividadUsuarioAdmin from './ActividadUsuarioAdmin.vue'
import AccesoUsuarioAdmin from './AccesoUsuarioAdmin.vue'
import AvanceUsuarioAdmin from './AvanceUsuarioAdmin.vue'
import PdfUsuarioAdmin from './PdfUsuarioAdmin.vue'
const props = defineProps({ usuario: { type: Object, required: true } })
const emit = defineEmits(['cerrar', 'guardado'])
const tab = ref('perfil'),
  ocupado = ref(false)
const nombre = ref(props.usuario.nombreCompleto || '')
const cargo = ref(props.usuario.cargo || '')
const guardado = ref({ nombre: nombre.value, cargo: cargo.value })
const cambios = computed(
  () =>
    nombre.value.trim() !== guardado.value.nombre || cargo.value.trim() !== guardado.value.cargo,
)
const error = ref(''),
  guardando = ref(false),
  revision = ref(0)
const requerido = (v) => !!v?.trim() || 'Campo obligatorio'
function actualizar() {
  revision.value++
  emit('guardado')
}
async function guardar() {
  if (guardando.value || !cambios.value) return
  guardando.value = true
  error.value = ''
  try {
    await api.put(`/admin/usuarios/${encodeURIComponent(props.usuario.id)}`, {
      nombreCompleto: nombre.value.trim(),
      cargo: cargo.value.trim(),
    })
    guardado.value = { nombre: nombre.value.trim(), cargo: cargo.value.trim() }
    actualizar()
    Notify.create({ type: 'positive', message: 'Datos actualizados.' })
  } catch (e) {
    error.value = errorAdmin(e)
  } finally {
    guardando.value = false
  }
}
</script>
