<template>
  <q-page padding style="background-color: #691b31">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Anexo 6 - Análisis de Alternativas</div>
      </q-card-section>

      <q-table
        flat
        bordered
        :rows="tabla"
        :columns="columns"
        row-key="nombre"
        separator="cell"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <!-- Nombre del componente -->
            <template v-if="props.col.name === 'nombre'">
              {{ props.row.nombre }}
            </template>

            <!-- Dropdowns -->
            <template v-else-if="props.col.editable">
              <q-select
                v-model="props.row[props.col.name]"
                :options="opciones"
                dense
                outlined
                emit-value
                map-options
                style="width: 80px"
              />
            </template>

            <!-- Total -->
            <template v-else-if="props.col.name === 'total'">
              <strong>{{ calcularTotal(props.row) }}</strong>
            </template>

            <!-- Probabilidad -->
            <template v-else-if="props.col.name === 'probabilidad'">
              <q-badge
                :color="getColor(calcularProbabilidad(props.row))"
                text-color="white"
                align="center"
              >
                {{ calcularProbabilidad(props.row) }}%
              </q-badge>
            </template>
          </q-td>
        </template>
      </q-table>

      <!-- Botones -->
      <div class="q-mt-md text-center flex flex-center q-gutter-md">
        <q-btn color="primary" label="Confirmar" @click="validarConfirmar" />
        <q-btn color="secondary" label="Continuar" @click="continuarFlujo" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Notify } from 'quasar'
import Swal from 'sweetalert2'
import api from 'src/boot/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const tabla = ref([])
const confirmado = ref(false)

const STORAGE_KEY = 'anexo6AnalisisAlternativas'

// Columnas y opciones
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

// Cargar componentes y actividades
onMounted(async () => {
  try {
    const res = await api.get('/DisenoIntervencionPublica/ultimo')
    const comps = res.data.componentes || []

    tabla.value = comps.flatMap((c) => {
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

    // Cargar desde localStorage si existe
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      tabla.value = JSON.parse(saved)
      console.log('✅ Anexo 6 cargado desde localStorage')
    }
  } catch (error) {
    console.error('❌ Error al cargar alternativas:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar alternativas' })
  }
})

// 💾 Guardar tabla automáticamente en localStorage
watch(
  tabla,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true },
)

// Calcular total y probabilidad
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

// Guardar en backend
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
    console.error('❌ Error al guardar Anexo 6:', e)
    Notify.create({ type: 'negative', message: 'Error al guardar Anexo 6' })
  }
}

// Confirmar con validaciones
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
  const tieneAmarillo = porcentajes.some((p) => p >= 70 && p <= 89.99)

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

// Continuar
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
