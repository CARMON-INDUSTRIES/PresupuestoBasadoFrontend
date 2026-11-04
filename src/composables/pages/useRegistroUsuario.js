import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useRegistroUsuario() {
  const mostrarPasswordRegistro = ref(false)

  const form = ref({
    user: '',
    password: '',
    rol: '',
    unidadAdministrativaId: null,
    EntidadId: null,
  })

  const roles = [
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Usuario', value: 'Usuario' },
  ]

  const unidades = ref([])
  const entidad = ref([])
  const loadingUnidades = ref(false)
  const loadingEntidad = ref(false)
  const loading = ref(false)

  onMounted(async () => {
    await Promise.all([
      cargarCatalogo('/UnidadAdministrativa', unidades, loadingUnidades),
      cargarCatalogo('/Entidad', entidad, loadingEntidad),
    ])
  })

  async function cargarCatalogo(url, target, busy) {
    busy.value = true
    try {
      target.value = (await api.get(url)).data
    } catch {
      Notify.create({
        type: 'negative',
        message: `No se pudo cargar ${url.slice(1)}. Recarga para reintentar.`,
      })
    } finally {
      busy.value = false
    }
  }

  async function registrarUsuario() {
    if (loading.value) return
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
  return {
    mostrarPasswordRegistro,
    form,
    roles,
    unidades,
    entidad,
    loadingUnidades,
    loadingEntidad,
    loading,
    registrarUsuario,
  }
}
