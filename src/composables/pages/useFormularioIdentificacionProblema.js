import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useFormularioIdentificacionProblema() {
  const router = useRouter()

  const loading = ref(false)
  const form = ref({
    id: null,
    problemaCentral: '',
    involucrados: '',
    causaBeneficiados: '',
    causaOpositores: '',
    causaEjecutores: '',
    causaIndiferentes: '',
    efectos: '',
    evolucion: '',
  })

  const { guardarDatos, saving: autosaveLoading } = useFormularioPersistente({
    form,
    storageKey: 'FormularioIdentificacionProblema',
    autosave: true,
    load: async () => (await api.get('/IdentificacionDescripcionProblema/ultimo')).data,
    save: async (data) => (await api.put('/IdentificacionDescripcionProblema/autosave', data)).data,
  })
  function validarFormulario() {
    if (!form.value.problemaCentral.trim()) return 'Debes escribir el problema central'
    if (!form.value.involucrados.trim()) return 'Debes capturar a los involucrados'
    return null
  }

  async function submitForm() {
    if (loading.value) return
    const validation = validarFormulario()
    if (validation) {
      Notify.create({ type: 'warning', message: validation })
      return
    }
    loading.value = true
    try {
      await guardarDatos()
      Notify.create({ type: 'positive', message: 'Identificación guardada correctamente' })
      await router.push('/formulario-determinacion-justificacion')
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response?.data?.message || 'No se pudo guardar. Tu borrador se conserva.',
      })
    } finally {
      loading.value = false
    }
  }
  const saving = autosaveLoading
  return {
    router,
    loading,
    form,
    guardarDatos,
    autosaveLoading,
    validarFormulario,
    submitForm,
    saving,
  }
}
