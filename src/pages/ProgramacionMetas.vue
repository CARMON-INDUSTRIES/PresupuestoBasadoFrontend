<template>
  <q-page padding class="metas-page">
    <q-card flat class="metas-card">
      <q-card-section class="card-header">
        <div class="text-h5 text-center text-weight-bold">Programación de Metas</div>

        <div class="text-subtitle2 text-center text-grey-7 q-mt-sm">
          Seguimiento mensual de indicadores y avances programados
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-banner rounded class="bg-blue-1 text-primary q-mb-md" v-if="indicadores.length">
          <q-icon name="analytics" size="sm" class="q-mr-sm" />
          Indicadores cargados:
          <strong>{{ indicadores.length }}</strong>
        </q-banner>

        <q-select
          v-if="indicadores.length"
          v-model="indiceSeleccionado"
          :options="optionsIndicadores"
          label="Selecciona un indicador"
          outlined
          emit-value
          map-options
        >
          <template #prepend>
            <q-icon name="track_changes" color="primary" />
          </template>
        </q-select>

        <div v-else class="empty-state text-center q-pa-xl">
          <q-icon name="warning_amber" size="60px" color="negative" />
          <div class="text-h6 q-mt-md">No hay indicadores disponibles</div>
        </div>
      </q-card-section>

      <q-card-section v-if="indicadorActivo">
        <q-markup-table flat bordered class="tabla-metas">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Programado</th>
              <th>Alcanzado</th>
              <th>Semáforo</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(meta, index) in indicadorActivo.metasProgramadas || []" :key="index">
              <td>
                <strong>{{ meta.mes ?? index + 1 }}</strong>
              </td>

              <td>
                {{ meta.cantidadEsperada ?? meta.cantidad ?? 0 }}
              </td>

              <td style="width: 200px">
                <q-input v-model.number="meta.alcanzado" type="number" dense outlined />
              </td>

              <td style="width: 200px">
                <q-badge
                  rounded
                  :color="obtenerColorSemaforo(meta)"
                  class="full-width q-pa-sm text-center"
                >
                  {{ obtenerTextoSemaforo(meta) }}
                </q-badge>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pa-lg acciones-footer">
        <q-btn
          color="primary"
          icon="save"
          label="Guardar cambios"
          rounded
          unelevated
          @click="guardarCambios"
          :disable="!indicadorActivo"
        />

        <div class="mensaje-ayuda">
          <q-icon name="info" color="orange" />
          Primero guarde los cambios y posteriormente descargue las fichas actualizadas.
        </div>

        <q-btn
          color="deep-orange"
          icon="picture_as_pdf"
          label="Descargar fichas actualizadas"
          rounded
          unelevated
          @click="descargarPdfActualizado"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { useProgramacionMetas } from 'src/composables/pages/useProgramacionMetas'

const state = useProgramacionMetas()
const {
  indicadores,
  indiceSeleccionado,
  optionsIndicadores,
  indicadorActivo,
  guardarCambios,
  obtenerColorSemaforo,
  obtenerTextoSemaforo,
  descargarPdfActualizado,
} = state
</script>

<style scoped src="src/css/pages/ProgramacionMetas.css" />
