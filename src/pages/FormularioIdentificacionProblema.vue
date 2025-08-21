<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">Identificación y Descripción del Problema</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <!-- Problema central -->
          <q-input
            filled
            v-model="form.problemaCentral"
            label="2.1 Defina de manera concreta el problema central o necesidad única a la que responde el programa."
            type="textarea"
          />

          <!-- Involucrados -->
          <q-input
            filled
            v-model="form.involucrados"
            label="2.2 Describa los involucrados, los cuales pueden ser organizaciones, empresas, frupos e individuos cuyos intereses serán
                coincidentes, complementarios o incluso antagónicos. (Debe ser consistente con el Anexo II)."
            type="textarea"
          />

          <!-- Causas divididas -->
          <div class="text-subtitle1">
            2.3 Describa las causas que han dado origen al problema. (Debe ser consistente con el
            Anexo III).
          </div>
          <q-input filled v-model="form.causaBeneficiados" label="Beneficiados" type="textarea" />
          <q-input filled v-model="form.causaOpositores" label="Opositores" type="textarea" />
          <q-input filled v-model="form.causaEjecutores" label="Ejecutores" type="textarea" />
          <q-input filled v-model="form.causaIndiferentes" label="Indiferentes" type="textarea" />

          <!-- Efectos -->
          <q-input
            filled
            v-model="form.efectos"
            label="2.4 Describa los efectos que dicho problema provoca en la población, en el ambiente o en el desarrollo económico y social."
            type="textarea"
          />

          <!-- Evolución -->
          <q-input
            filled
            v-model="form.evolucion"
            label="2.5 Describa la evolución del problema o necesidad que se pretende antender, mediante un análisis con información
                  cuantitativa y/o cualitativa."
            type="textarea"
          />
        </q-card-section>

        <!-- Botón -->
        <q-card-actions align="right">
          <q-btn color="primary" label="Guardar y continuar" type="submit" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)

const form = ref({
  problemaCentral: '',
  involucrados: '',
  causaBeneficiados: '',
  causaOpositores: '',
  causaEjecutores: '',
  causaIndiferentes: '',
  efectos: '',
  evolucion: '',
})

async function submitForm() {
  loading.value = true
  try {
    await api.post('/IdentificacionDescripcionProblema', form.value)
    router.push('/formulario-determinacion-justificacion')
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al guardar la identificación del problema',
    })
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
</style>
