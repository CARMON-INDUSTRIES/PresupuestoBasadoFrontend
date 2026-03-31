<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1100px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center">Árbol de Objetivos</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <div class="row justify-center q-mt-lg">
          <div class="col-12 col-md-8">
            <q-card flat bordered class="q-pa-md text-center">
              <div class="text-subtitle2">Fin (Efecto Superior en positivo)</div>
              <q-input v-model="arbolObjetivos.fin" filled type="textarea" autogrow />
              <div class="text-caption text-grey-7 q-mt-xs">
                Basado en: {{ arbolProblemas.efectoSuperior?.descripcion || '—' }}
              </div>
              <div class="flecha-down"></div>
            </q-card>
          </div>
        </div>

        <div class="row justify-around q-col-gutter-lg q-mt-md">
          <div
            v-for="(comp, cIndex) in arbolObjetivos.componentes"
            :key="'res-' + cIndex"
            class="col-12 col-md-3"
          >
            <q-card flat bordered class="q-pa-sm text-center relative-position">
              <div class="text-subtitle2">Efectos</div>
              <div
                v-for="(res, rIndex) in comp.resultados"
                :key="'resultados-' + cIndex + '-' + rIndex"
                class="q-mb-sm"
              >
                <q-input
                  v-model="arbolObjetivos.componentes[cIndex].resultados[rIndex]"
                  filled
                  :label="`Efecto ${rIndex + 1}`"
                  autogrow
                />
                <div class="text-caption text-grey-7">
                  Basado en: {{ arbolProblemas.componentes[cIndex]?.resultados?.[rIndex] || '—' }}
                </div>
              </div>
              <div class="flecha-down"></div>
            </q-card>
          </div>
        </div>

        <div class="row justify-center q-mt-lg">
          <div class="col-12 col-md-8">
            <q-card flat bordered class="q-pa-md text-center relative-position">
              <div class="text-subtitle2">Objetivo Central</div>
              <q-input v-model="arbolObjetivos.objetivoCentral" filled type="textarea" autogrow />
              <div class="text-caption text-grey-7 q-mt-xs">
                Basado en: {{ arbolProblemas.problemaCentral?.problemaCentral || '—' }}
              </div>
              <div class="flecha-down"></div>
            </q-card>
          </div>
        </div>

        <div class="row justify-around q-col-gutter-lg q-mt-lg">
          <div
            v-for="(comp, cIndex) in arbolObjetivos.componentes"
            :key="'comp-' + cIndex"
            class="col-12 col-md-3"
          >
            <q-card flat bordered class="q-pa-sm text-center relative-position">
              <div class="text-subtitle2">Componente {{ cIndex + 1 }}</div>
              <q-input
                v-model="arbolObjetivos.componentes[cIndex].nombre"
                filled
                label="Nombre en positivo"
                autogrow
              />
              <div class="text-caption text-grey-7 q-mt-xs">
                Basado en: {{ arbolProblemas.componentes[cIndex]?.nombre || '—' }}
              </div>
              <div class="flecha-down"></div>
            </q-card>
          </div>
        </div>

        <div class="row justify-around q-col-gutter-lg q-mt-md">
          <div
            v-for="(comp, cIndex) in arbolObjetivos.componentes"
            :key="'medios-' + cIndex"
            class="col-12 col-md-3"
          >
            <q-card flat bordered class="q-pa-sm text-center relative-position">
              <div class="text-subtitle2">Medios</div>
              <div
                v-for="(medio, mIndex) in comp.medios"
                :key="'medio-' + cIndex + '-' + mIndex"
                class="q-mb-sm"
              >
                <q-input
                  v-model="arbolObjetivos.componentes[cIndex].medios[mIndex]"
                  filled
                  :label="`Medio ${mIndex + 1}`"
                  autogrow
                />
                <div class="text-caption text-grey-7">
                  Basado en:
                  {{ arbolProblemas.componentes[cIndex]?.acciones?.[mIndex]?.descripcion || '—' }}
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-mt-lg">
        <q-btn
          label="Pantalla Anterior"
          color="primary"
          text-color="white"
          rounded
          unelevated
          class="registrar"
          to="formulario-arbol-problemas"
          :loading="loading"
        />

        <q-btn
          color="primary"
          label="Guardar"
          class="submit-btn"
          rounded
          :loading="loading"
          @click="guardar"
        />
      </q-card-actions>
    </q-card>
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
.submit-btn {
  font-weight: 900;
  font-size: 0.8rem;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}

.registrar {
  font-weight: 900;
  font-size: 0.8rem;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
