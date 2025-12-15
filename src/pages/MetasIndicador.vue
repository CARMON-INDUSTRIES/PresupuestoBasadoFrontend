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

    <q-card-section>
      <div class="text-h6 q-mb-md">Programación de Metas</div>

      <q-option-group
        v-model="modoProgramacion"
        :options="[
          { label: 'Prorratear automáticamente', value: 'prorratear' },
          { label: 'Ingresar manualmente', value: 'manual' },
        ]"
        type="radio"
        inline
        class="q-mb-md"
      />

      <q-markup-table flat bordered>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Cantidad</th>
            <th>% Esperado</th>
            <th>Alcanzado</th>
            <th>% Alcanzado</th>
            <th>Fecha</th>
            <th>Semáforo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(meta, index) in localProgramacionMetas" :key="'meta-mes-' + index">
            <td>{{ meta.mes }}</td>
            <td>
              <q-input
                v-model.number="meta.cantidad"
                :disable="modoProgramacion === 'prorratear'"
                dense
                filled
                type="number"
              />
            </td>
            <td>{{ calcularPorcentajeEsperado(meta) }}%</td>
            <td>
              <q-input v-model.number="meta.alcanzado" dense filled type="number" />
            </td>
            <td>{{ calcularPorcentajeAlcanzado(meta) }}%</td>
            <td>
              <q-input v-model="meta.fecha" type="date" dense filled />
            </td>
            <td>
              <q-chip :color="calcularSemaforo(meta)" text-color="white">
                {{
                  calcularSemaforo(meta) === 'green'
                    ? 'VERDE'
                    : calcularSemaforo(meta) === 'yellow'
                      ? 'AMARILLO'
                      : 'ROJO'
                }}
              </q-chip>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { Notify } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  programacionMetas: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'update:programacionMetas'])

const periodos = ['Primer trimestre', 'Segundo trimestre', 'Tercer trimestre', 'Cuarto trimestre']
const nuevaMeta = ref({ cantidad: null, periodoCumplimiento: '' })
const modoProgramacion = ref('prorratear')
const localProgramacionMetas = ref([...props.programacionMetas])

function updateField(field, value) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

function agregarMeta() {
  if (!nuevaMeta.value.cantidad || !nuevaMeta.value.periodoCumplimiento) {
    Notify.create({ type: 'warning', message: 'Completa todos los campos de la meta' })
    return
  }

  const metasActualizadas = [...(props.modelValue.metas || []), { ...nuevaMeta.value }]
  emit('update:modelValue', { ...props.modelValue, metas: metasActualizadas })
  nuevaMeta.value = { cantidad: null, periodoCumplimiento: '' }
  Notify.create({ type: 'positive', message: 'Meta agregada' })
}

function eliminarMeta(idx) {
  const metasActualizadas = [...props.modelValue.metas]
  metasActualizadas.splice(idx, 1)
  emit('update:modelValue', { ...props.modelValue, metas: metasActualizadas })
}

function calcularPorcentajeEsperado(meta) {
  const total = localProgramacionMetas.value.reduce((sum, m) => sum + (m.cantidad || 0), 0)
  if (!total) return 0
  return ((meta.cantidad / total) * 100).toFixed(1)
}

function calcularPorcentajeAlcanzado(meta) {
  if (!meta.cantidad) return 0
  return ((meta.alcanzado / meta.cantidad) * 100).toFixed(1)
}

function calcularSemaforo(meta) {
  const pct = parseFloat(calcularPorcentajeAlcanzado(meta))
  const sentido = props.modelValue?.sentido || 'Ascendente'

  if (sentido === 'Ascendente') {
    if (pct >= 90 && pct <= 130) return 'green'
    if (pct >= 70 && pct < 90) return 'yellow'
    return 'red'
  } else if (sentido === 'Descendente') {
    if (pct >= 0.1 && pct <= 100) return 'green'
    if (pct > 100 && pct <= 130) return 'yellow'
    if (pct > 130) return 'red'
    return 'grey'
  }

  return 'grey'
}

function getMesesAcumulados(periodo) {
  switch (periodo) {
    case 'Primer trimestre':
      return [0, 1, 2]
    case 'Segundo trimestre':
      return [0, 1, 2, 3, 4, 5]
    case 'Tercer trimestre':
      return [0, 1, 2, 3, 4, 5, 6, 7, 8]
    case 'Cuarto trimestre':
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    case 'Primer semestre':
      return [0, 1, 2, 3, 4, 5]
    case 'Segundo semestre':
      return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    case 'Anual':
      return Array.from({ length: 12 }, (_, i) => i)
    default:
      return Array.from({ length: 12 }, (_, i) => i)
  }
}

watch(
  [modoProgramacion, () => nuevaMeta.value.cantidad, () => nuevaMeta.value.periodoCumplimiento],
  ([modo, cantidad, periodo]) => {
    if (modo === 'prorratear' && cantidad && periodo) {
      const mesesAcumulados = getMesesAcumulados(periodo)
      const prorrateo = (cantidad / mesesAcumulados.length).toFixed(2)
      localProgramacionMetas.value.forEach((meta, index) => {
        meta.cantidad = mesesAcumulados.includes(index) ? parseFloat(prorrateo) : 0
      })
      emit('update:programacionMetas', localProgramacionMetas.value)
    }
  },
)

watch(
  () => props.programacionMetas,
  (newValue) => {
    localProgramacionMetas.value = [...newValue]
  },
  { deep: true },
)
</script>

<style scoped>
.q-markup-table td {
  vertical-align: middle;
}
</style>
