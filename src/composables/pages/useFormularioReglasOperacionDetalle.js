import { userStorage } from 'src/utils/userStorage'
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useFormularioReglasOperacionDetalle() {
  const STORAGE_KEY = 'formularioProgramaSocial'
  const router = useRouter()
  const saving = ref(false)

  const opcionesSiNo = [
    { label: 'Sí', value: 'Sí' },
    { label: 'No', value: 'No' },
  ]

  const form = ref({
    SujetoReglasOperacion: null,
    OtrosSubsidios: null,
    PrestacionServiciosPublicos: null,
    ProvisionBienesPublicos: null,
  })

  onMounted(async () => {
    const saved = userStorage.getItem(STORAGE_KEY)
    if (saved) {
      form.value = JSON.parse(saved)
    } else {
      try {
        const { data } = await api.get('/ReglasOperacionDetalle/ultimo')
        for (const key of Object.keys(form.value))
          form.value[key] = data[key[0].toLowerCase() + key.slice(1)] ?? null
      } catch (e) {
        if (e.response?.status !== 404)
          Notify.create({ type: 'warning', message: 'No se pudo cargar el detalle guardado.' })
      }
    }
  })

  watch(
    form,
    (newVal) => {
      userStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
    },
    { deep: true },
  )

  async function guardarDetalle() {
    if (saving.value) return
    saving.value = true
    try {
      const payload = { ...form.value }
      delete payload.Id

      await api.post('/ReglasOperacionDetalle', payload)

      Notify.create({ type: 'positive', message: 'Detalle guardado correctamente' })
      userStorage.setItem('ultimaRutaRegistro', '/formulario-programa-social')
      router.push('/formulario-programa-social')
    } catch (err) {
      console.error('Error al guardar detalle:', err)
      Notify.create({ type: 'negative', message: 'Error al guardar detalle' })
    } finally {
      saving.value = false
    }
  }
  return { STORAGE_KEY, router, saving, opcionesSiNo, form, guardarDetalle }
}
