<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-lg" style="max-width: 900px; margin: auto">
      <q-card-section>
        <div class="text-h5 text-center">Anexo 3 - Definición del Problema</div>
      </q-card-section>

      <!-- ================= DATOS MOSTRADOS ================= -->
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <q-input
            class="col-12"
            :model-value="resumen.identificacion?.problemaCentral || ''"
            label="Problema Central o Propósito (2.1)"
            filled
            readonly
          />
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <q-input
            class="col-6"
            :model-value="resumen.cobertura?.identificacionCaracterizacionPoblacionPotencial || ''"
            label="Población / Área de Enfoque Potencial (4.1)"
            filled
            readonly
          />
          <q-input
            class="col-6"
            :model-value="resumen.cobertura?.identificacionCaracterizacionPoblacionObjetivo || ''"
            label="Población / Área de Enfoque Objetivo (4.2)"
            filled
            readonly
          />
        </div>

        <div class="text-subtitle1 q-mb-sm">Magnitud del Problema</div>
        <div class="row q-col-gutter-md">
          <q-input
            class="col-4"
            :model-value="String(resumen.cobertura?.cuantificacionPoblacionPotencial ?? '')"
            label="Población Potencial"
            filled
            readonly
          />
          <q-input
            class="col-4"
            :model-value="String(resumen.cobertura?.cuantificacionPoblacionObjetivo ?? '')"
            label="Población Objetivo"
            filled
            readonly
          />
          <q-input
            class="col-4"
            :model-value="String(resumen.cobertura?.cuantificacionPoblacionAtendidaAnterior ?? '')"
            label="Población Atendida Ejercicio Fiscal Anterior"
            filled
            readonly
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- ================= NUEVO CAMPO (EDITABLE) ================= -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-md">Efecto Superior o Fin</div>
        <q-input
          v-model="efectoSuperior"
          type="textarea"
          label="Describa el efecto superior o fin"
          filled
          autogrow
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar" :loading="loading" @click="guardarEfectoSuperior" />
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

// Objeto con todos los datos que se traen de los endpoints /ultimo
const resumen = ref({
  identificacion: null,
  cobertura: null,
})

// Campo editable (nuevo en Anexo 3)
const efectoSuperior = ref('')

// Loading para el botón de guardar
const loading = ref(false)

// Cargar los datos cuando entra al componente
onMounted(async () => {
  try {
    const [identificacion, cobertura] = await Promise.allSettled([
      api.get('/IdentificacionDescripcionProblema/ultimo'),
      api.get('/Cobertura/ultimo'),
    ])

    if (identificacion.status === 'fulfilled') {
      resumen.value.identificacion = identificacion.value.data
    }
    if (cobertura.status === 'fulfilled') {
      resumen.value.cobertura = cobertura.value.data
    }
  } catch (error) {
    console.error('❌ Error al cargar datos del Anexo 3:', error)
    Notify.create({ type: 'negative', message: 'Error al cargar datos del Anexo 3' })
  }
})

// Guardar el nuevo campo
async function guardarEfectoSuperior() {
  loading.value = true
  try {
    await api.post('/EfectoSuperior', { descripcion: efectoSuperior.value })
    Notify.create({ type: 'positive', message: 'Efecto superior guardado correctamente' })
    efectoSuperior.value = ''
    router.push('/FormularioAnalisisInvolucrados')
  } catch (error) {
    console.error('❌ Error al guardar efecto superior:', error)
    Notify.create({ type: 'negative', message: 'Error al guardar efecto superior' })
  } finally {
    loading.value = false
  }
}
</script>
