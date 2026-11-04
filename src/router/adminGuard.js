import api from 'src/boot/api'
import { Notify } from 'quasar'

export async function verificarAdministrador() {
  try {
    const { data } = await api.get('/Cuentas/me', { cache: false })
    if (data.roles?.includes('Administrador')) return true
    Notify.create({
      type: 'negative',
      message: 'Esta sección requiere una cuenta de administrador.',
    })
    return '/formulario-alineacion'
  } catch (error) {
    if (error.response?.status === 401) return '/login'
    Notify.create({
      type: 'negative',
      message: 'No se pudieron verificar los permisos. Intenta nuevamente.',
    })
    return false
  }
}
