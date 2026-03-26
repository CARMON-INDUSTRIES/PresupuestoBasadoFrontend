<template>
  <q-page class="flex flex-center bg-mantenimiento">
    <!-- Overlay oscuro -->
    <div class="overlay"></div>

    <!-- Contenido -->
    <div class="content text-center q-pa-lg">
      <q-icon name="build_circle" size="100px" class="text-white q-mb-md" />

      <div class="text-h4 text-white text-weight-bold q-mb-sm">Estamos en mantenimiento</div>

      <div class="text-subtitle1 text-grey-3 q-mb-lg">
        Estamos mejorando el sistema para brindarte una mejor experiencia.<br />
        Por favor, intenta nuevamente más tarde.
      </div>

      <q-spinner-dots size="40px" color="amber" class="q-mb-md" />
    </div>
  </q-page>
</template>

<style scoped>
.bg-mantenimiento {
  position: relative;
  background-image: url('/images/wea.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Capa oscura encima de la imagen */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

/* Asegura que el contenido esté encima */
.content {
  position: relative;
  z-index: 1;
}
</style>
