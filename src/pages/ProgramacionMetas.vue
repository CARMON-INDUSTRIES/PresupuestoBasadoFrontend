<template>
  <q-page padding class="metas-page">
    <q-card flat class="metas-card">
      <q-card-section class="card-header">
        <div class="text-h5 text-center text-weight-bold">Programación de Metas</div>

        <div class="text-subtitle2 text-center text-grey-7 q-mt-sm">
          Seguimiento mensual de indicadores y avances programados
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-banner rounded class="bg-blue-1 text-primary q-mb-md" v-if="indicadores.length">
          <q-icon name="analytics" size="sm" class="q-mr-sm" />
          Indicadores cargados:
          <strong>{{ indicadores.length }}</strong>
        </q-banner>

        <q-select
          v-if="indicadores.length"
          v-model="indiceSeleccionado"
          :options="optionsIndicadores"
          label="Selecciona un indicador"
          outlined
          emit-value
          map-options
        >
          <template #prepend>
            <q-icon name="track_changes" color="primary" />
          </template>
        </q-select>

        <div v-else class="empty-state text-center q-pa-xl">
          <q-icon name="warning_amber" size="60px" color="negative" />
          <div class="text-h6 q-mt-md">No hay indicadores disponibles</div>
        </div>
      </q-card-section>

      <q-card-section v-if="indicadorActivo">
        <q-markup-table flat bordered class="tabla-metas">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Programado</th>
              <th>Alcanzado</th>
              <th>Semáforo</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(meta, index) in indicadorActivo.metasProgramadas || []" :key="index">
              <td>
                <strong>{{ meta.mes ?? index + 1 }}</strong>
              </td>

              <td>
                {{ meta.cantidadEsperada ?? meta.cantidad ?? 0 }}
              </td>

              <td style="width: 200px">
                <q-input v-model.number="meta.alcanzado" type="number" dense outlined />
              </td>

              <td style="width: 200px">
                <q-badge
                  rounded
                  :color="obtenerColorSemaforo(meta)"
                  class="full-width q-pa-sm text-center"
                >
                  {{ obtenerTextoSemaforo(meta) }}
                </q-badge>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pa-lg acciones-footer">
        <q-btn
          color="primary"
          icon="save"
          label="Guardar cambios"
          rounded
          unelevated
          @click="guardarCambios"
          :disable="!indicadorActivo"
        />

        <div class="mensaje-ayuda">
          <q-icon name="info" color="orange" />
          Primero guarde los cambios y posteriormente descargue las fichas actualizadas.
        </div>

        <q-btn
          color="deep-orange"
          icon="picture_as_pdf"
          label="Descargar fichas actualizadas"
          rounded
          unelevated
          @click="descargarPdfActualizado"
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
    const res = await api.get('/ProgramacionMetas/ultima')

    const fichaData = res.data

    if (!fichaData || !fichaData.indicadores) {
      Notify.create({
        type: 'warning',
        message: 'No hay ficha o indicadores disponibles',
      })
      return
    }

    ficha.value = fichaData

    indicadores.value = [...fichaData.indicadores]

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

    const metas = indicadorActivo.value.metasProgramadas.map((m) => ({
      id: m.id,
      alcanzado: Number(m.alcanzado) || 0,
    }))

    console.log('METAS ENVIADAS:', metas)

    await api.put('/ProgramacionMetas/actualizar-avances', metas)

    Notify.create({
      type: 'positive',
      message: 'Avances guardados correctamente',
    })
  } catch (err) {
    console.error('ERROR GUARDAR:', err)

    console.log(err.response?.data)

    Notify.create({
      type: 'negative',
      message: 'Error al guardar',
    })
  }
}

function obtenerPorcentaje(meta) {
  const esperado = Number(meta.cantidadEsperada ?? meta.cantidad ?? 0)
  const alcanzado = Number(meta.alcanzado ?? 0)

  if (esperado <= 0) return 0

  return (alcanzado / esperado) * 100
}

function obtenerColorSemaforo(meta) {
  const porcentaje = obtenerPorcentaje(meta)

  if (porcentaje >= 100) return 'positive'

  if (porcentaje >= 70) return 'warning'

  return 'negative'
}

function obtenerTextoSemaforo(meta) {
  const porcentaje = obtenerPorcentaje(meta)

  if (porcentaje >= 100) return 'Cumplido'

  if (porcentaje >= 70) return 'En riesgo'

  return 'Rezago'
}

async function descargarPdfActualizado() {
  try {
    const response = await api.get('/FormatoFichaFinal/ultimo', {
      responseType: 'blob',
    })

    const blob = new Blob([response.data], {
      type: 'application/pdf',
    })

    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'FichasActualizadas.pdf'

    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('ERROR PDF:', err)

    Notify.create({
      type: 'negative',
      message: 'Error al descargar PDF',
    })
  }
}
</script>

<style scoped>
.metas-page {
  background: linear-gradient(135deg, #691b31 0%, #7f1d35 100%);
  min-height: 100vh;
}

.metas-card {
  max-width: 1100px;
  margin: auto;
  border-radius: 20px;
  background: white;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 24px;
}

.tabla-metas {
  border-radius: 12px;
  overflow: hidden;
}

.tabla-metas thead tr {
  background: #691b31;
  color: white;
}

.tabla-metas th {
  font-weight: 700;
  text-align: center;
}

.tabla-metas td {
  vertical-align: middle;
  text-align: center;
}

.acciones-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.mensaje-ayuda {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
  text-align: center;
}

.empty-state {
  color: #666;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 10px;
}

:deep(.q-btn) {
  transition: all 0.25s ease;
}

:deep(.q-btn:hover) {
  transform: translateY(-2px);
}

:deep(.q-badge) {
  font-weight: 700;
  font-size: 13px;
}
</style>
