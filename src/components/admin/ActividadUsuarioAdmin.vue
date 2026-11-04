<template>
  <div>
    <div class="text-subtitle1">Historial de actividad</div>
    <q-linear-progress v-if="cargando" indeterminate class="q-my-sm" />
    <q-banner v-if="error" class="bg-red-1 text-negative" role="alert">
      {{ error }}
      <template #action><q-btn flat label="Reintentar" @click="cargar" /></template>
    </q-banner>
    <q-list v-else separator>
      <q-item v-for="evento in eventos" :key="evento.id">
        <q-item-section>
          <q-item-label>{{ evento.accion }} · {{ evento.entidad }}</q-item-label>
          <q-item-label caption
            >{{ fechaAdmin(evento.fechaUtc) }} ·
            {{ evento.actorNombre || evento.actorId }}</q-item-label
          >
          <q-item-label caption>{{ evento.campos }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <p v-if="!cargando && !error && !eventos.length">Sin eventos registrados.</p>
    <q-pagination
      v-model="pagina"
      :max="Math.max(1, Math.ceil(total / 20))"
      :max-pages="5"
      :disable="cargando"
      @update:model-value="cargar"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { consultarAdmin, errorAdmin, fechaAdmin } from 'src/services/admin'
const props = defineProps({ usuarioId: { type: String, required: true } })
const pagina = ref(1)
const total = ref(0)
const eventos = ref([])
const cargando = ref(false)
const error = ref('')
async function cargar() {
  if (cargando.value) return
  cargando.value = true
  error.value = ''
  try {
    const { data } = await consultarAdmin(
      `usuarios/${encodeURIComponent(props.usuarioId)}/actividad`,
      { pagina: pagina.value },
    )
    eventos.value = data.items
    total.value = data.total
  } catch (e) {
    error.value = errorAdmin(e)
  } finally {
    cargando.value = false
  }
}
onMounted(cargar)
</script>
