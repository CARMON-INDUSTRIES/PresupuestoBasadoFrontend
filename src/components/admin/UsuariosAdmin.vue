<template>
  <q-card flat bordered>
    <q-card-section>
      <q-form class="row items-center q-gutter-sm" @submit="buscarUsuarios">
        <q-input
          v-model="buscar"
          class="col"
          outlined
          dense
          maxlength="100"
          label="Buscar por usuario o nombre"
          :disable="cargando"
        />
        <q-btn type="submit" label="Buscar" color="primary" :loading="cargando" />
      </q-form>
    </q-card-section>
    <q-banner v-if="error" class="bg-red-1 text-negative" role="alert">
      {{ error }}
      <template #action
        ><q-btn flat label="Reintentar" :disable="cargando" @click="cargar()"
      /></template>
    </q-banner>
    <q-table
      title="Usuarios"
      row-key="id"
      :rows="usuarios"
      :columns="columnas"
      :loading="cargando"
      v-model:pagination="paginacion"
      :rows-per-page-options="[15]"
      no-data-label="No hay usuarios que coincidan con la búsqueda"
      @request="cargar"
    >
      <template #body-cell-acciones="props">
        <q-td :props="props"
          ><q-btn
            flat
            color="primary"
            label="Ver detalle"
            :aria-label="`Ver detalle de ${props.row.userName}`"
            @click="seleccionado = props.row"
        /></q-td>
      </template>
    </q-table>
  </q-card>
  <DetalleUsuarioAdmin
    v-if="seleccionado"
    :key="seleccionado.id"
    :usuario="seleccionado"
    @cerrar="seleccionado = null"
    @guardado="actualizar"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { consultarAdmin, errorAdmin, fechaAdmin } from 'src/services/admin'
import DetalleUsuarioAdmin from './DetalleUsuarioAdmin.vue'
const emit = defineEmits(['actualizado'])
const usuarios = ref([])
const seleccionado = ref(null)
const buscar = ref('')
const busquedaAplicada = ref('')
const error = ref('')
const cargando = ref(false)
const paginacion = ref({ page: 1, rowsPerPage: 15, rowsNumber: 0 })
const columnas = [
  { name: 'usuario', label: 'Usuario', field: 'userName', align: 'left' },
  { name: 'nombre', label: 'Nombre', field: 'nombreCompleto', align: 'left' },
  { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left' },
  {
    name: 'estado',
    label: 'Estado',
    field: 'activa',
    format: (v) => (v ? 'Activa' : 'Deshabilitada'),
  },
  { name: 'rol', label: 'Rol', field: 'roles', format: (v) => v?.join(', ') || 'Sin rol' },
  { name: 'unidad', label: 'Unidad administrativa', field: 'unidadAdministrativa', align: 'left' },
  { name: 'programa', label: 'Programa', field: 'programaPresupuestario', align: 'left' },
  { name: 'accesos', label: 'Accesos', field: 'accesos' },
  { name: 'ultimo', label: 'Último acceso', field: 'ultimoAcceso', format: fechaAdmin },
  {
    name: 'modificado',
    label: 'Última modificación',
    field: 'ultimaModificacion',
    format: fechaAdmin,
  },
  { name: 'acciones', label: 'Acciones', field: 'id' },
]
async function cargar({ pagination = paginacion.value } = {}) {
  if (cargando.value) return
  cargando.value = true
  error.value = ''
  try {
    const { data } = await consultarAdmin('usuarios', {
      buscar: busquedaAplicada.value,
      pagina: pagination.page,
      cantidad: pagination.rowsPerPage,
    })
    usuarios.value = data.items
    if (seleccionado.value)
      seleccionado.value =
        data.items.find((u) => u.id === seleccionado.value.id) || seleccionado.value
    paginacion.value = { ...pagination, rowsNumber: data.total }
  } catch (e) {
    error.value = errorAdmin(e)
  } finally {
    cargando.value = false
  }
}
function buscarUsuarios() {
  if (cargando.value) return
  busquedaAplicada.value = buscar.value.trim()
  cargar({ pagination: { ...paginacion.value, page: 1 } })
}
function actualizar() {
  cargar()
  emit('actualizado')
}
onMounted(() => cargar())
</script>
