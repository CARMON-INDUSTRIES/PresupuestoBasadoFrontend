import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useProgramacionMetas() {
  const saving = ref(false)
  const ficha = ref(null)
  const indicadores = ref([])
  const indiceSeleccionado = ref(null)

  const optionsIndicadores = computed(() =>
    indicadores.value.map((i, idx) => ({
      label: `${idx + 1}. ${i.resultadoEsperado || i.descripcion || 'Indicador'}`,
      value: idx,
    })),
  )

  const indicadorActivo = computed(() => {
    if (indiceSeleccionado.value === null) return null
    return indicadores.value[indiceSeleccionado.value] || null
  })

  onMounted(async () => {
    try {
      const res = await api.get('/ProgramacionMetas/ultima')

      const fichaData = res.data

      if (!fichaData || !fichaData.indicadores) {
        Notify.create({
          type: 'warning',
          message: 'No hay ficha o indicadores disponibles',
        })
        return
      }

      ficha.value = fichaData

      indicadores.value = [...fichaData.indicadores]

      if (indicadores.value.length > 0) {
        indiceSeleccionado.value = 0
      }
    } catch (err) {
      console.error('ERROR API:', err)

      Notify.create({
        type: 'negative',
        message: 'Error al cargar datos',
      })
    }
  })

  async function guardarCambios() {
    if (saving.value) return
    saving.value = true
    try {
      if (!indicadorActivo.value) return

      const metas = indicadorActivo.value.metasProgramadas.map((m) => ({
        id: m.id,
        alcanzado: Number(m.alcanzado) || 0,
      }))

      console.log('METAS ENVIADAS:', metas)

      await api.put('/ProgramacionMetas/actualizar-avances', metas)

      Notify.create({
        type: 'positive',
        message: 'Avances guardados correctamente',
      })
    } catch (err) {
      console.error('ERROR GUARDAR:', err)

      console.log(err.response?.data)

      Notify.create({
        type: 'negative',
        message: 'Error al guardar',
      })
    } finally {
      saving.value = false
    }
  }

  function obtenerPorcentaje(meta) {
    const esperado = Number(meta.cantidadEsperada ?? meta.cantidad ?? 0)
    const alcanzado = Number(meta.alcanzado ?? 0)

    if (esperado <= 0) return 0

    return (alcanzado / esperado) * 100
  }

  function obtenerColorSemaforo(meta) {
    const porcentaje = obtenerPorcentaje(meta)

    if (porcentaje >= 100) return 'positive'

    if (porcentaje >= 70) return 'warning'

    return 'negative'
  }

  function obtenerTextoSemaforo(meta) {
    const porcentaje = obtenerPorcentaje(meta)

    if (porcentaje >= 100) return 'Cumplido'

    if (porcentaje >= 70) return 'En riesgo'

    return 'Rezago'
  }

  async function descargarPdfActualizado() {
    try {
      const response = await api.get('/FormatoFichaFinal/ultimo', {
        responseType: 'blob',
        timeout: 120000,
      })

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'FichasActualizadas.pdf'

      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('ERROR PDF:', err)

      Notify.create({
        type: 'negative',
        message: 'Error al descargar PDF',
      })
    }
  }
  return {
    ficha,
    indicadores,
    indiceSeleccionado,
    optionsIndicadores,
    indicadorActivo,
    guardarCambios,
    obtenerPorcentaje,
    obtenerColorSemaforo,
    obtenerTextoSemaforo,
    descargarPdfActualizado,
  }
}
