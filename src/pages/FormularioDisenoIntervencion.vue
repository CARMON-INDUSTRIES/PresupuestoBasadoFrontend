<template>
  <q-page padding style="background-color: #691b31">
    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-black">Diseño de la Intervención Pública</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <!-- Botón para abrir modal de componentes -->
          <q-btn color="secondary" label="Agregar Componente" @click="showModal = true" />

          <!-- Lista previa de componentes agregados -->
          <div v-if="form.componentes.length" class="q-mt-md">
            <div
              v-for="(comp, index) in form.componentes"
              :key="index"
              class="q-pa-sm bg-grey-2 q-mb-sm rounded-borders"
            >
              <div class="text-subtitle2">
                {{
                  comp.nombre && comp.nombre.trim() !== '' ? comp.nombre : `Componente ${index + 1}`
                }}
              </div>
              <div><strong>Acciones:</strong> {{ comp.acciones.join(', ') }}</div>
              <div><strong>Resultados:</strong> {{ comp.resultados.join(', ') }}</div>
            </div>
          </div>

          <q-input
            filled
            v-model="form.etapasIntervencion"
            label="5.2 Establecimiento de los cursos de acción (etapas de la intervención).- Defina el espacio y tiempo de las actividades
(procesos) a realizar, los insumos, los tipos o montos de los apoyos a entregar, la cobertura que se pretende alcanzar
y/o los mecanismos de selección de los beneficiarios."
            type="textarea"
          />
          <q-input
            filled
            v-model="form.escenariosFuturosEsperar"
            label="5.3 Definir escenarios futuros a esperar.- Narrativa de los resultados que se esperan lograr a mediano y largo plazo con
la intervención pública a través del programa."
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="primary" label="Guardar y finalizar" type="submit" :loading="loading" />
        </q-card-actions>
      </q-card>
    </q-form>

    <!-- Modal -->
    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Nuevo Componente</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Nombre del Componente -->
          <q-input
            v-model="nuevoComponente.nombre"
            filled
            label="Nombre del Componente"
            placeholder="Ej. Infraestructura básica"
            class="q-mb-md"
          />

          <!-- Acciones -->
          <div class="q-mb-md">
            <div class="text-subtitle2 q-mb-sm">Acciones</div>
            <div
              v-for="(accion, idx) in nuevoComponente.acciones"
              :key="'a' + idx"
              class="row items-center q-mb-sm"
            >
              <q-input
                v-model="nuevoComponente.acciones[idx]"
                filled
                dense
                class="col"
                placeholder="Acción"
              />
              <q-btn
                dense
                flat
                round
                icon="delete"
                color="negative"
                @click="nuevoComponente.acciones.splice(idx, 1)"
              />
            </div>
            <q-btn
              flat
              icon="add"
              label="Agregar acción"
              @click="nuevoComponente.acciones.push('')"
            />
          </div>

          <!-- Resultados -->
          <div>
            <div class="text-subtitle2 q-mb-sm">Resultados</div>
            <div
              v-for="(resultado, idx) in nuevoComponente.resultados"
              :key="'r' + idx"
              class="row items-center q-mb-sm"
            >
              <q-input
                v-model="nuevoComponente.resultados[idx]"
                filled
                dense
                class="col"
                placeholder="Resultado"
              />
              <q-btn
                dense
                flat
                round
                icon="delete"
                color="negative"
                @click="nuevoComponente.resultados.splice(idx, 1)"
              />
            </div>
            <q-btn
              flat
              icon="add"
              label="Agregar resultado"
              @click="nuevoComponente.resultados.push('')"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Guardar Componente" color="primary" @click="guardarComponente" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

const router = useRouter()
const loading = ref(false)
const showModal = ref(false)

const form = ref({
  componentes: [], // [{ nombre, acciones:[], resultados:[] }]
  etapasIntervencion: '',
  escenariosFuturosEsperar: '',
})

const nuevoComponente = ref({
  nombre: '',
  acciones: [''],
  resultados: [''],
})

function guardarComponente() {
  if (!nuevoComponente.value.nombre || nuevoComponente.value.nombre.trim() === '') {
    Notify.create({ type: 'warning', message: 'El componente debe tener un nombre' })
    return
  }

  form.value.componentes.push({
    nombre: nuevoComponente.value.nombre.trim(),
    acciones: [...nuevoComponente.value.acciones],
    resultados: [...nuevoComponente.value.resultados],
  })

  // limpiar para siguiente uso
  nuevoComponente.value = { nombre: '', acciones: [''], resultados: [''] }
  showModal.value = false
}

async function submitForm() {
  loading.value = true
  try {
    await api.post('/DisenoIntervencionPublica', form.value)
    router.push('/formulario-programa-social') // Última pantalla del flujo
  } catch (error) {
    Notify.create({
      type: 'negative',
      message:
        error.response?.data?.message || 'Error al guardar Diseño de la Intervención Pública',
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
