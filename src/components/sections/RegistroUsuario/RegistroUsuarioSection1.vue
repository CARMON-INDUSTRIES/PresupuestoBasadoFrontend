<template>
  <q-card-section>
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-input v-model="form.user" label="Usuario" filled stack-label required>
          <template #prepend>
            <q-icon name="person" color="primary" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model="form.password"
          label="Contraseña"
          :type="mostrarPasswordRegistro ? 'text' : 'password'"
          filled
          stack-label
          required
        >
          <template #prepend>
            <q-icon name="lock" color="primary" />
          </template>

          <template #append>
            <q-icon
              :name="mostrarPasswordRegistro ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrarPasswordRegistro = !mostrarPasswordRegistro"
            />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="form.rol"
          :options="roles"
          label="Rol"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          filled
          stack-label
          required
        >
          <template #prepend>
            <q-icon name="security" color="primary" />
          </template>
        </q-select>
      </div>

      <div class="col-12 col-md-6">
        <q-select
          v-model="form.unidadAdministrativaId"
          :options="unidades"
          label="Unidad Administrativa"
          option-value="id"
          option-label="unidad"
          emit-value
          map-options
          filled
          stack-label
          required
        >
          <template #prepend>
            <q-icon name="domain" color="primary" />
          </template>
        </q-select>
      </div>

      <div class="col-12">
        <q-select
          v-model="form.EntidadId"
          :options="entidad"
          label="Entidad Federal"
          option-value="id"
          option-label="nombre"
          emit-value
          map-options
          filled
          stack-label
          required
        >
          <template #prepend>
            <q-icon name="apartment" color="primary" />
          </template>
        </q-select>
      </div>
    </div>
  </q-card-section>
</template>
<script>
import { inject } from 'vue'

export default {
  setup() {
    return inject('RegistroUsuario')
  },
}
</script>
<style scoped src="src/css/pages/RegistroUsuario.css" />
