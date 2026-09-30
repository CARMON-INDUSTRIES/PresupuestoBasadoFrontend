import { ref } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useResumenDownload() {
  const descargando = ref(false)

  async function fetchPdfArrayBuffer(formato, indicadorId = null) {
    const response = await api.get('/' + formato + '/ultimo', {
      responseType: 'arraybuffer',
      params: indicadorId ? { indicadorId } : undefined,
    })
    if (!(response.headers['content-type'] || '').includes('application/pdf'))
      throw new Error('El servidor no devolvió un PDF')
    return response.data
  }

  function guardarArchivo(bytes, nombre) {
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.download = nombre
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function descargarPdf(formato, indicadorId = null) {
    if (descargando.value) return
    descargando.value = true
    try {
      const bytes = await fetchPdfArrayBuffer(formato, indicadorId)
      guardarArchivo(bytes, formato + '.pdf')
      Notify.create({ type: 'positive', message: 'PDF generado; descarga iniciada.' })
    } catch {
      Notify.create({
        type: 'negative',
        message:
          'No se pudo descargar ' + formato + '. Reintenta cuando el servicio esté disponible.',
      })
    } finally {
      descargando.value = false
    }
  }

  async function obtenerIndicadores() {
    try {
      return (await api.get('/FormatoFichaFinal/indicadores')).data
    } catch {
      Notify.create({
        type: 'negative',
        message: 'No se pudieron cargar los indicadores para descarga.',
      })
      return []
    }
  }

  async function descargarConjunto(formatos, nombre) {
    if (descargando.value) return
    descargando.value = true
    const cerrarAviso = Notify.create({ type: 'info', message: 'Preparando PDF...', timeout: 0 })
    try {
      const { PDFDocument } = await import('pdf-lib')
      const merged = await PDFDocument.create()
      const faltantes = []
      for (let i = 0; i < formatos.length; i += 3) {
        const lote = formatos.slice(i, i + 3)
        const results = await Promise.allSettled(
          lote.map((formato) => fetchPdfArrayBuffer(formato)),
        )
        for (let j = 0; j < lote.length; j++) {
          try {
            if (results[j].status !== 'fulfilled') throw new Error('Descarga fallida')
            const pdf = await PDFDocument.load(results[j].value)
            const pages = await merged.copyPages(pdf, pdf.getPageIndices())
            pages.forEach((p) => merged.addPage(p))
          } catch {
            faltantes.push(lote[j])
          }
        }
      }
      if (!merged.getPageCount()) throw new Error('Sin documentos')
      const fecha = new Date().toISOString().slice(0, 10)
      guardarArchivo(
        await merged.save(),
        nombre + (faltantes.length ? '_INCOMPLETO' : '') + '_' + fecha + '.pdf',
      )
      Notify.create(
        faltantes.length
          ? {
              type: 'warning',
              message: 'PDF INCOMPLETO. Faltan: ' + faltantes.join(', '),
              timeout: 0,
              closeBtn: true,
            }
          : { type: 'positive', message: 'PDF completo generado; descarga iniciada.' },
      )
    } catch {
      Notify.create({
        type: 'negative',
        message: 'No se pudo generar el PDF. Reintenta cuando el servicio esté disponible.',
      })
    } finally {
      if (typeof cerrarAviso === 'function') cerrarAviso()
      descargando.value = false
    }
  }

  const descargarTodasLasFichas = () => descargarPdf('FormatoFichaFinal')
  const descargarFicha = (id) => descargarPdf('FormatoFichaFinal', id)
  const descargarTodos = () =>
    descargarConjunto(
      [
        'FormatoAlineacion',
        'FormatoFichaDeInformacionBasica1',
        'FormatoDefinicionDelProblema',
        'FormatoAnalisisDeInvolucrados',
        'FormatoArbolDeProblemas',
        'FormatoArbolDeObjetivos',
        'FormatoAnalisisInvolucrados',
        'FormatoEstructuraAnalitica',
        'FormatoMatriz',
        'FormatoFichaFinal',
      ],
      'FormatosGenerales',
    )
  const descargarArboles = () =>
    descargarConjunto(
      ['FormatoArbolDeProblemas', 'FormatoArbolDeObjetivos'],
      'FormatoArbolProblemasObjetivos',
    )

  return {
    descargando,
    descargarPdf,
    descargarFicha,
    descargarTodasLasFichas,
    descargarTodos,
    descargarArboles,
    obtenerIndicadores,
    obtenerFichas: obtenerIndicadores,
  }
}
