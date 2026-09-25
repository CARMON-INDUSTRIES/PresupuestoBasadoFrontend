import { ref, computed, watch } from 'vue'
import { Notify } from 'quasar'

export const propsOptions = {
  modelValue: {
    type: Object,
    required: true,
  },
}
export const emitsOptions = ['update:modelValue']
export function useMetasIndicador(pageProps, pageEmit) {
  const props = pageProps

  const emit = pageEmit

  const periodos = ['Primer trimestre', 'Segundo trimestre', 'Tercer trimestre', 'Cuarto trimestre']
  const nuevaMeta = ref({ cantidad: null, periodoCumplimiento: '' })
  const modoProgramacion = ref('prorratear')

  const localProgramacionMetas = computed({
    get: () => props.modelValue.metasProgramadas || [],
    set: (val) => {
      emit('update:modelValue', {
        ...props.modelValue,
        metasProgramadas: val,
      })
    },
  })

  function updateField(field, value) {
    emit('update:modelValue', { ...props.modelValue, [field]: value })
  }

  function agregarMeta() {
    if (!nuevaMeta.value.cantidad || !nuevaMeta.value.periodoCumplimiento) {
      Notify.create({ type: 'warning', message: 'Completa todos los campos de la meta' })
      return
    }

    const metasActualizadas = [...(props.modelValue.metas || []), { ...nuevaMeta.value }]
    emit('update:modelValue', { ...props.modelValue, metas: metasActualizadas })

    nuevaMeta.value = { cantidad: null, periodoCumplimiento: '' }

    Notify.create({ type: 'positive', message: 'Meta agregada' })
  }

  function eliminarMeta(idx) {
    const metasActualizadas = [...props.modelValue.metas]
    metasActualizadas.splice(idx, 1)
    emit('update:modelValue', { ...props.modelValue, metas: metasActualizadas })
  }

  function calcularPorcentajeEsperado(meta) {
    const total = localProgramacionMetas.value.reduce((sum, m) => sum + (m.cantidad || 0), 0)
    if (!total) return 0
    return ((meta.cantidad / total) * 100).toFixed(1)
  }

  function calcularPorcentajeAlcanzado(meta) {
    if (!meta.cantidad) return 0
    return ((meta.alcanzado / meta.cantidad) * 100).toFixed(1)
  }

  function calcularSemaforo(meta) {
    const pct = parseFloat(calcularPorcentajeAlcanzado(meta))
    const sentido = props.modelValue?.sentido || 'Ascendente'

    if (sentido === 'Ascendente') {
      if (pct >= 90 && pct <= 130) return 'green'
      if (pct >= 70 && pct < 90) return 'yellow'
      return 'red'
    } else if (sentido === 'Descendente') {
      if (pct >= 0.1 && pct <= 100) return 'green'
      if (pct > 100 && pct <= 130) return 'yellow'
      if (pct > 130) return 'red'
      return 'grey'
    }

    return 'grey'
  }

  function getMesesAcumulados(periodo) {
    switch (periodo) {
      case 'Primer trimestre':
        return [0, 1, 2]
      case 'Segundo trimestre':
        return [0, 1, 2, 3, 4, 5]
      case 'Tercer trimestre':
        return [0, 1, 2, 3, 4, 5, 6, 7, 8]
      case 'Cuarto trimestre':
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      case 'Primer semestre':
        return [0, 1, 2, 3, 4, 5]
      case 'Segundo semestre':
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      case 'Anual':
        return Array.from({ length: 12 }, (_, i) => i)
      default:
        return Array.from({ length: 12 }, (_, i) => i)
    }
  }

  watch(
    [modoProgramacion, () => nuevaMeta.value.cantidad, () => nuevaMeta.value.periodoCumplimiento],
    ([modo, cantidad, periodo]) => {
      if (modo === 'prorratear' && cantidad && periodo) {
        const mesesAcumulados = getMesesAcumulados(periodo)
        const prorrateo = (cantidad / mesesAcumulados.length).toFixed(2)

        const nuevas = localProgramacionMetas.value.map((meta, index) => ({
          ...meta,
          cantidad: mesesAcumulados.includes(index) ? parseFloat(prorrateo) : 0,
        }))

        localProgramacionMetas.value = nuevas
      }
    },
  )
  return {
    props,
    emit,
    periodos,
    nuevaMeta,
    modoProgramacion,
    localProgramacionMetas,
    updateField,
    agregarMeta,
    eliminarMeta,
    calcularPorcentajeEsperado,
    calcularPorcentajeAlcanzado,
    calcularSemaforo,
    getMesesAcumulados,
  }
}
