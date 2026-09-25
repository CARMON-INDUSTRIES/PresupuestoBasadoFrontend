<template>
  <q-page padding class="bg-secondary">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h5">Alineación de la Matriz de Indicadores para Resultados</div>
      </q-card-section>

      <q-tabs v-model="parteActiva" class="text-primary">
        <q-tab name="parte1" label="Parte 1" />
        <q-tab name="parte2" label="Parte 2" />
        <q-tab name="parte3" label="Parte 3" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="parteActiva" animated>
        <q-tab-panel name="parte1">
          <q-card-section ref="parte1Ref">
            <div class="text-subtitle1">Datos del Usuario</div>
            <q-list dense>
              <q-item-label>Nombre Completo: Luis Ramon Hernandez Rodriguez</q-item-label>
              <q-item-label>Cargo: Director de Proyectos Especiales</q-item-label>
              <q-item-label>Coordinador: María López Hernández</q-item-label>
              <q-item-label
                >Unidad Responsable: {{ resumen.usuario.unidadResponsable }}</q-item-label
              >
              <q-item-label
                >Unidades Presupuestales: {{ resumen.usuario.unidadesPresupuestales }}</q-item-label
              >
              <q-item-label
                >Programa Presupuestario: {{ resumen.usuario.programaPresupuestario }}</q-item-label
              >
              <q-item-label>Nombre Matriz: {{ resumen.usuario.nombreMatriz }}</q-item-label>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1">Alineación {{ resumen.tipoAlineacion }}</div>
            <q-list dense>
              <q-item-label>Acuerdo: {{ resumen.alineacion?.acuerdo }}</q-item-label>
              <q-item-label>Objetivo: {{ resumen.alineacion?.objetivo }}</q-item-label>
              <q-item-label>Estrategia: {{ resumen.alineacion?.estrategia }}</q-item-label>
              <q-item-label>Línea de Acción: {{ resumen.alineacion?.lineaAccion }}</q-item-label>
              <q-item-label>Ramo: {{ resumen.alineacion?.ramo }}</q-item-label>
            </q-list>

            <q-separator class="q-my-md" />

            <div class="text-subtitle1">Clasificación Funcional</div>
            <q-list dense>
              <q-item-label>Finalidad: {{ resumen.clasificacion?.finalidad }}</q-item-label>
              <q-item-label>Función: {{ resumen.clasificacion?.funcion }}</q-item-label>
              <q-item-label>Subfunción: {{ resumen.clasificacion?.subfuncion }}</q-item-label>
              <q-item-label>Año Operando: {{ resumen.clasificacion?.anioOperando }}</q-item-label>
              <q-item-label
                >Entrega de Bienes: {{ resumen.clasificacion?.entregaBienes }}</q-item-label
              >
            </q-list>

            <q-card-actions align="right">
              <q-card-actions align="right">
                <q-btn
                  color="primary"
                  icon="picture_as_pdf"
                  label="Descargar PDF Parte 1"
                  @click="descargarPdfParte('parte1')"
                />
              </q-card-actions>
            </q-card-actions>
          </q-card-section>
        </q-tab-panel>

        <ResumenFinalSection1 />

        <ResumenFinalSection2 />
      </q-tab-panels>

      <q-card-actions align="right" class="q-mt-md">
        <q-btn
          color="deep-orange"
          icon="picture_as_pdf"
          label="Descargar TODO en PDF"
          @click="descargarPdfCompleto"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useResumenFinal } from 'src/composables/pages/useResumenFinal'
import ResumenFinalSection1 from 'src/components/sections/ResumenFinal/ResumenFinalSection1.vue'
import ResumenFinalSection2 from 'src/components/sections/ResumenFinal/ResumenFinalSection2.vue'
const state = useResumenFinal()
provide('ResumenFinal', state)
const { parteActiva, resumen, parte1Ref, descargarPdfParte, descargarPdfCompleto } = state
</script>
