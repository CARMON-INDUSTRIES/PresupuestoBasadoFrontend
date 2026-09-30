import { ref, onMounted } from 'vue'
import { useResumenDownload } from 'src/router/useResumenDownload.js'

export function useResumenesFormularios() {
  const fichas = ref([])

  const {
    descargando,
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
    descargando,
    descargarPdf,
    descargarTodos,
    descargarArboles,
    obtenerFichas,
    descargarFicha,
    descargarTodasLasFichas,
  }
}
