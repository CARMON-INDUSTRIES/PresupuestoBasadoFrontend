<template>
  <q-table
    flat
    bordered
    separator="cell"
    :rows="filas"
    :columns="columns"
    row-key="nivel"
    :pagination="{ rowsPerPage: 0 }"
    class="mir-table"
  >
    <template v-slot:body-cell="props">
      <q-td :props="props">
        <template v-if="props.col.name === 'nivel'">
          <div class="text-grey-8 text-weight-bold">
            {{ textoBaseNivel(props.row.nivel) }}
          </div>

          <div class="text-caption text-grey-6 q-mt-xs">
            {{ props.row.nivel }}
          </div>
        </template>

        <template v-else-if="props.col.name === 'resumenNarrativo'">
          <div class="row items-center no-wrap full-width">
            <div class="col">
              <div v-if="props.row.resumenNarrativo" class="texto-celda">
                {{ props.row.resumenNarrativo }}
              </div>

              <div v-else class="text-grey-5 italic">Sin capturar</div>
            </div>

            <div class="col-auto row q-gutter-xs">
              <q-btn
                size="sm"
                flat
                round
                color="primary"
                icon="edit"
                @click="abrirModal(props.row)"
              >
                <q-tooltip>
                  {{ props.row.resumenNarrativo ? 'Editar captura' : 'Capturar información' }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>

        <template v-else-if="props.col.name === 'indicadores'">
          <div class="texto-celda">
            {{ props.row.indicadores || '—' }}
          </div>
        </template>

        <template v-else-if="props.col.name === 'medios'">
          <div class="texto-celda">
            {{ props.row.medios || '—' }}
          </div>
        </template>

        <template v-else-if="props.col.name === 'supuestos'">
          <div class="texto-celda">
            {{ props.row.supuestos || '—' }}
          </div>
        </template>
      </q-td>
    </template>
  </q-table>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('FormularioMatrizIndicadores')
  },
}
</script>
<style scoped src="src/css/pages/FormularioMatrizIndicadores.css" />
