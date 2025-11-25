<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1100px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center">
          Anexo 7 - Estructura Analítica del Programa Presupuestario
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          flat
          bordered
          :rows="tabla"
          :columns="columns"
          row-key="campo"
          separator="cell"
          class="anexo7-table"
          :rows-per-page-options="[0]"
        >
          <template v-slot:body-cell="props">
            <q-td :props="props">
              <div v-html="props.value"></div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right" class="q-mt-md">
        <q-btn color="primary" label="Continuar" rounded @click="irAMatrizIndicadores" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()
const tabla = ref([])

const columns = [
  {
    name: 'problema',
    label: 'PROBLEMÁTICA CENTRAL (Árbol de Problemas)',
    align: 'left',
    field: 'problema',
  },
  {
    name: 'solucion',
    label: 'SOLUCIÓN (Árbol de Objetivos)',
    align: 'left',
    field: 'solucion',
  },
]

function texto(obj) {
  if (!obj) return '—'
  if (typeof obj === 'string') return obj
  return obj.descripcion || obj.nombre || JSON.stringify(obj)
}

onMounted(async () => {
  try {
    const [problemaRes, objetivoRes, efectoRes, disenoRes, coberturaRes] = await Promise.all([
      api.get('/IdentificacionDescripcionProblema/ultimo'),
      api.get('/ArbolObjetivos/ultimo'),
      api.get('/EfectoSuperior/ultimo'),
      api.get('/DisenoIntervencionPublica/ultimo'),
      api.get('/Cobertura/ultimo'),
    ])

    const problemaCentral = problemaRes.data?.problemaCentral || '—'
    const fin = objetivoRes.data?.fin || efectoRes.data?.descripcion || '—'

    const componentesProblema = Array.isArray(disenoRes.data?.componentes)
      ? disenoRes.data.componentes
      : Array.isArray(disenoRes.data)
        ? disenoRes.data
        : []

    const componentesObjetivo = Array.isArray(objetivoRes.data?.componentes)
      ? objetivoRes.data.componentes
      : []

    const efectos = componentesProblema.flatMap((c) =>
      Array.isArray(c.resultados)
        ? c.resultados.map(texto)
        : c.resultado
          ? [texto(c.resultado)]
          : [],
    )
    const fines = componentesObjetivo.flatMap((c) =>
      Array.isArray(c.resultados)
        ? c.resultados.map(texto)
        : c.resultado
          ? [texto(c.resultado)]
          : [],
    )

    const causas = componentesProblema.flatMap((c) => (c.acciones || []).map((a) => texto(a)))
    const medios = componentesObjetivo.flatMap((c) => (c.medios || []).map((m) => texto(m)))

    const magnitudLineaBase = coberturaRes.data?.cuantificacionPoblacionAtendidaAnterior || '—'
    const magnitudResultadoEsperado =
      coberturaRes.data?.identificacionCaracterizacionPoblacionObjetivo || '—'

    tabla.value = [
      {
        campo: 'central',
        problema: problemaCentral,
        solucion: fin,
      },
      {
        campo: 'efectos',
        problema: efectos.length ? efectos.map((e) => `<div>${e}</div>`).join('') : '—',
        solucion: fines.length ? fines.map((f) => `<div>${f}</div>`).join('') : '—',
      },
      {
        campo: 'magnitud-base',
        problema: `<strong>Magnitud (Línea Base)</strong><div>${magnitudLineaBase}</div>`,
        solucion: `<strong>Magnitud (Resultado Esperado)</strong><div>${magnitudResultadoEsperado}</div>`,
      },
      {
        campo: 'causas',
        problema: causas.length ? causas.map((c) => `<div>${c}</div>`).join('') : '—',
        solucion: medios.length ? medios.map((m) => `<div>${m}</div>`).join('') : '—',
      },
    ]
  } catch (error) {
    console.error('Error al cargar Anexo 7:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar datos del Anexo 7.' })
  }
})

function irAMatrizIndicadores() {
  localStorage.setItem('ultimaRutaRegistro', '/formulario-matriz-indicadores')
  router.push('/formulario-matriz-indicadores')
}
</script>

<style scoped>
.anexo7-table {
  font-size: 14px;
}
.anexo7-table td {
  vertical-align: top;
  white-space: normal !important;
}
</style>
