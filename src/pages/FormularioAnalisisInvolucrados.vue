<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1000px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center">Anexo 3: Análisis de Involucrados</div>
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
            />
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- Grid 2 columnas para el resto -->
        <div class="row q-col-gutter-md">
          <!-- Beneficiarios -->
          <div class="col-6">
            <div class="text-subtitle1 q-mb-sm">Beneficiarios (5.1)</div>
            <q-input
              :model-value="resumen.causaBeneficiados || ''"
              type="textarea"
              filled
              autogrow
              readonly
            />
          </div>

          <!-- Opositores -->
          <div class="col-6">
            <div class="text-subtitle1 q-mb-sm">Opositores (5.1)</div>
            <q-input
              :model-value="resumen.causaOpositores || ''"
              type="textarea"
              filled
              autogrow
              readonly
            />
          </div>

          <!-- Ejecutores -->
          <div class="col-6">
            <div class="text-subtitle1 q-mb-sm">Ejecutores (5.1)</div>
            <q-input
              :model-value="resumen.causaEjecutores || ''"
              type="textarea"
              filled
              autogrow
              readonly
            />
          </div>

          <!-- Indiferentes -->
          <div class="col-6">
            <div class="text-subtitle1 q-mb-sm">Indiferentes (5.1)</div>
            <q-input
              :model-value="resumen.causaIndiferentes || ''"
              type="textarea"
              filled
              autogrow
              readonly
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          icon="picture_as_pdf"
          label="Descargar PDF Anexo 3"
          @click="descargarPdfParte"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'
import { useRouter } from 'vue-router'
import html2pdf from 'html2pdf.js'

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
    router.push('/formulario-arbol-problemas')
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

async function descargarPdfParte() {
  const el = document.querySelector('.q-card')
  if (!el) return
  html2pdf()
    .set({
      margin: 0.5,
      filename: 'anexo3_analisis_involucrados.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    })
    .from(el)
    .save()
}

onMounted(() => {
  cargarDatos()
})
</script>
