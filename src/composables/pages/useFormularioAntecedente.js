import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useFormularioAntecedente() {
  const router = useRouter()
  const loading = ref(false)
  const form = ref({
    descripcionPrograma: '',
    contextoHistoricoNormativo: '',
    problematicaOrigen: '',
    experienciasPrevias: '',
  })

  const { guardarDatos, saving: autosaveLoading } = useFormularioPersistente({
    form,
    storageKey: 'FormularioAntecedente',
    autosave: true,
    load: async () => (await api.get('/Antecedente/ultimo')).data,
    save: async (data) => (await api.put('/Antecedente/autosave', data)).data,
  })
  async function submitForm() {
    if (loading.value) return

    loading.value = true
    try {
      await guardarDatos()
      Notify.create({ type: 'positive', message: 'Antecedentes guardados correctamente' })
      await router.push('/formulario-identificacion-problema')
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response?.data?.message || 'No se pudo guardar. Tu borrador se conserva.',
      })
    } finally {
      loading.value = false
    }
  }
  return { router, loading, form, guardarDatos, autosaveLoading, submitForm }
}
