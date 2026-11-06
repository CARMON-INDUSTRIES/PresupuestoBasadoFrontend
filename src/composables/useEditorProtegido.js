import { watch, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { confirmarRiesgo } from 'src/utils/confirmarRiesgo'
export function useEditorProtegido(open, data) {
  let initial = ''
  const dirty = () => open.value && JSON.stringify(data.value) !== initial
  watch(open, value => { if (value) initial = JSON.stringify(data.value) }, { flush: 'sync' })
  const confirm = () => !dirty() || confirmarRiesgo('Tienes cambios sin aplicar en esta edición. Si sales, se descartarán.', 'Descartar cambios')
  async function cerrarEditor() { if (await confirm()) open.value = false }
  onBeforeRouteLeave(confirm)
  const beforeUnload = event => { if (dirty()) { event.preventDefault(); event.returnValue = '' } }
  window.addEventListener('beforeunload', beforeUnload)
  onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
  return { cerrarEditor }
}
