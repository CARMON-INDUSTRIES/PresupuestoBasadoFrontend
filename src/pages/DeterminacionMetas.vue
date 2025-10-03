<template>
  <q-card-section>
    <div class="text-h6 q-mb-md">Determinación de Metas Anual</div>

    <q-form @submit.prevent="addMeta">
      <div class="row q-col-gutter-md">
        <div class="col-5">
          <q-input v-model="meta.metaProgramada" label="Unidad de Medida" filled />
        </div>
        <div class="col-3">
          <q-input v-model.number="meta.cantidad" label="Cantidad" type="number" filled />
        </div>
        <div class="col-3">
          <q-select
            v-model="meta.periodoCumplimiento"
            :options="periodos"
            label="Periodo de cumplimiento"
            filled
          />
        </div>
      </div>
    </q-form>

    <q-markup-table flat bordered class="q-mt-md" v-if="localMetas.length">
      <thead>
        <tr>
          <th>Meta programada</th>
          <th>Cantidad</th>
          <th>Periodo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(m, i) in localMetas" :key="i">
          <td>{{ m.metaProgramada }}</td>
          <td>{{ m.cantidad }}</td>
          <td>{{ m.periodoCumplimiento }}</td>
          <td>
            <q-btn dense flat icon="delete" color="negative" @click="removeMeta(i)" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card-section>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  metas: Array,
  periodos: Array,
})
const emit = defineEmits(['update:metas'])

const localMetas = reactive([...props.metas])
watch(localMetas, (val) => emit('update:metas', val), { deep: true })

const meta = reactive({ metaProgramada: '', cantidad: null, periodoCumplimiento: '' })

function addMeta() {
  if (!meta.metaProgramada || !meta.cantidad || !meta.periodoCumplimiento) return
  localMetas.push({ ...meta })
  meta.metaProgramada = ''
  meta.cantidad = null
  meta.periodoCumplimiento = ''
}

function removeMeta(i) {
  localMetas.splice(i, 1)
}
</script>
