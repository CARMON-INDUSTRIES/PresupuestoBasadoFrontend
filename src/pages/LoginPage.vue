<template>
  <q-page class="q-pa-none flex items-center justify-center login-page">
    <q-card flat class="row no-wrap login-card">
      <div class="col-5 flex flex-center form-side q-pa-xl">
        <q-form @submit.prevent="handleLogin" style="width: 100%; max-width: 320px">
          <div class="flex flex-center q-mb-md">
            <q-img src="/images/smg.png" position="50% 50%" style="width: 100%; height: 100%" />
          </div>

          <div class="text-h5 text-dark text-bold text-center q-mb-sm">Iniciar Sesión</div>
          <div class="text-caption text-grey-7 text-center q-mb-lg">
            Bienvenido, ingresa tus credenciales para continuar
          </div>

          <q-input
            v-model="login.user"
            label="Usuario"
            filled
            dense
            class="q-mb-md custom-input"
            @keyup.enter="handleLogin"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="grey-7" />
            </template>
          </q-input>

          <q-input
            v-model="login.password"
            :type="showPassword ? 'text' : 'password'"
            label="Contraseña"
            filled
            dense
            class="q-mb-lg custom-input"
            @keyup.enter="handleLogin"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="grey-7" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-btn
            label="Ingresar"
            unelevated
            class="full-width custom-btn"
            type="submit"
            :loading="loading"
          />
        </q-form>
      </div>

      <div class="col-7 img-side">
        <q-img
          src="/images/persona.jpg"
          fit="cover"
          position="90% 20%"
          style="width: 100%; height: 100%"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import Swal from 'sweetalert2'
import api from 'src/boot/api'

const router = useRouter()
const login = ref({ user: '', password: '' })
const loading = ref(false)
const showPassword = ref(false)

const rutasRegistro = [
  '/formulario-alineacion',
  '/formulario-justificacion',
  '/formulario-poblacion',
  '/formulario-entorno',
  '/resumen-final',
  '/registro-usuario',
  '/formulario-ramo',
  '/formulario-clasificacion',
  '/formulario-antecedente',
  '/formulario-identificacion-problema',
  '/formulario-determinacion-justificacion',
  '/formulario-cobertura',
  '/formulario-diseno-intervencion',
  '/formulario-programa-social',
  '/formulario-padron-beneficiarios',
  '/formulario-reglas-operacion',
  '/PoblacionAreaEnfoquePotencial',
  '/FormularioAnalisisInvolucrados',
  '/resumenes',
  '/formulario-arbol-problemas',
  '/formulario-arbol-objetivos',
  '/formulario-analisis-alternativas',
  '/formulario-estructura-analitica',
  '/formulario-matriz-indicadores',
  '/formulario-ficha-tecnica-1',
  '/formulario-reglas-operacion-detalle',
  '/registro-datos',
  '/programacion-metas',
]

const rutaFicha = '/formulario-ficha-tecnica-1'

const handleLogin = async () => {
  if (!login.value.user || !login.value.password) {
    Notify.create({
      type: 'warning',
      message: 'Por favor ingresa usuario y contraseña',
    })
    return
  }

  loading.value = true
  try {
    const res = await api.post('/Cuentas/Login', {
      user: login.value.user,
      password: login.value.password,
    })

    const token = res.data.token
    localStorage.setItem('token', token)

    const userNameFromLogin = res.data.username || res.data.userName || res.data.UserName || null

    if (userNameFromLogin) {
      localStorage.setItem('userNameActual', userNameFromLogin)
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const perfilRes = await api.get('/Cuentas/me')
    const user = perfilRes.data

    const finalUserName =
      localStorage.getItem('userNameActual') || user.userName || user.user_name || null
    if (finalUserName) {
      localStorage.setItem('userNameActual', finalUserName)
    }

    const faltanDatos =
      !user.nombreCompleto ||
      !user.cargo ||
      !user.unidadesPresupuestales ||
      !user.programaPresupuestario ||
      !user.nombreMatriz ||
      !user.coordinador ||
      !user.unidadAdministrativaId ||
      !user.entidadId

    if (faltanDatos) {
      localStorage.setItem('usuarioBasico', JSON.stringify({ user: user.userName }))
      await Swal.fire({
        title: 'Bienvenido',
        text: 'Parece que eres un usuario nuevo. Por favor completa tu registro antes de continuar.',
        icon: 'info',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#691B31',
      })
      router.push('/registro-usuario-detalle')
      return
    }

    const userKey = finalUserName
    const ultimaRutaKey = userKey ? `ultimaRutaRegistro_${userKey}` : null
    const ultimaRuta = ultimaRutaKey ? localStorage.getItem(ultimaRutaKey) : null

    const indiceUltimaRuta = rutasRegistro.indexOf(ultimaRuta)
    const indiceAlineacion = rutasRegistro.indexOf('/formulario-alineacion')

    if (ultimaRuta && indiceUltimaRuta > indiceAlineacion && ultimaRuta !== rutaFicha) {
      const { isConfirmed } = await Swal.fire({
        title: 'Registro incompleto',
        text: `Te quedaste en: ${obtenerTextoRuta(ultimaRuta)}`,
        icon: 'info',
        confirmButtonText: 'Continuar desde ahí',
        showCancelButton: true,
        cancelButtonText: 'Empezar de nuevo',
        confirmButtonColor: '#691B31',
        cancelButtonColor: '#aaa',
      })

      if (isConfirmed) {
        router.push(ultimaRuta)
      } else {
        if (ultimaRutaKey) localStorage.removeItem(ultimaRutaKey)
        router.push('/formulario-alineacion')
      }
    } else {
      router.push('/formulario-alineacion')
    }
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.res?.data?.message || 'Credenciales inválidas',
    })
  } finally {
    loading.value = false
  }
}

function obtenerTextoRuta(ruta) {
  const mapa = {
    '/formulario-alineacion': 'la sección de Alineación',
    '/formulario-justificacion': 'la sección de Justificación',
    '/formulario-poblacion': 'la sección de Población',
    '/formulario-entorno': 'la sección de Entorno',
    '/resumen-final': 'el Resumen Final',
    '/registro-usuario': 'el Registro de Usuario',
    '/formulario-ramo': 'la sección de Ramo',
    '/formulario-clasificacion': 'la sección de Clasificación Funcional',
    '/formulario-antecedente': 'la sección de Antecedentes',
    '/formulario-identificacion-problema': 'la sección de Identificación del Problema',
    '/formulario-determinacion-justificacion': 'la sección de Determinación de la Justificación',
    '/formulario-cobertura': 'la sección de Cobertura',
    '/formulario-diseno-intervencion': 'la sección de Diseño de Intervención',
    '/formulario-programa-social': 'la sección de Programa Social',
    '/formulario-padron-beneficiarios': 'la sección de Padrón de Beneficiarios',
    '/formulario-reglas-operacion': 'la sección de Reglas de Operación',
    '/PoblacionAreaEnfoquePotencial': 'la sección de Población Área de Enfoque Potencial',
    '/FormularioAnalisisInvolucrados': 'la sección de Análisis de Involucrados',
    '/resumenes': 'la sección de Resúmenes',
    '/formulario-arbol-problemas': 'la sección de Árbol de Problemas',
    '/formulario-arbol-objetivos': 'la sección de Árbol de Objetivos',
    '/formulario-analisis-alternativas': 'la sección de Análisis de Alternativas',
    '/formulario-estructura-analitica': 'la sección de Estructura Analítica',
    '/formulario-matriz-indicadores': 'la sección de Matriz de Indicadores',
    '/formulario-ficha-tecnica-1': 'la Ficha Técnica',
    '/formulario-reglas-operacion-detalle': 'la sección de Reglas de Operación Detalle',
    '/registro-datos': 'la sección de Registro de Datos',
    '/programacion-metas': 'la sección de Programación de Metas',
  }
  return mapa[ruta] || 'una sección pendiente'
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: url('/images/bien.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  max-width: 900px;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.25),
    0 4px 10px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-side {
  background: rgba(255, 255, 255, 0.95);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.img-side {
  background: #fff;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.custom-input :deep(.q-field__control:hover),
.custom-input :deep(.q-field__control:focus-within) {
  box-shadow: 0 0 0 2px rgba(105, 27, 49, 0.4);
}

.custom-btn {
  border-radius: 12px;
  font-weight: bold;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #691b31, #8e2a4d);
  color: #fff;
  box-shadow: 0 4px 12px rgba(105, 27, 49, 0.3);
  transition: all 0.2s ease;
}

.custom-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(105, 27, 49, 0.4);
}
</style>
