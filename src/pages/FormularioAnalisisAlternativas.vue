<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Análisis de Alternativas</h1>
        <p class="page-subtitle">
          Evalúa la viabilidad de los componentes y actividades de la intervención pública.
        </p>
      </div>

      <q-card flat class="modern-card">
        <q-card-section>
          <div class="section-title">Matriz de evaluación</div>

          <q-table
            flat
            bordered
            :rows="tabla"
            :columns="columns"
            row-key="nombre"
            separator="cell"
            :rows-per-page-options="[0]"
            class="modern-table"
          >
            <template v-slot:body-cell="props">
              <q-td :props="props">
                <template v-if="props.col.name === 'nombre'">
                  <div class="nombre-cell">
                    {{ props.row.nombre }}
                  </div>
                </template>

                <template v-else-if="props.col.editable">
                  <q-select
                    v-model="props.row[props.col.name]"
                    :options="opciones"
                    dense
                    outlined
                    emit-value
                    map-options
                    class="score-select"
                  />
                </template>

                <template v-else-if="props.col.name === 'total'">
                  <div class="total-cell">
                    {{ calcularTotal(props.row) }}
                  </div>
                </template>

                <template v-else-if="props.col.name === 'probabilidad'">
                  <q-badge
                    :color="getColor(calcularProbabilidad(props.row))"
                    text-color="white"
                    class="probabilidad-badge"
                  >
                    {{ calcularProbabilidad(props.row) }}%
                  </q-badge>
                </template>
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
            to="formulario-arbol-objetivos"
            :loading="loading"
          />

          <q-btn
            label="Confirmar"
            rounded
            unelevated
            class="warning-btn"
            @click="validarConfirmar"
          />

          <q-btn label="Continuar" rounded unelevated class="primary-btn" @click="continuarFlujo" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>
.page-container {
  background: #f4f6f9;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1500px;
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

.nombre-cell {
  font-weight: 600;
  color: #374151;
  min-width: 240px;
}

.score-select {
  min-width: 90px;
}

.total-cell {
  font-weight: 800;
  color: #111827;
  text-align: center;
}

.probabilidad-badge {
  padding: 8px 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
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

.warning-btn {
  background: #f59e0b;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.warning-btn:hover {
  opacity: 0.95;
}

:deep(.q-table th) {
  background: #691b31;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  text-align: center;
}

:deep(.q-table tbody td) {
  vertical-align: middle;
}

:deep(.q-table tbody tr:nth-child(even)) {
  background: #fafafa;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.7rem;
  }

  .actions-container {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn,
  .warning-btn {
    width: 100%;
  }

  .nombre-cell {
    min-width: 180px;
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import Swal from 'sweetalert2'
import api from 'src/boot/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const tabla = ref([])
const confirmado = ref(false)

const columns = [
  { name: 'nombre', label: 'Alternativas (Componentes y Actividades)', align: 'left' },
  { name: 'facultad', label: 'a) Facultad Jurídica', editable: true },
  { name: 'presupuesto', label: 'b) Presupuesto Disponible', editable: true },
  { name: 'cortoPlazo', label: 'c) Realizable en Corto Plazo', editable: true },
  { name: 'recursosTecnicos', label: 'd) Recursos Técnicos', editable: true },
  { name: 'recursosAdm', label: 'e) Recursos Administrativos', editable: true },
  { name: 'cultural', label: 'f) Cultural y Socialmente Aceptable', editable: true },
  { name: 'impacto', label: 'g) Estudio de Impacto', editable: true },
  { name: 'total', label: 'Total', align: 'center' },
  { name: 'probabilidad', label: 'Probabilidad de Éxito', align: 'center' },
]

const opciones = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: 'N/A', value: 0 },
]

onMounted(async () => {
  try {
    const res = await api.get('/DisenoIntervencionPublica/ultimo')
    const comps = res.data.componentes || []

    const estructuraNueva = comps.flatMap((c) => {
      const filaComponente = {
        nombre: `Componente: ${c.nombre}`,
        facultad: 0,
        presupuesto: 0,
        cortoPlazo: 0,
        recursosTecnicos: 0,
        recursosAdm: 0,
        cultural: 0,
        impacto: 0,
      }

      const filasActividades = (c.acciones || []).map((a) => {
        const actividadNombre =
          typeof a === 'string' ? a : (a.nombre ?? a.titulo ?? a.descripcion ?? JSON.stringify(a))

        return {
          nombre: `Actividad: ${actividadNombre}`,
          facultad: 0,
          presupuesto: 0,
          cortoPlazo: 0,
          recursosTecnicos: 0,
          recursosAdm: 0,
          cultural: 0,
          impacto: 0,
        }
      })

      return [filaComponente, ...filasActividades]
    })

    let borrador = null
    try {
      const resBorrador = await api.get('/AnalisisAlternativas/ultimo')
      borrador = resBorrador.data
    } catch (error) {
      console.warn('No hay borrador previo', error)
    }

    if (borrador && Array.isArray(borrador.alternativas)) {
      const mapa = new Map()
      borrador.alternativas.forEach((a) => mapa.set(a.nombre, a))

      tabla.value = estructuraNueva.map((fila) => {
        const existente = mapa.get(fila.nombre)

        if (!existente) return fila

        return {
          nombre: fila.nombre,
          facultad: existente.facultad ?? 0,
          presupuesto: existente.presupuesto ?? 0,
          cortoPlazo: existente.cortoPlazo ?? 0,
          recursosTecnicos: existente.recursosTecnicos ?? 0,
          recursosAdm: existente.recursosAdministrativos ?? 0,
          cultural: existente.culturalSocial ?? 0,
          impacto: existente.impacto ?? 0,
        }
      })
    } else {
      tabla.value = estructuraNueva
    }
  } catch (error) {
    console.error('Error al cargar alternativas:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar alternativas',
    })
  }
})

function calcularTotal(row) {
  const valores = [
    row.facultad,
    row.presupuesto,
    row.cortoPlazo,
    row.recursosTecnicos,
    row.recursosAdm,
    row.cultural,
    row.impacto,
  ]
  return valores.reduce((sum, v) => sum + (v || 0), 0)
}

function calcularProbabilidad(row) {
  const valores = [
    row.facultad,
    row.presupuesto,
    row.cortoPlazo,
    row.recursosTecnicos,
    row.recursosAdm,
    row.cultural,
    row.impacto,
  ]
  const criteriosValidos = valores.filter((v) => v !== 0)
  const maximo = criteriosValidos.length * 3
  const obtenido = criteriosValidos.reduce((sum, v) => sum + (v || 0), 0)
  return maximo > 0 ? Math.round((obtenido / maximo) * 100) : 0
}

function getColor(valor) {
  if (valor <= 70) return 'red'
  if (valor <= 85) return 'orange'
  return 'green'
}

async function guardarAnalisis() {
  try {
    const payload = {
      alternativas: tabla.value.map((row) => ({
        nombre: row.nombre,
        facultad: row.facultad || 0,
        presupuesto: row.presupuesto || 0,
        cortoPlazo: row.cortoPlazo || 0,
        recursosAdministrativos: row.recursosAdm || 0,
        recursosTecnicos: row.recursosTecnicos || 0,
        culturalSocial: row.cultural || 0,
        impacto: row.impacto || 0,
      })),
    }

    await api.post('/AnalisisAlternativas', payload)
    Notify.create({ type: 'positive', message: 'Análisis guardado correctamente' })
  } catch (e) {
    console.error('Error al guardar Anexo 6:', e)
    Notify.create({ type: 'negative', message: 'Error al guardar Anexo 6' })
  }
}

function validarConfirmar() {
  const porcentajes = tabla.value
    .map((row) => {
      const valores = [
        row.facultad,
        row.presupuesto,
        row.cortoPlazo,
        row.recursosTecnicos,
        row.recursosAdm,
        row.cultural,
        row.impacto,
      ]
      const criteriosValidos = valores.filter((v) => v !== 0)
      if (criteriosValidos.length === 0) return null
      const maximo = criteriosValidos.length * 3
      const obtenido = criteriosValidos.reduce((sum, v) => sum + (v || 0), 0)
      return Math.round((obtenido / maximo) * 100)
    })
    .filter((p) => p !== null)

  if (porcentajes.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Sin criterios capturados',
      text: 'Captura al menos una fila antes de confirmar.',
      confirmButtonText: 'OK',
    })
    return
  }

  const tieneRojo = porcentajes.some((p) => p <= 69.99)
  const tieneAmarillo = porcentajes.some((p) => p >= 70 && p <= 84)

  if (tieneRojo) {
    Swal.fire({
      icon: 'error',
      title: 'Correcciones necesarias',
      text: 'Existen alternativas en rojo (≤70%). Debes corregir antes de continuar.',
      confirmButtonText: 'Regresar',
    }).then(() => router.push('/formulario-editar-componentes'))
  } else if (tieneAmarillo) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Hay alternativas en amarillo (71–85%). ¿Confirmar de todas formas?',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Corregir',
    }).then((result) => {
      if (result.isConfirmed) {
        confirmado.value = true
        guardarAnalisis()
        Swal.fire('Confirmado', 'Se guardó el análisis correctamente.', 'success')
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        router.push('/formulario-editar-componentes')
      }
    })
  } else {
    Swal.fire({
      icon: 'success',
      title: '¡Todo en orden!',
      text: 'Todas las alternativas están en verde.',
      confirmButtonText: 'OK',
    }).then(() => {
      confirmado.value = true
      guardarAnalisis()
    })
  }
}

function continuarFlujo() {
  if (!confirmado.value) {
    Swal.fire({
      icon: 'info',
      title: 'Primero confirma',
      text: 'Debes presionar "Confirmar" antes de continuar.',
    })
    return
  }
  localStorage.setItem('ultimaRutaRegistro', '/formulario-estructura-analitica')
  router.push('/formulario-estructura-analitica')
}
</script>
