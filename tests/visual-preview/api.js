const usuario = { userName: 'Cuenta de revisión', nombreCompleto: 'Persona de prueba', roles: ['Usuario'],
  programaPresupuestario: 'Servicios comunitarios', unidadesPresupuestales: 'Desarrollo municipal',
  cargo: 'Responsable del programa', nombreMatriz: 'Servicios comunitarios' }
const ficha = { id: 1, claveIndicador: 'FIN-01', tipoIndicador: 'Estratégico', indicadores: [{
  id: 1, nivel: 'Fin', resultadoEsperado: 'Mejorar el acceso a los servicios comunitarios',
  sentido: 'Ascendente', metasProgramadas: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1, mes: i + 1, cantidad: 20, cantidadEsperada: 20, alcanzado: i < 3 ? 18 + i : 0,
  })),
}] }
export function clearApiCache() {}
export default {
  async get(url) {
    if (url === '/Cuentas/me') return { data: usuario }
    if (url === '/ProgramacionMetas/ultima') return { data: structuredClone(ficha) }
    if (url === '/FichaIndicador') return { data: [structuredClone(ficha)] }
    if (/ultimo|ultima/.test(url)) throw { response: { status: 404 } }
    return { data: [] }
  },
  async post() { throw new Error('La revisión visual no guarda ni envía datos.') },
  async put() { throw new Error('La revisión visual no guarda ni envía datos.') },
}
