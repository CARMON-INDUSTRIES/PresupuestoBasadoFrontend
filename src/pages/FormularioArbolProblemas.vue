<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Árbol de Problemas</h1>
        <p class="page-subtitle">
          Visualización estructurada del problema central, efectos, componentes y actividades.
        </p>
      </div>

      <q-card flat class="modern-card q-pa-xl">
        <div class="arbol-container">
          <div class="nivel efecto">
            <div class="label">Efecto superior o fin</div>

            <div class="nodo efecto-nodo ancho-central with-arrow-down">
              {{ resumen.efectoSuperior?.descripcion }}
            </div>
          </div>

          <div class="nivel resultados" v-if="hayResultados">
            <div class="label">Efectos</div>

            <div class="fila">
              <div
                v-for="(comp, idx) in resumen.disenio?.componentes || []"
                :key="'res-' + idx"
                class="componente-columna"
              >
                <div
                  v-for="(res, rIdx) in comp.resultados"
                  :key="'res-' + idx + '-' + rIdx"
                  class="nodo resultado-nodo with-arrow-down"
                >
                  {{ res }}
                </div>
              </div>
            </div>
          </div>

          <div class="nivel problema">
            <div class="label">Problema central</div>

            <div class="nodo problema-nodo ancho-central with-arrow-up with-arrow-down">
              {{ resumen.identificacion?.problemaCentral }}
            </div>
          </div>

          <div class="nivel componentes" v-if="resumen.disenio?.componentes?.length">
            <div class="label">Componentes y actividades</div>

            <div class="fila">
              <div
                v-for="(comp, idx) in resumen.disenio.componentes"
                :key="'comp-' + idx"
                class="componente-columna"
              >
                <div class="nodo componente-nodo with-arrow-up with-arrow-down">
                  {{ comp.nombre }}
                </div>

                <div
                  v-for="(accion, aIdx) in comp.acciones"
                  :key="'accion-' + idx + '-' + aIdx"
                  class="nodo accion-nodo with-arrow-up"
                >
                  {{ accion }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <q-separator class="q-my-xl" />

        <div class="row justify-end actions-container">
          <q-btn
            label="Pantalla Anterior"
            rounded
            unelevated
            class="secondary-btn"
            to="FormularioAnalisisInvolucrados"
          />

          <q-btn
            label="Continuar"
            rounded
            unelevated
            class="primary-btn"
            @click="irArbolObjetivos"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useFormularioArbolProblemas } from 'src/composables/pages/useFormularioArbolProblemas'

const state = useFormularioArbolProblemas()
const { resumen, hayResultados, irArbolObjetivos } = state
</script>

<style scoped src="src/css/pages/FormularioArbolProblemas.css" />
