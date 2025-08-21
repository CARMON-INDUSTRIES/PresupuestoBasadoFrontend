<template>
  <q-page padding>
    <q-form @submit.prevent="guardarPadron" class="q-gutter-md">
      <!-- Pregunta principal -->
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6">¿Cuenta con padrón de beneficiarios?</div>
          <q-option-group
            v-model="form.tienePadron"
            :options="[
              { label: 'Sí', value: true },
              { label: 'No', value: false },
            ]"
            type="radio"
          />
        </q-card-section>
      </q-card>

      <!-- Campos extra si es Sí -->
      <q-card v-if="form.tienePadron" flat bordered class="q-pa-md">
        <q-card-section>
          <!-- Archivo adjunto -->
          <q-file
            filled
            label="Adjuntar archivo"
            v-model="archivo"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
            @update:model-value="procesarArchivo"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <!-- Liga de internet -->
          <q-input filled label="Liga de internet" v-model="form.ligaInternet" type="url">
            <template v-slot:prepend>
              <q-icon name="link" />
            </template>
          </q-input>
        </q-card-section>
      </q-card>

      <!-- Botón Guardar -->
      <q-card-actions align="right">
        <q-btn label="Guardar" color="primary" type="submit" />
      </q-card-actions>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()

const form = ref({
  tienePadron: null,
  archivoAdjunto: '',
  ligaInternet: '',
})

const archivo = ref(null)

// Procesar archivo (Base64 por ahora)
function procesarArchivo(file) {
  if (!file) {
    form.value.archivoAdjunto = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    form.value.archivoAdjunto = reader.result // Base64 temporal
  }
  reader.readAsDataURL(file)
}

async function guardarPadron() {
  try {
    const payload = {
      tienePadron: form.value.tienePadron,
      archivoAdjunto: form.value.archivoAdjunto,
      ligaInternet: form.value.ligaInternet,
    }

    await api.post('/PadronBeneficiarios', payload)

    Notify.create({
      type: 'positive',
      message: 'Padron de Beneficiarios guardadas correctamente',
    })

    // Aquí decides si redirigir a otro formulario
    router.push('/formulario-reglas-operacion')
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: 'Error al guardar Padron de Beneficiarios',
    })
  }
}
</script>
