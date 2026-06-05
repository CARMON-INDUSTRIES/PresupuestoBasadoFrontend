<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Árbol de Problemas</h1>
        <p class="page-subtitle">
          Visualización estructurada del problema central, efectos, componentes y actividades.
        </p>
      </div>

      <q-card flat class="modern-card q-pa-xl">
        <div class="arbol-container">
          <div class="nivel efecto">
            <div class="label">Efecto superior o fin</div>

            <div class="nodo efecto-nodo ancho-central with-arrow-down">
              {{ resumen.efectoSuperior?.descripcion }}
            </div>
          </div>

          <div class="nivel resultados" v-if="hayResultados">
            <div class="label">Efectos</div>

            <div class="fila">
              <div
                v-for="(comp, idx) in resumen.disenio?.componentes || []"
                :key="'res-' + idx"
                class="componente-columna"
              >
                <div
                  v-for="(res, rIdx) in comp.resultados"
                  :key="'res-' + idx + '-' + rIdx"
                  class="nodo resultado-nodo with-arrow-down"
                >
                  {{ res }}
                </div>
              </div>
            </div>
          </div>

          <div class="nivel problema">
            <div class="label">Problema central</div>

            <div class="nodo problema-nodo ancho-central with-arrow-up with-arrow-down">
              {{ resumen.identificacion?.problemaCentral }}
            </div>
          </div>

          <div class="nivel componentes" v-if="resumen.disenio?.componentes?.length">
            <div class="label">Componentes y actividades</div>

            <div class="fila">
              <div
                v-for="(comp, idx) in resumen.disenio.componentes"
                :key="'comp-' + idx"
                class="componente-columna"
              >
                <div class="nodo componente-nodo with-arrow-up with-arrow-down">
                  {{ comp.nombre }}
                </div>

                <div
                  v-for="(accion, aIdx) in comp.acciones"
                  :key="'accion-' + idx + '-' + aIdx"
                  class="nodo accion-nodo with-arrow-up"
                >
                  {{ accion }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <q-separator class="q-my-xl" />

        <div class="row justify-end actions-container">
          <q-btn
            label="Pantalla Anterior"
            rounded
            unelevated
            class="secondary-btn"
            to="FormularioAnalisisInvolucrados"
            :loading="loading"
          />

          <q-btn
            label="Continuar"
            rounded
            unelevated
            class="primary-btn"
            @click="irArbolObjetivos"
          />
        </div>
      </q-card>
    </div>
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

const hayResultados = computed(() => {
  return (
    Array.isArray(resumen.value?.disenio?.componentes) &&
    resumen.value.disenio.componentes.some(
      (c) => Array.isArray(c.resultados) && c.resultados.length > 0,
    )
  )
})

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

      const resultadosRaw = comp.resultado
        ? [comp.resultado]
        : (comp.resultados ?? comp.efectos ?? comp.Resultados ?? comp.Efectos ?? [])

      const acciones = Array.isArray(accionesRaw)
        ? accionesRaw
            .map((a) => (typeof a === 'string' ? a : (a.descripcion ?? '')))
            .filter(Boolean)
        : []

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

    console.log('Datos Anexo 4 (normalizados):', JSON.parse(JSON.stringify(resumen.value)))
  } catch (err) {
    console.error('Error al cargar Anexo 4:', err)
    Notify.create({ type: 'negative', message: 'Error al cargar datos del Anexo 4' })
  }
}

function irArbolObjetivos() {
  localStorage.setItem('ultimaRutaRegistro', '/formulario-arbol-objetivos')
  router.push('/formulario-arbol-objetivos')
}

onMounted(() => {
  cargarDatos()
})
</script>
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
  text-align: center;
}

.page-title {
  font-size: 2.3rem;
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
  border-radius: 28px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border: none;
  background: white;
  overflow: hidden;
}

.arbol-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding: 24px 12px;
}

.label {
  font-size: 0.9rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nivel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.fila {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 28px;
  width: 100%;
}

.componente-columna {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.nodo {
  position: relative;
  padding: 18px 22px;
  border-radius: 22px;
  min-width: 220px;
  max-width: 320px;
  text-align: center;
  font-weight: 700;
  line-height: 1.5;
  font-size: 0.95rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.nodo:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.ancho-central {
  min-width: 420px;
  max-width: 720px;
}

.efecto-nodo {
  background: linear-gradient(135deg, #691b31, #8a1538);
  color: white;
}

.resultado-nodo {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #1f2937;
}

.problema-nodo {
  background: linear-gradient(135deg, #7c1d36, #691b31);
  color: white;
}

.componente-nodo {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}

.accion-nodo {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.with-arrow-down::after {
  content: '';
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 24px;
  background: #9ca3af;
}

.with-arrow-up::before {
  content: '';
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 24px;
  background: #9ca3af;
}

.actions-container {
  gap: 14px;
  padding-top: 20px;
}

.primary-btn {
  background: #c5a46d;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.secondary-btn {
  background: #691b31;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.primary-btn:hover,
.secondary-btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .ancho-central {
    min-width: 100%;
    max-width: 100%;
  }

  .fila {
    gap: 20px;
  }

  .nodo {
    min-width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .arbol-container {
    gap: 36px;
  }

  .actions-container {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }

  .nodo {
    font-size: 0.9rem;
    padding: 16px;
  }
}
</style>
