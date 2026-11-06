// Diagnóstico local y acotado: no registra parámetros, cabeceras ni respuestas.
const samples = []
export function recordTiming(resource, phase, started, status = 0) {
  if (process.env.NODE_ENV !== 'development') return
  samples.push({ resource: String(resource || '').split('?')[0].split('/').filter(Boolean)[0] || 'API', phase, ms: Math.max(0, Date.now() - started), status })
  if (samples.length > 200) samples.shift()
}
export function getPerformanceReport() {
  const groups = new Map()
  for (const item of samples) {
    const key = `${item.resource} · ${item.phase}`
    const group = groups.get(key) || { consulta: key, muestras: 0, total: 0, maximoMs: 0 }
    group.muestras++; group.total += item.ms; group.maximoMs = Math.max(group.maximoMs, item.ms)
    groups.set(key, group)
  }
  return [...groups.values()].map(({ total, ...group }) => ({ ...group, promedioMs: Math.round(total / group.muestras) })).sort((a,b) => b.maximoMs - a.maximoMs)
}
export function clearPerformanceReport() { samples.length = 0 }
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.pbrRendimiento = { consultar: getPerformanceReport, limpiar: clearPerformanceReport }
}
