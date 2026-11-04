export function prepararFicha(data) {
  return {
    ...data,
    indicadores: data.indicadores.map((ind) => ({
      ...ind,
      id: ind.id || 0,
      fuenteResultado: ind.fuentes?.resultadoEsperado || '',
      fuenteNumerador: ind.fuentes?.numerador || '',
      fuenteDenominador: ind.fuentes?.denominador || '',
      lineaBaseAnio: String(ind.lineaBaseAnio ?? ''),
      metasProgramadas: (ind.metasProgramadas || []).map((m, index) => ({
        id: m.id || 0,
        metaProgramadaNombre: m.metaProgramadaNombre || 'Meta ' + (index + 1),
        cantidad: Number(m.cantidad ?? 0),
        periodoCumplimiento: m.periodoCumplimiento || 'Mensual',
        mes: m.mes || index + 1,
        cantidadEsperada: Number(m.cantidad ?? 0),
      })),
    })),
  }
}

// Sólo actualiza identificadores; conserva la edición que llegó durante el envío.
export function confirmarFicha(form, snapshot, saved) {
  const ack = structuredClone(snapshot)
  const previousIds = new Set(snapshot.indicadores.map((i) => i.id).filter(Boolean))
  const assigned = new Set()
  ack.id = saved.id
  ack.version = saved.version
  const current = { ...form.value, id: saved.id, version: saved.version }
  ack.indicadores.forEach((ind, index) => {
    const server = saved.indicadores.find((i) =>
      ind.id
        ? i.id === ind.id
        : !previousIds.has(i.id) && !assigned.has(i.id) && i.nivel === ind.nivel,
    )
    if (!server) return
    assigned.add(server.id)
    const live = current.indicadores.find((i) =>
      ind.id ? i.id === ind.id : i === form.value.indicadores[index],
    )
    for (const target of [ind, live].filter(Boolean)) {
      target.id = server.id
      target.metasProgramadas?.forEach((meta, month) => {
        meta.id = server.metasProgramadas.find((m) => m.mes === (meta.mes || month + 1))?.id || 0
      })
    }
  })
  form.value = current
  return ack
}
