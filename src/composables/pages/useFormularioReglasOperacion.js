import { useAdjuntoPrograma } from 'src/composables/useAdjuntoPrograma'

export function useFormularioReglasOperacion() {
  const state = useAdjuntoPrograma({
    storageKey: 'formularioReglasOperacion',
    endpoint: '/ReglasOperacion',
    campo: 'tieneReglasOperacion',
    siguiente: '/PoblacionAreaEnfoquePotencial',
  })
  return { ...state, guardarReglasOperacion: state.guardar }
}
