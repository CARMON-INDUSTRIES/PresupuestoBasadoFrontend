import { reconciliarIndicadores } from './indicadores.js'
const vacio = value => value == null || (typeof value === 'string' && !value.trim())
// Completar exclusivamente campos equivalentes; nunca reemplazar una captura existente.
export function completarCampos(destino, fuente, campos) {
  const result = { ...destino }
  for (const [campo, origen] of Object.entries(campos))
    if (vacio(result[campo]) && !vacio(fuente?.[origen])) result[campo] = fuente[origen]
  return result
}
export function reutilizarMirEnFicha(actuales, guardados = []) {
  const reconciliadas = reconciliarIndicadores(actuales.map(({ nivel }) => ({ nivel })), guardados)
  return reconciliadas.map(fila => {
    const source = actuales.find(actual => actual.nivel === fila.nivel)
    return completarCampos(fila, source, {
      indicadores: 'indicadores', resultadoEsperado: 'resumenNarrativo', resumenNarrativo: 'resumenNarrativo',
    })
  })
}
export function reutilizarObjetivoEnMir(fila) {
  const separator = (fila.nivel || '').indexOf(':')
  const texto = separator < 0 ? '' : fila.nivel.slice(separator + 1).trim()
  // Las etiquetas de reserva no son contenido del expediente.
  if (/^(Componente|Actividad)\s+\d+$/i.test(texto)) return { ...fila }
  return completarCampos(fila, { texto }, { resumenNarrativo: 'texto' })
}
