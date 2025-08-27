<template>
  <q-page padding>
    <q-form @submit.prevent="guardarReglasOperacion" class="q-gutter-md">
      <!-- Pregunta principal -->
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6">¿Tiene reglas de operación?</div>
          <q-option-group
            v-model="form.tieneReglasOperacion"
            :options="[
              { label: 'Sí', value: true },
              { label: 'No', value: false },
            ]"
            type="radio"
          />
        </q-card-section>
      </q-card>

      <!-- Campos adicionales -->
      <q-card v-if="form.tieneReglasOperacion" flat bordered class="q-pa-md">
        <q-card-section>
          <q-input filled type="file" label="Archivo adjunto" @change="onFileChange" />
          <q-input v-model="form.ligaInternet" filled label="Liga de internet" type="url" />
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
  tieneReglasOperacion: null,
  archivoAdjunto: '',
  ligaInternet: '',
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    form.value.archivoAdjunto = file.name // temporal, luego será URL Cloudinary
  }
}

async function guardarReglasOperacion() {
  try {
    const payload = {
      tieneReglasOperacion: form.value.tieneReglasOperacion,
      archivoAdjunto: form.value.archivoAdjunto,
      ligaInternet: form.value.ligaInternet,
    }

    await api.post('/ReglasOperacion', payload)

    Notify.create({
      type: 'positive',
      message: 'Reglas de operación guardadas correctamente',
    })

    // Aquí decides si redirigir a otro formulario
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
