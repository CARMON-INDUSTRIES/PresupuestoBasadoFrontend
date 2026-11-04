import { ref, computed } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'
import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'
import { evaluarMeta } from 'src/utils/semaforoMetas'

export function useProgramacionMetas() {
  const ficha = ref({ indicadores: [] })
  const indicadores = computed(() => ficha.value.indicadores || [])
  const indiceSeleccionado = ref(0)
  const metasDe = (data) => (data.indicadores || []).flatMap((i) => i.metasProgramadas || [])
  const optionsIndicadores = computed(() =>
    indicadores.value.map((i, idx) => ({
      label: `${idx + 1}. ${i.resultadoEsperado || i.descripcion || 'Indicador'}`,
      value: idx,
    })),
  )
  const indicadorActivo = computed(() => indicadores.value[indiceSeleccionado.value] || null)
  const { guardarDatos, saving, loading, notificarErrorGuardado } = useFormularioPersistente({
    form: ficha,
    storageKey: 'programacionMetas',
    autosave: true,
    load: async () => {
      const { data } = await api.get('/ProgramacionMetas/ultima', { cache: false })
      metasDe(data).forEach((m) => {
        m.alcanzadoAnterior = m.alcanzado
      })
      return data
    },
    save: async (data) => {
      const metas = metasDe(data).filter(
        (m) =>
          m.alcanzado === '' || m.alcanzado == null || Number(m.alcanzado) !== m.alcanzadoAnterior,
      )
      if (
        metas.some(
          (m) =>
            m.alcanzado === '' ||
            m.alcanzado == null ||
            !Number.isFinite(Number(m.alcanzado)) ||
            Number(m.alcanzado) < 0,
        )
      )
        throw new Error('Los avances deben ser números no negativos.')
      if (metas.length)
        await api.put(
          '/ProgramacionMetas/actualizar-avances',
          metas.map((m) => ({
            id: m.id,
            alcanzado: Number(m.alcanzado),
            alcanzadoAnterior: m.alcanzadoAnterior,
          })),
        )
    },
    onSaved: (_, snapshot) => {
      const actuales = new Map(metasDe(ficha.value).map((m) => [m.id, m]))
      for (const meta of metasDe(snapshot)) {
        meta.alcanzadoAnterior = Number(meta.alcanzado)
        const actual = actuales.get(meta.id)
        if (actual) actual.alcanzadoAnterior = meta.alcanzadoAnterior
      }
      return snapshot
    },
  })
  async function guardarCambios() {
    if (saving.value || loading.value || !indicadorActivo.value) return
    try {
      await guardarDatos(false)
      Notify.create({ type: 'positive', message: 'Avances guardados correctamente' })
    } catch (error) {
      notificarErrorGuardado(error)
    }
  }
  const evaluar = (meta) => evaluarMeta(meta, indicadorActivo.value?.sentido)
  const obtenerPorcentaje = (meta) => evaluar(meta).porcentaje
  const obtenerColorSemaforo = (meta) => evaluar(meta).color
  const obtenerTextoSemaforo = (meta) => evaluar(meta).texto

  async function descargarPdfActualizado() {
    try {
      await guardarDatos(false)
      const response = await api.get('/FormatoFichaFinal/ultimo', {
        responseType: 'blob',
        timeout: 120000,
      })
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = 'FichasActualizadas.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      Notify.create({
        type: 'negative',
        message: 'No se pudo guardar o descargar la ficha actualizada.',
      })
    }
  }
  return {
    ficha,
    indicadores,
    indiceSeleccionado,
    optionsIndicadores,
    indicadorActivo,
    saving,
    loading,
    guardarCambios,
    obtenerPorcentaje,
    obtenerColorSemaforo,
    obtenerTextoSemaforo,
    descargarPdfActualizado,
  }
}
