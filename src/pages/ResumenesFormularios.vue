<template>
  <q-page padding class="resumen-page" style="background-color: #691b31">
    <q-card flat bordered class="resumen-card q-pa-lg">
      <q-card-section>
        <div class="text-h4 text-center text-primary q-mb-md">Resúmenes Generales</div>
      </q-card-section>

      <q-separator spaced />

      <q-list class="rounded-borders shadow-2 q-pa-sm">
        <q-expansion-item
          icon="person_outline"
          label="Formato Alineación de la Matriz de Indicadores "
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label
                >Formato 1 Alineación de la Matriz de Indicadores Para Resultados al Plan Municipal
                de Desarrollo
              </q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                dense
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarPdf('FormatoAlineacion')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="groups"
          label="Formato Ficha de Informacion Básica"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label>Anexo 1 Ficha de Informacion Básica</q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                dense
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarPdf('FormatoFichaDeInformacionBasica1')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="group_work"
          label="Formato Definicion Del Problema"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label>Anexo 2 Definicion del Problema</q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                dense
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarPdf('FormatoDefinicionDelProblema')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="analytics"
          label="Formato Analisis de Involucrados"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label>Anexo 3 Análisis de Involucrados </q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                dense
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarPdf('FormatoAnalisisDeInvolucrados')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="description"
          label="Formato Arbol de Problemas y Objetivos"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label>Anexo 4 y 5: Árbol de Problemas y objetivos </q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                dense
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarArboles"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <!-- Formato Árbol de Problemas -->
        <!--<q-expansion-item
          icon="account_tree"
          label="Formato Árbol de Objetivos"
          expand-separator
          class="expansion-card"
        >
           <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label>Anexo 5 Árbol de Objetivos </q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                dense
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarPdf('FormatoArbolDeObjetivos')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item> -->

        <q-expansion-item
          icon="account_tree"
          label="Formato Analisis de Alternativas"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label>Anexo 6 Análisis de Alternativas </q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                dense
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarPdf('FormatoAnalisisInvolucrados')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="description"
          label="Formato Estructura Analitica"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label>Descargar PDF directamente desde el backend</q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                dense
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarPdf('FormatoEstructuraAnalitica')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="groups"
          label="Formato Matriz"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label>Descargar PDF directamente desde el backend</q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                dense
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarPdf('FormatoMatriz')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="account_tree"
          label="Formato Ficha Tecnica Del Indicador"
          expand-separator
          class="expansion-card"
        >
          <q-card flat bordered class="q-ma-sm formato-card">
            <q-card-section>
              <q-item-label>Descargar PDF directamente desde el backend</q-item-label>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                dense
                icon="picture_as_pdf"
                label="Descargar PDF"
                @click="descargarPdf('FormatoFichaFinal')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </q-list>

      <q-separator spaced class="q-my-lg" />

      <q-card-actions align="center">
        <q-btn
          color="deep-orange"
          rounded
          icon="picture_as_pdf"
          label="Descargar TODOS los PDF"
          @click="descargarTodos"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { Notify } from 'quasar'
import { PDFDocument } from 'pdf-lib'

const isLocal = window.location.hostname === 'localhost'
const API_BASE_URL = isLocal
  ? 'https://localhost:7125/api'
  : 'https://presupuestobr2025.somee.com/api'

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
</script>

<style scoped>
.resumen-page {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.resumen-card {
  max-width: 1100px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
}

.expansion-card {
  transition: transform 0.2s;
}

.expansion-card:hover {
  transform: translateY(-2px);
}

.formato-card {
  background-color: #fafafa;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
</style>
