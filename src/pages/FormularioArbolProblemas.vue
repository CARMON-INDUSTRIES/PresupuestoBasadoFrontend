<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1400px; margin: auto">
      <!-- Título -->
      <q-card-section>
        <div class="text-h5 text-center text-black">Árbol de Problemas</div>
      </q-card-section>

      <q-separator class="q-my-md" color="black" />

      <div class="arbol-container">
        <!-- EFECTO SUPERIOR -->
        <div class="nivel efecto">
          <div class="label">Efecto superior o fin</div>
          <div class="nodo efecto-nodo ancho-central with-arrow-down rounded">
            {{ resumen.efectoSuperior?.descripcion }}
          </div>
        </div>

        <!-- RESULTADOS -->
        <div class="nivel resultados" v-if="hayResultados">
          <div class="label">Efecto</div>
          <div class="fila">
            <div
              v-for="(comp, idx) in resumen.disenio?.componentes || []"
              :key="'res-' + idx"
              class="componente-columna"
            >
              <div
                v-for="(res, rIdx) in comp.resultados"
                :key="'res-' + idx + '-' + rIdx"
                class="nodo resultado-nodo with-arrow-down rounded"
              >
                {{ res }}
              </div>
            </div>
          </div>
        </div>

        <!-- PROBLEMA CENTRAL -->
        <div class="nivel problema">
          <div class="label">Problema central</div>
          <div class="nodo problema-nodo ancho-central with-arrow-down with-arrow-up rounded">
            {{ resumen.identificacion?.problemaCentral }}
          </div>
        </div>

        <!-- COMPONENTES Y ACCIONES -->
        <div class="nivel componentes" v-if="resumen.disenio?.componentes?.length">
          <div class="label">Componentes</div>
          <div class="fila">
            <div
              v-for="(comp, idx) in resumen.disenio.componentes"
              :key="'comp-' + idx"
              class="componente-columna"
            >
              <!-- Componente -->
              <div class="nodo componente-nodo with-arrow-up with-arrow-down rounded">
                {{ comp.nombre }}
              </div>

              <div class="label">Actividades</div>

              <!-- Acciones (solo nombre) -->
              <div
                v-for="(accion, aIdx) in comp.acciones"
                :key="'accion-' + idx + '-' + aIdx"
                class="nodo accion-nodo with-arrow-up rounded"
              >
                {{ accion }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón continuar -->
      <q-card-actions align="right" class="q-mt-lg">
        <q-btn
          color="primary"
          text-color="white"
          label="Continuar"
          rounded
          class="submit-btn"
          @click="irArbolObjetivos"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()

const resumen = ref({
  identificacion: null,
  disenio: null,
  efectoSuperior: null,
})

// computado para saber si hay resultados
const hayResultados = computed(() => {
  return (
    Array.isArray(resumen.value?.disenio?.componentes) &&
    resumen.value.disenio.componentes.some(
      (c) => Array.isArray(c.resultados) && c.resultados.length > 0,
    )
  )
})

// helper: convierte cualquier item (string u objeto) a string representativo
function itemToString(item) {
  if (item == null) return ''
  if (typeof item === 'string') return item
  return item.nombre ?? item.Nombre ?? item.descripcion ?? item.Descripcion ?? String(item)
}

async function cargarDatos() {
  try {
    const [identificacionRes, disenioRes, efectoRes] = await Promise.all([
      api.get('/IdentificacionDescripcionProblema/ultimo'),
      api.get('/DisenoIntervencionPublica/ultimo'),
      api.get('/EfectoSuperior/ultimo'),
    ])

    const rawDisenio = disenioRes.data ?? {}
    const rawComps = Array.isArray(rawDisenio.componentes)
      ? rawDisenio.componentes
      : Array.isArray(rawDisenio)
        ? rawDisenio
        : []

    const componentesNormalizados = (rawComps || []).map((comp) => {
      const accionesRaw =
        comp.acciones ?? comp.actividades ?? comp.Acciones ?? comp.Actividades ?? []

      // 🔹 Normalizamos resultado único o múltiples
      const resultadosRaw = comp.resultado
        ? [comp.resultado]
        : (comp.resultados ?? comp.efectos ?? comp.Resultados ?? comp.Efectos ?? [])

      // Normalizamos acciones: solo descripción
      const acciones = Array.isArray(accionesRaw)
        ? accionesRaw
            .map((a) => (typeof a === 'string' ? a : (a.descripcion ?? '')))
            .filter(Boolean)
        : []

      // Normalizamos resultados: solo strings
      const resultados = Array.isArray(resultadosRaw)
        ? resultadosRaw.map(itemToString).filter(Boolean)
        : []

      const nombre = comp.nombre ?? comp.Nombre ?? itemToString(comp)

      return {
        ...(comp.id ? { id: comp.id } : {}),
        ...comp,
        nombre,
        acciones,
        resultados,
      }
    })

    const disenioNormalizado = {
      ...rawDisenio,
      componentes: componentesNormalizados,
    }

    resumen.value = {
      identificacion: identificacionRes.data ?? null,
      disenio: disenioNormalizado,
      efectoSuperior: efectoRes.data ?? null,
    }

    console.log('✅ Datos Anexo 4 (normalizados):', JSON.parse(JSON.stringify(resumen.value)))
  } catch (err) {
    console.error('❌ Error al cargar Anexo 4:', err)
    Notify.create({ type: 'negative', message: 'Error al cargar datos del Anexo 4' })
  }
}

function irArbolObjetivos() {
  router.push('/formulario-arbol-objetivos')
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.arbol-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #111;
  text-transform: uppercase;
}

.nivel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.fila {
  display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.componente-columna {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.nodo {
  position: relative;
  padding: 10px 20px;
  border-radius: 8px;
  min-width: 180px;
  text-align: center;
  font-weight: bold;
}

.ancho-central {
  min-width: 400px;
}

.efecto-nodo,
.problema-nodo {
  background-color: #8a1538;
  color: white;
}

.resultado-nodo {
  background-color: #f59e0b;
  color: black;
}

.componente-nodo {
  background-color: #2563eb;
  color: white;
}

.accion-nodo {
  background-color: #10b981;
  color: white;
}

.submit-btn {
  font-weight: 900;
  font-size: 0.9rem;
  padding: 12px 40px;
}
</style>
