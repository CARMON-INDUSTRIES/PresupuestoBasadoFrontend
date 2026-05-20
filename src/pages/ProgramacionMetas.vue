<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1000px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center text-black">Programación de Metas</div>
      </q-card-section>

      <q-card-section>
        <div class="text-caption text-grey-7">Indicadores cargados: {{ indicadores.length }}</div>
      </q-card-section>

      <q-card-section v-if="indicadores.length">
        <q-select
          v-model="indiceSeleccionado"
          :options="optionsIndicadores"
          label="Selecciona un indicador"
          filled
          emit-value
          map-options
        />
      </q-card-section>

      <q-card-section v-else>
        <div class="text-negative text-center">No hay indicadores disponibles</div>
      </q-card-section>

      <q-card-section v-if="indicadorActivo">
        <q-markup-table flat bordered>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Programado</th>
              <th>Alcanzado</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(meta, index) in indicadorActivo.metasProgramadas || []" :key="index">
              <td>{{ meta.mes ?? index + 1 }}</td>

              <td>
                {{ meta.cantidadEsperada ?? meta.cantidad ?? 0 }}
              </td>

              <td>
                <q-input v-model.number="meta.alcanzado" type="number" dense filled />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Guardar cambios"
          @click="guardarCambios"
          :disable="!indicadorActivo"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const ficha = ref(null)
const indicadores = ref([])
const indiceSeleccionado = ref(null)

const optionsIndicadores = computed(() =>
  indicadores.value.map((i, idx) => ({
    label: `${idx + 1}. ${i.resultadoEsperado || i.descripcion || 'Indicador'}`,
    value: idx,
  })),
)

const indicadorActivo = computed(() => {
  if (indiceSeleccionado.value === null) return null
  return indicadores.value[indiceSeleccionado.value] || null
})

onMounted(async () => {
  try {
    console.log('CONSULTANDO API...')

    const res = await api.get('/ProgramacionMetas/ultima')

    console.log('RESPUESTA API:', res.data)

    const fichaData = res.data

    if (!fichaData || !fichaData.indicadores) {
      Notify.create({
        type: 'warning',
        message: 'No hay ficha o indicadores disponibles',
      })
      return
    }

    ficha.value = fichaData

    // 🔥 importante
    indicadores.value = [...fichaData.indicadores]

    console.log('INDICADORES:', indicadores.value)

    if (indicadores.value.length > 0) {
      indiceSeleccionado.value = 0
    }
  } catch (err) {
    console.error('ERROR API:', err)

    Notify.create({
      type: 'negative',
      message: 'Error al cargar datos',
    })
  }
})

async function guardarCambios() {
  try {
    if (!indicadorActivo.value) return

    const metas = indicadorActivo.value.metasProgramadas || []

    console.log('GUARDANDO:', metas)

    await api.put('/ProgramacionMetas/actualizar-avances', metas)

    Notify.create({
      type: 'positive',
      message: 'Avances guardados correctamente',
    })
  } catch (err) {
    console.error('ERROR GUARDAR:', err)

    Notify.create({
      type: 'negative',
      message: 'Error al guardar',
    })
  }
}
</script>
