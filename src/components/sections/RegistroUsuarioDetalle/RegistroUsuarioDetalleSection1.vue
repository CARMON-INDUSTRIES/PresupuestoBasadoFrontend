<template>
  <div class="row q-col-gutter-lg">
    <div class="col-12 col-md-4">
      <q-input v-model="form.NuevoUserName" label="Nombre de Usuario" outlined stack-label>
        <template #prepend>
          <q-icon name="person" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-4">
      <q-input v-model="form.email" label="Correo Electrónico" type="email" outlined stack-label>
        <template #prepend>
          <q-icon name="mail" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-4">
      <q-input v-model="form.nombreCompleto" label="Nombre Completo" outlined stack-label>
        <template #prepend>
          <q-icon name="badge" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-4">
      <q-input v-model="form.cargo" label="Cargo" outlined stack-label>
        <template #prepend>
          <q-icon name="work" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-4">
      <q-input v-model="form.coordinador" label="Coordinador" outlined stack-label>
        <template #prepend>
          <q-icon name="supervisor_account" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-4">
      <q-input
        v-model="form.unidadesPresupuestales"
        label="Unidades Presupuestales"
        outlined
        stack-label
      >
        <template #prepend>
          <q-icon name="account_balance" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-4">
      <q-input
        v-model="form.programaPresupuestario"
        label="Programa Presupuestario"
        outlined
        stack-label
      >
        <template #prepend>
          <q-icon name="assignment" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-4">
      <q-input v-model="form.nombreMatriz" label="Programa Presupuestal" outlined stack-label>
        <template #prepend>
          <q-icon name="description" color="primary" />
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-4">
      <q-select
        v-model="form.unidadAdministrativaId"
        :options="unidades"
        label="Unidad Administrativa"
        option-value="id"
        option-label="unidad"
        emit-value
        map-options
        outlined
        stack-label
      >
        <template #prepend>
          <q-icon name="domain" color="primary" />
        </template>
      </q-select>
    </div>
  </div>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('RegistroUsuarioDetalle')
  },
}
</script>
<style scoped src="src/css/pages/RegistroUsuarioDetalle.css" />
