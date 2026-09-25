export const propsOptions = {
  modelValue: {
    type: Object,
    required: true,
  },
  lineasAccion: {
    type: Array,
    default: () => [],
  },
}
export const emitsOptions = ['update:modelValue']
export function useDatosBasicosIndicador(pageProps, pageEmit) {
  const props = pageProps

  const emit = pageEmit

  const dimensiones = ['Eficiencia', 'Eficacia', 'Calidad', 'Economía']
  const sentidos = ['Ascendente', 'Descendente']
  const frecuencias = ['Mensual', 'Trimestral', 'Semestral', 'Anual']
  const periodos = ['Primer trimestre', 'Segundo trimestre', 'Tercer trimestre', 'Cuarto trimestre']
  const currentYear = new Date().getFullYear()
  const anios = [currentYear, currentYear - 1, currentYear - 2]

  function updateField(field, value) {
    emit('update:modelValue', { ...props.modelValue, [field]: value })
  }
  return {
    props,
    emit,
    dimensiones,
    sentidos,
    frecuencias,
    periodos,
    currentYear,
    anios,
    updateField,
  }
}
