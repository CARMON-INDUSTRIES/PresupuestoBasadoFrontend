import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useFormularioDeterminacionJustificacionObjetivos() {
  const router = useRouter()
  const loading = ref(false)

  const form = ref({
    objetivosEspecificos: '',
    relacionOtrosProgramas: '',
  })

  const { guardarDatos, saving: autosaveLoading } = useFormularioPersistente({
    form,
    storageKey: 'FormularioDeterminacionJustificacionObjetivos',
    autosave: true,
    load: async () => (await api.get('/DeterminacionJustificacionObjetivos/ultimo')).data,
    save: async (data) =>
      (await api.put('/DeterminacionJustificacionObjetivos/autosave', data)).data,
  })
  function validarFormulario() {
    if (!form.value.objetivosEspecificos?.trim()) {
      return 'Debes capturar los objetivos específicos'
    }
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
      Notify.create({ type: 'positive', message: 'Objetivos guardados correctamente' })
      await router.push('/formulario-cobertura')
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response?.data?.message || 'No se pudo guardar. Tu borrador se conserva.',
      })
    } finally {
      loading.value = false
    }
  }
  return { router, loading, form, guardarDatos, autosaveLoading, validarFormulario, submitForm }
}
