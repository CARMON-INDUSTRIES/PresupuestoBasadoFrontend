<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1200px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center text-black">Ficha Técnica del Indicador</div>
      </q-card-section>

      <q-card-section class="q-pa-md bg-grey-2">
        <div class="text-h6 q-mb-md">Datos de Identificación del Programa</div>
        <q-markup-table flat bordered>
          <tbody>
            <tr>
              <td class="bg-primary text-white text-weight-bold">Unidad Responsable</td>
              <td>{{ usuario.nombreCompleto || '' }}</td>
              <td class="bg-primary text-white text-weight-bold">Unidad Presupuestal</td>
              <td>{{ usuario.unidadesPresupuestales || '' }}</td>
            </tr>
            <tr>
              <td class="bg-primary text-white text-weight-bold">Clave del Indicador</td>
              <td>{{ claveIndicador || '' }}</td>
              <td class="bg-primary text-white text-weight-bold">Programa Presupuestario</td>
              <td>{{ usuario.programaPresupuestario || '' }}</td>
            </tr>
            <tr>
              <td class="bg-primary text-white text-weight-bold">Tipo de Indicador</td>
              <td>{{ tipoIndicador }}</td>
              <td class="bg-primary text-white text-weight-bold">
                Responsable de la Elaboración de la MIR
              </td>
              <td>{{ usuario.nombreCompleto || '' }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-card-section v-if="indicadores.length">
        <div class="text-h6 q-mb-md">Seleccionar Indicador</div>
        <div class="row q-col-gutter-sm no-wrap scroll-x">
          <q-btn
            v-for="(ind, index) in indicadores"
            :key="'btn-' + index"
            :label="index + 1 + '. ' + (ind.indicadores || 'Sin nombre')"
            flat
            class="q-ma-xs"
            :color="indiceSeleccionado === index ? 'primary' : 'grey-7'"
            text-color="black"
            @click="indiceSeleccionado = index"
          />
        </div>
      </q-card-section>

      <template v-if="indicadorActivo">
        <DatosBasicosIndicador v-model="indicadorActivo" :lineas-accion="filtradas" />

        <FormulaIndicador v-model="indicadorActivo" :siglas="siglas" />

        <MetasIndicador v-model="indicadorActivo" />
      </template>

      <q-card-actions align="right" v-if="indicadores.length">
        <q-btn
          label="Pantalla Anterior"
          color="primary"
          text-color="white"
          rounded
          unelevated
          class="registrar"
          to="formulario-estructura-analitica"
          :loading="loading"
        />
        <q-btn
          color="primary"
          label="Guardar"
          :loading="loading"
          rounded
          class="submit-btn"
          @click="guardar"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { useFormularioFichaTecnica1 } from 'src/composables/pages/useFormularioFichaTecnica1'

const state = useFormularioFichaTecnica1()
const {
  usuario,
  claveIndicador,
  tipoIndicador,
  indicadores,
  indiceSeleccionado,
  siglas,
  loading,
  indicadorActivo,
  filtradas,
  guardar,
  DatosBasicosIndicador,
  FormulaIndicador,
  MetasIndicador,
} = state
</script>

<style scoped src="src/css/pages/FormularioFichaTecnica1.css" />
