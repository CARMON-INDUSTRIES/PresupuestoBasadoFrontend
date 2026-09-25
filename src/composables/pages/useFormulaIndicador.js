export const propsOptions = {
  modelValue: {
    type: Object,
    required: true,
  },
  siglas: {
    type: Object,
    default: () => ({ resultadoEsperado: '', numerador: '', denominador: '' }),
  },
}
export const emitsOptions = ['update:modelValue']
export function useFormulaIndicador(pageProps, pageEmit) {
  const props = pageProps

  const emit = pageEmit

  function updateField(field, value) {
    emit('update:modelValue', { ...props.modelValue, [field]: value })
  }

  function updateFuente(field, value) {
    emit('update:modelValue', {
      ...props.modelValue,
      fuentes: { ...props.modelValue.fuentes, [field]: value },
    })
  }

  // function updateCrema(field, value) {
  //   emit('update:modelValue', {
  //     ...props.modelValue,
  //     crema: { ...props.modelValue.crema, [field]: value },
  //   })
  // }
  return { props, emit, updateField, updateFuente }
}
