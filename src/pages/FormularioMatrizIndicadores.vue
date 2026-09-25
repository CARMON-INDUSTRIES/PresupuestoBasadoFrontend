<template>
  <q-page padding style="background-color: #f4f6f9">
    <q-card flat bordered class="q-pa-md" style="max-width: 1200px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center">Matriz de Indicadores para Resultados</div>
      </q-card-section>

      <q-markup-table flat bordered class="q-mb-lg">
        <tbody>
          <tr>
            <td class="bg-primary text-white text-weight-bold">Programa Presupuestario:</td>
            <td>{{ usuario.programaPresupuestario || '' }}</td>

            <td class="bg-primary text-white text-weight-bold" style="width: 30%">
              Unidad Responsable:
            </td>

            <td>{{ usuario.nombreMatriz || usuario.cargo || '' }}</td>
          </tr>

          <tr>
            <td class="bg-primary text-white text-weight-bold">Responsable:</td>
            <td>{{ usuario.nombreCompleto || '' }}</td>

            <td class="bg-primary text-white text-weight-bold" style="width: 30%">
              Unidad Presupuestal Responsable de la Elaboración de la MIR:
            </td>

            <td>{{ usuario.unidadesPresupuestales || '' }}</td>
          </tr>
        </tbody>
      </q-markup-table>

      <FormularioMatrizIndicadoresSection1 />

      <q-card-actions align="right" class="q-mt-lg">
        <q-btn
          label="Pantalla Anterior"
          color="primary"
          text-color="white"
          rounded
          unelevated
          class="registrar"
          to="formulario-estructura-analitica"
          :loading="loading"
        />

        <q-btn
          color="primary"
          label="Siguiente"
          rounded
          unelevated
          class="submit-btn"
          :loading="loading"
          @click="guardarMatriz"
        />
      </q-card-actions>

      <q-dialog v-model="modalVisible" persistent>
        <q-card class="modal-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Captura MIR</div>

            <div class="text-subtitle2 q-mt-xs">
              {{ filaSeleccionada?.nivel }}
            </div>
          </q-card-section>

          <q-card-section class="q-pa-lg">
            <div class="q-mb-md" v-for="(campo, idx) in camposNarrativos" :key="idx">
              <q-input
                v-model="camposNarrativos[idx]"
                :label="labelsNarrativos[idx]"
                filled
                autogrow
              />
            </div>

            <q-input
              v-model="indicadoresTemp"
              label="Indicadores (solo nombre)"
              type="textarea"
              filled
              autogrow
              class="q-mb-md"
            />

            <q-input
              v-model="mediosTemp"
              label="Medios de verificación"
              type="textarea"
              filled
              autogrow
              class="q-mb-md"
            />

            <q-input v-model="supuestosTemp" label="Supuestos" type="textarea" filled autogrow />
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />

            <q-btn
              unelevated
              label="Guardar"
              color="primary"
              @click="guardarNarrativo"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script setup>
import { provide } from 'vue'
import { useFormularioMatrizIndicadores } from 'src/composables/pages/useFormularioMatrizIndicadores'
import FormularioMatrizIndicadoresSection1 from 'src/components/sections/FormularioMatrizIndicadores/FormularioMatrizIndicadoresSection1.vue'
const state = useFormularioMatrizIndicadores()
provide('FormularioMatrizIndicadores', state)
const {
  loading,
  usuario,
  modalVisible,
  filaSeleccionada,
  camposNarrativos,
  labelsNarrativos,
  indicadoresTemp,
  mediosTemp,
  supuestosTemp,
  guardarMatriz,
  guardarNarrativo,
} = state
</script>

<style scoped src="src/css/pages/FormularioMatrizIndicadores.css" />
