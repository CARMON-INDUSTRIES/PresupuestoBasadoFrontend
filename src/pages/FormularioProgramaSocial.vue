<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="guardarProgramaSocial" class="q-gutter-md">
      <!-- Pregunta principal -->
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="form-title">¿Es un programa social?</div>
          <q-option-group
            v-model="form.esProgramaSocial"
            :options="[
              { label: 'Sí', value: true },
              { label: 'No', value: false },
            ]"
            type="radio"
            inline
            color="primary"
          />
        </q-card-section>
      </q-card>

      <!-- Selección de categorías -->
      <q-card v-if="form.esProgramaSocial" flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-subtitle1">Categorías</div>
          <q-separator spaced />

          <div v-for="cat in categorias" :key="cat.nombre" class="q-mb-md">
            <q-toggle v-model="cat.seleccionado" :label="cat.nombre" color="primary" />

            <div v-if="cat.seleccionado" class="q-mt-sm">
              <q-option-group
                v-model="cat.tipo"
                :options="[
                  { label: 'Directo', value: 'Directo' },
                  { label: 'Indirecto', value: 'Indirecto' },
                ]"
                type="radio"
                color="primary"
                inline
              />
            </div>

            <q-separator spaced />
          </div>
        </q-card-section>
      </q-card>

      <!-- Botón Guardar -->
      <q-card-actions align="right">
        <q-btn
          label="Continuar"
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
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

const router = useRouter()

const form = ref({
  esProgramaSocial: null,
})

const categorias = ref([
  { nombre: 'Alimentación', tipo: '', seleccionado: false },
  { nombre: 'Educación', tipo: '', seleccionado: false },
  { nombre: 'Salud', tipo: '', seleccionado: false },
  { nombre: 'Trabajo', tipo: '', seleccionado: false },
  { nombre: 'Vivienda', tipo: '', seleccionado: false },
  { nombre: 'Seguridad social', tipo: '', seleccionado: false },
  { nombre: 'No discriminación', tipo: '', seleccionado: false },
  { nombre: 'Medio ambiente sano', tipo: '', seleccionado: false },
  { nombre: 'Bienestar económico', tipo: '', seleccionado: false },
])

async function guardarProgramaSocial() {
  try {
    const payload = {
      esProgramaSocial: form.value.esProgramaSocial,
      categorias: categorias.value
        .filter((cat) => cat.seleccionado)
        .map((cat) => ({
          nombre: cat.nombre,
          tipo: cat.tipo,
        })),
    }

    await api.post('/ProgramaSocial', payload)

    Notify.create({
      type: 'positive',
      message: 'Programa social guardado correctamente',
    })

    router.push('/formulario-padron-beneficiarios')
  } catch (error) {
    console.error(error)
    Notify.create({
      type: 'negative',
      message: 'Error al guardar el programa social',
    })
  }
}
</script>

<style scoped>
.form-title {
  font-size: 2rem;
  font-weight: 700;
}

/* Botón guardar */
.submit-btn {
  font-weight: 900;
  font-size: 0.8rem;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
