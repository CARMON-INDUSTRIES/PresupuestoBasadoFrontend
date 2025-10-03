// src/composables/useIndicadores.js

export function useIndicadores() {
  /**
   * Calcula el porcentaje esperado en base a valor y meta.
   * @param {number} valor - Valor alcanzado
   * @param {number} meta - Meta establecida
   * @returns {number} porcentaje
   */
  function calcularPorcentajeEsperado(valor, meta) {
    if (!meta || meta === 0) return 0
    return (valor / meta) * 100
  }

  /**
   * Determina el color del semáforo según el porcentaje.
   * @param {number} porcentaje
   * @returns {string} 'green' | 'yellow' | 'red'
   */
  function calcularSemaforo(porcentaje) {
    if (porcentaje >= 90) return 'green'
    if (porcentaje >= 70) return 'yellow'
    return 'red'
  }

  /**
   * Formatea un valor numérico como porcentaje con 2 decimales.
   * @param {number} valor
   * @returns {string}
   */
  function formatoPorcentaje(valor) {
    return `${valor.toFixed(2)}%`
  }

  /**
   * Valida si un valor está vacío o nulo.
   * @param {any} valor
   * @returns {boolean}
   */
  function esVacio(valor) {
    return valor === null || valor === undefined || valor === ''
  }

  /**
   * Normaliza un número (si no es válido, devuelve 0).
   * @param {any} valor
   * @returns {number}
   */
  function normalizarNumero(valor) {
    const num = Number(valor)
    return isNaN(num) ? 0 : num
  }

  return {
    calcularPorcentajeEsperado,
    calcularSemaforo,
    formatoPorcentaje,
    esVacio,
    normalizarNumero,
  }
}
