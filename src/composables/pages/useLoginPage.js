import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api, { clearApiCache } from 'src/boot/api'
import { userStorage } from 'src/utils/userStorage'

export function useLoginPage() {
  const router = useRouter()
  const login = ref({ user: '', password: '' })
  const loading = ref(false)
  const showPassword = ref(false)
  async function handleLogin() {
    if (loading.value) return
    if (!login.value.user.trim() || !login.value.password) {
      Notify.create({ type: 'warning', message: 'Por favor ingresa usuario y contraseña' })
      return
    }
    loading.value = true
    try {
      const { data } = await api.post('/Cuentas/Login', login.value)
      if (!data.token) throw new Error('No se recibió una sesión válida')
      clearApiCache()
      localStorage.setItem('token', data.token)
      localStorage.setItem(
        'userNameActual',
        data.username || data.userName || login.value.user.trim(),
      )
      const { data: user } = await api.get('/Cuentas/me')
      localStorage.setItem(
        'userNameActual',
        user.userName || data.username || login.value.user.trim(),
      )
      const incomplete = [
        'nombreCompleto',
        'cargo',
        'unidadesPresupuestales',
        'programaPresupuestario',
        'nombreMatriz',
        'coordinador',
        'unidadAdministrativaId',
        'entidadId',
      ].some((key) => !user[key])
      const previous =
        userStorage.getItem('ultimaRutaRegistro') ||
        localStorage.getItem('ultimaRutaRegistro_' + user.userName)
      const destination =
        previous && router.resolve(previous).matched.some((r) => r.meta.requiresAuth)
          ? previous
          : '/formulario-alineacion'
      if (incomplete)
        Notify.create({ type: 'info', message: 'Completa los datos de tu perfil para continuar.' })
      await router.push(incomplete ? '/registro-usuario-detalle' : destination)
    } catch (error) {
      Notify.create({
        type: 'negative',
        message:
          error.response?.status === 401
            ? 'Credenciales inválidas'
            : 'No se pudo iniciar sesión. Comprueba tu conexión e intenta nuevamente.',
      })
    } finally {
      loading.value = false
    }
  }
  return { router, login, loading, showPassword, handleLogin }
}
