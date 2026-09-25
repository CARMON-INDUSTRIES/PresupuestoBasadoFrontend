<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Reglas de Operación</h1>

        <p class="page-subtitle">
          Registra la información correspondiente a las reglas de operación del programa y adjunta
          los documentos oficiales si existen.
        </p>
      </div>

      <q-form @submit.prevent="guardarReglasOperacion">
        <q-card class="modern-card">
          <q-card-section>
            <div class="section-title">Información general</div>
          </q-card-section>

          <q-card-section class="form-grid">
            <div>
              <div class="text-subtitle1 text-weight-medium q-mb-md">
                ¿Tiene reglas de operación?
              </div>

              <q-option-group
                v-model="form.tieneReglasOperacion"
                :options="[
                  { label: 'Sí', value: true },
                  { label: 'No', value: false },
                ]"
                type="radio"
                inline
                color="primary"
              />
            </div>

            <div v-if="form.tieneReglasOperacion" class="upload-box">
              <q-banner rounded class="info-banner q-mb-md">
                <template v-slot:avatar>
                  <q-icon name="info" />
                </template>

                Adjunta el documento oficial de reglas de operación y proporciona una liga pública
                si se encuentra disponible.
              </q-banner>

              <q-file
                filled
                bg-color="white"
                v-model="archivoSeleccionado"
                label="Archivo adjunto"
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

            <q-banner
              v-else-if="form.tieneReglasOperacion === false"
              rounded
              class="warning-banner"
            >
              <template v-slot:avatar>
                <q-icon name="warning" />
              </template>

              El programa actualmente no cuenta con reglas de operación registradas.
            </q-banner>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="formulario-padron-beneficiarios"
            />

            <q-btn label="Continuar" type="submit" class="primary-btn" unelevated />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { useFormularioReglasOperacion } from 'src/composables/pages/useFormularioReglasOperacion'

const state = useFormularioReglasOperacion()
const { form, archivoSeleccionado, guardarReglasOperacion } = state
</script>

<style scoped src="src/css/pages/FormularioReglasOperacion.css" />
