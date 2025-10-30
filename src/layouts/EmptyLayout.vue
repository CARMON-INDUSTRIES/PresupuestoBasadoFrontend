<template>
  <q-layout view="hHh lpR fFf">
    <!-- Navbar -->
    <q-header elevated class="navbar">
      <q-toolbar class="q-pl-md q-pr-md">
        <!-- Botón para abrir sidebar -->
        <q-btn flat dense round icon="menu" class="q-mr-md" @click="sidebarOpen = !sidebarOpen" />

        <q-toolbar-title class="text-h6 text-weight-bold">
          Sistema de Presupuesto Basado en Resultados
        </q-toolbar-title>

        <q-space />

        <!-- Botón de cerrar sesión -->
        <q-btn
          flat
          dense
          icon="logout"
          label="Cerrar sesión"
          class="q-ml-md text-white"
          @click="cerrarSesion"
          :style="{ color: hoverLogout ? '#FFD700' : 'white' }"
          @mouseover="hoverLogout = true"
          @mouseleave="hoverLogout = false"
        />
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer v-model="sidebarOpen" side="left" show-if-above bordered :width="280" class="sidebar">
      <div
        class="column full-height"
        style="
          background-image: url('/images/sidebar.jpg');
          background-size: cover;
          background-position: center;
        "
      >
        <!-- Avatar + nombre -->
        <div class="column items-center q-my-xl">
          <q-avatar size="100px" class="shadow-4 avatar-border">
            <q-icon name="person" size="64px" />
          </q-avatar>
          <div class="text-h6 text-weight-bold q-mt-sm text-white">
            {{ nombreUsuario || 'Cargando...' }}
          </div>
        </div>

        <q-separator color="white" inset />

        <!-- Menú -->
        <q-list class="q-pa-sm">
          <q-item
            clickable
            v-ripple
            @click="goTo('/formulario-alineacion')"
            class="hover-item text-white"
          >
            <q-item-section avatar><q-icon name="home" /></q-item-section>
            <q-item-section>Inicio</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goTo('/resumenes')" class="hover-item text-white">
            <q-item-section avatar><q-icon name="summarize" /></q-item-section>
            <q-item-section>Resúmenes PDF</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="goTo('/programacion-metas')"
            class="hover-item text-white"
          >
            <q-item-section avatar><q-icon name="event_note" /></q-item-section>
            <q-item-section>Programación Metas</q-item-section>
          </q-item>

          <q-separator color="white" inset class="q-my-sm" />

          <!-- Sección de Configuración -->
          <q-expansion-item
            icon="settings"
            label="Configuración"
            dense
            expand-separator
            class="text-white hover-item"
          >
            <q-list dense>
              <q-item clickable v-ripple @click="abrirCambiarPassword">
                <q-item-section avatar><q-icon name="lock" /></q-item-section>
                <q-item-section>Cambiar contraseña</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="abrirCambiarFoto">
                <q-item-section avatar><q-icon name="photo_camera" /></q-item-section>
                <q-item-section>Foto de perfil</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-separator color="white" inset class="q-my-sm" />

          <q-item clickable v-ripple @click="cerrarSesion" class="hover-item text-white">
            <q-item-section avatar><q-icon name="logout" /></q-item-section>
            <q-item-section>Cerrar sesión</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <!-- Contenido -->
    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- Dialogo Cambiar Contraseña -->
    <q-dialog v-model="dialogCambiarPassword">
      <q-card>
        <q-card-section>
          <div class="text-h6">Incluya mayuscula, numeros y un carácter especial</div>
        </q-card-section>

        <q-card-section>
          <!-- Contraseña actual -->
          <q-input
            filled
            v-model="passwordActual"
            :type="showPasswordActual ? 'text' : 'password'"
            label="Contraseña actual"
            class="q-mb-md"
          >
            <template #append>
              <q-icon
                :name="showPasswordActual ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPasswordActual = !showPasswordActual"
              />
            </template>
          </q-input>

          <!-- Nueva contraseña -->
          <q-input
            filled
            v-model="nuevaPassword"
            :type="showNuevaPassword ? 'text' : 'password'"
            label="Nueva contraseña"
          >
            <template #append>
              <q-icon
                :name="showNuevaPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showNuevaPassword = !showNuevaPassword"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="cambiarPassword" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialogo Cambiar Foto (placeholder) -->
    <q-dialog v-model="dialogCambiarFoto">
      <q-card>
        <q-card-section>
          <div class="text-h6">Cambiar foto de perfil</div>
          <div class="text-subtitle2">Próximamente</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'
import { Notify } from 'quasar'

const router = useRouter()
const sidebarOpen = ref(false)
const hoverLogout = ref(false)
const nombreUsuario = ref('')

const dialogCambiarPassword = ref(false)
const dialogCambiarFoto = ref(false)

const passwordActual = ref('')
const nuevaPassword = ref('')

const showPasswordActual = ref(false)
const showNuevaPassword = ref(false)

// Obtener usuario actual
onMounted(async () => {
  try {
    const { data } = await api.get('/Cuentas/me')
    nombreUsuario.value = data.userName || data.nombre || 'Usuario'
  } catch (err) {
    console.error('Error al obtener usuario:', err)
    nombreUsuario.value = 'Invitado'
  }
})

const rutasRegistro = [
  '/formulario-alineacion',
  '/formulario-identificacion',
  '/formulario-diseno-intervencion',
  '/formulario-clasificacion',
  '/formulario-actividad',
  '/formulario-ficha-tecnica-1',
  '/Formulario-matriz-indicadores',
  '/formulario-antecedente',
  '/formulario-identificacion-problema',
  '/formulario-determinacion-justificacion',
  '/formulario-cobertura',
  '/formulario-justificacion',
  '/formulario-diseno-intervencion',
  '/Formulario-reglas-operacion-detalle',
  '/formulario-programa-social',
  '/formulario-padron-beneficiarios',
  '/formulario-reglas-operacion',
  '/PoblacionAreaEnfoquePotencial',
  '/FormularioAnalisisInvolucrados',
  '/formulario-arbol-problemas',
  '/formulario-poblacion',
  '/formulario-cobertura',
  '/formulario-arbol-objetivos',
  '/formulario-analisis-alternativas',
  '/Formulario-estructura-analitica',
  '/Formulario-ficha-tecnica-1',
]

// Guardar última ruta visitada
router.afterEach((to) => {
  if (rutasRegistro.includes(to.path)) {
    localStorage.setItem('ultimaRutaRegistro', to.path)
  }
})

// Navegar
function goTo(ruta) {
  sidebarOpen.value = false
  router.push(ruta)
}

// Abrir diálogos
function abrirCambiarPassword() {
  dialogCambiarPassword.value = true
}
function abrirCambiarFoto() {
  dialogCambiarFoto.value = true
}

// Cambiar contraseña
async function cambiarPassword() {
  if (!passwordActual.value || !nuevaPassword.value) {
    Notify.create({ type: 'negative', message: 'Debes completar todos los campos' })
    return
  }

  try {
    await api.put('/Cuentas/CambiarPassword', {
      User: nombreUsuario.value, // nombre del usuario loggeado
      Password: nuevaPassword.value, // nueva contraseña
    })

    dialogCambiarPassword.value = false
    passwordActual.value = ''
    nuevaPassword.value = ''
    Notify.create({ type: 'positive', message: 'Contraseña cambiada correctamente' })
  } catch (err) {
    console.error('Error al cambiar contraseña:', err)
    Notify.create({ type: 'negative', message: 'Error al cambiar contraseña' })
  }
}

// Cerrar sesión
async function cerrarSesion() {
  try {
    await api.post('/Cuentas/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('formAlineacion')
    localStorage.removeItem('tipoAlineacion')
    localStorage.removeItem('alineacionEstatal')
    localStorage.removeItem('alineacionMunicipal')
    localStorage.removeItem('clasificacionFuncionalForm_v1')
    localStorage.removeItem('antecedentesForm_v1')
    localStorage.removeItem('formularioIdentificacionProblema')
    localStorage.removeItem('formularioDeterminacionJustificacion')
    localStorage.removeItem('formularioCobertura')
    localStorage.removeItem('formularioCobertura')
    localStorage.removeItem('disenoIntervencionPublica')
    localStorage.removeItem('formularioProgramaSocial')
    localStorage.removeItem('formularioProgramaSocialCompleto')
    localStorage.removeItem('formularioPadronBeneficiarios')
    localStorage.removeItem('formularioReglasOperacion')
    localStorage.removeItem('formularioArbolObjetivos')
    localStorage.removeItem('anexo6AnalisisAlternativas')
    localStorage.removeItem('mirMatrizIndicadores')
    localStorage.removeItem('LineaEstatal')
    localStorage.removeItem('LineaMunicipal')

    router.push('/login')
  } catch (err) {
    console.error('Error al cerrar sesión:', err)
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(120deg, #bc995b, #691b31);
  color: white;
  height: 55px;
}

.sidebar {
  backdrop-filter: blur(6px);
  background-color: rgba(0, 0, 0, 0.65);
}

.avatar-border {
  border: 2px solid white;
}

.hover-item:hover {
  background-color: rgba(255, 215, 0, 0.2);
  transition: 0.2s;
}
</style>
