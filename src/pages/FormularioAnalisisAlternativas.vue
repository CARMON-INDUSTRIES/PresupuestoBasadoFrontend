<template>
  <q-page padding style="background-color: #691b31">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Anexo 6 - Análisis de Alternativas</div>
      </q-card-section>

      <q-table flat bordered :rows="tabla" :columns="columns" row-key="nombre" separator="cell">
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
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import Swal from 'sweetalert2'
import api from 'src/boot/api'
import { useRouter } from 'vue-router'

const tabla = ref([])
const router = useRouter()
const confirmado = ref(false)

const columns = [
  { name: 'nombre', label: 'Alternativas (Componentes)', align: 'left' },
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

// Cargar componentes
onMounted(async () => {
  try {
    const res = await api.get('/DisenoIntervencionPublica/ultimo')
    tabla.value = (res.data.componentes || []).map((c) => ({
      nombre: c.nombre,
      facultad: 0,
      presupuesto: 0,
      cortoPlazo: 0,
      recursosTecnicos: 0,
      recursosAdm: 0,
      cultural: 0,
      impacto: 0,
    }))
  } catch (error) {
    console.error('❌ Error al cargar alternativas:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar alternativas' })
  }
})

// Calcular total
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

// Calcular probabilidad
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
  const obtenido = criteriosValidos.reduce((sum, v) => sum + v, 0)
  return maximo > 0 ? Math.round((obtenido / maximo) * 100) : 0
}

// Colores según probabilidad
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
        recursosTecnicos: row.recursosTecnicos || 0,
        recursosAdministrativos: row.recursosAdm || 0,
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
  const probabilidades = tabla.value.map((row) => calcularProbabilidad(row))
  const tieneRojo = probabilidades.some((p) => p <= 70)
  const tieneAmarillo = probabilidades.some((p) => p >= 71 && p <= 85)

  if (tieneRojo) {
    Swal.fire({
      icon: 'error',
      title: 'Correcciones necesarias',
      text: 'Existen componentes en rojo (≤70%). Debes corregir antes de continuar.',
      confirmButtonText: 'Regresar',
    }).then(() => router.push('/formulario-diseno-intervencion'))
  } else if (tieneAmarillo) {
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: 'Hay componentes en amarillo (71–85%). ¿Confirmar de todas formas?',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Corregir',
    }).then((result) => {
      if (result.isConfirmed) {
        confirmado.value = true
        guardarAnalisis()
        Swal.fire('Confirmado', 'Se guardó el análisis correctamente.', 'success')
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        router.push('/formulario-diseno-intervencion')
      }
    })
  } else {
    Swal.fire({
      icon: 'success',
      title: '¡Todo en orden!',
      text: 'Todos los componentes están en verde.',
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
  router.push('/formulario-estructura-analitica')
}
</script>
