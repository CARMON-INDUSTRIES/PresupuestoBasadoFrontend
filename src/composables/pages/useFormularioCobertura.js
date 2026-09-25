import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useFormularioCobertura() {
  const router = useRouter()
  const loading = ref(false)

  const frecuencias = [
    { label: 'Mensual', value: 'Mensual' },
    { label: 'Trimestral', value: 'Trimestral' },
    { label: 'Semestral', value: 'Semestral' },
    { label: 'Anual', value: 'Anual' },
  ]

  const form = ref({
    identificacionCaracterizacionPoblacionPotencial: '',
    identificacionCaracterizacionPoblacionObjetivo: '',
    cuantificacionPoblacionPotencial: null,
    cuantificacionPoblacionObjetivo: null,
    cuantificacionPoblacionAtendidaAnterior: null,
    unidadMedida: '',
    frecuenciaActualizacion: '',
    procesoIdentificacionPoblacionPotencial: '',
    procesoIdentificacionPoblacionObjetivo: '',
  })

  const { guardarDatos, saving: autosaveLoading } = useFormularioPersistente({
    form,
    storageKey: 'FormularioCobertura',
    autosave: true,
    load: async () => (await api.get('/Cobertura/ultimo')).data,
    save: async (data) => (await api.put('/Cobertura/autosave', data)).data,
  })
  function validarFormulario() {
    if (!form.value.unidadMedida?.trim()) {
      return 'La unidad de medida es obligatoria'
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
      Notify.create({ type: 'positive', message: 'Cobertura guardada correctamente' })
      await router.push('/formulario-diseno-intervencion')
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response?.data?.message || 'No se pudo guardar. Tu borrador se conserva.',
      })
    } finally {
      loading.value = false
    }
  }
  return {
    router,
    loading,
    frecuencias,
    form,
    guardarDatos,
    autosaveLoading,
    validarFormulario,
    submitForm,
  }
}
