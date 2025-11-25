<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1200px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center text-black">Ficha Técnica del Indicador</div>
      </q-card-section>

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

      <!-- ====== FICHA SELECCIONADA ====== -->
      <q-card-section v-if="indicadorActivo">
        <div class="text-h6 q-mb-md">Ficha Técnica del Indicador</div>
        <q-card flat bordered class="q-pa-md">
          <div class="text-subtitle1 q-mb-md text-primary">
            Nombre del Indicador:
            <span class="text-black">{{ indicadorActivo.indicadores || 'Sin nombre' }}ㅤ</span>
            <span class="text-caption text-grey-9">({{ indicadorActivo.nivel }})</span>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-select
                v-model="indicadorActivo.dimension"
                :options="dimensiones"
                label="Dimensión a Medir"
                filled
              />
            </div>
            <div class="col-6">
              <q-select
                v-model="indicadorActivo.sentido"
                :options="sentidos"
                label="Sentido"
                filled
              />
            </div>
          </div>

          <q-input
            v-model="indicadorActivo.definicion"
            type="textarea"
            label="Definición (qué mide y para qué)"
            filled
            autogrow
            class="q-mt-md"
          />

          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-4">
              <q-input
                v-model="indicadorActivo.unidadMedida"
                label="Unidad de medida del resultado"
                filled
                disable
              />
            </div>
            <div class="col-4">
              <q-input v-model="indicadorActivo.rangoValor" label="Rango de valor" filled disable />
            </div>
            <div class="col-4">
              <q-select
                v-model="indicadorActivo.frecuenciaMedicion"
                :options="frecuencias"
                label="Frecuencia de medición"
                filled
              />
            </div>
          </div>

          <q-input
            v-model="indicadorActivo.cobertura"
            label="Cobertura"
            filled
            disable
            class="q-mt-md"
          />
        </q-card>
      </q-card-section>

      <!-- ====== DETERMINACIÓN DE METAS (III) ====== -->
      <q-card-section v-if="indicadorActivo">
        <div class="text-h6 q-mb-md">Determinación de Metas Anual</div>

        <q-form @submit.prevent="agregarMeta">
          <div class="row q-col-gutter-md">
            <div class="col-5">
              <q-input v-model="indicadorActivo.unidadMedida" label="Unidad de Medida" filled />
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
          </div>
        </q-form>

        <q-markup-table
          flat
          bordered
          class="q-mt-md"
          v-if="indicadorActivo.metas && indicadorActivo.metas.length"
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
            <tr v-for="(meta, i) in indicadorActivo.metas" :key="'meta-' + i">
              <td>{{ indicadorActivo.unidadMedida }}</td>
              <td>{{ meta.cantidad }}</td>
              <td>{{ meta.periodoCumplimiento }}</td>
              <td>
                <q-btn dense flat icon="delete" color="negative" @click="eliminarMeta(i)" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <!-- ====== LÍNEA BASE (IV) ====== -->
      <q-card-section v-if="indicadorActivo">
        <div class="text-h6 q-mb-md">Línea Base</div>
        <div class="row q-col-gutter-md">
          <div class="col-3">
            <q-input
              v-model.number="indicadorActivo.lineaBase.valor"
              type="number"
              label="Valor (num)"
              filled
            />
          </div>
          <div class="col-3">
            <q-input
              v-model="indicadorActivo.lineaBase.unidad"
              label="Unidad de medida (texto)"
              filled
            />
          </div>
          <div class="col-3">
            <q-select
              v-model="indicadorActivo.lineaBase.anio"
              :options="anios"
              label="Año"
              filled
            />
          </div>
          <div class="col-3">
            <q-select
              v-model="indicadorActivo.lineaBase.periodo"
              :options="periodos"
              label="Periodo"
              filled
            />
          </div>
        </div>
      </q-card-section>

      <!-- ====== LÍNEAS DE ACCIÓN (V) ====== -->
      <q-card-section v-if="filtradas.length">
        <div class="text-h6 q-mb-md">Líneas de Acción</div>

        <q-markup-table flat bordered>
          <thead>
            <tr>
              <th>Línea de Acción</th>
              <th>Tipo</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="la in filtradas" :key="la.id">
              <td>{{ la.lineaAccion || la.nombre }}</td>
              <td>{{ la.tipo }}</td>
              <td>
                <q-radio
                  v-model="indicadorActivo.lineaAccionSeleccionada"
                  :val="la.id"
                  color="primary"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <!-- ====== DATOS DEL INDICADOR (FÓRMULA) ====== -->
      <q-card-section v-if="indicadorActivo">
        <div class="text-h6 q-mb-md">Datos del Indicador y Fórmula</div>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-input
              v-model="indicadorActivo.resultadoEsperado"
              label="Resultado esperado"
              filled
            />
          </div>
          <div class="col-3">
            <q-input v-model="indicadorActivo.numerador" label="Numerador" filled />
          </div>
          <div class="col-3">
            <q-input v-model="indicadorActivo.denominador" label="Denominador" filled />
          </div>
        </div>

        <div class="q-mt-md text-center">
          <div class="text-subtitle2 q-mb-xs">Vista previa fórmula:</div>
          <div class="q-pa-sm bg-white text-black" style="display: inline-block; min-width: 300px">
            <strong>{{ siglas.resultadoEsperado || 'RE' }}</strong> =
            <strong>{{ siglas.numerador || 'NUM' }}</strong> /
            <strong>{{ siglas.denominador || 'DEN' }}</strong>
          </div>
        </div>

        <div class="q-mt-md">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th>Sigla</th>
                <th>Unidad de medida</th>
                <th>Descripción</th>
                <th>Fuente</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ siglas.resultadoEsperado || 'RE' }}</td>
                <td>
                  <q-input
                    v-model="indicadorActivo.unidadMedida"
                    dense
                    filled
                    placeholder="Unidad"
                  />
                </td>
                <td>{{ indicadorActivo.resultadoEsperado }}</td>
                <td>
                  <q-input
                    v-model="indicadorActivo.fuentes.resultadoEsperado"
                    dense
                    filled
                    placeholder="Fuente"
                  />
                </td>
              </tr>

              <tr>
                <td>{{ siglas.numerador || 'NUM' }}</td>
                <td>
                  <q-input
                    v-model="indicadorActivo.unidadMedida"
                    dense
                    filled
                    placeholder="Unidad"
                  />
                </td>
                <td>{{ indicadorActivo.numerador }}</td>
                <td>
                  <q-input
                    v-model="indicadorActivo.fuentes.numerador"
                    dense
                    filled
                    placeholder="Fuente"
                  />
                </td>
              </tr>

              <tr>
                <td>{{ siglas.denominador || 'DEN' }}</td>
                <td>
                  <q-input
                    v-model="indicadorActivo.unidadMedida"
                    dense
                    filled
                    placeholder="Unidad"
                  />
                </td>
                <td>{{ indicadorActivo.denominador }}</td>
                <td>
                  <q-input
                    v-model="indicadorActivo.fuentes.denominador"
                    dense
                    filled
                    placeholder="Fuente"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </q-card-section>

      <!-- ====== APARTADO CREMA ====== -->
      <q-card-section v-if="indicadorActivo">
        <div class="text-h6 q-mb-md">CREMA</div>

        <q-markup-table flat bordered>
          <thead>
            <tr class="bg-grey-3 text-bold">
              <th>Nombre del Indicador</th>
              <th>Claro</th>
              <th>Relevante</th>
              <th>Económico</th>
              <th>Monitoreable</th>
              <th>Adecuado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ indicadorActivo.indicadores }}</td>
              <td>
                <q-checkbox
                  v-model="indicadorActivo.crema.claro"
                  true-value="Sí"
                  false-value="No"
                />
              </td>
              <td>
                <q-checkbox
                  v-model="indicadorActivo.crema.relevante"
                  true-value="Sí"
                  false-value="No"
                />
              </td>
              <td>
                <q-checkbox
                  v-model="indicadorActivo.crema.economico"
                  true-value="Sí"
                  false-value="No"
                />
              </td>
              <td>
                <q-checkbox
                  v-model="indicadorActivo.crema.monitoreable"
                  true-value="Sí"
                  false-value="No"
                />
              </td>
              <td>
                <q-checkbox
                  v-model="indicadorActivo.crema.adecuado"
                  true-value="Sí"
                  false-value="No"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>

      <!-- ====== VI. PROGRAMACIÓN DE METAS ====== -->
      <q-card-section v-if="indicadorActivo">
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
            <tr v-for="(meta, index) in programacionMetas" :key="'meta-mes-' + index">
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

      <q-card-actions align="right" v-if="indicadores.length">
        <q-btn color="primary" label="Guardar y Continuar" @click="guardar" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const usuario = ref({})
const claveIndicador = ref('')
const tipoIndicador = ref('')
const indicadores = ref([])
const indiceSeleccionado = ref(0)
const modoProgramacion = ref('prorratear')

const dimensiones = ['Eficiencia', 'Eficacia', 'Calidad', 'Economía']
const sentidos = ['Ascendente', 'Descendente']
const frecuencias = ['Mensual', 'Trimestral', 'Semestral', 'Anual']
const periodos = ['Primer trimestre', 'Segundo trimestre', 'Tercer trimestre', 'Cuarto trimestre']
const currentYear = new Date().getFullYear()
const anios = [currentYear, currentYear - 1, currentYear - 2]

const nuevaMeta = ref({ metaProgramada: '', cantidad: null, periodoCumplimiento: '' })
const indicadorActivo = computed(() => indicadores.value[indiceSeleccionado.value] || null)
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

const siglas = ref({ resultadoEsperado: '', numerador: '', denominador: '' })
let siglasInterval = null

const programacionMetas = ref(
  Array.from({ length: 12 }, (_, i) => ({
    mes: `Mes ${i + 1}`,
    cantidad: 0,
    alcanzado: 0,
    fecha: '',
  })),
)

function calcularPorcentajeEsperado(meta) {
  const total = programacionMetas.value.reduce((sum, m) => sum + (m.cantidad || 0), 0)
  if (!total) return 0
  return ((meta.cantidad / total) * 100).toFixed(1)
}

function calcularPorcentajeAlcanzado(meta) {
  if (!meta.cantidad) return 0
  return ((meta.alcanzado / meta.cantidad) * 100).toFixed(1)
}

function calcularSemaforo(meta) {
  const pct = parseFloat(calcularPorcentajeAlcanzado(meta))
  const sentido = indicadorActivo.value?.sentido || 'Ascendente'

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

watch(
  [modoProgramacion, () => nuevaMeta.value.cantidad, () => nuevaMeta.value.periodoCumplimiento],
  ([modo, cantidad, periodo]) => {
    if (modo === 'prorratear' && cantidad && periodo) {
      const mesesAcumulados = getMesesAcumulados(periodo)
      const prorrateo = (cantidad / mesesAcumulados.length).toFixed(2)
      programacionMetas.value.forEach((meta, index) => {
        meta.cantidad = mesesAcumulados.includes(index) ? parseFloat(prorrateo) : 0
      })
    }
  },
)

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
      lineaBase: f.lineaBase || { valor: null, unidad: '', anio: '', periodo: '' },

      lineasAccion: f.lineasAccion || [],

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

      console.log('Líneas de acción cargadas correctamente:', lineasSeleccionadas)
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

function generarSiglas(texto) {
  if (!texto) return ''
  const blacklist = ['de', 'la', 'el', 'y', 'del', 'para', 'con', 'las', 'los']
  return texto
    .split(/[\s\-/]+/)
    .filter((w) => w && !blacklist.includes(w.toLowerCase()))
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
}

function agregarMeta() {
  const activo = indicadorActivo.value
  if (!activo) return
  if (!nuevaMeta.value.cantidad || !nuevaMeta.value.periodoCumplimiento) {
    Notify.create({ type: 'warning', message: 'Completa todos los campos de la meta' })
    return
  }
  activo.metas.push({ ...nuevaMeta.value })
  nuevaMeta.value = { metaProgramada: '', cantidad: null, periodoCumplimiento: '' }
  Notify.create({ type: 'positive', message: 'Meta agregada' })
}

function eliminarMeta(idx) {
  const activo = indicadorActivo.value
  if (!activo) return
  activo.metas.splice(idx, 1)
}

async function guardar() {
  try {
    const fichaPayload = {
      claveIndicador: claveIndicador.value,
      tipoIndicador: tipoIndicador.value,
      indicadores: indicadores.value,
      programacionMetas: programacionMetas.value,
    }

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
.q-markup-table td {
  vertical-align: middle;
}
</style>
