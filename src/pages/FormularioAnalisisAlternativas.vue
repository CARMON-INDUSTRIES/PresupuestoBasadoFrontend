<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Análisis de Alternativas</h1>
        <p class="page-subtitle">
          Evalúa la viabilidad de los componentes y actividades de la intervención pública.
        </p>
      </div>

      <q-card flat class="modern-card">
        <q-card-section>
          <div class="section-title">Matriz de evaluación</div>

          <q-table
            flat
            bordered
            :rows="tabla"
            :columns="columns"
            row-key="nombre"
            separator="cell"
            :rows-per-page-options="[0]"
            class="modern-table"
          >
            <template v-slot:body-cell="props">
              <q-td :props="props">
                <template v-if="props.col.name === 'nombre'">
                  <div class="nombre-cell">
                    {{ props.row.nombre }}
                  </div>
                </template>

                <template v-else-if="props.col.editable">
                  <q-select
                    v-model="props.row[props.col.name]"
                    :options="opciones"
                    dense
                    outlined
                    emit-value
                    map-options
                    class="score-select"
                  />
                </template>

                <template v-else-if="props.col.name === 'total'">
                  <div class="total-cell">
                    {{ calcularTotal(props.row) }}
                  </div>
                </template>

                <template v-else-if="props.col.name === 'probabilidad'">
                  <q-badge
                    :color="getColor(calcularProbabilidad(props.row))"
                    text-color="white"
                    class="probabilidad-badge"
                  >
                    {{ calcularProbabilidad(props.row) }}%
                  </q-badge>
                </template>
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right" class="actions-container q-pa-md">
          <q-btn
            label="Pantalla Anterior"
            rounded
            unelevated
            class="secondary-btn"
            to="formulario-arbol-objetivos"
            :loading="saving"
          />

          <q-btn
            label="Confirmar"
            rounded
            unelevated
            class="warning-btn"
            @click="validarConfirmar"
          />

          <q-btn label="Continuar" rounded unelevated class="primary-btn" @click="continuarFlujo" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useFormularioAnalisisAlternativas } from 'src/composables/pages/useFormularioAnalisisAlternativas'

const state = useFormularioAnalisisAlternativas()
const {
  saving,
  tabla,
  columns,
  opciones,
  calcularTotal,
  calcularProbabilidad,
  getColor,
  validarConfirmar,
  continuarFlujo,
} = state
</script>

<style scoped src="src/css/pages/FormularioAnalisisAlternativas.css" />
