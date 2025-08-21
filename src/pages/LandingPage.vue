<template>
  <q-page class="bg-grey-2 text-dark q-pa-none">
    <!-- Hero Section -->
    <div
      class="q-pa-lg row items-center justify-between bg-primary text-white"
      style="min-height: 50vh"
    >
      <div class="col-12 col-md-6 q-pr-xl from-left">
        <h1 class="text-h3 text-weight-bold q-mb-sm">El sistema de gestión PbR que sí funciona</h1>
        <p class="text-subtitle1 q-mb-md">
          Optimiza el diseño, seguimiento y validación de la Matriz de Indicadores para Resultados
          con un solo sistema digital.
        </p>
        <q-btn
          label="Probar ahora"
          class="btn-hover color-2"
          size="lg"
          @click="$router.push('/login')"
        />
        <div class="text-caption text-grey-7 q-mt-sm">
          Disponible para todos los niveles de gobierno
        </div>
      </div>

      <div class="col-12 col-md-6 from-right">
        <q-img src="/images/hero-ilustracion.png" style="max-width: 100%" spinner-color="primary" />
      </div>
    </div>

    <!-- Beneficios Section -->
    <div class="q-py-xl q-px-xl bg-white">
      <div class="text-center q-mb-xl fade-in">
        <h2 class="text-h5 text-weight-bold">¿Por qué usar este sistema?</h2>
        <p class="text-subtitle2 q-mt-sm">
          Compatible con todos tus dispositivos y adaptable a cualquier nivel operativo.
        </p>
        <br />
      </div>

      <div class="row q-col-gutter-xl items-center bg-grey">
        <div class="col-12 col-md-6 from-left">
          <q-img src="/images/ventaja1.png" style="max-width: 70%" />
        </div>
        <div class="col-12 col-md-6 from-right">
          <h3 class="text-h6 text-weight-bold q-mb-sm">Uso intuitivo y accesible</h3>
          <p class="text-body1">
            Podrás capturar tus programas, componentes y actividades con facilidad desde cualquier
            dispositivo. Ideal para enlaces institucionales y UTED.
          </p>
          <q-btn label="Ver funcionalidades" flat color="secondary" class="q-mt-md" />
        </div>
      </div>
    </div>

    <!-- Seguridad/Confiabilidad Section -->
    <div class="q-px-xl q-py-xl row items-center bg-accent">
      <div class="col-12 col-md-6 bg-accent from-left">
        <h3 class="text-h6 text-weight-bold q-mb-sm">Acceso seguro y confiable</h3>
        <p class="text-body1">
          Cada usuario tiene permisos específicos según su rol: UTED, Enlace, Coordinador, etc. La
          seguridad está garantizada a nivel de autenticación y permisos.
        </p>
      </div>
      <div class="col-12 col-md-6 from-right">
        <q-img src="/images/seguridad.png" style="max-width: 70%" />
      </div>
    </div>

    <!-- Contáctanos Section -->
    <div class="q-py-xl q-px-xl bg-white fade-in">
      <div class="text-center q-mb-lg">
        <h2 class="text-h5 text-weight-bold">Contáctanos</h2>
        <p class="text-subtitle2 q-mt-sm">
          ¿Tienes dudas? ¿Quieres una demostración? Estamos aquí para ayudarte.
        </p>
      </div>

      <div class="row q-col-gutter-xl items-center justify-center">
        <div class="col-12 col-md-4 text-center fade-in">
          <q-icon name="mail" size="48px" color="primary" />
          <h6 class="text-h6 text-weight-medium q-mt-sm">Correo electrónico</h6>
          <p class="text-body2">soporte@pbr.mx</p>
        </div>

        <div class="col-12 col-md-4 text-center fade-in">
          <q-icon name="call" size="48px" color="primary" />
          <h6 class="text-h6 text-weight-medium q-mt-sm">Teléfono</h6>
          <p class="text-body2">+52 771 123 4567</p>
        </div>

        <div class="col-12 col-md-4 text-center fade-in">
          <q-icon name="location_on" size="48px" color="primary" />
          <h6 class="text-h6 text-weight-medium q-mt-sm">Ubicación</h6>
          <p class="text-body2">Hidalgo, México</p>
        </div>
      </div>

      <div class="text-center q-mt-xl">
        <q-btn label="Enviar mensaje" color="primary" outline @click="openContactForm" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const appearOptions = {
    threshold: 0,
    rootMargin: '0px 0px -100px 0px',
  }

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('appear')
      observer.unobserve(entry.target)
    })
  }, appearOptions)

  const elements = document.querySelectorAll('.fade-in, .from-left, .from-right')
  elements.forEach((el) => appearOnScroll.observe(el))
})

function openContactForm() {
  // Puedes redirigir a un formulario, mostrar un modal, o abrir un chat
  window.location.href = 'mailto:soporte@pbr.mx'
}
</script>
