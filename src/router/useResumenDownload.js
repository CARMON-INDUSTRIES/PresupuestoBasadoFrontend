import { Notify } from 'quasar'
import { PDFDocument } from 'pdf-lib'

const isLocal = window.location.hostname === 'localhost'
const API_BASE_URL = isLocal
  ? 'https://localhost:7125/api'
  : 'https://presupuestobr2025.somee.com/api'

export function useResumenDownload() {
  function getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  async function fetchPdfArrayBuffer(formato) {
    const token = getToken()
    if (!token) throw new Error('NoAuth')

    const url = `${API_BASE_URL}/${formato}/ultimo`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      const msg = `Error en ${formato}: ${res.status} ${res.statusText} ${txt ? '- ' + txt : ''}`
      const error = new Error(msg)
      error.status = res.status
      throw error
    }

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/pdf')) {
      const txt = await res.text().catch(() => '')
      throw new Error(`Respuesta de ${formato} no es PDF. ${txt}`)
    }

    return await res.arrayBuffer()
  }

  async function descargarPdf(formato) {
    const token = getToken()
    if (!token) {
      Notify.create({ type: 'warning', message: 'Debes iniciar sesión para descargar el PDF' })
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${formato}/ultimo`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        console.error('Error del servidor:', errorText)
        throw new Error('Error al generar el PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${formato}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)

      Notify.create({ type: 'positive', message: `Descarga completa: ${formato}.pdf` })
    } catch (error) {
      console.error('Error al descargar:', error)
      Notify.create({ type: 'negative', message: `Error al descargar ${formato}` })
    }
  }

  async function descargarTodos() {
    const token = getToken()
    if (!token) {
      Notify.create({ type: 'warning', message: 'Debes iniciar sesión para descargar los PDFs' })
      return
    }

    const formatos = [
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
    ]

    Notify.create({ type: 'info', message: 'Preparando descarga general...' })

    const resultados = await Promise.allSettled(
      formatos.map(async (f) => {
        try {
          const buf = await fetchPdfArrayBuffer(f)
          return { formato: f, buffer: buf }
        } catch (err) {
          console.warn(`Fallo al obtener ${f}:`, err)
          return { formato: f, error: err }
        }
      }),
    )

    const pdfValidos = resultados
      .map((r) => (r.status === 'fulfilled' ? r.value : null))
      .filter(Boolean)
      .filter((x) => !x.error)

    if (!pdfValidos.length) {
      Notify.create({ type: 'negative', message: 'No se pudo obtener ningún PDF para consolidar.' })
      return
    }

    try {
      const mergedPdf = await PDFDocument.create()

      for (const f of formatos) {
        const encontrado = pdfValidos.find((p) => p.formato === f)
        if (!encontrado) continue
        const srcPdf = await PDFDocument.load(encontrado.buffer)
        const copied = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices())
        copied.forEach((p) => mergedPdf.addPage(p))
      }

      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([mergedBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const today = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `FormatosGenerales_${today}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      Notify.create({
        type: 'positive',
        message: `PDF consolidado descargado (${pdfValidos.length} archivos unidos)`,
      })
    } catch (err) {
      console.error('Error al unir PDFs:', err)
      Notify.create({ type: 'negative', message: 'Error al generar el PDF consolidado' })
    }
  }

  async function descargarArboles() {
    const token = getToken()
    if (!token) {
      Notify.create({ type: 'warning', message: 'Debes iniciar sesión para descargar los PDFs' })
      return
    }

    const formatos = ['FormatoArbolDeProblemas', 'FormatoArbolDeObjetivos']

    Notify.create({ type: 'info', message: 'Preparando arbol problemas y objetivos...' })

    const resultados = await Promise.allSettled(
      formatos.map(async (f) => {
        try {
          const buf = await fetchPdfArrayBuffer(f)
          return { formato: f, buffer: buf }
        } catch (err) {
          console.warn(`Fallo al obtener ${f}:`, err)
          return { formato: f, error: err }
        }
      }),
    )

    const pdfValidos = resultados
      .map((r) => (r.status === 'fulfilled' ? r.value : null))
      .filter(Boolean)
      .filter((x) => !x.error)

    if (!pdfValidos.length) {
      Notify.create({
        type: 'negative',
        message: 'No se pudo obtener ningún PDF Problemas u objetivos.',
      })
      return
    }

    try {
      const mergedPdf = await PDFDocument.create()

      for (const f of formatos) {
        const encontrado = pdfValidos.find((p) => p.formato === f)
        if (!encontrado) continue
        const srcPdf = await PDFDocument.load(encontrado.buffer)
        const copied = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices())
        copied.forEach((p) => mergedPdf.addPage(p))
      }

      const mergedBytes = await mergedPdf.save()
      const blob = new Blob([mergedBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const today = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `FormatoArbolProblemasObjetivos_${today}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      Notify.create({
        type: 'positive',
        message: `PDF arboles descargado (${pdfValidos.length})`,
      })
    } catch (err) {
      console.error('Error al unir PDFs:', err)
      Notify.create({ type: 'negative', message: 'Error al generar el PDF arboles' })
    }
  }

  return {
    descargarPdf,
    descargarTodos,
    descargarArboles,
  }
}
