<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="guardarDetalle" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md bg-white">
        <q-card-section>
          <div class="form-title">¿Es un programa social?</div>

          <!-- 1) Sujeto a reglas de operación -->
          <br />
          <br />
          <div class="text-subtitle1 q-mb-sm">
            Sujeto a reglas de operación
            <q-option-group
              v-model="form.SujetoReglasOperacion"
              label="Sujeto a reglas de operación"
              :options="opcionesSiNo"
              type="radio"
              inline
              class="q-mt-md"
            />
          </div>

          <!-- 2) Otros subsidios -->
          <div class="text-subtitle1 q-mb-sm">
            Otros subsidios (para otorgar otros subsidios no sujetos a reglas de operación, en su
            caso se otorgan mediante convenios)
            <q-option-group
              v-model="form.OtrosSubsidios"
              label="Otros subsidios (para otorgar otros subsidios no sujetos a reglas de operación, en su caso se otorgan mediante convenios)"
              :options="opcionesSiNo"
              type="radio"
              inline
              class="q-mt-md"
            />
          </div>

          <!-- 3) Prestación de servicios públicos -->
          <div class="text-subtitle1 q-mb-sm">
            Prestación de servicios públicos (Actividades del sector publico, que se realiza en
            forma directa, regular y continua para, satisfacer demandas de la sociedad, de interes
            general, atendiendo a las personas en sus diferentes esferas juridicas, a traves de las
            siguientes finaldiades: Funciones de goberno; Funciones de desarrollo social: Funciones
            de desarrollo economico)
            <q-option-group
              v-model="form.PrestacionServiciosPublicos"
              label="Prestación de servicios públicos"
              :options="opcionesSiNo"
              type="radio"
              inline
              class="q-mt-md"
            />
          </div>

          <!-- 4) Provisión de bienes públicos -->
          <div class="text-subtitle1 q-mb-sm">
            Provisión de bienes públicos (Actividades que se realizan para crear, fabricar y/o
            elaborar bienes que son competencia del Sector Publico. Incluye las actividades
            relacionadas con la compra de materias primar que se industralizan o transforman,para su
            posterior distribucion a la poblacion )
            <q-option-group
              v-model="form.ProvisionBienesPublicos"
              label="Provisión de bienes públicos"
              :options="opcionesSiNo"
              type="radio"
              inline
              class="q-mt-md"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Guardar"
            color="primary"
            text-color="white"
            type="submit"
            rounded
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()

const form = ref({
  SujetoReglasOperacion: null,
  OtrosSubsidios: null,
  PrestacionServiciosPublicos: null,
  ProvisionBienesPublicos: null,
})

const opcionesSiNo = [
  { label: 'Sí', value: 'Sí' },
  { label: 'No', value: 'No' },
]

onMounted(async () => {
  try {
    const { data } = await api.get('/ReglasOperacionDetalle/ultimo')
    if (data) {
      form.value = data
    }
  } catch (err) {
    console.log('No hay registros previos', err)
  }
})

async function guardarDetalle() {
  try {
    // Crear copia del formulario para POST y eliminar Id si existe
    const payload = { ...form.value }
    if (!form.value.Id) delete payload.Id

    if (!form.value.Id) {
      await api.post('/ReglasOperacionDetalle', payload)
    } else {
      await api.put(`/ReglasOperacionDetalle/${form.value.Id}`, payload)
    }

    Notify.create({ type: 'positive', message: 'Detalle guardado correctamente' })
    router.push('/formulario-programa-social')
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Error al guardar detalle' })
  }
}
</script>

<style scoped>
.form-title {
  font-weight: bold;
  font-size: 1.1rem;
}
.bg-white {
  background: white;
}
.q-mt-md {
  margin-top: 15px;
}
</style>
