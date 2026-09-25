import { userStorage } from 'src/utils/userStorage'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api, { clearApiCache } from 'src/boot/api'
import { guardarFormulariosPendientes } from 'src/composables/useFormularioPersistente'
import { Notify } from 'quasar'

export function useEmptyLayout() {
  const router = useRouter()
  const sidebarOpen = ref(false)
  const hoverLogout = ref(false)
  const nombreUsuario = ref('')
  const fotoActual = ref('/images/default-avatar.png') // imagen por defecto

  const dialogCambiarPassword = ref(false)
  const dialogCambiarFoto = ref(false)

  const passwordActual = ref('')
  const nuevaPassword = ref('')

  const showPasswordActual = ref(false)
  const showNuevaPassword = ref(false)

  const nuevaFoto = ref(null)
  const previewFoto = ref(null)

  onMounted(async () => {
    try {
      const { data } = await api.get('/Cuentas/me')
      nombreUsuario.value = data.userName || data.nombre || 'Usuario'

      if (data.fotoUrl) {
        // Si la URL empieza con "/uploads/", se concatena el dominio del backend
        if (data.fotoUrl.startsWith('/uploads/')) {
          fotoActual.value = `${import.meta.env.VITE_API_URL}${data.fotoUrl}`
        } else {
          fotoActual.value = data.fotoUrl
        }
      }
    } catch (err) {
      console.error('Error al obtener usuario:', err)
      nombreUsuario.value = 'Invitado'
    }
  })

  function onFileAdded(files) {
    const file = Array.isArray(files) ? files[0] : files?.files?.[0] || files[0]

    if (file) {
      nuevaFoto.value = file
      previewImage(file)
    } else {
      console.warn('No se detectó archivo al agregar.')
    }
  }

  function previewImage(file) {
    if (file && file instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewFoto.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  async function cambiarFoto() {
    if (!nuevaFoto.value) {
      Notify.create({ type: 'negative', message: 'Selecciona una foto primero' })
      return
    }

    try {
      const formData = new FormData()
      formData.append('User', nombreUsuario.value)
      formData.append('Foto', nuevaFoto.value)

      const { data } = await api.put('/Cuentas/ActualizarPerfil', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      Notify.create({ type: 'positive', message: 'Foto actualizada correctamente' })

      fotoActual.value = data.fotoUrl

      userStorage.setItem('fotoUsuario', data.fotoUrl)

      previewFoto.value = null
      nuevaFoto.value = null
      dialogCambiarFoto.value = false
    } catch (err) {
      console.error('Error al subir foto:', err)
      Notify.create({ type: 'negative', message: 'Error al actualizar la foto' })
    }
  }

  function goTo(ruta) {
    sidebarOpen.value = false
    router.push(ruta)
  }

  function abrirCambiarPassword() {
    dialogCambiarPassword.value = true
  }
  function abrirCambiarFoto() {
    dialogCambiarFoto.value = true
  }

  async function cambiarPassword() {
    if (!passwordActual.value || !nuevaPassword.value) {
      Notify.create({ type: 'negative', message: 'Debes completar todos los campos' })
      return
    }

    try {
      await api.put('/Cuentas/CambiarPassword', {
        User: nombreUsuario.value,
        Password: nuevaPassword.value,
      })

      dialogCambiarPassword.value = false
      passwordActual.value = ''
      nuevaPassword.value = ''
      Notify.create({ type: 'positive', message: 'Contraseña cambiada correctamente' })
    } catch (err) {
      console.error('Error al cambiar contraseña:', err)
      Notify.create({ type: 'negative', message: 'Error al cambiar contraseña' })
    }
  }

  async function cerrarSesion() {
    try {
      await guardarFormulariosPendientes()
    } catch {
      Notify.create({
        type: 'negative',
        message: 'No se pudo guardar el último cambio. Intenta de nuevo antes de cerrar sesión.',
      })
      return
    }
    try {
      await api.post('/Cuentas/logout', null, { timeout: 5000 })
    } catch {
      /* La sesión local siempre se cierra. */
    }
    userStorage.removeItem('token')
    clearApiCache()
    await router.push('/login')
  }
  return {
    router,
    sidebarOpen,
    hoverLogout,
    nombreUsuario,
    fotoActual,
    dialogCambiarPassword,
    dialogCambiarFoto,
    passwordActual,
    nuevaPassword,
    showPasswordActual,
    showNuevaPassword,
    nuevaFoto,
    previewFoto,
    onFileAdded,
    previewImage,
    cambiarFoto,
    goTo,
    abrirCambiarPassword,
    abrirCambiarFoto,
    cambiarPassword,
    cerrarSesion,
  }
}
