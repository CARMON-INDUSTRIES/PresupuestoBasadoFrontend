<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-tabs v-model="tab" dense class="bg-primary text-white" align="justify">
        <q-tab name="estatal" label="Plan Estatal" />
        <q-tab name="municipal" label="Plan Municipal" />
        <q-tab name="clasificacion" label="Clasificación Funcional" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="estatal">
          <h6>Plan Estatal</h6>
          <PlanEditor
            v-model="planEstatal"
            nivel1="Acuerdo"
            nivel2="Objetivo"
            nivel3="Estrategia"
            nivel4="Línea de Acción"
          />
        </q-tab-panel>

        <q-tab-panel name="municipal">
          <h6>Plan Municipal</h6>
          <PlanEditor
            v-model="planMunicipal"
            nivel1="Acuerdo"
            nivel2="Objetivo"
            nivel3="Estrategia"
            nivel4="Línea de Acción"
          />
        </q-tab-panel>

        <q-tab-panel name="clasificacion">
          <h6>Clasificación Funcional</h6>
          <PlanEditor
            v-model="clasificacionFuncional"
            nivel1="Finalidad"
            nivel2="Función"
            nivel3="Subfunción"
          />
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions align="right">
        <q-btn color="positive" label="Guardar" @click="guardar" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import PlanEditor from './PlanEditor.vue'
import api from 'src/boot/api'

const tab = ref('estatal')
const $q = useQuasar()

const planEstatal = ref([{ nombre: '', hijos: [] }])
const planMunicipal = ref([{ nombre: '', hijos: [] }])
const clasificacionFuncional = ref([{ nombre: '', hijos: [] }])

async function guardar() {
  try {
    if (tab.value === 'estatal') {
      await guardarPlanEstatal(planEstatal.value)
      $q.notify({ type: 'positive', message: 'Plan Estatal guardado!' })
    } else if (tab.value === 'municipal') {
      await guardarPlanMunicipal(planMunicipal.value)
      $q.notify({ type: 'positive', message: 'Plan Municipal guardado!' })
    } else if (tab.value === 'clasificacion') {
      await guardarClasificacion(clasificacionFuncional.value)
      $q.notify({ type: 'positive', message: 'Clasificación Funcional guardada!' })
    }
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error al guardar' })
  }
}

async function guardarPlanMunicipal(data) {
  for (const acuerdo of data) {
    const acuerdoResp = await api.post('Municipal/acuerdo', { Nombre: acuerdo.nombre })

    for (const objetivo of acuerdo.hijos) {
      const objetivoResp = await api.post('Municipal/objetivo', {
        Nombre: objetivo.nombre,
        AcuerdoMunicipalId: acuerdoResp.data.id,
      })

      for (const estrategia of objetivo.hijos) {
        const estrategiaResp = await api.post('Municipal/estrategia', {
          Nombre: estrategia.nombre,
          ObjetivoMunicipalId: objetivoResp.data.id,
        })

        for (const linea of estrategia.hijos) {
          await api.post('Municipal/linea', {
            Nombre: linea.nombre,
            EstrategiaMunicipalId: estrategiaResp.data.id,
          })
        }
      }
    }
  }
}

async function guardarPlanEstatal(data) {
  for (const acuerdo of data) {
    const acuerdoResp = await api.post('Estatal/acuerdo', { Nombre: acuerdo.nombre })

    for (const objetivo of acuerdo.hijos) {
      const objetivoResp = await api.post('Estatal/objetivo', {
        Nombre: objetivo.nombre,
        AcuerdoEstatalId: acuerdoResp.data.id,
      })

      for (const estrategia of objetivo.hijos) {
        const estrategiaResp = await api.post('Estatal/estrategia', {
          Nombre: estrategia.nombre,
          ObjetivoEstatalId: objetivoResp.data.id,
        })

        for (const linea of estrategia.hijos) {
          await api.post('Estatal/linea', {
            Nombre: linea.nombre,
            EstrategiaEstatalId: estrategiaResp.data.id,
          })
        }
      }
    }
  }
}

async function guardarClasificacion(data) {
  const baseUrl = 'Clasificacion'

  for (const finalidad of data) {
    const finResp = await api.post(`${baseUrl}/finalidad`, { Nombre: finalidad.nombre })

    for (const funcion of finalidad.hijos) {
      const funResp = await api.post(`${baseUrl}/funcion`, {
        Nombre: funcion.nombre,
        FinalidadId: finResp.data.id,
      })

      for (const subfuncion of funcion.hijos) {
        await api.post(`${baseUrl}/subfuncion`, {
          Nombre: subfuncion.nombre,
          FuncionId: funResp.data.id,
        })
      }
    }
  }
}
</script>
