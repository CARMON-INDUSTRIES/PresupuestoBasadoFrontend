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
              <q-item-label>Anexo 7 Estructura Analitica</q-item-label>
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
              <q-item-label>Matriz Indicadores</q-item-label>
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
              <q-item-label>Ficha del Indicador</q-item-label>
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
import { useResumenDownload } from 'src/router/useResumenDownload.js'

const { descargarPdf, descargarTodos, descargarArboles } = useResumenDownload()
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
