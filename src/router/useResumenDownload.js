import { Notify } from 'quasar'

const isLocal = window.location.hostname === 'localhost'
const API_BASE_URL = isLocal
  ? 'https://localhost:7125/api'
  : 'https://presupuesto-basado.somee.com/api'

export function useResumenDownload() {
  function getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
  }

  async function fetchPdfArrayBuffer(formato, indicadorId = null) {
    const token = getToken()
    if (!token) throw new Error('NoAuth')

    let url = `${API_BASE_URL}/${formato}/ultimo`

    if (indicadorId) {
      url += `?indicadorId=${indicadorId}`
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      const msg = `Error en ${formato}: ${res.status} ${res.statusText}${txt ? ' - ' + txt : ''}`
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

  async function descargarPdf(formato, indicadorId = null) {
    const token = getToken()

    if (!token) {
      Notify.create({
        type: 'warning',
        message: 'Debes iniciar sesión para descargar el PDF',
      })
      return
    }

    try {
      let url = `${API_BASE_URL}/${formato}/ultimo`

      if (indicadorId) {
        url += `?indicadorId=${indicadorId}`
      }

      const response = await fetch(url, {
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
      const objectUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `${formato}.pdf`
      link.click()

      window.URL.revokeObjectURL(objectUrl)

      Notify.create({
        type: 'positive',
        message: `Descarga completa: ${formato}.pdf`,
      })
    } catch (error) {
      console.error(error)

      Notify.create({
        type: 'negative',
        message: `Error al descargar ${formato}`,
      })
    }
  }

  async function obtenerIndicadores() {
    const token = getToken()

    if (!token) return []

    try {
      const response = await fetch(`${API_BASE_URL}/FormatoFichaFinal/indicadores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return []
      }

      return await response.json()
    } catch (err) {
      console.error(err)
      return []
    }
  }

  async function descargarTodasLasFichas() {
    await descargarPdf('FormatoFichaFinal')
  }

  async function descargarFicha(indicadorId) {
    await descargarPdf('FormatoFichaFinal', indicadorId)
  }

  async function descargarTodos() {
    const token = getToken()

    if (!token) {
      Notify.create({
        type: 'warning',
        message: 'Debes iniciar sesión para descargar los PDFs',
      })
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
    ]

    Notify.create({
      type: 'info',
      message: 'Preparando descarga general...',
    })

    const { PDFDocument } = await import('pdf-lib')
    const mergedPdf = await PDFDocument.create()

    for (const formato of formatos) {
      try {
        const buffer = await fetchPdfArrayBuffer(formato)

        const pdf = await PDFDocument.load(buffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())

        pages.forEach((p) => mergedPdf.addPage(p))
      } catch (err) {
        console.warn(`No se pudo descargar ${formato}`, err)
        Notify.create({
          type: 'warning',
          message: `El documento no incluye ${formato}: no se pudo descargar.`,
        })
      }
    }

    try {
      const buffer = await fetchPdfArrayBuffer('FormatoFichaFinal')
      const pdf = await PDFDocument.load(buffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((p) => mergedPdf.addPage(p))
    } catch {
      Notify.create({
        type: 'warning',
        message: 'El PDF general no incluye fichas: no se pudieron obtener.',
      })
    }

    const mergedBytes = await mergedPdf.save()

    const blob = new Blob([mergedBytes], {
      type: 'application/pdf',
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    const today = new Date().toISOString().slice(0, 10)

    a.href = url
    a.download = `FormatosGenerales_${today}.pdf`
    a.click()

    URL.revokeObjectURL(url)

    Notify.create({
      type: 'positive',
      message: 'PDF consolidado descargado.',
    })
  }

  async function descargarArboles() {
    const token = getToken()

    if (!token) {
      Notify.create({
        type: 'warning',
        message: 'Debes iniciar sesión para descargar los PDFs',
      })
      return
    }

    const formatos = ['FormatoArbolDeProblemas', 'FormatoArbolDeObjetivos']

    Notify.create({
      type: 'info',
      message: 'Preparando árbol de problemas y objetivos...',
    })

    const { PDFDocument } = await import('pdf-lib')
    const mergedPdf = await PDFDocument.create()

    for (const formato of formatos) {
      try {
        const buffer = await fetchPdfArrayBuffer(formato)

        const pdf = await PDFDocument.load(buffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())

        pages.forEach((p) => mergedPdf.addPage(p))
      } catch (err) {
        console.warn(`No se pudo descargar ${formato}`, err)
        Notify.create({
          type: 'warning',
          message: `El documento no incluye ${formato}: no se pudo descargar.`,
        })
      }
    }

    const mergedBytes = await mergedPdf.save()

    const blob = new Blob([mergedBytes], {
      type: 'application/pdf',
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    const today = new Date().toISOString().slice(0, 10)

    a.href = url
    a.download = `FormatoArbolProblemasObjetivos_${today}.pdf`
    a.click()

    URL.revokeObjectURL(url)

    Notify.create({
      type: 'positive',
      message: 'PDF de árboles descargado.',
    })
  }

  return {
    descargarPdf,
    descargarFicha,
    descargarTodasLasFichas,
    descargarTodos,
    descargarArboles,
    obtenerIndicadores,
    obtenerFichas: obtenerIndicadores,
  }
}
