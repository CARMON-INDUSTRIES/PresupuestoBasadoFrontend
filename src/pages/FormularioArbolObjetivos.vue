<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Árbol de Objetivos</h1>
        <p class="page-subtitle">
          Transformación del árbol de problemas en objetivos, medios y fines en positivo.
        </p>
      </div>

      <q-card flat class="modern-card q-pa-xl">
        <div class="row justify-center q-mb-xl">
          <div class="col-12 col-lg-8">
            <div class="tree-card tree-fin">
              <div class="tree-label">Fin</div>

              <q-input
                v-model="arbolObjetivos.fin"
                filled
                autogrow
                type="textarea"
                class="modern-input"
                placeholder="Describe el fin esperado..."
              />

              <div class="tree-reference">
                Basado en:
                {{ arbolProblemas.efectoSuperior?.descripcion || '—' }}
              </div>

              <div class="connector"></div>
            </div>
          </div>
        </div>

        <FormularioArbolObjetivosSection1 />

        <div class="row justify-center q-mb-xl">
          <div class="col-12 col-lg-8">
            <div class="tree-card tree-objective">
              <div class="tree-label">Objetivo Central</div>

              <q-input
                v-model="arbolObjetivos.objetivoCentral"
                filled
                autogrow
                type="textarea"
                class="modern-input"
                placeholder="Describe el objetivo central..."
              />

              <div class="tree-reference">
                Basado en:
                {{ arbolProblemas.problemaCentral?.problemaCentral || '—' }}
              </div>

              <div class="connector"></div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-xl justify-center q-mb-xl">
          <div
            v-for="(comp, cIndex) in arbolObjetivos.componentes"
            :key="'comp-' + cIndex"
            class="col-12 col-md-6 col-lg-3"
          >
            <div class="tree-card tree-component">
              <div class="tree-label">Componente {{ cIndex + 1 }}</div>

              <q-input
                v-model="arbolObjetivos.componentes[cIndex].nombre"
                filled
                autogrow
                label="Nombre en positivo"
                class="modern-input"
              />

              <div class="tree-reference">
                Basado en:
                {{ arbolProblemas.componentes[cIndex]?.nombre || '—' }}
              </div>

              <div class="connector"></div>
            </div>
          </div>
        </div>

        <FormularioArbolObjetivosSection2 />

        <q-separator class="q-my-xl" />

        <div class="row justify-end actions-container">
          <q-btn
            label="Pantalla Anterior"
            rounded
            unelevated
            class="secondary-btn"
            to="formulario-arbol-problemas"
            :loading="loading"
          />

          <q-btn
            rounded
            unelevated
            class="primary-btn"
            :loading="loading || generandoIA"
            label="Guardar"
            @click="guardar"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useFormularioArbolObjetivos } from 'src/composables/pages/useFormularioArbolObjetivos'
import FormularioArbolObjetivosSection1 from 'src/components/sections/FormularioArbolObjetivos/FormularioArbolObjetivosSection1.vue'
import FormularioArbolObjetivosSection2 from 'src/components/sections/FormularioArbolObjetivos/FormularioArbolObjetivosSection2.vue'
const pageExpose = (value) => {
  exposed = value
}
let exposed
const state = useFormularioArbolObjetivos(pageExpose)
provide('FormularioArbolObjetivos', state)
const { loading, generandoIA, arbolProblemas, arbolObjetivos, guardar } = state
defineExpose(exposed)
</script>

<style scoped src="src/css/pages/FormularioArbolObjetivos.css" />
