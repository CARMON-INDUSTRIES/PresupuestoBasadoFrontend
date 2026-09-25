import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useRegistroUsuario() {
  const mostrarPassword = ref(false)
  const mostrarPasswordRegistro = ref(false)

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

  const mostrarLogin = ref(true)
  const passwordAcceso = ref('')

  const PASSWORD_CORRECTA = 'Wishyouwerehere.1950'

  function validarAcceso() {
    if (passwordAcceso.value === PASSWORD_CORRECTA) {
      mostrarLogin.value = false
    } else {
      Notify.create({
        type: 'negative',
        message: 'Contraseña incorrecta',
      })
    }
  }

  onMounted(async () => {
    const results = await Promise.allSettled([
      api.get('/UnidadAdministrativa'),
      api.get('/Entidad'),
    ])
    if (results[0].status === 'fulfilled') unidades.value = results[0].value.data
    if (results[1].status === 'fulfilled') entidad.value = results[1].value.data
  })

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
    mostrarPassword,
    mostrarPasswordRegistro,
    form,
    roles,
    unidades,
    entidad,
    loading,
    mostrarLogin,
    passwordAcceso,
    PASSWORD_CORRECTA,
    validarAcceso,
    registrarUsuario,
  }
}
