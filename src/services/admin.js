import api from 'src/boot/api'

export const consultarAdmin = (ruta, params = {}) =>
  api.get(`/admin/${ruta}`, { cache: false, params })

export function errorAdmin(error) {
  if (error.response?.status === 401) return 'La sesión venció. Inicia sesión nuevamente.'
  if (error.response?.status === 403) return 'Tu cuenta no tiene permiso de administrador.'
  if (error.response?.status === 404)
    return 'El usuario ya no está disponible o falta actualizar la API.'
  if (error.response?.status === 400) {
    const data = error.response.data
    if (typeof data === 'string') return data
    if (typeof data?.message === 'string') return data.message
    if (Array.isArray(data))
      return (
        data
          .map((e) => e.description)
          .filter(Boolean)
          .join(' ') || 'Revisa los datos.'
      )
    if (data?.errors) return Object.values(data.errors).flat().join(' ')
  }
  return 'No se pudo completar la operación. Intenta nuevamente.'
}

export const fechaAdmin = (valor) =>
  valor ? new Date(valor).toLocaleString('es-MX') : 'Sin registro'
