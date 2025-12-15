<template>
  <q-page padding style="background-color: #691b31">
    <q-card flat bordered class="q-pa-md" style="max-width: 1000px; margin: auto">
      <q-card-section class="row items-center justify-between">
        <div class="form-title">Editar Componentes</div>
        <q-btn
          color="secondary"
          label="Regresar al análisis de alternativas"
          rounded
          @click="router.push('/Formulario-analisis-alternativas')"
        />
      </q-card-section>
      <q-separator color="#691b31" spaced />

      <div v-if="componentes.length" class="q-mt-md">
        <div
          v-for="comp in componentes"
          :key="comp.id"
          class="q-pa-sm bg-grey-2 q-mb-sm rounded-borders"
        >
          <div class="row items-center justify-between">
            <div class="text-subtitle2"><q-icon name="widgets" /> {{ comp.nombre }}</div>
            <q-btn dense flat round icon="edit" color="primary" @click="editarComponente(comp)" />
          </div>

          <div v-for="accion in comp.acciones" :key="accion.id" class="q-ml-md row items-center">
            <strong class="col">
              <q-icon name="task_alt" /> {{ accion.descripcion }} ({{ accion.cantidad }})
            </strong>
          </div>

          <div class="q-ml-md q-mt-sm">
            <em>
              <q-icon name="flare" />
              {{ comp.resultado?.descripcion }}
            </em>
          </div>
        </div>
      </div>

      <q-skeleton v-else animated width="100%" height="150px" class="q-mt-md" />
    </q-card>

    <q-dialog v-model="showModal" persistent>
      <q-card style="min-width: 600px; max-width: 800px">
        <q-card-section>
          <div class="form-title">Editar Componente</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            v-model="componenteEdit.nombre"
            filled
            rounded
            label="Nombre del componente"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="widgets" />
            </template>
          </q-input>

          <div
            v-for="(accion, aIdx) in componenteEdit.acciones"
            :key="'accion-' + aIdx"
            class="q-mb-md"
          >
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle2"><q-icon name="task_alt" /> Actividad {{ aIdx + 1 }}</div>
              <q-btn
                v-if="componenteEdit.acciones.length > 1"
                dense
                flat
                round
                icon="delete"
                color="negative"
                @click="componenteEdit.acciones.splice(aIdx, 1)"
              />
            </div>

            <div class="row q-col-gutter-md">
              <q-input
                class="col-8"
                v-model="accion.descripcion"
                filled
                rounded
                dense
                placeholder="Nombre de la actividad"
              />
              <q-input
                class="col-4"
                v-model.number="accion.cantidad"
                type="number"
                filled
                rounded
                dense
                placeholder="Cantidad"
              />
            </div>
            <q-separator class="q-my-sm" />
          </div>

          <q-btn
            flat
            icon="add"
            label="Agregar actividad"
            @click="componenteEdit.acciones.push({ descripcion: '', cantidad: 0 })"
          />

          <div class="q-mt-md">
            <div class="text-caption q-mb-xs">Efecto</div>
            <q-input
              v-model="componenteEdit.resultado.descripcion"
              filled
              rounded
              dense
              placeholder="Efecto del componente"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup @click="showModal = false" />
          <q-btn flat label="Guardar Cambios" color="primary" @click="guardarEdicionComponente" />
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

const componentes = ref([])
const componenteEdit = ref({
  id: 0,
  nombre: '',
  acciones: [],
  resultado: { id: 0, descripcion: '' },
})

let idRegistroDiseno = ref(0)

const obtenerComponentes = async () => {
  loading.value = true
  try {
    const res = await api.get('/DisenoIntervencionPublica/ultimo')
    idRegistroDiseno.value = res.data.id
    componentes.value = res.data.componentes.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      acciones: c.acciones.map((a) => ({
        id: a.id,
        descripcion: a.descripcion,
        cantidad: a.cantidad,
      })),
      resultado: { id: c.resultado.id, descripcion: c.resultado.descripcion },
    }))
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al obtener componentes',
    })
  } finally {
    loading.value = false
  }
}

const editarComponente = (comp) => {
  componenteEdit.value = JSON.parse(JSON.stringify(comp))
  showModal.value = true
}

const guardarEdicionComponente = async () => {
  if (!componenteEdit.value.nombre.trim()) {
    Notify.create({ type: 'warning', message: 'El componente debe tener un nombre' })
    return
  }

  loading.value = true
  try {
    const index = componentes.value.findIndex((c) => c.id === componenteEdit.value.id)
    if (index !== -1) {
      componentes.value[index] = JSON.parse(JSON.stringify(componenteEdit.value))
    }

    const payload = {
      id: idRegistroDiseno.value,
      componentes: componentes.value,
      etapasIntervencion: '',
      escenariosFuturosEsperar: '',
    }

    await api.put(`/DisenoIntervencionPublica/${idRegistroDiseno.value}`, payload)
    Notify.create({ type: 'positive', message: 'Componente actualizado correctamente' })
    showModal.value = false
    await obtenerComponentes()
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Error al actualizar componente',
    })
  } finally {
    loading.value = false
  }
}

obtenerComponentes()
</script>

<style scoped>
.q-card {
  max-width: 1000px;
  margin: auto;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #691b31;
}

.q-field__control {
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
