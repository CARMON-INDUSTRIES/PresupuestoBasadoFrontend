<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1000px; margin: auto">
      <q-card-section class="row items-center justify-between">
        <div class="form-title">Editar Componentes</div>
        <q-btn
          color="secondary"
          label="Regresar al análisis de alternativas"
          rounded
          @click="router.push('/Formulario-analisis-alternativas')"
        />
      </q-card-section>
      <q-separator color="#691b31" spaced />

      <div v-if="componentes.length" class="q-mt-md">
        <div
          v-for="comp in componentes"
          :key="comp.id"
          class="q-pa-sm bg-grey-2 q-mb-sm rounded-borders"
        >
          <div class="row items-center justify-between">
            <div class="text-subtitle2"><q-icon name="widgets" /> {{ comp.nombre }}</div>
            <q-btn dense flat round icon="edit" color="primary" @click="editarComponente(comp)" />
          </div>

          <div v-for="accion in comp.acciones" :key="accion.id" class="q-ml-md row items-center">
            <strong class="col">
              <q-icon name="task_alt" /> {{ accion.descripcion }} ({{ accion.cantidad }})
            </strong>
          </div>

          <div class="q-ml-md q-mt-sm">
            <em>
              <q-icon name="flare" />
              {{ comp.resultado?.descripcion }}
            </em>
          </div>
        </div>
      </div>

      <q-skeleton v-else animated width="100%" height="150px" class="q-mt-md" />
    </q-card>

    <EditarComponentesSection1 />
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useEditarComponentes } from 'src/composables/pages/useEditarComponentes'
import EditarComponentesSection1 from 'src/components/sections/EditarComponentes/EditarComponentesSection1.vue'
const state = useEditarComponentes()
provide('EditarComponentes', state)
const { router, componentes, editarComponente } = state
</script>

<style scoped src="src/css/pages/EditarComponentes.css" />
