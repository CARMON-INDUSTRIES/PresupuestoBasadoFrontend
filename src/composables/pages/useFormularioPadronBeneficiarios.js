import { useAdjuntoPrograma } from 'src/composables/useAdjuntoPrograma'

export function useFormularioPadronBeneficiarios() {
  const state = useAdjuntoPrograma({
    storageKey: 'formularioPadronBeneficiarios',
    endpoint: '/PadronBeneficiarios',
    campo: 'tienePadron',
    siguiente: '/formulario-reglas-operacion',
  })
  return { ...state, guardarPadron: state.guardar }
}
