<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="guardarReglasOperacion" class="q-gutter-md">
      <!-- Card principal -->
      <q-card flat bordered class="q-pa-md bg-white">
        <q-card-section>
          <div class="form-title">¿Tiene reglas de operación?</div>

          <!-- Sí / No -->
          <q-option-group
            v-model="form.tieneReglasOperacion"
            :options="[
              { label: 'Sí', value: true },
              { label: 'No', value: false },
            ]"
            type="radio"
            inline
            color="primary"
          />

          <!-- Campos solo si tiene reglas de operación -->
          <div v-if="form.tieneReglasOperacion" class="q-mt-md">
            <q-file
              filled
              v-model="archivoSeleccionado"
              label="Archivo adjunto"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
              counter
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

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

      <!-- Botón Guardar -->
      <q-card-actions align="right">
        <q-btn
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

const STORAGE_KEY = 'formularioReglasOperacion' // 🔹 clave localStorage
const router = useRouter()

const form = ref({
  tieneReglasOperacion: null,
  ligaInternet: '',
})

const archivoSeleccionado = ref(null)

// 🧠 Cargar datos previos si existen
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
    form.value = parsed.form ?? form.value
    archivoSeleccionado.value = parsed.archivo ?? archivoSeleccionado.value
    console.log('✅ Datos cargados desde localStorage:', parsed)
  }
})

// 💾 Guardar automáticamente al modificar cualquier campo
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

// Guardar reglas de operación usando FormData
async function guardarReglasOperacion() {
  try {
    const fd = new FormData()
    fd.append('TieneReglasOperacion', form.value.tieneReglasOperacion)
    fd.append('LigaInternet', form.value.ligaInternet || '')

    if (archivoSeleccionado.value) {
      const file =
        archivoSeleccionado.value instanceof File
          ? archivoSeleccionado.value
          : archivoSeleccionado.value.file || archivoSeleccionado.value
      fd.append('Archivo', file)
    }

    await api.post('/ReglasOperacion', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    Notify.create({
      type: 'positive',
      message: 'Reglas de operación guardadas correctamente',
    })

    localStorage.setItem('ultimaRutaRegistro', '/PoblacionAreaEnfoquePotencial')
    router.push('/PoblacionAreaEnfoquePotencial')
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: 'Error al guardar reglas de operación',
    })
  }
}
</script>

<style scoped>
.form-title {
  font-size: 2rem;
  font-weight: 700;
}

.submit-btn {
  font-weight: 900;
  font-size: 0.8rem;
  padding: 12px 40px;
}
</style>
