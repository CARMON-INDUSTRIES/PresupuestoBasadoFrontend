<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1200px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center">Matriz de Indicadores para Resultados</div>
      </q-card-section>

      <!-- ===== Encabezado (datos del usuario) ===== -->
      <q-markup-table flat bordered class="q-mb-lg">
        <tbody>
          <tr>
            <td class="bg-primary text-white text-weight-bold" style="width: 30%">
              Unidad Responsable:
            </td>
            <td>{{ usuario.nombreMatriz || usuario.cargo || '' }}</td>
            <td class="bg-primary text-white text-weight-bold" style="width: 30%">
              Unidad Presupuestal Responsable de la Elaboración de la MIR:
            </td>
            <td>{{ usuario.unidadesPresupuestales || '' }}</td>
          </tr>
          <tr>
            <td class="bg-primary text-white text-weight-bold">Programa Sectorial:</td>
            <td>{{ usuario.programaSectorial || '' }}</td>
            <td class="bg-primary text-white text-weight-bold">Programa Presupuestario:</td>
            <td>{{ usuario.programaPresupuestario || '' }}</td>
          </tr>
        </tbody>
      </q-markup-table>

      <!-- ===== Tabla MIR ===== -->
      <q-table flat bordered separator="cell" :rows="filas" :columns="columns" row-key="id">
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <!-- Columna NIVEL en gris -->
            <template v-if="props.col.name === 'nivel'">
              <span class="text-grey-7">{{ props.row.nivel }}</span>
            </template>

            <!-- Columna Resumen Narrativo -->
            <template v-else-if="props.col.name === 'resumenNarrativo'">
              <div class="row items-center no-wrap">
                <div class="col text-ellipsis">
                  <span v-if="props.row.resumenNarrativo">
                    {{ props.row.resumenNarrativo }}
                  </span>
                  <span v-else class="text-grey-6">Sin capturar</span>
                </div>
                <div class="col-auto">
                  <q-btn
                    size="sm"
                    flat
                    color="primary"
                    icon="note_add"
                    label="Capturar"
                    @click="abrirModal(props.row)"
                  />
                </div>
              </div>
            </template>

            <!-- Columnas editables -->
            <template v-else-if="props.col.editable">
              <q-input
                v-model="props.row[props.col.name]"
                dense
                outlined
                type="textarea"
                autogrow
              />
            </template>

            <!-- Fallback -->
            <template v-else>
              {{ props.row[props.col.name] }}
            </template>
          </q-td>
        </template>
      </q-table>

      <!-- ===== Botón Guardar y Siguiente ===== -->
      <div class="q-mt-md text-right">
        <q-btn color="primary" label="Siguiente" :loading="loading" @click="guardarMatriz" />
      </div>

      <!-- ===== Modal Resumen Narrativo ===== -->
      <q-dialog v-model="modalVisible" persistent>
        <q-card style="min-width: 520px">
          <q-card-section class="q-pb-none">
            <div class="text-h6">Resumen Narrativo — {{ filaSeleccionada?.nivel }}</div>
            <div class="text-caption text-grey-7">
              Complete los campos según la regla de sintaxis.
            </div>
          </q-card-section>

          <q-card-section>
            <div v-for="(campo, idx) in camposNarrativos" :key="idx" class="q-mb-md">
              <q-input
                v-model="camposNarrativos[idx]"
                :label="labelsNarrativos[idx]"
                filled
                autogrow
              />
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="negative" v-close-popup />
            <q-btn flat label="Guardar" color="primary" @click="guardarNarrativo" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)

const usuario = ref({
  nombreMatriz: '',
  cargo: '',
  unidadesPresupuestales: '',
  programaSectorial: '',
  programaPresupuestario: '',
})

const filas = ref([])
const modalVisible = ref(false)
const filaSeleccionada = ref(null)
const camposNarrativos = ref([])
const labelsNarrativos = ref([])

const columns = [
  { name: 'nivel', label: 'Nivel', align: 'left' },
  { name: 'resumenNarrativo', label: 'Resumen Narrativo' },
  { name: 'indicadores', label: 'Indicadores', editable: true },
  { name: 'medios', label: 'Medios de verificación', editable: true },
  { name: 'supuestos', label: 'Supuestos', editable: true },
]

onMounted(async () => {
  try {
    const me = await api.get('/Cuentas/me')
    const u = me.data || {}
    usuario.value = {
      nombreMatriz: u.nombreMatriz ?? '',
      cargo: u.cargo ?? '',
      unidadesPresupuestales: u.unidadesPresupuestales ?? '',
      programaSectorial: u.programaSectorial ?? '',
      programaPresupuestario: u.programaPresupuestario ?? '',
    }

    const [efectoRes, objetivoRes, diseno] = await Promise.all([
      api.get('/EfectoSuperior/ultimo'),
      api.get('/ArbolObjetivos/ultimo'),
      api.get('/DisenoIntervencionPublica/ultimo'),
    ])

    const efectoSuperior = efectoRes.data || {}
    const objetivoCentral = objetivoRes.data?.objetivoCentral || ''
    const componentes = Array.isArray(diseno.data?.componentes)
      ? diseno.data.componentes
      : Array.isArray(diseno.data)
        ? diseno.data
        : []

    const f = []
    // 🔥 Ahora los valores de Fin y Propósito van en "nivel"
    f.push(crearFila(`Fin: ${efectoSuperior.descripcion || ''}`))
    f.push(crearFila(`Propósito: ${objetivoCentral}`))

    componentes.forEach((c, ci) => {
      const nombre = c?.nombre ?? `Componente ${ci + 1}`
      f.push(crearFila(`Componente: ${nombre}`))
      const acciones = Array.isArray(c?.acciones) ? c.acciones : []
      acciones.forEach((a, ai) => {
        const etiqueta = a || `Acción ${ai + 1}`
        f.push(crearFila(`Actividad: ${etiqueta}`))
      })
    })
    filas.value = f
  } catch (error) {
    console.error('❌ Error al cargar MIR:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar la MIR' })
  }
})

function crearFila(nivel) {
  return {
    id: cryptoRandomId(),
    nivel, // 🔥 Ahora el texto completo va aquí
    resumenNarrativo: '',
    indicadores: '',
    medios: '',
    supuestos: '',
  }
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

async function guardarMatriz() {
  loading.value = true
  try {
    const payload = {
      unidadResponsable: usuario.value.nombreMatriz || usuario.value.cargo,
      unidadPresupuestal: usuario.value.unidadesPresupuestales,
      programaSectorial: usuario.value.programaSectorial,
      programaPresupuestario: usuario.value.programaPresupuestario,
      filas: filas.value.map((fila) => ({
        nivel: fila.nivel,
        resumenNarrativo: fila.resumenNarrativo,
        indicadores: fila.indicadores,
        medios: fila.medios,
        supuestos: fila.supuestos,
      })),
    }

    await api.post('/MatrizIndicadores', payload)
    Notify.create({ type: 'positive', message: 'Matriz guardada correctamente' })
    router.push('/formulario-ficha-tecnica-1')
  } catch (error) {
    console.error('❌ Error al guardar:', error)
    Notify.create({ type: 'negative', message: 'Error al guardar la matriz' })
  } finally {
    loading.value = false
  }
}

function obtenerLabelsParaNivel(nivel) {
  if (nivel.startsWith('Fin')) return ['Contribuir a un objetivo superior']
  if (nivel.startsWith('Propósito')) {
    return ['Sujeto beneficiario', 'Verbo en presente', 'Resultado logrado']
  }
  if (nivel.startsWith('Componente')) {
    return ['Producto terminado o servicio proporcionado', 'Verbo en pasado participio']
  }
  if (nivel.startsWith('Actividad')) {
    return ['Sustantivo derivado de un verbo', 'Complemento (acciones y procesos)']
  }
  return ['Texto']
}

function abrirModal(row) {
  filaSeleccionada.value = row
  labelsNarrativos.value = obtenerLabelsParaNivel(row.nivel)
  const partes = (row.resumenNarrativo || '').split(' | ')
  camposNarrativos.value = labelsNarrivosLength(labelsNarrativos.value, partes)
  modalVisible.value = true
}

function labelsNarrivosLength(labels, partes) {
  const arr = new Array(labels.length).fill('')
  for (let i = 0; i < labels.length; i++) {
    arr[i] = partes[i] ?? ''
  }
  return arr
}

function guardarNarrativo() {
  if (!filaSeleccionada.value) return
  filaSeleccionada.value.resumenNarrativo = camposNarrativos.value.join(' | ')
}
</script>

<style scoped>
.q-markup-table td.bg-primary {
  background: #7f1d35 !important; /* vino */
}
.q-markup-table td {
  vertical-align: middle;
}
</style>
