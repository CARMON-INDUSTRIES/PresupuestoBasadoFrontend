<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="navbar">
      <q-toolbar class="q-pl-md q-pr-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="q-mr-md menu-btn"
          @click="sidebarOpen = !sidebarOpen"
        />
        <q-toolbar-title class="text-h6 text-weight-bold">
          Sistema de Presupuesto Basado en Resultados
        </q-toolbar-title>

        <q-space />

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

    <q-drawer v-model="sidebarOpen" side="left" show-if-above bordered :width="400" class="sidebar">
      <div
        class="column full-height"
        style="background-color: #691b31; background-size: cover; background-position: center"
      >
        <div class="column items-center q-my-xl">
          <q-avatar size="120px" class="shadow-4 avatar-border">
            <img :src="previewFoto || fotoActual" alt="" />
          </q-avatar>

          <div class="text-h6 text-weight-bold q-mt-sm text-white">
            {{ nombreUsuario || 'Cargando...' }}
          </div>
        </div>

        <q-separator color="white" inset />

        <q-list class="q-pa-sm sidebar-content">
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
            @click="goTo('/registro-usuario-detalle')"
            class="hover-item text-white"
          >
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>Datos Personales</q-item-section>
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

          <q-expansion-item
            icon="description"
            label="Registro del Programa"
            dense
            expand-separator
            class="text-white hover-item"
          >
            <q-list dense>
              <q-item clickable v-ripple @click="$router.push('/formulario-alineacion')">
                <q-item-section avatar><q-icon name="badge" /></q-item-section>
                <q-item-section>Alineación</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-clasificacion')">
                <q-item-section avatar><q-icon name="architecture" /></q-item-section>
                <q-item-section>Clasificación Funcional</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-antecedente')">
                <q-item-section avatar><q-icon name="category" /></q-item-section>
                <q-item-section>Antecedentes</q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                @click="$router.push('/formulario-identificacion-problema')"
              >
                <q-item-section avatar><q-icon name="feed" /></q-item-section>
                <q-item-section>Identificación y Descripción del Problema</q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                @click="$router.push('/formulario-determinacion-justificacion')"
              >
                <q-item-section avatar><q-icon name="grid_on" /></q-item-section>
                <q-item-section>Determinación y Justificación</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-cobertura')">
                <q-item-section avatar><q-icon name="history" /></q-item-section>
                <q-item-section>Cobertura</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-diseno-intervencion')">
                <q-item-section avatar><q-icon name="report_problem" /></q-item-section>
                <q-item-section>Diseño de la Intervención Pública</q-item-section>
              </q-item>

              <q-item
                clickable
                v-ripple
                @click="$router.push('/formulario-reglas-operacion-detalle')"
              >
                <q-item-section avatar><q-icon name="rule" /></q-item-section>
                <q-item-section>Reglas Operación (detalle)</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-programa-social')">
                <q-item-section avatar><q-icon name="public" /></q-item-section>
                <q-item-section>Programa Social</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-padron-beneficiarios')">
                <q-item-section avatar><q-icon name="gavel" /></q-item-section>
                <q-item-section>Padrón beneficiarios</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-reglas-operacion')">
                <q-item-section avatar><q-icon name="groups" /></q-item-section>
                <q-item-section>Reglas Operación</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/PoblacionAreaEnfoquePotencial')">
                <q-item-section avatar><q-icon name="list_alt" /></q-item-section>
                <q-item-section>Definición del Problema</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/FormularioAnalisisInvolucrados')">
                <q-item-section avatar><q-icon name="menu_book" /></q-item-section>
                <q-item-section>Análisis de Involucrados</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-arbol-problemas')">
                <q-item-section avatar><q-icon name="people" /></q-item-section>
                <q-item-section>Árbol de Problemas</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-arbol-objetivos')">
                <q-item-section avatar><q-icon name="diversity_3" /></q-item-section>
                <q-item-section>Árbol de Objetivos</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-analisis-alternativas')">
                <q-item-section avatar><q-icon name="device_hub" /></q-item-section>
                <q-item-section>Análisis de Alternativas</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-estructura-analitica')">
                <q-item-section avatar><q-icon name="account_tree" /></q-item-section>
                <q-item-section>Estructura Analítica</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-matriz-indicadores')">
                <q-item-section avatar><q-icon name="alt_route" /></q-item-section>
                <q-item-section>Matriz de Indicadores</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="$router.push('/formulario-ficha-tecnica-1')">
                <q-item-section avatar><q-icon name="schema" /></q-item-section>
                <q-item-section>Ficha Técnica</q-item-section>
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

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog v-model="dialogCambiarPassword">
      <q-card>
        <q-card-section>
          <div class="text-h6">ㅤㅤ ­ ­­­Cambio de Contraseña</div>
          <div class="text-body-1">Incluya mayúscula, números y un carácter especial</div>
        </q-card-section>

        <q-card-section>
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

    previewFoto.value = null
    nuevaFoto.value = null
    dialogCambiarFoto.value = false
  } catch (err) {
    console.error('Error al subir foto:', err)
    Notify.create({ type: 'negative', message: 'Error al actualizar la foto' })
  }
}

const rutasRegistro = [
  '/formulario-alineacion',
  '/formulario-identificacion',
  '/formulario-diseno-intervencion',
  '/formulario-clasificacion',
  '/formulario-actividad',
  '/formulario-ficha-tecnica-1',
  '/formulario-matriz-indicadores',
  '/formulario-antecedente',
  '/formulario-identificacion-problema',
  '/formulario-determinacion-justificacion',
  '/formulario-cobertura',
  '/formulario-justificacion',
  '/formulario-diseno-intervencion',
  '/formulario-reglas-operacion-detalle',
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
  '/formulario-estructura-analitica',
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
  '/formulario-matriz-indicadores': 'mirMatrizIndicadores',
  '/formulario-reglas-operacion-detalle': 'formularioPadronBeneficiarios',
  '/formulario-programa-social': 'formularioProgramaSocialCompleto',
  '/formulario-reglas-operacion': 'formularioReglasOperacion',
  '/formulario-poblacion': 'formularioProgramaSocial',
  '/formulario-ficha-tecnica-1': 'formularioFichaTecnica',
}

router.afterEach((to) => {
  if (rutasRegistro.includes(to.path)) {
    const user = localStorage.getItem('userNameActual')
    if (user && rutasRegistro.includes(to.path)) {
      localStorage.setItem(`ultimaRutaRegistro_${user}`, to.path)
    }
  }
})

function goTo(ruta) {
  sidebarOpen.value = false
  router.push(ruta)
}

function abrirCambiarPassword() {
  dialogCambiarPassword.value = true
}
function abrirCambiarFoto() {
  dialogCambiarFoto.value = true
}

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

async function cerrarSesion() {
  try {
    await api.post('/Cuentas/logout')

    const user = localStorage.getItem('userNameActual')

    const ultimaRuta = user ? localStorage.getItem(`ultimaRutaRegistro_${user}`) : null

    let storageKeyToKeep = null
    if (ultimaRuta && RUTA_TO_STORAGE[ultimaRuta]) {
      storageKeyToKeep = RUTA_TO_STORAGE[ultimaRuta]
    }

    let tempValue = null
    if (storageKeyToKeep) {
      tempValue = localStorage.getItem(storageKeyToKeep)
    }

    if (user) {
      localStorage.setItem('userNameActual', user)
    }

    if (ultimaRuta) {
      localStorage.setItem(`ultimaRutaRegistro_${user}`, ultimaRuta)
    }

    if (storageKeyToKeep && tempValue) {
      localStorage.setItem(storageKeyToKeep, tempValue)
    }

    router.push('/login')
  } catch (err) {
    console.error('Error al cerrar sesión:', err)
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #691b31 0%, #8c2345 50%, #bc995b 100%);
  color: white;
  height: 68px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.navbar .q-toolbar-title {
  letter-spacing: 0.5px;
  font-size: 1.05rem;
}

.sidebar {
  background: #691b31;
  border-right: none;
}

.sidebar > div {
  background: linear-gradient(180deg, #691b31 0%, #5a172a 45%, #45111f 100%) !important;
}

.avatar-border {
  border: 4px solid rgba(255, 255, 255, 0.95);
  box-shadow:
    0 0 0 4px rgba(188, 153, 91, 0.3),
    0 8px 20px rgba(0, 0, 0, 0.35);
}

.text-h6 {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.sidebar-content,
.sidebar-content .q-item,
.sidebar-content .q-expansion-item,
.sidebar-content .q-expansion-item__container,
.sidebar-content .q-expansion-item__content,
.sidebar-content .q-list {
  background: transparent !important;
  color: white;
}

.hover-item {
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.25s ease;
}

.hover-item:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(6px);
}

.hover-item:hover .q-icon {
  color: #bc995b;
}

.q-item .q-icon {
  font-size: 22px;
  transition: all 0.25s ease;
}

.q-expansion-item {
  border-radius: 12px;
  overflow: hidden;
}

.q-expansion-item--expanded {
  background: rgba(255, 255, 255, 0.05);
}

.q-expansion-item__toggle-icon {
  color: #bc995b;
}

.q-separator {
  opacity: 0.3;
}

.q-btn[text-color='white'] {
  font-weight: 600;
}

.q-btn[text-color='white']:hover {
  transform: translateY(-1px);
}

.sidebar-content {
  overflow-y: auto;
}

.sidebar-content::-webkit-scrollbar {
  width: 8px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #bc995b;
  border-radius: 20px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #d6b579;
}

.menu-btn {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}
</style>
