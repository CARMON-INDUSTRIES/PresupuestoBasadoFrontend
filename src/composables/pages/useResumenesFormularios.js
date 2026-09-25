import { ref, onMounted } from 'vue'
import { useResumenDownload } from 'src/router/useResumenDownload.js'

export function useResumenesFormularios() {
  const fichas = ref([])

  const {
    descargarPdf,
    descargarTodos,
    descargarArboles,
    obtenerFichas,
    descargarFicha,
    descargarTodasLasFichas,
  } = useResumenDownload()

  onMounted(async () => {
    fichas.value = await obtenerFichas()
  })
  return {
    fichas,
    descargarPdf,
    descargarTodos,
    descargarArboles,
    obtenerFichas,
    descargarFicha,
    descargarTodasLasFichas,
  }
}
