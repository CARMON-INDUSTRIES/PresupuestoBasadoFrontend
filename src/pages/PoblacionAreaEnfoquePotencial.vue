<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-lg" style="max-width: 900px; margin: auto">
      <q-card-section>
        <div class="form-title text-center">Definición del Problema</div>
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
            rounded
          />
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <q-input
            class="col-6"
            :model-value="resumen.cobertura?.identificacionCaracterizacionPoblacionPotencial || ''"
            label="Población / Área de Enfoque Potencial (4.1)"
            filled
            readonly
            rounded
          />
          <q-input
            class="col-6"
            :model-value="resumen.cobertura?.identificacionCaracterizacionPoblacionObjetivo || ''"
            label="Población / Área de Enfoque Objetivo (4.2)"
            filled
            readonly
            rounded
          />
        </div>

        <div class="text-subtitle1 q-mb-sm">Magnitud del Problema</div>
        <!-- NUEVO CAMPO: Unidad de Medida -->
        <div class="row q-col-gutter-md q-mt-md">
          <q-input
            class="col-12"
            :model-value="resumen.cobertura?.unidadMedida || ''"
            label="Unidad de Medida"
            filled
            readonly
            rounded
          />
        </div>
        <br />

        <div class="row q-col-gutter-md">
          <q-input
            class="col-4"
            :model-value="String(resumen.cobertura?.cuantificacionPoblacionPotencial ?? '')"
            label="Población Potencial"
            filled
            readonly
            rounded
          />
          <q-input
            class="col-4"
            :model-value="String(resumen.cobertura?.cuantificacionPoblacionObjetivo ?? '')"
            label="Población Objetivo"
            filled
            readonly
            rounded
          />
          <q-input
            class="col-4"
            :model-value="String(resumen.cobertura?.cuantificacionPoblacionAtendidaAnterior ?? '')"
            label="Población Atendida Ejercicio Fiscal Anterior"
            filled
            readonly
            rounded
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
          readonly
          rounded
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Guardar"
          text-color="white"
          :loading="loading"
          rounded
          unelevated
          class="submit-btn"
          @click="guardarEfectoSuperior"
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
      efectoSuperior.value = objetivoMunicipal.value // se precarga aquí
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
