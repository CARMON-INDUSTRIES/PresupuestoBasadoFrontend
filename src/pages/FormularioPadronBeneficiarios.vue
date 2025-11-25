<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="guardarPadron" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md bg-white">
        <q-card-section>
          <div class="form-title">¿Cuenta con padrón de beneficiarios?</div>

          <q-option-group
            v-model="form.tienePadron"
            :options="[
              { label: 'Sí', value: true },
              { label: 'No', value: false },
            ]"
            type="radio"
            inline
            color="primary"
          />

          <div v-if="form.tienePadron" class="q-mt-md">
            <q-file
              filled
              v-model="archivoSeleccionado"
              label="Adjuntar archivo"
              placeholder="Selecciona un archivo"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
              counter
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <div v-if="archivoSeleccionado" class="q-mt-sm text-caption text-grey-8">
              Archivo seleccionado:
              {{ archivoSeleccionado.name || archivoSeleccionado.file?.name }}
            </div>

            <q-input
              filled
              v-model="form.ligaInternet"
              label="Liga de internet"
              type="url"
              class="q-mt-md"
            >
              <template v-slot:prepend>
                <q-icon name="link" />
              </template>
            </q-input>
          </div>
        </q-card-section>
      </q-card>

      <q-card-actions align="right">
        <q-btn
          :loading="subiendo"
          label="Guardar"
          color="primary"
          text-color="white"
          type="submit"
          rounded
          unelevated
          class="submit-btn"
        />
      </q-card-actions>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const STORAGE_KEY = 'formularioPadronBeneficiarios'
const router = useRouter()

const form = ref({
  tienePadron: null,
  ligaInternet: '',
})
const archivoSeleccionado = ref(null)
const subiendo = ref(false)

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
    form.value = parsed.form ?? form.value
    archivoSeleccionado.value = parsed.archivo ?? archivoSeleccionado.value
    console.log('Datos cargados desde localStorage:', parsed)
  }
})

watch(
  [form, archivoSeleccionado],
  () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ form: form.value, archivo: archivoSeleccionado.value }),
    )
  },
  { deep: true },
)

async function guardarPadron() {
  subiendo.value = true
  try {
    const fd = new FormData()
    fd.append('TienePadron', form.value.tienePadron)
    fd.append('LigaInternet', form.value.ligaInternet || '')

    if (archivoSeleccionado.value) {
      const file =
        archivoSeleccionado.value instanceof File
          ? archivoSeleccionado.value
          : archivoSeleccionado.value.file || archivoSeleccionado.value
      fd.append('Archivo', file)
    }

    await api.post('/PadronBeneficiarios', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    Notify.create({
      type: 'positive',
      message: 'Padrón de Beneficiarios guardado correctamente',
    })

    localStorage.setItem('ultimaRutaRegistro', '/formulario-reglas-operacion')
    router.push('/formulario-reglas-operacion')
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: 'Error al guardar Padrón de Beneficiarios',
    })
  } finally {
    subiendo.value = false
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
.submit-btn {
  font-weight: 900;
  font-size: 0.8rem;
  padding: 12px 40px;
}
</style>
