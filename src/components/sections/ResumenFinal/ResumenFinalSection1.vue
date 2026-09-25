<template>
  <q-tab-panel name="parte2">
    <q-card-section ref="parte2Ref">
      <div class="text-subtitle1">Antecedente</div>
      <q-list dense>
        <q-item-label>Descripción: {{ resumen.antecedente?.descripcionPrograma }}</q-item-label>
        <q-item-label
          >Contexto Histórico: {{ resumen.antecedente?.contextoHistoricoNormativo }}</q-item-label
        >
        <q-item-label>Problemática: {{ resumen.antecedente?.problematicaOrigen }}</q-item-label>
        <q-item-label
          >Experiencias Previas: {{ resumen.antecedente?.experienciasPrevias }}</q-item-label
        >
      </q-list>

      <q-separator class="q-my-md" />

      <div class="text-subtitle1">Identificación del Problema</div>
      <q-list dense>
        <q-item-label>Problema Central: {{ resumen.identificacion?.problemaCentral }}</q-item-label>
        <q-item-label>Involucrados: {{ resumen.identificacion?.involucrados }}</q-item-label>
        <q-item-label>Causas: {{ resumen.identificacion?.causas }}</q-item-label>
        <q-item-label>Efectos: {{ resumen.identificacion?.efectos }}</q-item-label>
        <q-item-label>Evolución: {{ resumen.identificacion?.evolucion }}</q-item-label>
      </q-list>

      <q-separator class="q-my-md" />

      <div class="text-subtitle1">Objetivos</div>
      <q-list dense>
        <q-item-label
          >Objetivos Específicos: {{ resumen.objetivos?.objetivosEspecificos }}</q-item-label
        >
        <q-item-label
          >Relación con Otros Programas:
          {{ resumen.objetivos?.relacionOtrosProgramas }}</q-item-label
        >
      </q-list>

      <q-separator class="q-my-md" />

      <div class="text-subtitle1">Cobertura</div>
      <q-list dense>
        <q-item-label
          >Población Potencial:
          {{ resumen.cobertura?.identificacionCaracterizacionPoblacionPotencial }}</q-item-label
        >
        <q-item-label
          >Población Objetivo:
          {{ resumen.cobertura?.identificacionCaracterizacionPoblacionObjetivo }}</q-item-label
        >
      </q-list>

      <q-separator class="q-my-md" />

      <div class="text-subtitle1">Diseño de la Intervención Pública</div>
      <div v-if="resumen.diseno?.componentes?.length">
        <div
          v-for="(comp, idx) in resumen.diseno.componentes"
          :key="idx"
          class="q-pa-sm q-mb-sm bg-grey-2 rounded-borders"
        >
          <div class="text-subtitle2">{{ comp.nombre || `Componente ${idx + 1}` }}</div>
          <div><strong>Acciones:</strong></div>
          <ul>
            <li v-for="(a, i) in comp.acciones" :key="'a' + i">{{ a }}</li>
          </ul>
          <div><strong>Resultados:</strong></div>
          <ul>
            <li v-for="(r, i) in comp.resultados" :key="'r' + i">{{ r }}</li>
          </ul>
        </div>
      </div>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          icon="picture_as_pdf"
          label="Descargar PDF Parte 2"
          @click="descargarPdfParte('parte2')"
        />
      </q-card-actions>
    </q-card-section>
  </q-tab-panel>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('ResumenFinal')
  },
}
</script>
