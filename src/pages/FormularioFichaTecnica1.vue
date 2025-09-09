<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1200px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center text-black">Ficha Técnica del Indicador</div>
      </q-card-section>

      <!-- ====== DATOS DE IDENTIFICACIÓN DEL PROGRAMA ====== -->
      <q-card-section class="q-pa-md bg-grey-2">
        <div class="text-h6 q-mb-md">I. Datos de Identificación del Programa</div>
        <q-markup-table flat bordered>
          <tbody>
            <tr>
              <td class="bg-primary text-white text-weight-bold">Unidad Responsable</td>
              <td>{{ usuario.nombreCompleto || '' }}</td>
              <td class="bg-primary text-white text-weight-bold">Unidad Presupuestal</td>
              <td>{{ usuario.unidadesPresupuestales || '' }}</td>
            </tr>
            <tr>
              <td class="bg-primary text-white text-weight-bold">Clave del Indicador</td>
              <td>{{ claveIndicador || '' }}</td>
              <td class="bg-primary text-white text-weight-bold">Programa Presupuestario</td>
              <td>{{ usuario.programaPresupuestario || '' }}</td>
            </tr>
            <tr>
              <td class="bg-primary text-white text-weight-bold">Tipo de Indicador</td>
              <td>{{ tipoIndicador }}</td>
              <td class="bg-primary text-white text-weight-bold">
                Responsable de la Elaboración de la MIR
              </td>
              <td>{{ usuario.nombreCompleto || '' }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <!-- ====== MENÚ HORIZONTAL DE INDICADORES ====== -->
      <q-card-section v-if="indicadores.length">
        <div class="text-h6 q-mb-md">Seleccionar Indicador</div>
        <div class="row q-col-gutter-sm no-wrap scroll-x">
          <q-btn
            v-for="(ind, index) in indicadores"
            :key="'btn-' + index"
            :label="ind.nivel"
            flat
            class="q-ma-xs"
            :color="indiceSeleccionado === index ? 'primary' : 'grey-7'"
            text-color="black"
            @click="indiceSeleccionado = index"
          />
        </div>
      </q-card-section>

      <!-- ====== FICHA SELECCIONADA ====== -->
      <q-card-section v-if="indicadorActivo">
        <div class="text-h6 q-mb-md">II. Ficha Técnica del Indicador</div>
        <q-card flat bordered class="q-pa-md">
          <div class="text-subtitle1 q-mb-md text-primary">
            Indicador: {{ indicadorActivo.nombre || 'Sin nombre' }}
            <span class="text-caption text-grey-7">(Nivel: {{ indicadorActivo.nivel }})</span>
          </div>

          <!-- 🔥 Ahora todos los niveles tienen los mismos campos -->
          <q-select
            v-model="indicadorActivo.dimension"
            :options="dimensiones"
            label="Dimensión a Medir"
            filled
            class="q-mb-md"
          />
          <q-select
            v-model="indicadorActivo.sentido"
            :options="sentidos"
            label="Sentido"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="indicadorActivo.definicion"
            type="textarea"
            label="Definición (Qué mide y para qué lo mide)"
            filled
            autogrow
            class="q-mb-md"
          />
          <q-input
            v-model="indicadorActivo.unidadMedida"
            label="Unidad de medida del resultado"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="indicadorActivo.rangoValor"
            label="Rango de valor"
            filled
            class="q-mb-md"
          />
          <q-select
            v-model="indicadorActivo.frecuenciaMedicion"
            :options="frecuencias"
            label="Frecuencia de medición"
            filled
            class="q-mb-md"
          />
          <q-input
            v-model="indicadorActivo.cobertura"
            label="Cobertura"
            filled
            disable
            class="q-mb-md"
          />
        </q-card>
      </q-card-section>

      <!-- Botones -->
      <q-card-actions align="right" v-if="indicadores.length">
        <q-btn color="primary" label="Guardar y Continuar" @click="guardar" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const usuario = ref({})
const claveIndicador = ref('')
const tipoIndicador = ref('')
const indicadores = ref([])
const indiceSeleccionado = ref(0)

const dimensiones = ['Eficiencia', 'Eficacia', 'Calidad', 'Economía']
const sentidos = ['Ascendente', 'Descendente']
const frecuencias = ['Mensual', 'Trimestral', 'Semestral', 'Anual']

const indicadorActivo = computed(() => indicadores.value[indiceSeleccionado.value] || null)

onMounted(async () => {
  try {
    const me = await api.get('/Cuentas/me')
    usuario.value = me.data || {}

    const mir = await api.get('/MatrizIndicadores/ultimo')
    const filas = mir.data?.filas || []

    const nivelesUnicos = [...new Set(filas.map((f) => f.nivel))]
    indicadores.value = nivelesUnicos.map((nivel) => {
      const fila = filas.find((f) => f.nivel === nivel)
      return {
        nombre: fila?.resumenNarrativo || '',
        nivel: nivel,
        dimension: '',
        sentido: '',
        definicion: '',
        unidadMedida: '',
        rangoValor: '',
        frecuenciaMedicion: '',
        cobertura: 'Municipal', // siempre fijo
      }
    })

    if (indicadores.value.length > 0) {
      const nivelActual = indicadores.value[0]?.nivel?.toLowerCase() || ''
      tipoIndicador.value =
        nivelActual === 'fin' || nivelActual === 'propósito' ? 'Estratégico' : 'De Gestión'
    }

    claveIndicador.value = '' // Generar más adelante
  } catch (error) {
    console.error('❌ Error al cargar datos:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar datos' })
  }
})

function guardar() {
  console.log('Datos a guardar:', {
    usuario: usuario.value,
    claveIndicador: claveIndicador.value,
    tipoIndicador: tipoIndicador.value,
    indicadores: indicadores.value,
  })
  Notify.create({ type: 'positive', message: 'Datos guardados (simulación)' })
}
</script>

<style scoped>
.bg-primary {
  background-color: #7f1d35 !important;
}
.scroll-x {
  overflow-x: auto;
  white-space: nowrap;
}
</style>
