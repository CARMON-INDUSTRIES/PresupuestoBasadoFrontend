<template>
  <div>
    <div class="text-subtitle1">Avance por apartado</div>
    <p class="text-caption">
      Comprobación básica del último registro guardado. “Completo” solo indica que cumple los
      criterios mostrados; no valida el contenido ni sustituye la revisión del expediente.
    </p>
    <q-linear-progress v-if="cargando" indeterminate />
    <q-banner v-if="error" class="bg-red-1 text-negative" role="alert">
      {{ error }}<template #action><q-btn flat label="Reintentar" @click="cargar" /></template>
    </q-banner>
    <q-list v-else bordered separator>
      <q-expansion-item
        v-for="registro in registros"
        :key="registro.apartado"
        :label="registro.apartado"
        :caption="`${registro.estado} · ${registro.cantidad} registros`"
      >
        <div class="q-pa-md">{{ registro.criterio }}</div>
      </q-expansion-item>
    </q-list>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { consultarAdmin, errorAdmin } from 'src/services/admin'
const props = defineProps({ usuarioId: { type: String, required: true } })
const registros = ref([]),
  error = ref(''),
  cargando = ref(false)
async function cargar() {
  if (cargando.value) return
  cargando.value = true
  error.value = ''
  try {
    registros.value = (
      await consultarAdmin(`usuarios/${encodeURIComponent(props.usuarioId)}/registros`)
    ).data
  } catch (e) {
    error.value = errorAdmin(e)
  } finally {
    cargando.value = false
  }
}
onMounted(cargar)
</script>
