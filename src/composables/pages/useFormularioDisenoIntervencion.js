import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useFormularioDisenoIntervencion() {
  const router = useRouter()
  const loading = ref(false)
  const showModal = ref(false)
  const modoEdicion = ref(false)
  const indiceEditando = ref(null)

  const form = ref({
    componentes: [],
    etapasIntervencion: '',
    escenariosFuturosEsperar: '',
  })

  const nuevoComponente = ref({
    nombre: '',
    acciones: [{ nombre: '', cantidad: 0 }],
    resultado: '',
  })

  const proximoIndiceComp = computed(() => form.value.componentes.length + 1)

  const { guardarDatos, saving: autosaveLoading } = useFormularioPersistente({
    form,
    storageKey: 'FormularioDisenoIntervencion',
    autosave: true,
    load: async () => (await api.get('/DisenoIntervencionPublica/ultimo')).data,
    save: async (data) => (await api.put('/DisenoIntervencionPublica/autosave', data)).data,
  })
  function editarComponente(comp, index) {
    modoEdicion.value = true
    indiceEditando.value = index

    nuevoComponente.value = {
      nombre: comp.nombre.replace(/^\d+\.\s*/, ''),

      acciones: comp.acciones.map((a) => ({
        nombre: a.descripcion.replace(/^\d+\.\d+\s*/, ''),
        cantidad: a.cantidad,
      })),

      resultado:
        typeof comp.resultado === 'string'
          ? comp.resultado.replace(/^\d+\.\d+\.\d+\s*/, '')
          : comp.resultado.descripcion.replace(/^\d+\.\d+\.\d+\s*/, ''),
    }

    showModal.value = true
  }

  function guardarComponente(continuar = false) {
    if (!nuevoComponente.value.nombre?.trim()) {
      Notify.create({
        type: 'warning',
        message: 'El componente debe tener un nombre',
      })
      return
    }

    const compIndex = modoEdicion.value ? indiceEditando.value + 1 : proximoIndiceComp.value

    const componenteFinal = {
      nombre: `${compIndex}. ${nuevoComponente.value.nombre.trim()}`,

      acciones: nuevoComponente.value.acciones.map((accion, aIdx) => ({
        descripcion: `${compIndex}.${aIdx + 1} ${accion.nombre.trim()}`,
        cantidad: accion.cantidad ?? 0,
      })),

      resultado: {
        descripcion: `${compIndex}.1.1 ${nuevoComponente.value.resultado.trim()}`,
      },
    }

    if (modoEdicion.value) {
      form.value.componentes[indiceEditando.value] = componenteFinal
    } else {
      form.value.componentes.push(componenteFinal)
    }

    nuevoComponente.value = {
      nombre: '',
      acciones: [{ nombre: '', cantidad: 0 }],
      resultado: '',
    }

    modoEdicion.value = false
    indiceEditando.value = null

    if (!continuar) {
      showModal.value = false
    }
  }

  async function submitForm() {
    if (loading.value) return

    loading.value = true
    try {
      await guardarDatos()
      Notify.create({ type: 'positive', message: 'Diseño guardado correctamente' })
      await router.push('/formulario-reglas-operacion-detalle')
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
    showModal,
    modoEdicion,
    indiceEditando,
    form,
    nuevoComponente,
    proximoIndiceComp,
    guardarDatos,
    autosaveLoading,
    editarComponente,
    guardarComponente,
    submitForm,
  }
}
