import { userStorage } from 'src/utils/userStorage'
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useRegistroUsuarioDetalle() {
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
      const userNameActual = userStorage.getItem('userNameActual')

      if (userNameActual) {
        try {
          form.value.User = JSON.parse(userNameActual)
        } catch {
          form.value.User = userNameActual
        }
      }

      userStorage.removeItem('usuarioBasico')

      await Promise.all([
        api.get('/UnidadAdministrativa').then((r) => {
          unidades.value = r.data
        }),
        api.get('/Entidad').then((r) => {
          entidad.value = r.data
        }),
        api.get('/Cuentas/me').then(({ data }) => {
          form.value = { ...form.value, ...data, User: data.userName || form.value.User }
        }),
      ])
    } catch (err) {
      console.error('Error cargando datos:', err)
      Notify.create({
        type: 'negative',
        message: 'No se pudo cargar parte de la información. Recarga para reintentar.',
      })
    }
  })

  async function registrarUsuario() {
    if (loading.value) return
    if (!form.value.User) {
      Notify.create({ type: 'negative', message: 'No se encontró el usuario actual' })
      return
    }

    loading.value = true
    try {
      await api.put('/Cuentas/ActualizarPerfil', form.value)

      Notify.create({ type: 'positive', message: 'Usuario actualizado exitosamente' })

      userStorage.setItem('userNameActual', form.value.User)
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
  return {
    abrirModal,
    nuevaPassword,
    confirmarPassword,
    loading,
    form,
    unidades,
    entidad,
    registrarUsuario,
    cambiarPassword,
  }
}
