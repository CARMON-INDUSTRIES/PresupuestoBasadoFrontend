export function itemToString(item) {
  if (typeof item === 'string') return item.trim()
  return String(item?.descripcion ?? item?.nombre ?? '').trim()
}

export function normalizarComponentes(diseno) {
  return (diseno?.componentes || []).map((c) => ({
    nombre: itemToString(c.nombre),
    acciones: (c.acciones || []).map((a) => ({ descripcion: itemToString(a) })),
    resultados: (c.resultado ? [c.resultado] : c.resultados || []).map(itemToString),
  }))
}

export function completarEstructura(guardado, componentes) {
  const anteriores = guardado?.componentes || []
  const completar = (valores = [], cantidad) =>
    Array.from({ length: Math.max(valores.length, cantidad) }, (_, i) => valores[i] ?? '')
  // ponytail: el contrato actual relaciona árboles por posición; usar ids de origen si se permite reordenarlos.
  return {
    ...guardado,
    fin: guardado?.fin ?? '',
    objetivoCentral: guardado?.objetivoCentral ?? '',
    componentes: Array.from({ length: Math.max(anteriores.length, componentes.length) }, (_, i) => {
      const anterior = anteriores[i] || {}
      return {
        ...anterior,
        nombre: anterior.nombre ?? '',
        medios: completar(anterior.medios, componentes[i]?.acciones.length || 0),
        resultados: completar(anterior.resultados, componentes[i]?.resultados.length || 0),
      }
    }),
  }
}

export function destinosVacios(problemas, objetivos) {
  const destinos = []
  const agregar = (objeto, campo, fuente, nivel, id) => {
    const textoBase = itemToString(fuente)
    if (textoBase && !itemToString(objeto[campo]))
      destinos.push({ objeto, campo, nodo: { id, textoBase, nivel } })
  }
  agregar(objetivos, 'fin', problemas.efectoSuperior?.descripcion, 'FIN', 'fin')
  agregar(
    objetivos,
    'objetivoCentral',
    problemas.problemaCentral?.problemaCentral,
    'OBJETIVO_CENTRAL',
    'central',
  )
  objetivos.componentes.forEach((c, i) => {
    const fuente = problemas.componentes[i]
    agregar(c, 'nombre', fuente?.nombre, 'COMPONENTE', `c${i}`)
    c.resultados.forEach((_, j) =>
      agregar(c.resultados, j, fuente?.resultados[j], 'RESULTADO', `c${i}r${j}`),
    )
    c.medios.forEach((_, j) => agregar(c.medios, j, fuente?.acciones[j], 'MEDIO', `c${i}m${j}`))
  })
  return destinos
}

export function aplicarPropuestas(destinos, propuestas) {
  const ids = new Set(destinos.map((d) => d.nodo.id))
  if (
    !Array.isArray(propuestas) ||
    propuestas.length !== destinos.length ||
    propuestas.some(
      (p) =>
        !p || !ids.delete(p.id) || typeof p.textoPositivo !== 'string' || !p.textoPositivo.trim(),
    )
  )
    throw new Error('La IA devolvió una propuesta incompleta; no se aplicó ningún cambio.')
  const porId = new Map(propuestas.map((p) => [p.id, p.textoPositivo.trim()]))
  let aplicadas = 0
  for (const { objeto, campo, nodo } of destinos) {
    if (!itemToString(objeto[campo])) {
      objeto[campo] = porId.get(nodo.id)
      aplicadas++
    }
  }
  return aplicadas
}
