<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1 class="page-title">Reglas de Operación</h1>

        <p class="page-subtitle">
          Registra la información correspondiente a las reglas de operación del programa y adjunta
          los documentos oficiales si existen.
        </p>
      </div>

      <q-form @submit.prevent="guardarReglasOperacion">
        <q-card class="modern-card">
          <q-card-section>
            <div class="section-title">Información general</div>
          </q-card-section>

          <q-card-section class="form-grid">
            <div>
              <div class="text-subtitle1 text-weight-medium q-mb-md">
                ¿Tiene reglas de operación?
              </div>

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
            </div>

            <div v-if="form.tieneReglasOperacion" class="upload-box">
              <q-banner rounded class="info-banner q-mb-md">
                <template v-slot:avatar>
                  <q-icon name="info" />
                </template>

                Adjunta el documento oficial de reglas de operación y proporciona una liga pública
                si se encuentra disponible.
              </q-banner>

              <q-file
                filled
                bg-color="white"
                v-model="archivoSeleccionado"
                label="Archivo adjunto"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
                counter
                class="modern-input"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" color="primary" />
                </template>
              </q-file>

              <div v-if="archivoSeleccionado" class="file-preview">
                <q-icon name="description" class="q-mr-sm" />

                {{ archivoSeleccionado.name || archivoSeleccionado.file?.name }}
              </div>

              <q-input
                filled
                bg-color="white"
                v-model="form.ligaInternet"
                label="Liga de internet"
                type="url"
                class="modern-input q-mt-lg"
              >
                <template v-slot:prepend>
                  <q-icon name="link" color="primary" />
                </template>
              </q-input>
            </div>

            <q-banner
              v-else-if="form.tieneReglasOperacion === false"
              rounded
              class="warning-banner"
            >
              <template v-slot:avatar>
                <q-icon name="warning" />
              </template>

              El programa actualmente no cuenta con reglas de operación registradas.
            </q-banner>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-lg actions-container">
            <q-btn
              label="Pantalla anterior"
              class="secondary-btn"
              unelevated
              to="formulario-padron-beneficiarios"
            />

            <q-btn label="Continuar" type="submit" class="primary-btn" unelevated />
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-page>
</template>

<style scoped>
.page-container {
  background: #f4f6f9;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1000px;
  margin: auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #691b31;
  margin: 0;
}

.page-subtitle {
  color: #6b7280;
  margin-top: 8px;
  font-size: 1rem;
  line-height: 1.6;
}

.modern-card {
  border-radius: 24px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
  border: none;
  background: white;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.modern-input {
  transition: all 0.2s ease;
}

.modern-input:hover {
  transform: translateY(-1px);
}

.upload-box {
  border: 2px dashed #d1d5db;
  border-radius: 18px;
  padding: 20px;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.upload-box:hover {
  border-color: #c5a46d;
  background: #fffdf8;
}

.file-preview {
  background: #f3f4f6;
  border-radius: 14px;
  padding: 12px 16px;
  margin-top: 14px;
  color: #374151;
  font-size: 0.92rem;
}

.primary-btn {
  background: #c5a46d;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.primary-btn:hover {
  opacity: 0.95;
}

.secondary-btn {
  background: #691b31;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
}

.actions-container {
  gap: 12px;
}

.info-banner {
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 14px;
}

.warning-banner {
  background: #fffbeb;
  color: #b54708;
  border-radius: 14px;
}

:deep(.q-field__control) {
  border-radius: 16px;
  min-height: 58px;
}

:deep(.q-field--filled .q-field__control) {
  background: #f9fafb;
}

:deep(.q-field--focused .q-field__control) {
  background: white;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }

  .page-title {
    font-size: 1.7rem;
  }

  .actions-container {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}
</style>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const STORAGE_KEY = 'formularioReglasOperacion'
const router = useRouter()

const form = ref({
  tieneReglasOperacion: null,
  ligaInternet: '',
})

const archivoSeleccionado = ref(null)

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
