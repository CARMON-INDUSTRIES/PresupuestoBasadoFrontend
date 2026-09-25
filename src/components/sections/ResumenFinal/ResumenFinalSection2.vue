<template>
  <q-tab-panel name="parte3">
    <q-card-section ref="parte3">
      <div class="text-subtitle1">Programa Social</div>
      <q-list dense>
        <q-item-label
          >¿Es Programa Social?:
          {{ resumen.programa?.esProgramaSocial ? 'Sí' : 'No' }}</q-item-label
        >
        <q-item-label>
          Categorías:
          <span v-if="resumen.programa?.categorias?.length">
            <ul>
              <li v-for="(cat, idx) in resumen.programa.categorias" :key="idx">
                {{ cat.nombre || JSON.stringify(cat) }}
              </li>
            </ul>
          </span>
          <span v-else>-</span>
        </q-item-label>
      </q-list>

      <q-separator class="q-my-md" />

      <div class="text-subtitle1">Padrón de Beneficiarios</div>
      <q-list dense>
        <q-item-label>¿Tiene Padrón?: {{ resumen.padron?.tienePadron ? 'Sí' : 'No' }}</q-item-label>
        <q-item-label>Archivo Adjunto: {{ resumen.padron?.archivoAdjunto || 'N/A' }}</q-item-label>
        <q-item-label>
          Liga Internet:
          <a
            v-if="resumen.padron?.ligaInternet"
            :href="resumen.padron.ligaInternet"
            target="_blank"
          >
            {{ resumen.padron.ligaInternet }}
          </a>
          <span v-else>-</span>
        </q-item-label>
      </q-list>

      <q-separator class="q-my-md" />

      <div class="text-subtitle1">Reglas de Operación</div>
      <q-list dense>
        <q-item-label
          >¿Tiene Reglas?: {{ resumen.reglas?.tieneReglasOperacion ? 'Sí' : 'No' }}</q-item-label
        >
        <q-item-label>Archivo Adjunto: {{ resumen.reglas?.archivoAdjunto || 'N/A' }}</q-item-label>
        <q-item-label>
          Liga Internet:
          <a
            v-if="resumen.reglas?.ligaInternet"
            :href="resumen.reglas.ligaInternet"
            target="_blank"
          >
            {{ resumen.reglas.ligaInternet }}
          </a>
          <span v-else>-</span>
        </q-item-label>
      </q-list>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          icon="picture_as_pdf"
          label="Descargar PDF Parte 3"
          @click="descargarPdfParte('parte3')"
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
