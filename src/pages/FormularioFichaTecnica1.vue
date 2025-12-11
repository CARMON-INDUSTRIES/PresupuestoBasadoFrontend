<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1200px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center text-black">Ficha Técnica del Indicador</div>
      </q-card-section>

      <!-- Datos de Identificación -->
      <q-card-section class="q-pa-md bg-grey-2">
        <div class="text-h6 q-mb-md">Datos de Identificación del Programa</div>
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

      <!-- Selector de Indicadores -->
      <q-card-section v-if="indicadores.length">
        <div class="text-h6 q-mb-md">Seleccionar Indicador</div>
        <div class="row q-col-gutter-sm no-wrap scroll-x">
          <q-btn
            v-for="(ind, index) in indicadores"
            :key="'btn-' + index"
            :label="index + 1 + '. ' + (ind.indicadores || 'Sin nombre')"
            flat
            class="q-ma-xs"
            :color="indiceSeleccionado === index ? 'primary' : 'grey-7'"
            text-color="black"
            @click="indiceSeleccionado = index"
          />
        </div>
      </q-card-section>

      <!-- Componentes hijos -->
      <template v-if="indicadorActivo">
        <DatosBasicosIndicador v-model="indicadorActivo" :lineas-accion="filtradas" />

        <FormulaIndicador v-model="indicadorActivo" :siglas="siglas" />

        <MetasIndicador
          v-model="indicadorActivo"
          :programacion-metas="programacionMetas"
          @update:programacion-metas="programacionMetas = $event"
        />
      </template>

      <q-card-actions align="right" v-if="indicadores.length">
        <q-btn color="primary" label="Guardar y Continuar" @click="guardar" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'
import DatosBasicosIndicador from './DatosBasicosIndicador.vue'
import FormulaIndicador from './FormulaIndicador.vue'
import MetasIndicador from './MetasIndicador.vue'

const usuario = ref({})
const claveIndicador = ref('')
const tipoIndicador = ref('')
const indicadores = ref([])
const indiceSeleccionado = ref(0)
const programacionMetas = ref(
  Array.from({ length: 12 }, (_, i) => ({
    mes: `Mes ${i + 1}`,
    cantidad: 0,
    alcanzado: 0,
    fecha: '',
  })),
)

const siglas = ref({ resultadoEsperado: '', numerador: '', denominador: '' })
let siglasInterval = null

const indicadorActivo = computed({
  get: () => indicadores.value[indiceSeleccionado.value] || null,
  set: (nuevoValor) => {
    indicadores.value[indiceSeleccionado.value] = nuevoValor
  },
})

const filtradas = computed(() => {
  const municipal = JSON.parse(localStorage.getItem('LineaMunicipal') || '{}')
  const estatal = JSON.parse(localStorage.getItem('LineaEstatal') || '{}')

  const lineasM =
    municipal.lineasSeleccionadas?.map((l) => ({
      id: l.id,
      lineaAccion: l.nombre,
      tipo: 'Municipal',
    })) || []

  const lineasE =
    estatal.lineasSeleccionadas?.map((l) => ({
      id: l.id,
      lineaAccion: l.nombre,
      tipo: 'Estatal',
    })) || []

  const todas = [...lineasM, ...lineasE]
  const idsPermitidos = todas.map((l) => l.id)

  return indicadorActivo.value?.lineasAccion?.filter((l) => idsPermitidos.includes(l.id)) || []
})

function generarSiglas(texto) {
  if (!texto) return ''
  const blacklist = ['de', 'la', 'el', 'y', 'del', 'para', 'con', 'las', 'los']
  return texto
    .split(/[\s\-/]+/)
    .filter((w) => w && !blacklist.includes(w.toLowerCase()))
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
}

onMounted(async () => {
  try {
    const local = localStorage.getItem('fichaIndicador')
    if (local) {
      const ficha = JSON.parse(local)
      usuario.value = ficha.usuario || {}
      claveIndicador.value = ficha.claveIndicador || ''
      tipoIndicador.value = ficha.tipoIndicador || ''
      indicadores.value = ficha.indicadores || []
      programacionMetas.value = ficha.programacionMetas || programacionMetas.value
      Notify.create({ type: 'info', message: 'Ficha cargada desde respaldo local' })
    }

    const me = await api.get('/Cuentas/me')
    usuario.value = me.data || {}

    const mir = await api.get('/MatrizIndicadores/ultimo')
    const filas = mir.data?.filas || []
    indicadores.value = filas.map((f) => ({
      id: f.id,
      nivel: f.nivel || '',
      indicadores: f.indicadores || '',
      resultadoEsperado: f.resumenNarrativo || '',
      dimension: '',
      sentido: '',
      definicion: '',
      unidadMedida: 'Número / Porcentaje',
      rangoValor: '0-100',
      frecuenciaMedicion: '',
      cobertura: 'Municipal',
      numerador: f.numerador || '',
      denominador: f.denominador || '',
      descripcion: f.descripcion || '',
      fuentes: {
        resultadoEsperado: f.fuentes?.resultadoEsperado || '',
        numerador: f.fuentes?.numerador || '',
        denominador: f.fuentes?.denominador || '',
      },
      metas: f.metas || [],
      lineaBaseValor: f.lineaBase?.valor ?? null,
      lineaBaseUnidad: f.lineaBase?.unidad ?? '',
      lineaBaseAnio: f.lineaBase?.anio ?? '',
      lineaBasePeriodo: f.lineaBase?.periodo ?? '',
      lineasAccion: f.lineasAccion || [],
      lineaAccionSeleccionada: null,
      crema: {
        claro: 'No',
        relevante: 'No',
        economico: 'No',
        monitoreable: 'No',
        adecuado: 'No',
      },
    }))

    await cargarLineasAccion()

    const nivelActual = (indicadores.value[0]?.nivel || '').toString().toLowerCase()
    tipoIndicador.value =
      nivelActual === 'fin' || nivelActual.includes('prop') ? 'Estratégico' : 'De Gestión'

    siglasInterval = setInterval(() => {
      const activo = indicadorActivo.value
      if (!activo) return
      siglas.value = {
        resultadoEsperado: generarSiglas(activo.resultadoEsperado),
        numerador: generarSiglas(activo.numerador),
        denominador: generarSiglas(activo.denominador),
      }
    }, 3000)
  } catch (error) {
    console.error('Error al cargar datos:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar datos' })
  }
})

async function cargarLineasAccion() {
  try {
    const municipal = JSON.parse(localStorage.getItem('LineaMunicipal') || '{}')
    const estatal = JSON.parse(localStorage.getItem('LineaEstatal') || '{}')

    const lineasM =
      municipal.lineasSeleccionadas?.map((l) => ({
        id: l.id,
        lineaAccion: l.nombre,
        tipo: 'Municipal',
      })) || []

    const lineasE =
      estatal.lineasSeleccionadas?.map((l) => ({
        id: l.id,
        lineaAccion: l.nombre,
        tipo: 'Estatal',
      })) || []

    const lineasSeleccionadas = [...lineasM, ...lineasE]

    if (lineasSeleccionadas.length) {
      indicadores.value.forEach((ind) => {
        ind.lineasAccion = lineasSeleccionadas
      })
      return
    }

    const res = await api.get('/AlineacionMunicipio')
    const data = res.data || []
    indicadores.value.forEach((ind) => {
      ind.lineasAccion = data.map((la) => ({
        id: la.id,
        lineaAccion: la.lineaAccion,
        tipo: 'Municipal',
      }))
    })
  } catch (err) {
    console.error('Error al cargar líneas de acción', err)
    Notify.create({ type: 'negative', message: 'Error al cargar líneas de acción' })
  }
}

async function guardar() {
  try {
    const fichaPayload = {
      claveIndicador: claveIndicador.value,
      tipoIndicador: tipoIndicador.value,
      indicadores: indicadores.value,
      programacionMetas: programacionMetas.value,
    }

    fichaPayload.indicadores = fichaPayload.indicadores.map((ind) => ({
      ...ind,
      lineaBaseAnio:
        ind.lineaBaseAnio !== null && ind.lineaBaseAnio !== undefined
          ? String(ind.lineaBaseAnio)
          : '',
    }))

    await api.post('/FichaIndicador', fichaPayload)
    localStorage.setItem('fichaIndicador', JSON.stringify(fichaPayload))
    Notify.create({ type: 'positive', message: 'Ficha técnica guardada correctamente' })
  } catch (err) {
    console.error('Error al guardar ficha:', err)
    Notify.create({ type: 'negative', message: 'Error al guardar ficha' })
  }
}

onUnmounted(() => {
  if (siglasInterval) clearInterval(siglasInterval)
})
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
