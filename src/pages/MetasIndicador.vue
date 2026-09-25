<template>
  <div>
    <q-card-section>
      <div class="text-h6 q-mb-md">Determinación de Metas Anual</div>

      <q-form @submit.prevent="agregarMeta">
        <div class="row q-col-gutter-md">
          <div class="col-5">
            <q-input
              :model-value="modelValue.unidadMedida"
              @update:model-value="updateField('unidadMedida', $event)"
              label="Unidad de Medida"
              filled
            />
          </div>

          <div class="col-3">
            <q-input v-model.number="nuevaMeta.cantidad" label="Cantidad" type="number" filled />
          </div>

          <div class="col-3">
            <q-select
              v-model="nuevaMeta.periodoCumplimiento"
              :options="periodos"
              label="Periodo de cumplimiento"
              filled
            />
          </div>

          <div class="col-1 flex items-center">
            <q-btn icon="add" color="primary" round dense type="submit" title="Agregar meta" />
          </div>
        </div>
      </q-form>

      <q-markup-table
        flat
        bordered
        class="q-mt-md"
        v-if="modelValue.metas && modelValue.metas.length"
      >
        <thead>
          <tr>
            <th>Unidad de Medida</th>
            <th>Cantidad</th>
            <th>Periodo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(meta, i) in modelValue.metas" :key="'meta-' + i">
            <td>{{ modelValue.unidadMedida }}</td>
            <td>{{ meta.cantidad }}</td>
            <td>{{ meta.periodoCumplimiento }}</td>
            <td>
              <q-btn dense flat icon="delete" color="negative" @click="eliminarMeta(i)" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>

    <MetasIndicadorSection1 />
  </div>
</template>

<script setup>
import { provide, toRefs } from 'vue'
import {
  useMetasIndicador,
  propsOptions,
  emitsOptions,
} from 'src/composables/pages/useMetasIndicador'
import MetasIndicadorSection1 from 'src/components/sections/MetasIndicador/MetasIndicadorSection1.vue'
const pageProps = defineProps(propsOptions)
const pageEmit = defineEmits(emitsOptions)
const state = useMetasIndicador(pageProps, pageEmit)
provide('MetasIndicador', { ...toRefs(pageProps), ...state })
const { periodos, nuevaMeta, updateField, agregarMeta, eliminarMeta } = state
</script>

<style scoped src="src/css/pages/MetasIndicador.css" />
