// Los registros antiguos no tienen una identidad común entre árbol, MIR y ficha.
// Se conservan las filas sin correspondencia para no borrar capturas anteriores.
export function reconciliarIndicadores(actuales, guardados = []) {
  const tipo = (fila) => (fila.nivel || '').split(':')[0].trim()
  const usados = new Set()
  const exactos = actuales.map((fila) => {
    const index = guardados.findIndex((g, i) => !usados.has(i) && g.nivel === fila.nivel)
    if (index >= 0) usados.add(index)
    return index
  })
  const filas = actuales.map((fila, i) => {
    let index = exactos[i]
    if (index < 0 && guardados[i] && !usados.has(i) && tipo(guardados[i]) === tipo(fila)) {
      const cantidad = (lista) => lista.filter((g) => tipo(g) === tipo(fila)).length
      if (cantidad(actuales) === cantidad(guardados)) index = i
    }
    if (index >= 0) usados.add(index)
    return { ...guardados[index], ...fila }
  })
  return [...filas, ...guardados.filter((_, i) => !usados.has(i))]
}
