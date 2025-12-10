<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="form-title">Identificación y Descripción del Problema</div>
          <q-separator color="#691b31" spaced />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            filled
            v-model="form.problemaCentral"
            label="2.1 Defina de manera concreta el problema central o necesidad única a la que responde el programa."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="report_problem" />
            </template>
          </q-input>

          <div class="text-subtitle1">
            2.2 Describa los involucrados, los cuales pueden ser organizaciones, empresas, grupos e
            individuos cuyos intereses serán coincidentes, complementarios o incluso antagónicos.
            (Debe ser consistente con el Anexo II).
          </div>

          <q-input
            filled
            v-model="form.causaBeneficiados"
            label="Beneficiados"
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="emoji_people" />
            </template>
          </q-input>

          <q-input filled v-model="form.causaOpositores" label="Opositores" type="textarea" rounded>
            <template v-slot:prepend>
              <q-icon name="thumb_down" />
            </template>
          </q-input>

          <q-input filled v-model="form.causaEjecutores" label="Ejecutores" type="textarea" rounded>
            <template v-slot:prepend>
              <q-icon name="construction" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.causaIndiferentes"
            label="Indiferentes"
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="remove_circle_outline" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.involucrados"
            label="2.3 Describa las causas que han dado origen al problema. (Debe ser consistente con el Anexo III)."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="group" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.efectos"
            label="2.4 Describa los efectos que dicho problema provoca en la población, en el ambiente o en el desarrollo económico y social."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="visibility" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.evolucion"
            label="2.5 Describa la evolución del problema o necesidad que se pretende atender, mediante un análisis con información cuantitativa y/o cualitativa."
            type="textarea"
            rounded
          >
            <template v-slot:prepend>
              <q-icon name="timeline" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            text-color="white"
            label="Guardar y continuar"
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
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const ROUTE_AFTER_SAVE = '/formulario-determinacion-justificacion'
const router = useRouter()

const loading = ref(false)
const saving = ref(false)

const form = ref({
  id: null,
  problemaCentral: '',
  involucrados: '',
  causaBeneficiados: '',
  causaOpositores: '',
  causaEjecutores: '',
  causaIndiferentes: '',
  efectos: '',
  evolucion: '',
})

async function cargarBorrador() {
  loading.value = true
  try {
    const { data } = await api.get('/IdentificacionDescripcionProblema/borrador')
    form.value = data
  } catch (err) {
    console.error('Error al cargar borrador:', err)
    Notify.create({ type: 'negative', message: 'No se pudo cargar el borrador' })
  } finally {
    loading.value = false
  }
}

let autosaveTimer = null

async function autoSave() {
  saving.value = true
  try {
    const { data } = await api.put('/IdentificacionDescripcionProblema/autosave', form.value)
    form.value = data // sincroniza con backend
  } catch (err) {
    console.error('Error en autosave:', err)
  } finally {
    saving.value = false
  }
}

watch(
  form,
  () => {
    clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(autoSave, 1500) // autosave cada 1.5s
  },
  { deep: true },
)

onMounted(() => {
  cargarBorrador()
})

function validarFormulario() {
  if (!form.value.problemaCentral.trim()) return 'Debes escribir el problema central'
  if (!form.value.involucrados.trim()) return 'Debes capturar a los involucrados'
  return null
}

async function submitForm() {
  const errorValidacion = validarFormulario()
  if (errorValidacion) {
    Notify.create({ type: 'warning', message: errorValidacion })
    return
  }

  loading.value = true
  try {
    await api.put('/IdentificacionDescripcionProblema/autosave', form.value)

    localStorage.setItem('ultimaRutaRegistro', ROUTE_AFTER_SAVE)

    Notify.create({
      type: 'positive',
      message: 'Identificación guardada correctamente',
    })

    router.push(ROUTE_AFTER_SAVE)
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Error al guardar el formulario' })
  } finally {
    loading.value = false
  }
}
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
  padding: 12px 40px;
}
</style>
