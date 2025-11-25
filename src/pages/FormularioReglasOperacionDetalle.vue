<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="guardarDetalle" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md bg-white">
        <q-card-section>
          <div class="form-title">¿Es un programa social?</div>

          <br /><br />

          <div class="text-subtitle1 q-mb-sm">
            Sujeto a reglas de operación
            <q-option-group
              v-model="form.SujetoReglasOperacion"
              :options="opcionesSiNo"
              type="radio"
              inline
              class="q-mt-md"
            />
          </div>

          <div class="text-subtitle1 q-mb-sm">
            Otros subsidios (para otorgar otros subsidios no sujetos a reglas de operación, en su
            caso se otorgan mediante convenios)
            <q-option-group
              v-model="form.OtrosSubsidios"
              :options="opcionesSiNo"
              type="radio"
              inline
              class="q-mt-md"
            />
          </div>

          <div class="text-subtitle1 q-mb-sm">
            Prestación de servicios públicos (Actividades del sector público que se realizan para
            satisfacer demandas de la sociedad)
            <q-option-group
              v-model="form.PrestacionServiciosPublicos"
              :options="opcionesSiNo"
              type="radio"
              inline
              class="q-mt-md"
            />
          </div>

          <div class="text-subtitle1 q-mb-sm">
            Provisión de bienes públicos (Actividades que se realizan para crear o elaborar bienes
            de competencia del sector público)
            <q-option-group
              v-model="form.ProvisionBienesPublicos"
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
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const STORAGE_KEY = 'formularioProgramaSocial'
const router = useRouter()

const opcionesSiNo = [
  { label: 'Sí', value: 'Sí' },
  { label: 'No', value: 'No' },
]

const form = ref({
  SujetoReglasOperacion: null,
  OtrosSubsidios: null,
  PrestacionServiciosPublicos: null,
  ProvisionBienesPublicos: null,
})

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    form.value = JSON.parse(saved)
    console.log('✅ Datos cargados desde localStorage:', form.value)
  }
})

watch(
  form,
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  },
  { deep: true },
)

async function guardarDetalle() {
  try {
    const payload = { ...form.value }
    delete payload.Id

    await api.post('/ReglasOperacionDetalle', payload)

    Notify.create({ type: 'positive', message: 'Detalle guardado correctamente' })
    localStorage.setItem('ultimaRutaRegistro', '/formulario-programa-social')
    router.push('/formulario-programa-social')
  } catch (err) {
    console.error('Error al guardar detalle:', err)
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
