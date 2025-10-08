<template>
  <q-page padding class="resumen-page" style="background-color: #691b31">
    <q-card flat bordered class="resumen-card q-pa-lg">
      <q-card-section>
        <div class="text-h4 text-center text-primary q-mb-md">Resúmenes Generales</div>
      </q-card-section>

      <q-separator spaced />

      <q-list class="rounded-borders shadow-2 q-pa-sm">
        <!-- Formato Alineación -->
        <q-expansion-item
          icon="map"
          label="Formato Alineación"
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
                @click="descargarPdf('FormatoAlineacion')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <!-- Formato Análisis de Involucrados -->
        <q-expansion-item
          icon="groups"
          label="Formato Análisis de Involucrados"
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
                @click="descargarPdf('FormatoAnalisisInvolucrados')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <!-- Formato Análisis De Involucrados -->
        <q-expansion-item
          icon="diversity_3"
          label="Formato Análisis De Involucrados"
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
                @click="descargarPdf('FormatoAnalisisDeInvolucrados')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <!-- Formato Definición del Problema -->
        <q-expansion-item
          icon="analytics"
          label="Formato Definición del Problema"
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
                @click="descargarPdf('FormatoDefinicionDelProblema')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <!-- Formato Ficha de Información Básica -->
        <q-expansion-item
          icon="description"
          label="Formato Ficha de Información Básica"
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
                @click="descargarPdf('FormatoFichaDeInformacionBasica2')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </q-list>

      <q-separator spaced class="q-my-lg" />

      <!-- Botón general -->
      <q-card-actions align="center">
        <q-btn
          color="deep-orange"
          rounded
          icon="picture_as_pdf"
          label="Descargar TODOS los PDFs"
          @click="descargarTodos"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { Notify } from 'quasar'

// Detecta entorno
const isLocal = window.location.hostname === 'localhost'
const API_BASE_URL = isLocal
  ? 'https://localhost:7125/api'
  : 'https://presupuestobr2025.somee.com/api'

// Obtiene el token guardado (ajusta según tu login)
function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

// 🔽 Descargar un PDF autenticado
async function descargarPdf(formato) {
  const token = getToken()
  if (!token) {
    Notify.create({ type: 'warning', message: 'Debes iniciar sesión para descargar el PDF' })
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${formato}/ultimo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error('Error al generar el PDF')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${formato}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)

    Notify.create({ type: 'positive', message: `Descarga completa: ${formato}.pdf` })
  } catch (error) {
    console.error(error)
    Notify.create({ type: 'negative', message: 'Error al descargar el PDF' })
  }
}

// 🔽 Descargar todos los PDFs
async function descargarTodos() {
  const formatos = [
    'FormatoAlineacion',
    'FormatoAnalisisInvolucrados',
    'FormatoAnalisisDeInvolucrados',
    'FormatoDefinicionDelProblema',
    'FormatoFichaDeInformacionBasica2',
  ]

  for (const f of formatos) {
    await descargarPdf(f)
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
