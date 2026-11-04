import { userStorage } from 'src/utils/userStorage'
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api, { clearApiCache } from 'src/boot/api'
import { useRouter } from 'vue-router'

export function useRegistroUsuarioDetalle() {
  const router = useRouter()
  const abrirModal = ref(false)
  const nuevaPassword = ref('')
  const passwordActual = ref('')
  const guardandoPassword = ref(false)
  const confirmarPassword = ref('')
  const loading = ref(false)

  const form = ref({
    User: '',
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
    if (guardandoPassword.value) return
    if (
      !passwordActual.value ||
      !nuevaPassword.value ||
      nuevaPassword.value !== confirmarPassword.value
    ) {
      Notify.create({
        type: 'warning',
        message: 'Escribe la contraseña actual y confirma la nueva.',
      })
      return
    }
    if (!form.value.User) {
      Notify.create({ type: 'negative', message: 'No se encontró el usuario actual' })
      return
    }

    guardandoPassword.value = true
    try {
      await api.put(`/Cuentas/CambiarPassword`, {
        passwordActual: passwordActual.value,
        password: nuevaPassword.value,
      })

      Notify.create({ type: 'positive', message: 'Contraseña actualizada correctamente' })
      abrirModal.value = false
      passwordActual.value = ''
      nuevaPassword.value = ''
      confirmarPassword.value = ''
      userStorage.removeItem('token')
      clearApiCache()
      await router.push('/login')
    } catch (err) {
      console.error('error catastrofico', err)
      Notify.create({ type: 'negative', message: 'Error al cambiar contraseña' })
    } finally {
      guardandoPassword.value = false
    }
  }
  return {
    abrirModal,
    nuevaPassword,
    passwordActual,
    guardandoPassword,
    confirmarPassword,
    loading,
    form,
    unidades,
    entidad,
    registrarUsuario,
    cambiarPassword,
  }
}
