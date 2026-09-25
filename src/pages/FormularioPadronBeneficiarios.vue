<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Padrón de Beneficiarios</h1>
        <p class="page-subtitle">
          Registra la información relacionada con el padrón de beneficiarios y los medios de
          consulta disponibles para la ciudadanía.
        </p>
      </div>

      <q-form @submit.prevent="guardarPadron">
        <q-card class="modern-card">
          <q-card-section>
            <div class="section-title">Información general</div>
          </q-card-section>

          <q-card-section class="form-grid">
            <div>
              <div class="text-subtitle1 text-weight-medium q-mb-md">
                ¿Cuenta con padrón de beneficiarios?
              </div>

              <q-option-group
                v-model="form.tienePadron"
                :options="[
                  { label: 'Sí', value: true },
                  { label: 'No', value: false },
                ]"
                type="radio"
                inline
                color="primary"
              />
            </div>

            <div v-if="form.tienePadron" class="upload-box">
              <q-banner rounded class="info-banner q-mb-md">
                <template v-slot:avatar>
                  <q-icon name="info" />
                </template>

                Adjunta el documento oficial del padrón y agrega la liga pública de consulta si
                existe.
              </q-banner>

              <q-file
                filled
                bg-color="white"
                v-model="archivoSeleccionado"
                label="Adjuntar archivo"
                placeholder="Selecciona un archivo"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
                counter
                class="modern-input"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" color="primary" />
                </template>
              </q-file>

              <div v-if="archivoSeleccionado" class="file-preview">
                <q-icon name="description" class="q-mr-sm" />
                {{ archivoSeleccionado.name || archivoSeleccionado.file?.name }}
              </div>

              <q-input
                filled
                bg-color="white"
                v-model="form.ligaInternet"
                label="Liga de internet"
                type="url"
                class="modern-input q-mt-lg"
              >
                <template v-slot:prepend>
                  <q-icon name="link" color="primary" />
                </template>
              </q-input>
            </div>

            <q-banner v-else-if="form.tienePadron === false" rounded class="warning-banner">
              <template v-slot:avatar>
                <q-icon name="warning" />
              </template>

              El programa no cuenta actualmente con un padrón de beneficiarios.
            </q-banner>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="formulario-programa-social"
              :disable="subiendo"
            />

            <q-btn
              :loading="subiendo"
              label="Continuar"
              type="submit"
              class="primary-btn"
              unelevated
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { useFormularioPadronBeneficiarios } from 'src/composables/pages/useFormularioPadronBeneficiarios'

const state = useFormularioPadronBeneficiarios()
const { form, archivoSeleccionado, subiendo, guardarPadron } = state
</script>

<style scoped src="src/css/pages/FormularioPadronBeneficiarios.css" />
