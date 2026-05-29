<template>
  <q-page class="page-container">
    <div class="content-wrapper">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Definición del Problema</h1>
        <p class="page-subtitle">
          Consulta y validación de la información estratégica del programa.
        </p>
      </div>

      <q-card flat class="modern-card">
        <q-card-section>
          <div class="section-title">Resumen del Problema</div>

          <div class="form-grid q-mt-md">
            <q-input
              class="modern-input full-width"
              :model-value="resumen.identificacion?.problemaCentral || ''"
              label="Problema Central o Propósito (2.1)"
              filled
              readonly
              rounded
            >
              <template v-slot:prepend>
                <q-icon name="report_problem" color="primary" />
              </template>
            </q-input>

            <q-input
              class="modern-input"
              :model-value="
                resumen.cobertura?.identificacionCaracterizacionPoblacionPotencial || ''
              "
              label="Población / Área de Enfoque Potencial (4.1)"
              filled
              readonly
              rounded
            >
              <template v-slot:prepend>
                <q-icon name="groups" color="primary" />
              </template>
            </q-input>

            <q-input
              class="modern-input"
              :model-value="resumen.cobertura?.identificacionCaracterizacionPoblacionObjetivo || ''"
              label="Población / Área de Enfoque Objetivo (4.2)"
              filled
              readonly
              rounded
            >
              <template v-slot:prepend>
                <q-icon name="group" color="primary" />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator spaced />

        <q-card-section>
          <div class="section-title">Magnitud del Problema</div>

          <div class="form-grid q-mt-md">
            <q-input
              class="modern-input full-width"
              :model-value="resumen.cobertura?.unidadMedida || ''"
              label="Unidad de Medida"
              filled
              readonly
              rounded
            >
              <template v-slot:prepend>
                <q-icon name="straighten" color="primary" />
              </template>
            </q-input>

            <q-input
              class="modern-input"
              :model-value="String(resumen.cobertura?.cuantificacionPoblacionPotencial ?? '')"
              label="Población Potencial"
              filled
              readonly
              rounded
            >
              <template v-slot:prepend>
                <q-icon name="people_alt" color="primary" />
              </template>
            </q-input>

            <q-input
              class="modern-input"
              :model-value="String(resumen.cobertura?.cuantificacionPoblacionObjetivo ?? '')"
              label="Población Objetivo"
              filled
              readonly
              rounded
            >
              <template v-slot:prepend>
                <q-icon name="person" color="primary" />
              </template>
            </q-input>

            <q-input
              class="modern-input"
              :model-value="
                String(resumen.cobertura?.cuantificacionPoblacionAtendidaAnterior ?? '')
              "
              label="Población Atendida Ejercicio Fiscal Anterior"
              filled
              readonly
              rounded
            >
              <template v-slot:prepend>
                <q-icon name="history" color="primary" />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-separator spaced />

        <q-card-section>
          <div class="section-title">Efecto Superior o Fin</div>

          <q-input
            v-model="efectoSuperior"
            type="textarea"
            label="Describa el efecto superior o fin"
            filled
            readonly
            rounded
            autogrow
            class="modern-input"
          >
            <template v-slot:prepend>
              <q-icon name="emoji_objects" color="primary" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg actions-container">
          <q-btn
            label="Pantalla Anterior"
            color="primary"
            text-color="white"
            rounded
            unelevated
            class="secondary-btn"
            to="/formulario-reglas-operacion"
            :loading="loading"
            icon="arrow_back"
          />

          <q-btn
            color="primary"
            label="Guardar"
            text-color="white"
            :loading="loading"
            rounded
            unelevated
            class="primary-btn"
            icon="save"
            @click="guardarEfectoSuperior"
          />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()
const resumen = ref({ identificacion: null, cobertura: null })
const efectoSuperior = ref('')
const loading = ref(false)
const objetivoMunicipal = ref(null)

onMounted(async () => {
  try {
    const [identificacion, cobertura, alineacion] = await Promise.allSettled([
      api.get('/IdentificacionDescripcionProblema/ultimo'),
      api.get('/Cobertura/ultimo'),
      api.get('/AlineacionMunicipio/ultimo'),
    ])

    if (identificacion.status === 'fulfilled')
      resumen.value.identificacion = identificacion.value.data
    if (cobertura.status === 'fulfilled') resumen.value.cobertura = cobertura.value.data
    if (alineacion.status === 'fulfilled') {
      objetivoMunicipal.value = alineacion.value.data?.objetivo || ''
      efectoSuperior.value = objetivoMunicipal.value
    }
  } catch (error) {
    console.error(error)
    Notify.create({ type: 'negative', message: 'Error al cargar datos del Anexo 3' })
  }
})

async function guardarEfectoSuperior() {
  loading.value = true
  try {
    await api.post('/EfectoSuperior', { descripcion: efectoSuperior.value })
    Notify.create({ type: 'positive', message: 'Efecto superior guardado correctamente' })
    efectoSuperior.value = ''
    localStorage.setItem('ultimaRutaRegistro', '/FormularioAnalisisInvolucrados')
    router.push('/FormularioAnalisisInvolucrados')
  } catch (error) {
    console.error(error)
    Notify.create({ type: 'negative', message: 'Error al guardar efecto superior' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-container {
  background: #f4f6f9;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1200px;
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
  margin-bottom: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.full-width {
  grid-column: 1 / -1;
}

.modern-input {
  transition: all 0.2s ease;
}

.modern-input:hover {
  transform: translateY(-1px);
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

.warning-banner {
  background: #fffbeb;
  color: #b54708;
  border-radius: 14px;
}

.q-field__control {
  border-radius: 14px;
  background: #fff;
}

@media (max-width: 768px) {
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

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
