<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Árbol de Objetivos</h1>
        <p class="page-subtitle">
          Transformación del árbol de problemas en objetivos, medios y fines en positivo.
        </p>
      </div>

      <q-card flat class="modern-card q-pa-xl">
        <div class="row justify-center q-mb-xl">
          <div class="col-12 col-lg-8">
            <div class="tree-card tree-fin">
              <div class="tree-label">Fin</div>

              <q-input
                v-model="arbolObjetivos.fin"
                filled
                autogrow
                type="textarea"
                class="modern-input"
                placeholder="Describe el fin esperado..."
              />

              <div class="tree-reference">
                Basado en:
                {{ arbolProblemas.efectoSuperior?.descripcion || '—' }}
              </div>

              <div class="connector"></div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-xl justify-center q-mb-xl">
          <div
            v-for="(comp, cIndex) in arbolObjetivos.componentes"
            :key="'res-' + cIndex"
            class="col-12 col-md-6 col-lg-3"
          >
            <div class="tree-card tree-effect">
              <div class="tree-label">Efectos</div>

              <div
                v-for="(res, rIndex) in comp.resultados"
                :key="'resultado-' + cIndex + '-' + rIndex"
                class="q-mb-md"
              >
                <q-input
                  v-model="arbolObjetivos.componentes[cIndex].resultados[rIndex]"
                  filled
                  autogrow
                  :label="`Efecto ${rIndex + 1}`"
                  class="modern-input"
                />

                <div class="tree-reference">
                  Basado en:
                  {{ arbolProblemas.componentes[cIndex]?.resultados?.[rIndex] || '—' }}
                </div>
              </div>

              <div class="connector"></div>
            </div>
          </div>
        </div>

        <div class="row justify-center q-mb-xl">
          <div class="col-12 col-lg-8">
            <div class="tree-card tree-objective">
              <div class="tree-label">Objetivo Central</div>

              <q-input
                v-model="arbolObjetivos.objetivoCentral"
                filled
                autogrow
                type="textarea"
                class="modern-input"
                placeholder="Describe el objetivo central..."
              />

              <div class="tree-reference">
                Basado en:
                {{ arbolProblemas.problemaCentral?.problemaCentral || '—' }}
              </div>

              <div class="connector"></div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-xl justify-center q-mb-xl">
          <div
            v-for="(comp, cIndex) in arbolObjetivos.componentes"
            :key="'comp-' + cIndex"
            class="col-12 col-md-6 col-lg-3"
          >
            <div class="tree-card tree-component">
              <div class="tree-label">Componente {{ cIndex + 1 }}</div>

              <q-input
                v-model="arbolObjetivos.componentes[cIndex].nombre"
                filled
                autogrow
                label="Nombre en positivo"
                class="modern-input"
              />

              <div class="tree-reference">
                Basado en:
                {{ arbolProblemas.componentes[cIndex]?.nombre || '—' }}
              </div>

              <div class="connector"></div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-xl justify-center">
          <div
            v-for="(comp, cIndex) in arbolObjetivos.componentes"
            :key="'medio-' + cIndex"
            class="col-12 col-md-6 col-lg-3"
          >
            <div class="tree-card tree-medium">
              <div class="tree-label">Medios</div>

              <div
                v-for="(medio, mIndex) in comp.medios"
                :key="'medio-item-' + cIndex + '-' + mIndex"
                class="q-mb-md"
              >
                <q-input
                  v-model="arbolObjetivos.componentes[cIndex].medios[mIndex]"
                  filled
                  autogrow
                  :label="`Medio ${mIndex + 1}`"
                  class="modern-input"
                />

                <div class="tree-reference">
                  Basado en:
                  {{ arbolProblemas.componentes[cIndex]?.acciones?.[mIndex]?.descripcion || '—' }}
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
            to="formulario-arbol-problemas"
            :loading="loading"
          />

          <q-btn
            rounded
            unelevated
            class="primary-btn"
            :loading="loading || generandoIA"
            label="Guardar"
            @click="guardar"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)
const generandoIA = ref(false)

const arbolId = ref(null)

const arbolProblemas = ref({
  efectoSuperior: null,
  problemaCentral: null,
  componentes: [],
})

const arbolObjetivos = ref({
  fin: '',
  objetivoCentral: '',
  componentes: [],
})

function itemToString(item) {
  if (!item) return ''
  return typeof item === 'string' ? item : (item.descripcion ?? '')
}

function estaVacioArbolObjetivos(arbol) {
  if (arbol.fin) return false
  if (arbol.objetivoCentral) return false

  return arbol.componentes.every(
    (c) => !c.nombre && c.medios.every((m) => !m) && c.resultados.every((r) => !r),
  )
}

async function convertirConIA(textoBase, nivel) {
  if (!textoBase) return ''
  try {
    const { data } = await api.post('/ArbolObjetivos/convertir-positivo', {
      textoBase,
      nivel,
    })
    return data?.textoPositivo || ''
  } catch {
    return ''
  }
}

async function generarObjetivosAutomaticamente() {
  generandoIA.value = true

  try {
    if (!arbolObjetivos.value.fin && arbolProblemas.value.efectoSuperior?.descripcion) {
      arbolObjetivos.value.fin = await convertirConIA(
        arbolProblemas.value.efectoSuperior.descripcion,
        'FIN',
      )
    }

    if (
      !arbolObjetivos.value.objetivoCentral &&
      arbolProblemas.value.problemaCentral?.problemaCentral
    ) {
      arbolObjetivos.value.objetivoCentral = await convertirConIA(
        arbolProblemas.value.problemaCentral.problemaCentral,
        'OBJETIVO_CENTRAL',
      )
    }

    for (let i = 0; i < arbolObjetivos.value.componentes.length; i++) {
      const compObj = arbolObjetivos.value.componentes[i]
      const compProb = arbolProblemas.value.componentes[i]

      if (!compObj.nombre && compProb?.nombre) {
        compObj.nombre = await convertirConIA(compProb.nombre, 'COMPONENTE')
      }

      for (let r = 0; r < compObj.resultados.length; r++) {
        if (!compObj.resultados[r] && compProb?.resultados?.[r]) {
          compObj.resultados[r] = await convertirConIA(compProb.resultados[r], 'RESULTADO')
        }
      }

      for (let m = 0; m < compObj.medios.length; m++) {
        if (!compObj.medios[m] && compProb?.acciones?.[m]?.descripcion) {
          compObj.medios[m] = await convertirConIA(compProb.acciones[m].descripcion, 'MEDIO')
        }
      }
    }
  } finally {
    generandoIA.value = false
  }
}

let autosaveTimer = null
function autosave() {
  clearTimeout(autosaveTimer)

  autosaveTimer = setTimeout(async () => {
    try {
      const payload = {
        id: arbolId.value ?? 0,
        fin: arbolObjetivos.value.fin,
        objetivoCentral: arbolObjetivos.value.objetivoCentral,
        componentes: arbolObjetivos.value.componentes,
      }

      const res = await api.post('/ArbolObjetivos/borrador', payload)

      if (res?.data?.id) arbolId.value = res.data.id

      console.log('💾 Árbol autosave')
    } catch (err) {
      console.warn('Autosave error:', err)
    }
  }, 700)
}

onMounted(async () => {
  try {
    const [efectoRes, problemaRes, disenoRes] = await Promise.all([
      api.get('/EfectoSuperior/ultimo'),
      api.get('/IdentificacionDescripcionProblema/ultimo'),
      api.get('/DisenoIntervencionPublica/ultimo'),
    ])

    const compSrc = Array.isArray(disenoRes.data?.componentes) ? disenoRes.data.componentes : []

    const componentesProblema = compSrc.map((c) => ({
      nombre: c?.nombre ?? '',
      acciones: Array.isArray(c?.acciones) ? c.acciones : [],
      resultados: c?.resultado ? [itemToString(c.resultado)] : [],
    }))

    arbolProblemas.value = {
      efectoSuperior: efectoRes.data || null,
      problemaCentral: problemaRes.data || null,
      componentes: componentesProblema,
    }

    const baseComponentes = componentesProblema.map((c) => ({
      nombre: '',
      medios: c.acciones.map(() => ''),
      resultados: c.resultados.map(() => ''),
    }))

    // 🔥 1. Intentar cargar borrador
    try {
      const borradorRes = await api.get('/ArbolObjetivos/ultimo')
      const borrador = borradorRes.data

      if (borrador && borrador.componentes) {
        arbolId.value = borrador.id

        arbolObjetivos.value = {
          fin: borrador.fin || '',
          objetivoCentral: borrador.objetivoCentral || '',
          componentes: baseComponentes.map((base, i) => ({
            nombre: borrador.componentes?.[i]?.nombre || '',
            medios: base.medios.map((_, m) => borrador.componentes?.[i]?.medios?.[m] || ''),
            resultados: base.resultados.map(
              (_, r) => borrador.componentes?.[i]?.resultados?.[r] || '',
            ),
          })),
        }
      } else {
        throw new Error()
      }
    } catch {
      // 🔥 2. Si no hay nada → estructura limpia
      arbolObjetivos.value = {
        fin: '',
        objetivoCentral: '',
        componentes: baseComponentes,
      }
    }

    if (estaVacioArbolObjetivos(arbolObjetivos.value)) {
      await generarObjetivosAutomaticamente()
    }
  } catch (error) {
    console.error('Error al cargar árbol:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar árbol de problemas' })
  }
})

// 🔥 autosave real
watch(
  arbolObjetivos,
  () => {
    autosave()
  },
  { deep: true },
)

async function guardar() {
  loading.value = true
  try {
    const payload = {
      fin: arbolObjetivos.value.fin,
      objetivoCentral: arbolObjetivos.value.objetivoCentral,
      componentes: arbolObjetivos.value.componentes,
    }

    await api.post('/ArbolObjetivos', payload)

    Notify.create({ type: 'positive', message: 'Árbol de Objetivos guardado' })
    router.push('/formulario-analisis-alternativas')
  } catch (error) {
    console.warn('No se pudo guardar:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-container {
  background: #f4f6f9;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1400px;
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
  background: white;
  border: none;
}

.tree-card {
  position: relative;
  border-radius: 24px;
  padding: 24px;
  height: 100%;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.tree-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

.tree-fin {
  background: linear-gradient(135deg, #691b31, #8a1538);
  color: white;
}

.tree-effect {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.tree-objective {
  background: linear-gradient(135deg, #7c1d36, #691b31);
  color: white;
}

.tree-component {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}

.tree-medium {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.tree-label {
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tree-reference {
  margin-top: 10px;
  font-size: 0.78rem;
  opacity: 0.9;
  line-height: 1.4;
}

.connector {
  width: 3px;
  height: 28px;
  background: rgba(156, 163, 175, 0.7);
  position: absolute;
  left: 50%;
  bottom: -28px;
  transform: translateX(-50%);
}

.modern-input {
  transition: all 0.2s ease;
}

.modern-input:hover {
  transform: translateY(-1px);
}

.actions-container {
  gap: 14px;
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
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .actions-container {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }

  .tree-card {
    padding: 18px;
  }
}
</style>
