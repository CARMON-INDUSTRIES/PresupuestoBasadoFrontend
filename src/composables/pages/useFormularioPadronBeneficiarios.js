import { userStorage } from 'src/utils/userStorage'
import { ref, watch, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

export function useFormularioPadronBeneficiarios() {
  const STORAGE_KEY = 'formularioPadronBeneficiarios'
  const router = useRouter()

  const form = ref({
    tienePadron: null,
    ligaInternet: '',
  })
  const archivoSeleccionado = ref(null)
  const subiendo = ref(false)

  onMounted(async () => {
    const saved = userStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      form.value = parsed.form ?? form.value
    } else {
      try {
        form.value = (await api.get('/PadronBeneficiarios/ultimo')).data
      } catch (e) {
        if (e.response?.status !== 404)
          Notify.create({ type: 'warning', message: 'No se pudieron cargar los datos guardados.' })
      }
    }
  })

  watch(
    [form, archivoSeleccionado],
    () => {
      userStorage.setItem(STORAGE_KEY, JSON.stringify({ form: form.value }))
    },
    { deep: true },
  )

  async function guardarPadron() {
    if (subiendo.value) return
    subiendo.value = true
    try {
      const fd = new FormData()
      fd.append('TienePadron', form.value.tienePadron)
      fd.append('LigaInternet', form.value.ligaInternet || '')

      if (archivoSeleccionado.value) {
        const file =
          archivoSeleccionado.value instanceof File
            ? archivoSeleccionado.value
            : archivoSeleccionado.value.file || archivoSeleccionado.value
        fd.append('Archivo', file)
      }

      await api.post('/PadronBeneficiarios', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      Notify.create({
        type: 'positive',
        message: 'Padrón de Beneficiarios guardado correctamente',
      })

      userStorage.setItem('ultimaRutaRegistro', '/formulario-reglas-operacion')
      router.push('/formulario-reglas-operacion')
    } catch (error) {
      console.error(error)
      Notify.create({
        type: 'negative',
        message: 'Error al guardar Padrón de Beneficiarios',
      })
    } finally {
      subiendo.value = false
    }
  }
  return { STORAGE_KEY, router, form, archivoSeleccionado, subiendo, guardarPadron }
}
