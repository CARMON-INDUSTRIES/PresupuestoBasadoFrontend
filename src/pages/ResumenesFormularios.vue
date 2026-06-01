<template>
  <q-page padding class="resumen-page">
    <q-card flat class="resumen-card">
      <q-card-section class="header-section">
        <div class="text-h4 text-center text-weight-bold titulo-principal">Resúmenes Generales</div>

        <div class="text-subtitle2 text-center text-grey-7 q-mt-sm">
          Descarga todos los formatos y anexos generados por el sistema
        </div>
      </q-card-section>

      <q-separator />

      <q-list class="q-pa-md">
        <q-expansion-item
          icon="flag"
          label="Formato Alineación de la Matriz de Indicadores"
          expand-separator
          class="expansion-card q-mb-sm"
        >
          <q-card flat class="formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">
                Formato 1 Alineación de la Matriz de Indicadores Para Resultados al Plan Municipal
                de Desarrollo
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="download"
                label="Descargar PDF"
                @click="descargarPdf('FormatoAlineacion')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="article"
          label="Formato Ficha de Información Básica"
          expand-separator
          class="expansion-card q-mb-sm"
        >
          <q-card flat class="formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">
                Anexo 1 Ficha de Información Básica
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="download"
                label="Descargar PDF"
                @click="descargarPdf('FormatoFichaDeInformacionBasica1')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="crisis_alert"
          label="Formato Definición del Problema"
          expand-separator
          class="expansion-card q-mb-sm"
        >
          <q-card flat class="formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">Anexo 2 Definición del Problema</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="download"
                label="Descargar PDF"
                @click="descargarPdf('FormatoDefinicionDelProblema')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="groups"
          label="Formato Análisis de Involucrados"
          expand-separator
          class="expansion-card q-mb-sm"
        >
          <q-card flat class="formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">Anexo 3 Análisis de Involucrados</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="download"
                label="Descargar PDF"
                @click="descargarPdf('FormatoAnalisisDeInvolucrados')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="account_tree"
          label="Árbol de Problemas y Objetivos"
          expand-separator
          class="expansion-card q-mb-sm"
        >
          <q-card flat class="formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">
                Anexos 4 y 5: Árbol de Problemas y Objetivos
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="download"
                label="Descargar PDF"
                @click="descargarArboles"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="hub"
          label="Formato Análisis de Alternativas"
          expand-separator
          class="expansion-card q-mb-sm"
        >
          <q-card flat class="formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">Anexo 6 Análisis de Alternativas</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="download"
                label="Descargar PDF"
                @click="descargarPdf('FormatoAnalisisInvolucrados')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="schema"
          label="Formato Estructura Analítica"
          expand-separator
          class="expansion-card q-mb-sm"
        >
          <q-card flat class="formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">Anexo 7 Estructura Analítica</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="download"
                label="Descargar PDF"
                @click="descargarPdf('FormatoEstructuraAnalitica')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="table_chart"
          label="Matriz de Indicadores"
          expand-separator
          class="expansion-card q-mb-sm"
        >
          <q-card flat class="formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">
                Matriz de Indicadores para Resultados
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="download"
                label="Descargar PDF"
                @click="descargarPdf('FormatoMatriz')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          icon="monitoring"
          label="Ficha Técnica del Indicador"
          expand-separator
          class="expansion-card"
        >
          <q-card flat class="formato-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-medium">Ficha Técnica del Indicador</div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                color="primary"
                rounded
                unelevated
                icon="download"
                label="Descargar PDF"
                @click="descargarPdf('FormatoFichaFinal')"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </q-list>

      <q-separator class="q-my-lg" />

      <q-card-actions align="center" class="q-pb-xl">
        <q-btn
          color="deep-orange"
          size="lg"
          rounded
          unelevated
          icon="download_for_offline"
          label="Descargar TODOS los PDF"
          @click="descargarTodos"
          class="btn-descargar"
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
  background: linear-gradient(135deg, #691b31, #7f1d35);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.resumen-card {
  width: 100%;
  max-width: 1150px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.header-section {
  padding-top: 30px;
  padding-bottom: 25px;
}

.titulo-principal {
  color: #691b31;
  letter-spacing: 1px;
}

.expansion-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.25s ease;
  border: 1px solid #ececec;
  margin-bottom: 12px;
}

.expansion-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(105, 27, 49, 0.15);
}

.formato-card {
  background: #fafafa;
  border-radius: 12px;
  margin: 10px;
}

.btn-descargar {
  font-weight: 700;
  padding-left: 40px;
  padding-right: 40px;
  min-height: 52px;
  box-shadow: 0 6px 15px rgba(255, 87, 34, 0.35);
}

:deep(.q-expansion-item__container) {
  background: white;
}

:deep(.q-expansion-item__toggle-icon) {
  color: #691b31;
}

:deep(.q-item__label) {
  font-weight: 600;
}

:deep(.q-btn) {
  text-transform: none;
}
</style>
