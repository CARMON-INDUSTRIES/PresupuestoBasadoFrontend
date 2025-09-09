<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1100px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center">Árbol de Objetivos</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <!-- FILA: Fin -->
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

        <!-- FILA: Efectos -->
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
                :key="'resultado-' + cIndex + '-' + rIndex"
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

        <!-- FILA: Objetivo Central -->
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

        <!-- FILA: Componentes -->
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

        <!-- FILA: Medios -->
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
                  Basado en: {{ arbolProblemas.componentes[cIndex]?.acciones?.[mIndex] || '—' }}
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

<style scoped>
.flecha-down {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 12px solid gray;
  margin: 8px auto 0 auto;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const loading = ref(false)

const arbolProblemas = ref({
  efectoSuperior: null,
  problemaCentral: null,
  componentes: [], // [{ nombre, acciones:[], resultados:[] }]
})

const arbolObjetivos = ref({
  fin: '',
  objetivoCentral: '',
  componentes: [], // [{ nombre, medios:[], resultados:[] }]
})

onMounted(async () => {
  try {
    const [efectoRes, problemaRes, disenoRes] = await Promise.all([
      api.get('/EfectoSuperior/ultimo'),
      api.get('/IdentificacionDescripcionProblema/ultimo'),
      api.get('/DisenoIntervencionPublica/ultimo'),
    ])

    // Normalizamos 'componentes' (puede venir como objeto o como {componentes:[]})
    const compSrc = Array.isArray(disenoRes.data?.componentes)
      ? disenoRes.data.componentes
      : Array.isArray(disenoRes.data)
        ? disenoRes.data
        : []

    const componentesProblema = compSrc.map((c) => ({
      nombre: c?.nombre ?? '',
      acciones: Array.isArray(c?.acciones) ? c.acciones : [],
      resultados: Array.isArray(c?.resultados) ? c.resultados : [],
    }))

    arbolProblemas.value = {
      efectoSuperior: efectoRes.data || null,
      problemaCentral: problemaRes.data || null,
      componentes: componentesProblema,
    }

    // Construimos espejo para objetivos: medios = acciones (positivizadas por el usuario)
    arbolObjetivos.value = {
      fin: '',
      objetivoCentral: '',
      componentes: componentesProblema.map((c) => ({
        nombre: '',
        medios: c.acciones.map(() => ''), // ✅ existe siempre (array)
        resultados: c.resultados.map(() => ''), // ✅ existe siempre (array)
      })),
    }
  } catch (error) {
    console.error('❌ Error al cargar árbol de problemas:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar árbol de problemas' })
  }
})

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
    Notify.create({ type: 'positive', message: 'Árbol de Objetivos guardado' })
  } catch (error) {
    console.error('❌ Error al guardar:', error)
    Notify.create({ type: 'negative', message: 'Error al guardar el árbol de objetivos' })
  } finally {
    loading.value = false
  }
}
</script>
