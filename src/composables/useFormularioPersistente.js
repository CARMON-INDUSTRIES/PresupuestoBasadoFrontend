// src/composables/useFormularioPersistente.js
import { ref, onMounted, watch } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'

// Array global para registrar todos los formularios persistentes
window.__formulariosPersistentes = window.__formulariosPersistentes || []

export function useFormularioPersistente(storageKey, endpointBase) {
  const datos = ref({})

  // Registrar el storageKey en el array global si no está
  if (!window.__formulariosPersistentes.includes(storageKey)) {
    window.__formulariosPersistentes.push(storageKey)
  }

  // Cargar datos desde localStorage o BD
  const cargarDatos = async () => {
    const guardado = localStorage.getItem(storageKey)
    if (guardado) {
      try {
        datos.value = JSON.parse(guardado)
        console.log(`🟡 Cargado desde localStorage (${storageKey})`, datos.value)
        return
      } catch (err) {
        console.warn(`⚠️ Error al parsear localStorage[${storageKey}]`, err)
      }
    }

    try {
      const res = await api.get(`${endpointBase}/ultimo`)
      datos.value = res.data || {}
      localStorage.setItem(storageKey, JSON.stringify(datos.value))
      console.log(`✅ Cargado desde BD (${storageKey})`, datos.value)
    } catch (err) {
      console.error(`❌ Error al cargar ${storageKey}:`, err)
    }
  }

  const guardarDatos = async (payload) => {
    try {
      let res
      if (payload.id) {
        res = await api.put(`${endpointBase}/actualizar/${payload.id}`, payload)
      } else {
        res = await api.post(`${endpointBase}/crear`, payload)
      }
      datos.value = res.data
      localStorage.setItem(storageKey, JSON.stringify(res.data))
      console.log(`💾 Guardado ${storageKey}`, res.data)
      return true
    } catch (err) {
      console.error(`❌ Error al guardar ${storageKey}:`, err)
      Notify.create({ type: 'negative', message: 'Error al guardar datos' })
      return false
    }
  }

  // Auto-guardar cada cambio del formulario
  watch(
    datos,
    (val) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(val))
      } catch (err) {
        console.warn(`⚠️ Error al guardar automáticamente ${storageKey}`, err)
      }
    },
    { deep: true },
  )

  // Limpiar solo este formulario
  const limpiarFormulario = () => {
    localStorage.removeItem(storageKey)
    datos.value = {}
    console.log(`🧹 Limpiado ${storageKey}`)
  }

  // 🔒 Limpiar todos los formularios persistentes al cerrar sesión
  const limpiarTodosFormularios = () => {
    window.__formulariosPersistentes.forEach((key) => {
      localStorage.removeItem(key)
      console.log(`🧹 Limpiado ${key} (cierre de sesión)`)
    })
    window.__formulariosPersistentes = []
  }

  // Escuchar evento global de logout
  window.addEventListener('logout', limpiarTodosFormularios)

  onMounted(() => {
    cargarDatos()
  })

  return { datos, guardarDatos, cargarDatos, limpiarFormulario, limpiarTodosFormularios }
}
