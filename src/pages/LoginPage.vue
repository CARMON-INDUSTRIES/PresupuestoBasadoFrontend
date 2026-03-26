<template>
  <q-page class="flex flex-center bg-mantenimiento">
    <div class="text-center q-pa-lg">
      <!-- Icono -->
      <q-icon name="build_circle" size="100px" class="text-white q-mb-md" />

      <!-- Título -->
      <div class="text-h4 text-white text-weight-bold q-mb-sm">Estamos en mantenimiento</div>

      <!-- Mensaje -->
      <div class="text-subtitle1 text-grey-3 q-mb-lg">
        Estamos mejorando el sistema para brindarte una mejor experiencia.<br />
      </div>

      <!-- Loader -->
      <q-spinner-dots size="40px" color="amber" class="q-mb-md" />

      <!-- Botón opcional -->
    </div>
  </q-page>
</template>

<style scoped>
.bg-mantenimiento {
  background: linear-gradient(135deg, #691b31, #bc995b);
}
</style>
