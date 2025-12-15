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

      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar" :loading="loading" @click="guardar" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const BASE_STORAGE_KEY = 'formularioArbolObjetivos'
const router = useRouter()
const loading = ref(false)
const generandoIA = ref(false)

// ------------------------------
//     Estados principales
// ------------------------------
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

// ------------------------------
//     Multiusuario
// ------------------------------
let userName = null
let storageKey = BASE_STORAGE_KEY

async function resolveUserName() {
  let user = localStorage.getItem('userNameActual')
  if (user) return user

  try {
    const { data } = await api.get('/Cuentas/me')
    user = data?.userName || data?.username || null
    if (user) localStorage.setItem('userNameActual', user)
    return user
  } catch {
    return null
  }
}

// ------------------------------
// Helper
// ------------------------------
function itemToString(item) {
  if (!item) return ''
  return typeof item === 'string' ? item : (item.descripcion ?? '')
}

// ⭐ NUEVO → Detectar si el árbol sigue vacío
function estaVacioArbolObjetivos(arbol) {
  if (arbol.fin) return false
  if (arbol.objetivoCentral) return false

  return arbol.componentes.every(
    (c) => !c.nombre && c.medios.every((m) => !m) && c.resultados.every((r) => !r),
  )
}

// ------------------------------
//     IA - Conversión automática
// ------------------------------
async function convertirConIA(textoBase, nivel) {
  if (!textoBase) return ''

  console.log('➡️ IA llamada:', nivel, textoBase) // ⭐ LOG útil

  try {
    const { data } = await api.post('/ArbolObjetivos/convertir-positivo', {
      textoBase,
      nivel,
    })
    return data?.textoPositivo || ''
  } catch (error) {
    console.error('❌ Error IA:', error)
    return ''
  }
}

async function generarObjetivosAutomaticamente() {
  generandoIA.value = true
  console.log('🤖 Generando árbol de objetivos con IA...')

  try {
    // FIN
    if (!arbolObjetivos.value.fin && arbolProblemas.value.efectoSuperior?.descripcion) {
      arbolObjetivos.value.fin = await convertirConIA(
        arbolProblemas.value.efectoSuperior.descripcion,
        'FIN',
      )
    }

    // OBJETIVO CENTRAL
    if (
      !arbolObjetivos.value.objetivoCentral &&
      arbolProblemas.value.problemaCentral?.problemaCentral
    ) {
      arbolObjetivos.value.objetivoCentral = await convertirConIA(
        arbolProblemas.value.problemaCentral.problemaCentral,
        'OBJETIVO_CENTRAL',
      )
    }

    // COMPONENTES
    for (let i = 0; i < arbolObjetivos.value.componentes.length; i++) {
      const compObj = arbolObjetivos.value.componentes[i]
      const compProb = arbolProblemas.value.componentes[i]

      // Nombre del componente
      if (!compObj.nombre && compProb?.nombre) {
        compObj.nombre = await convertirConIA(compProb.nombre, 'COMPONENTE')
      }

      // RESULTADOS
      for (let r = 0; r < compObj.resultados.length; r++) {
        if (!compObj.resultados[r] && compProb?.resultados?.[r]) {
          compObj.resultados[r] = await convertirConIA(compProb.resultados[r], 'RESULTADO')
        }
      }

      // MEDIOS
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

// ------------------------------
//     onMounted
// ------------------------------
onMounted(async () => {
  userName = await resolveUserName()
  storageKey = userName ? `${BASE_STORAGE_KEY}_${userName}` : BASE_STORAGE_KEY

  console.log('✔ Usuario detectado:', userName)
  console.log('✔ Usando storage key:', storageKey)

  try {
    const [efectoRes, problemaRes, disenoRes] = await Promise.all([
      api.get('/EfectoSuperior/ultimo'),
      api.get('/IdentificacionDescripcionProblema/ultimo'),
      api.get('/DisenoIntervencionPublica/ultimo'),
    ])

    const compSrc = Array.isArray(disenoRes.data?.componentes)
      ? disenoRes.data.componentes
      : Array.isArray(disenoRes.data)
        ? disenoRes.data
        : []

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

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      arbolObjetivos.value = JSON.parse(saved)
      console.log('✔ Árbol de objetivos cargado desde localStorage')
    } else {
      arbolObjetivos.value = {
        fin: '',
        objetivoCentral: '',
        componentes: componentesProblema.map((c) => ({
          nombre: '',
          medios: c.acciones.map(() => ''),
          resultados: c.resultados.map(() => ''),
        })),
      }
    }

    // ⭐ AQUÍ ESTÁ LA CLAVE
    if (estaVacioArbolObjetivos(arbolObjetivos.value)) {
      await generarObjetivosAutomaticamente()
    }
  } catch (error) {
    console.error('❌ Error al cargar árbol:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar árbol de problemas' })
  }
})

// ------------------------------
// Guardado automático MULTIUSER
// ------------------------------
watch(
  arbolObjetivos,
  (val) => {
    localStorage.setItem(storageKey, JSON.stringify(val))
  },
  { deep: true },
)

// ------------------------------
//       GUARDAR API
// ------------------------------
async function guardar() {
  loading.value = true
  try {
    const payload = {
      fin: arbolObjetivos.value.fin,
      objetivoCentral: arbolObjetivos.value.objetivoCentral,
      componentes: arbolObjetivos.value.componentes.map((c) => ({
        nombre: c.nombre,
        medios: [...c.medios],
        resultados: [...c.resultados],
      })),
    }

    await api.post('/ArbolObjetivos', payload)

    if (userName) {
      localStorage.setItem(`ultimaRutaRegistro_${userName}`, '/formulario-analisis-alternativas')
    } else {
      localStorage.setItem('ultimaRutaRegistro', '/formulario-analisis-alternativas')
    }

    Notify.create({ type: 'positive', message: 'Árbol de Objetivos guardado' })
    router.push('/formulario-analisis-alternativas')
  } catch (error) {
    console.warn('❌ No se pudo guardar el árbol:', error)
  } finally {
    loading.value = false
  }
}
</script>
