<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="min-width: 600px; max-width: 800px">
      <q-card-section>
        <div class="form-title">Editar Componentes</div>
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
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('EditarComponentes')
  },
}
</script>
<style scoped src="src/css/pages/EditarComponentes.css" />
