<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-tabs v-model="tab" dense class="bg-primary text-white" align="justify">
        <q-tab name="estatal" label="Plan Estatal" />
        <q-tab name="municipal" label="Plan Municipal" />
        <q-tab name="clasificacion" label="Clasificación Funcional" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="estatal">
          <h6>Plan Estatal</h6>
          <PlanEditor
            v-model="planEstatal"
            nivel1="Acuerdo"
            nivel2="Objetivo"
            nivel3="Estrategia"
            nivel4="Línea de Acción"
          />
        </q-tab-panel>

        <q-tab-panel name="municipal">
          <h6>Plan Municipal</h6>
          <PlanEditor
            v-model="planMunicipal"
            nivel1="Acuerdo"
            nivel2="Objetivo"
            nivel3="Estrategia"
            nivel4="Línea de Acción"
          />
        </q-tab-panel>

        <q-tab-panel name="clasificacion">
          <h6>Clasificación Funcional</h6>
          <PlanEditor
            v-model="clasificacionFuncional"
            nivel1="Finalidad"
            nivel2="Función"
            nivel3="Subfunción"
          />
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions align="right">
        <q-btn color="positive" label="Guardar" @click="guardar" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRegistroDatos } from 'src/composables/pages/useRegistroDatos'

const state = useRegistroDatos()
const { tab, planEstatal, planMunicipal, clasificacionFuncional, guardar, PlanEditor } = state
</script>
