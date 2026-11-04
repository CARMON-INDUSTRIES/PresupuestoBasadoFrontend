export function evaluarMeta(meta, sentido) {
  const esperado = Number(meta.cantidadEsperada ?? meta.cantidad ?? 0)
  const alcanzado = Number(meta.alcanzado ?? 0)
  if (
    meta.alcanzado === '' ||
    !Number.isFinite(esperado) ||
    !Number.isFinite(alcanzado) ||
    esperado < 0 ||
    alcanzado < 0
  )
    return { porcentaje: null, color: 'grey', texto: 'Revisa las cantidades' }
  if (esperado === 0) return { porcentaje: null, color: 'grey', texto: 'Sin meta programada' }
  const direccion = String(sentido || '')
    .trim()
    .toLowerCase()
  if (!['ascendente', 'descendente'].includes(direccion))
    return { porcentaje: null, color: 'grey', texto: 'Falta definir el sentido' }
  const porcentaje =
    direccion === 'descendente'
      ? alcanzado === 0
        ? 100
        : (esperado / alcanzado) * 100
      : (alcanzado / esperado) * 100
  return {
    porcentaje,
    color: porcentaje >= 100 ? 'positive' : porcentaje >= 70 ? 'warning' : 'negative',
    texto: porcentaje >= 100 ? 'Cumplido' : porcentaje >= 70 ? 'En riesgo' : 'Rezago',
  }
}
