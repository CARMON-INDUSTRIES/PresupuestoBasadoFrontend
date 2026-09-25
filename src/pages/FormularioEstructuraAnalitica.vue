<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Estructura Analítica del Programa Presupuestario</h1>
        <p class="page-subtitle">
          Relación entre la problemática central y la solución propuesta derivada del árbol de
          problemas y objetivos.
        </p>
      </div>

      <q-card flat class="modern-card">
        <q-card-section>
          <div class="section-title">Matriz analítica</div>

          <q-table
            flat
            bordered
            :rows="tabla"
            :columns="columns"
            row-key="campo"
            separator="cell"
            class="modern-table"
            :rows-per-page-options="[0]"
          >
            <template v-slot:body-cell="props">
              <q-td :props="props">
                <div class="table-content" v-html="props.value"></div>
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
            to="formulario-analisis-alternativas"
          />

          <q-btn
            label="Continuar"
            rounded
            unelevated
            class="primary-btn"
            @click="irAMatrizIndicadores"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useFormularioEstructuraAnalitica } from 'src/composables/pages/useFormularioEstructuraAnalitica'

const state = useFormularioEstructuraAnalitica()
const { tabla, columns, irAMatrizIndicadores } = state
</script>

<style scoped src="src/css/pages/FormularioEstructuraAnalitica.css" />
