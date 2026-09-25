<template>
  <q-list dense>
    <q-item clickable v-ripple @click="$router.push('/formulario-alineacion')">
      <q-item-section avatar><q-icon name="badge" /></q-item-section>
      <q-item-section>Alineación</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-clasificacion')">
      <q-item-section avatar><q-icon name="architecture" /></q-item-section>
      <q-item-section>Clasificación Funcional</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-antecedente')">
      <q-item-section avatar><q-icon name="category" /></q-item-section>
      <q-item-section>Antecedentes</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-identificacion-problema')">
      <q-item-section avatar><q-icon name="feed" /></q-item-section>
      <q-item-section>Identificación y Descripción del Problema</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-determinacion-justificacion')">
      <q-item-section avatar><q-icon name="grid_on" /></q-item-section>
      <q-item-section>Determinación y Justificación</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-cobertura')">
      <q-item-section avatar><q-icon name="history" /></q-item-section>
      <q-item-section>Cobertura</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-diseno-intervencion')">
      <q-item-section avatar><q-icon name="report_problem" /></q-item-section>
      <q-item-section>Diseño de la Intervención Pública</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-reglas-operacion-detalle')">
      <q-item-section avatar><q-icon name="rule" /></q-item-section>
      <q-item-section>Reglas Operación (detalle)</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-programa-social')">
      <q-item-section avatar><q-icon name="public" /></q-item-section>
      <q-item-section>Programa Social</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-padron-beneficiarios')">
      <q-item-section avatar><q-icon name="gavel" /></q-item-section>
      <q-item-section>Padrón beneficiarios</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-reglas-operacion')">
      <q-item-section avatar><q-icon name="groups" /></q-item-section>
      <q-item-section>Reglas Operación</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/PoblacionAreaEnfoquePotencial')">
      <q-item-section avatar><q-icon name="list_alt" /></q-item-section>
      <q-item-section>Definición del Problema</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/FormularioAnalisisInvolucrados')">
      <q-item-section avatar><q-icon name="menu_book" /></q-item-section>
      <q-item-section>Análisis de Involucrados</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-arbol-problemas')">
      <q-item-section avatar><q-icon name="people" /></q-item-section>
      <q-item-section>Árbol de Problemas</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-arbol-objetivos')">
      <q-item-section avatar><q-icon name="diversity_3" /></q-item-section>
      <q-item-section>Árbol de Objetivos</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-analisis-alternativas')">
      <q-item-section avatar><q-icon name="device_hub" /></q-item-section>
      <q-item-section>Análisis de Alternativas</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-estructura-analitica')">
      <q-item-section avatar><q-icon name="account_tree" /></q-item-section>
      <q-item-section>Estructura Analítica</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-matriz-indicadores')">
      <q-item-section avatar><q-icon name="alt_route" /></q-item-section>
      <q-item-section>Matriz de Indicadores</q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="$router.push('/formulario-ficha-tecnica-1')">
      <q-item-section avatar><q-icon name="schema" /></q-item-section>
      <q-item-section>Ficha Técnica</q-item-section>
    </q-item>
  </q-list>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('EmptyLayout')
  },
}
</script>
<style scoped src="src/css/pages/EmptyLayout.css" />
