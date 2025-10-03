<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="form-title">Clasificación Funcional</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <!-- Subfunción -->
          <q-select
            filled
            v-model="form.subfuncion"
            :options="subfunciones"
            label="Subfunción"
            rounded
            emit-value
            map-options
            @update:model-value="onSubfuncionChange"
          >
            <template v-slot:prepend>
              <q-icon name="subdirectory_arrow_right" />
            </template>
          </q-select>

          <!-- Función -->
          <q-select
            filled
            v-model="form.funcion"
            :options="funciones"
            label="Función"
            rounded
            disable
          >
            <template v-slot:prepend>
              <q-icon name="work" />
            </template>
          </q-select>

          <!-- Finalidad -->
          <q-select
            filled
            v-model="form.finalidad"
            :options="finalidades"
            label="Finalidad"
            rounded
            disable
          >
            <template v-slot:prepend>
              <q-icon name="star" />
            </template>
          </q-select>

          <!-- Año -->
          <q-select
            filled
            v-model="form.anioOperando"
            :options="anios"
            label="Año Operando"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" />
            </template>
          </q-select>

          <!-- Entrega de bienes -->
          <q-select
            filled
            v-model="form.entregaBienes"
            :options="opcionesEntregaBienes"
            label="Entrega de Bienes o Servicios"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="handshake" />
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Continuar"
            color="primary"
            text-color="white"
            type="submit"
            rounded
            unelevated
            class="submit-btn"
            :loading="loading"
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
const loading = ref(false)

const anioActual = new Date().getFullYear()
const anios = [anioActual - 1, anioActual, anioActual + 1]
const opcionesEntregaBienes = [
  'Población General',
  'Administración Pública',
  'Población General y Administración Pública',
]

const form = ref({
  subfuncion: null,
  funcion: null,
  finalidad: null,
  anioOperando: anioActual,
  entregaBienes: '',
})

// Arrays de opciones { label, value }
const subfunciones = ref([])
const funciones = ref([])
const finalidades = ref([])

// Función auxiliar para obtener label de ID
//function labelFromList(list, id) {
//  const item = list.find((x) => x.value === id)
//  return item ? item.label : ''
//}

// Cargar todas las subfunciones
async function cargarSubfunciones() {
  try {
    const { data } = await api.get('/ClasificadorFuncional/subfunciones')
    subfunciones.value = data.map((x) => ({ label: x.nombre, value: x.id }))
  } catch {
    Notify.create({ type: 'negative', message: 'Error cargando subfunciones' })
  }
}

// Al cambiar subfunción, se determinan función y finalidad
const onSubfuncionChange = async (subfuncionId) => {
  form.value.funcion = null
  form.value.finalidad = null
  funciones.value = []
  finalidades.value = []

  if (!subfuncionId) return

  try {
    const { data } = await api.get(`/ClasificadorFuncional/subfuncion/${subfuncionId}/jerarquia`)

    // Pintar labels correctos en selects
    funciones.value = [{ label: data.funcionNombre, value: data.funcionId }]
    finalidades.value = [{ label: data.finalidadNombre, value: data.finalidadId }]

    // Guardar labels (nombres) para enviar al backend
    form.value.funcion = data.funcionNombre
    form.value.finalidad = data.finalidadNombre
    form.value.subfuncion = data.subfuncionNombre
  } catch {
    Notify.create({ type: 'negative', message: 'Error cargando función y finalidad' })
  }
}

// Submit
async function submitForm() {
  loading.value = true
  try {
    await api.post('/ClasificacionFuncional', {
      Subfuncion: form.value.subfuncion,
      Funcion: form.value.funcion,
      Finalidad: form.value.finalidad,
      AnioOperando: form.value.anioOperando,
      EntregaBienes: form.value.entregaBienes,
    })
    Notify.create({ type: 'positive', message: 'Clasificación guardada correctamente' })
    router.push('/formulario-antecedente')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar la clasificación',
    })
  } finally {
    loading.value = false
  }
}

onMounted(cargarSubfunciones)
</script>

<style scoped>
.q-card {
  max-width: 800px;
  margin: auto;
}
.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #691b31;
}
.q-field__control {
  border-radius: 12px;
}
.submit-btn {
  font-weight: 900;
  font-size: 0.8rem;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
