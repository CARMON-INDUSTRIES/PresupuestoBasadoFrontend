import { userStorage } from 'src/utils/userStorage'
import { ref, watch, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

export function useFormularioProgramaSocial() {
  const STORAGE_KEY = 'formularioProgramaSocialCompleto'
  const router = useRouter()
  const saving = ref(false)

  const form = ref({
    esProgramaSocial: null,
  })

  const categorias = ref([
    { nombre: 'Alimentación', tipo: '', seleccionado: false },
    { nombre: 'Educación', tipo: '', seleccionado: false },
    { nombre: 'Salud', tipo: '', seleccionado: false },
    { nombre: 'Trabajo', tipo: '', seleccionado: false },
    { nombre: 'Vivienda', tipo: '', seleccionado: false },
    { nombre: 'Seguridad social', tipo: '', seleccionado: false },
    { nombre: 'No discriminación', tipo: '', seleccionado: false },
    { nombre: 'Medio ambiente sano', tipo: '', seleccionado: false },
    { nombre: 'Bienestar económico', tipo: '', seleccionado: false },
  ])

  onMounted(async () => {
    const saved = userStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      form.value = parsed.form ?? form.value
      categorias.value = parsed.categorias ?? categorias.value
    } else {
      try {
        const { data } = await api.get('/ProgramaSocial/ultimo')
        form.value.esProgramaSocial = data.esProgramaSocial
        categorias.value = categorias.value.map((cat) => ({
          ...cat,
          ...data.categorias?.find((c) => c.nombre === cat.nombre),
          seleccionado: !!data.categorias?.some((c) => c.nombre === cat.nombre),
        }))
      } catch (e) {
        if (e.response?.status !== 404)
          Notify.create({ type: 'warning', message: 'No se pudo cargar el programa guardado.' })
      }
    }
  })

  watch(
    [form, categorias],
    () => {
      userStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ form: form.value, categorias: categorias.value }),
      )
    },
    { deep: true },
  )

  async function guardarProgramaSocial() {
    if (saving.value) return
    saving.value = true
    try {
      const payload = {
        esProgramaSocial: form.value.esProgramaSocial,
        categorias: categorias.value
          .filter((cat) => cat.seleccionado)
          .map((cat) => ({
            nombre: cat.nombre,
            tipo: cat.tipo,
          })),
      }

      await api.post('/ProgramaSocial', payload)

      Notify.create({
        type: 'positive',
        message: 'Programa social guardado correctamente',
      })

      userStorage.setItem('ultimaRutaRegistro', '/formulario-padron-beneficiarios')
      router.push('/formulario-padron-beneficiarios')
    } catch (error) {
      console.error(error)
      Notify.create({
        type: 'negative',
        message: 'Error al guardar el programa social',
      })
    } finally {
      saving.value = false
    }
  }
  return { STORAGE_KEY, router, saving, form, categorias, guardarProgramaSocial }
}
