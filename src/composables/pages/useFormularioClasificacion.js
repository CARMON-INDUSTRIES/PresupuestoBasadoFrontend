import { userStorage } from 'src/utils/userStorage'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useFormularioClasificacion() {
  const router = useRouter()
  const loading = ref(false)

  const STORAGE_KEY = 'clasificacionFuncionalForm_v1'

  const anioActual = new Date().getFullYear()
  const anios = [anioActual - 1, anioActual, anioActual + 1]
  const opcionesEntregaBienes = [
    'Población General',
    'Administración Pública',
    'Población General y Administración Pública',
  ]

  const form = ref({
    subfuncionId: null,
    subfuncion: '',
    funcionId: null,
    funcion: '',
    finalidadId: null,
    finalidad: '',
    anioOperando: anioActual,
    entregaBienes: '',
  })

  const subfunciones = ref([])
  const funciones = ref([])
  const finalidades = ref([])

  async function cargarSubfunciones() {
    try {
      const { data } = await api.get('/ClasificadorFuncional/subfunciones')
      subfunciones.value = data.map((x) => ({ label: x.nombre, value: x.id }))
    } catch (err) {
      console.error('Error cargando subfunciones', err)
      Notify.create({ type: 'negative', message: 'Error cargando subfunciones' })
    }
  }

  const onSubfuncionChange = async (subfuncionId) => {
    form.value.funcionId = null
    form.value.funcion = ''
    form.value.finalidadId = null
    form.value.finalidad = ''
    funciones.value = []
    finalidades.value = []

    if (!subfuncionId) {
      userStorage.setItem(STORAGE_KEY, JSON.stringify(form.value))
      return
    }

    try {
      const { data } = await api.get(`/ClasificadorFuncional/subfuncion/${subfuncionId}/jerarquia`)

      form.value.subfuncionId = subfuncionId
      form.value.subfuncion =
        data.subfuncionNombre ?? data.subfuncionNombre ?? form.value.subfuncion
      form.value.funcionId = data.funcionId
      form.value.funcion = data.funcionNombre
      form.value.finalidadId = data.finalidadId
      form.value.finalidad = data.finalidadNombre

      funciones.value = [{ label: data.funcionNombre, value: data.funcionId }]
      finalidades.value = [{ label: data.finalidadNombre, value: data.finalidadId }]

      userStorage.setItem(STORAGE_KEY, JSON.stringify(form.value))
    } catch (err) {
      console.error('Error al cargar jerarquía', err)
      Notify.create({ type: 'negative', message: 'Error cargando función y finalidad' })
    }
  }

  function restaurarFormulario() {
    const raw = userStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)

      form.value.anioOperando = parsed.anioOperando ?? form.value.anioOperando
      form.value.entregaBienes = parsed.entregaBienes ?? form.value.entregaBienes

      if (parsed.subfuncionId) {
        form.value.subfuncionId = parsed.subfuncionId
      }
      if (parsed.subfuncion) form.value.subfuncion = parsed.subfuncion
      if (parsed.funcionId) form.value.funcionId = parsed.funcionId
      if (parsed.funcion) form.value.funcion = parsed.funcion
      if (parsed.finalidadId) form.value.finalidadId = parsed.finalidadId
      if (parsed.finalidad) form.value.finalidad = parsed.finalidad

      if (form.value.subfuncionId) {
        onSubfuncionChange(form.value.subfuncionId)
      } else if (form.value.subfuncion) {
        const found = subfunciones.value.find((s) => s.label === form.value.subfuncion)
        if (found) {
          onSubfuncionChange(found.value)
        }
      }
    } catch (err) {
      console.warn('No se pudo parsear el storage:', err)
    }
  }

  watch(
    form,
    (newVal) => {
      try {
        userStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
      } catch (err) {
        console.error('Error guardando en localStorage', err)
      }
    },
    { deep: true },
  )

  async function submitForm() {
    if (loading.value) return
    loading.value = true
    try {
      await api.post('/ClasificacionFuncional', {
        Subfuncion: form.value.subfuncion,
        Funcion: form.value.funcion,
        Finalidad: form.value.finalidad,
        AnioOperando: form.value.anioOperando,
        EntregaBienes: form.value.entregaBienes,
      })

      Notify.create({ type: 'positive', message: 'Clasificación guardada correctamente' })

      userStorage.setItem('ultimaRutaRegistro', '/formulario-antecedente')
      router.push('/formulario-antecedente')
    } catch (error) {
      console.error('Error enviar Clasificación:', error)
      Notify.create({
        type: 'negative',
        message: error.response?.data?.message || 'Error al guardar la clasificación',
      })
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await Promise.all([
      cargarSubfunciones(),
      (async () => {
        if (userStorage.getItem(STORAGE_KEY)) return
        try {
          const { data } = await api.get('/ClasificacionFuncional/ultimo')
          userStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        } catch (e) {
          if (e.response?.status !== 404)
            Notify.create({ type: 'warning', message: 'No se pudo recuperar la clasificación.' })
        }
      })(),
    ])
    restaurarFormulario()
  })
  return {
    router,
    loading,
    STORAGE_KEY,
    anioActual,
    anios,
    opcionesEntregaBienes,
    form,
    subfunciones,
    funciones,
    finalidades,
    cargarSubfunciones,
    onSubfuncionChange,
    restaurarFormulario,
    submitForm,
  }
}
