import { ref } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'
import { userStorage } from 'src/utils/userStorage'
import { useFormularioPersistente } from './useFormularioPersistente'

export function useAdjuntoPrograma({ storageKey, endpoint, campo, siguiente }) {
  const router = useRouter()
  const form = ref({ [campo]: null, ligaInternet: '', archivoAdjunto: null })
  const archivoSeleccionado = ref(null)
  try {
    const anterior = JSON.parse(userStorage.getItem(storageKey) || 'null')
    if (anterior?.form)
      userStorage.setItem(storageKey, JSON.stringify({ data: anterior.form, dirty: true }))
  } catch {
    /* El cargador recuperará el registro del servidor. */
  }
  const {
    guardarDatos,
    loading,
    saving: subiendo,
  } = useFormularioPersistente({
    form,
    storageKey,
    load: async () => (await api.get(`${endpoint}/ultimo`, { cache: false })).data,
    save: async (data) => {
      if (typeof data[campo] !== 'boolean') throw new Error('Selecciona Sí o No antes de guardar.')
      const fd = new FormData()
      fd.append(campo, data[campo])
      fd.append('LigaInternet', data.ligaInternet || '')
      const selected = archivoSeleccionado.value
      if (selected) fd.append('Archivo', selected.file || selected)
      const response = await api.post(endpoint, fd)
      if (archivoSeleccionado.value === selected) archivoSeleccionado.value = null
      return response
    },
    onSaved: ({ data }, snapshot) => {
      form.value.archivoAdjunto = data.archivoAdjunto
      return { ...snapshot, archivoAdjunto: data.archivoAdjunto }
    },
  })
  async function guardar() {
    if (subiendo.value || loading.value) return
    try {
      await guardarDatos()
      Notify.create({ type: 'positive', message: 'Información guardada correctamente' })
      userStorage.setItem('ultimaRutaRegistro', siguiente)
      await router.push(siguiente)
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response
          ? 'No se pudo guardar. El borrador se conserva; vuelve a intentar.'
          : error.message,
      })
    }
  }
  return { STORAGE_KEY: storageKey, router, form, archivoSeleccionado, subiendo, loading, guardar }
}
