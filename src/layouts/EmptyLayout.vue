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
            <img :src="previewFoto || fotoActual" alt="Avatar usuario" />
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
          <div class="text-h6">ㅤㅤ ­ ­­­Cambio de Contraseña</div>
          <div class="text-body-1">Incluya mayúscula, números y un carácter especial</div>
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
          <q-uploader
            label="Selecciona una foto"
            accept="image/*"
            :auto-upload="false"
            @added="onFileAdded"
          />

          <div v-if="previewFoto" class="q-mt-md">
            <div>Previsualización:</div>
            <img :src="previewFoto" style="max-width: 100%; border-radius: 8px" />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Guardar" color="primary" @click="cambiarFoto" />
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
const fotoActual = ref('/images/default-avatar.png') // imagen por defecto

const dialogCambiarPassword = ref(false)
const dialogCambiarFoto = ref(false)

const passwordActual = ref('')
const nuevaPassword = ref('')

const showPasswordActual = ref(false)
const showNuevaPassword = ref(false)

// --- Foto de perfil ---
const nuevaFoto = ref(null)
const previewFoto = ref(null)

onMounted(async () => {
  try {
    const { data } = await api.get('/Cuentas/me')
    nombreUsuario.value = data.userName || data.nombre || 'Usuario'

    if (data.fotoUrl) {
      // Si la URL empieza con "/uploads/", se concatena el dominio del backend
      if (data.fotoUrl.startsWith('/uploads/')) {
        fotoActual.value = `${import.meta.env.VITE_API_URL}${data.fotoUrl}`
      } else {
        fotoActual.value = data.fotoUrl
      }
    }
  } catch (err) {
    console.error('Error al obtener usuario:', err)
    nombreUsuario.value = 'Invitado'
  }
})

function onFileAdded(files) {
  const file = Array.isArray(files) ? files[0] : files?.files?.[0] || files[0]

  if (file) {
    nuevaFoto.value = file
    previewImage(file)
  } else {
    console.warn('No se detectó archivo al agregar.')
  }
}

// ✅ Previsualizar imagen seleccionada
function previewImage(file) {
  if (file && file instanceof File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewFoto.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function cambiarFoto() {
  if (!nuevaFoto.value) {
    Notify.create({ type: 'negative', message: 'Selecciona una foto primero' })
    return
  }

  try {
    const formData = new FormData()
    formData.append('User', nombreUsuario.value)
    formData.append('Foto', nuevaFoto.value)

    const { data } = await api.put('/Cuentas/ActualizarPerfil', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    Notify.create({ type: 'positive', message: 'Foto actualizada correctamente' })

    fotoActual.value = data.fotoUrl

    localStorage.setItem('fotoUsuario', data.fotoUrl)

    // Limpieza
    previewFoto.value = null
    nuevaFoto.value = null
    dialogCambiarFoto.value = false
  } catch (err) {
    console.error('Error al subir foto:', err)
    Notify.create({ type: 'negative', message: 'Error al actualizar la foto' })
  }
}

// --- Rutas que se registran ---
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

const RUTA_TO_STORAGE = {
  '/formulario-alineacion': 'formAlineacion',
  '/formulario-analisis-alternativas': 'anexo6AnalisisAlternativas',
  '/formulario-antecedente': 'antecedentesForm_v1',
  '/formulario-arbol-objetivos': 'formularioArbolObjetivos',
  '/formulario-clasificacion': 'clasificacionFuncionalForm_v1',
  '/formulario-cobertura': 'formularioCobertura',
  '/formulario-determinacion-justificacion': 'formularioDeterminacionJustificacion',
  '/formulario-diseno-intervencion': 'disenoIntervencionPublica',
  '/formulario-identificacion-problema': 'formularioIdentificacionProblema',
  '/Formulario-matriz-indicadores': 'mirMatrizIndicadores',
  '/Formulario-reglas-operacion-detalle': 'formularioPadronBeneficiarios',
  '/formulario-programa-social': 'formularioProgramaSocialCompleto',
  '/formulario-reglas-operacion': 'formularioReglasOperacion',
  '/formulario-poblacion': 'formularioProgramaSocial',
}

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
      User: nombreUsuario.value,
      Password: nuevaPassword.value,
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

    // 1️⃣ Obtener la última ruta registrada
    const ultimaRuta = localStorage.getItem('ultimaRutaRegistro')

    // 2️⃣ Obtener la key de almacenamiento que corresponde a esa ruta
    let storageKeyToKeep = null
    if (ultimaRuta && RUTA_TO_STORAGE[ultimaRuta]) {
      storageKeyToKeep = RUTA_TO_STORAGE[ultimaRuta]
    }

    // 3️⃣ Si la key existe, guardamos temporalmente su valor
    let tempValue = null
    if (storageKeyToKeep) {
      tempValue = localStorage.getItem(storageKeyToKeep)
    }

    // 4️⃣ Limpiamos TODO el localStorage
    localStorage.clear()

    // 5️⃣ Restauramos última ruta y su data (solo si existía)
    if (ultimaRuta) {
      localStorage.setItem('ultimaRutaRegistro', ultimaRuta)
    }

    if (storageKeyToKeep && tempValue) {
      localStorage.setItem(storageKeyToKeep, tempValue)
    }

    // 6️⃣ Quitar token e ir a login
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
