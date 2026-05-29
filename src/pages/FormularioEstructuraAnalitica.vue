<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Estructura Analítica del Programa Presupuestario</h1>
        <p class="page-subtitle">
          Relación entre la problemática central y la solución propuesta derivada del árbol de
          problemas y objetivos.
        </p>
      </div>

      <q-card flat class="modern-card">
        <q-card-section>
          <div class="section-title">Matriz analítica</div>

          <q-table
            flat
            bordered
            :rows="tabla"
            :columns="columns"
            row-key="campo"
            separator="cell"
            class="modern-table"
            :rows-per-page-options="[0]"
          >
            <template v-slot:body-cell="props">
              <q-td :props="props">
                <div class="table-content" v-html="props.value"></div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right" class="actions-container q-pa-md">
          <q-btn
            label="Pantalla Anterior"
            rounded
            unelevated
            class="secondary-btn"
            to="formulario-analisis-alternativas"
            :loading="loading"
          />

          <q-btn
            label="Continuar"
            rounded
            unelevated
            class="primary-btn"
            @click="irAMatrizIndicadores"
          />
        </q-card-actions>
      </q-card>
    </div>
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
.page-container {
  background: #f4f6f9;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1250px;
  margin: auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #691b31;
  margin: 0;
}

.page-subtitle {
  color: #6b7280;
  margin-top: 8px;
  font-size: 1rem;
}

.modern-card {
  border-radius: 24px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
  border: none;
  background: white;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 18px;
}

.modern-table {
  border-radius: 18px;
  overflow: hidden;
}

.table-content {
  white-space: normal;
  line-height: 1.7;
  color: #374151;
}

:deep(.q-table th) {
  background: #691b31;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  text-align: center;
  padding: 16px;
}

:deep(.q-table tbody td) {
  vertical-align: top;
  padding: 18px;
  font-size: 0.95rem;
}

:deep(.q-table tbody tr:nth-child(even)) {
  background: #fafafa;
}

.actions-container {
  gap: 12px;
  flex-wrap: wrap;
}

.primary-btn {
  background: #c5a46d;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.primary-btn:hover {
  opacity: 0.95;
}

.secondary-btn {
  background: #691b31;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.7rem;
  }

  .actions-container {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }

  :deep(.q-table th),
  :deep(.q-table tbody td) {
    font-size: 0.82rem;
    padding: 10px;
  }
}
</style>
