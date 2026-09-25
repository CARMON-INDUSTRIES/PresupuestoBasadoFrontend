<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <div>
          <h1 class="page-title">Programa Social</h1>
          <p class="page-subtitle">
            Define si el programa pertenece al ámbito social y selecciona sus categorías
            correspondientes.
          </p>
        </div>
      </div>

      <q-form @submit.prevent="guardarProgramaSocial">
        <q-card class="modern-card">
          <q-card-section>
            <div class="section-title">¿Es un programa social?</div>

            <q-option-group
              v-model="form.esProgramaSocial"
              :options="[
                { label: 'Sí', value: true },
                { label: 'No', value: false },
              ]"
              type="radio"
              inline
              color="primary"
              class="modern-radio"
            />
          </q-card-section>

          <q-card-section v-if="form.esProgramaSocial">
            <div class="section-title q-mb-lg">Categorías del programa</div>

            <div class="categories-grid">
              <q-card
                v-for="cat in categorias"
                :key="cat.nombre"
                flat
                bordered
                class="category-card"
                :class="{ active: cat.seleccionado }"
              >
                <q-card-section>
                  <div class="row items-center justify-between">
                    <div class="category-title">
                      {{ cat.nombre }}
                    </div>

                    <q-toggle v-model="cat.seleccionado" color="primary" />
                  </div>

                  <transition name="fade">
                    <div v-if="cat.seleccionado" class="q-mt-md">
                      <q-option-group
                        v-model="cat.tipo"
                        :options="[
                          { label: 'Directo', value: 'Directo' },
                          { label: 'Indirecto', value: 'Indirecto' },
                        ]"
                        type="radio"
                        inline
                        color="primary"
                        class="modern-radio"
                      />
                    </div>
                  </transition>
                </q-card-section>
              </q-card>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="formulario-reglas-operacion-detalle"
            />

            <q-btn label="Continuar" type="submit" class="primary-btn" unelevated />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { useFormularioProgramaSocial } from 'src/composables/pages/useFormularioProgramaSocial'

const state = useFormularioProgramaSocial()
const { form, categorias, guardarProgramaSocial } = state
</script>

<style scoped src="src/css/pages/FormularioProgramaSocial.css" />
