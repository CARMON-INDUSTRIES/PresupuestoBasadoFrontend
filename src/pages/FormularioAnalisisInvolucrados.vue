<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-lg" style="max-width: 1000px; margin: auto">
      <q-card-section>
        <div class="form-title text-center">Análisis de Involucrados</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <!-- Problema Central -->
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="text-subtitle1 q-mb-sm">Problema Central (2.1)</div>
            <q-input
              :model-value="resumen.problemaCentral || ''"
              type="textarea"
              filled
              autogrow
              readonly
              rounded
            />
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- Grid 2 columnas para el resto -->
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <div class="text-subtitle1 q-mb-sm">Beneficiarios (5.1)</div>
            <q-input
              :model-value="resumen.causaBeneficiados || ''"
              type="textarea"
              filled
              autogrow
              readonly
              rounded
            />
          </div>

          <div class="col-6">
            <div class="text-subtitle1 q-mb-sm">Opositores (5.1)</div>
            <q-input
              :model-value="resumen.causaOpositores || ''"
              type="textarea"
              filled
              autogrow
              readonly
              rounded
            />
          </div>

          <div class="col-6">
            <div class="text-subtitle1 q-mb-sm">Ejecutores (5.1)</div>
            <q-input
              :model-value="resumen.causaEjecutores || ''"
              type="textarea"
              filled
              autogrow
              readonly
              rounded
            />
          </div>

          <div class="col-6">
            <div class="text-subtitle1 q-mb-sm">Indiferentes (5.1)</div>
            <q-input
              :model-value="resumen.causaIndiferentes || ''"
              type="textarea"
              filled
              autogrow
              readonly
              rounded
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          text-color="white"
          icon="arrow_forward"
          label="Continuar"
          rounded
          class="submit-btn"
          @click="irArbolProblemas"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()

const resumen = ref({
  problemaCentral: '',
  causaBeneficiados: '',
  causaOpositores: '',
  causaEjecutores: '',
  causaIndiferentes: '',
})

async function cargarDatos() {
  try {
    const res = await api.get('/IdentificacionDescripcionProblema/ultimo')
    resumen.value = {
      problemaCentral: res.data.problemaCentral,
      causaBeneficiados: res.data.causaBeneficiados,
      causaOpositores: res.data.causaOpositores,
      causaEjecutores: res.data.causaEjecutores,
      causaIndiferentes: res.data.causaIndiferentes,
    }
    console.log('✅ Datos Anexo 3:', resumen.value)
  } catch (err) {
    console.error('❌ Error al cargar datos del Anexo 3:', err)
    Notify.create({ type: 'negative', message: 'Error al cargar datos del Anexo 3' })
  }
}

function irArbolProblemas() {
  localStorage.setItem('ultimaRutaRegistro', '/formulario-arbol-problemas')
  router.push('/formulario-arbol-problemas')
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.form-title {
  font-size: 2rem;
  font-weight: 700;
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
