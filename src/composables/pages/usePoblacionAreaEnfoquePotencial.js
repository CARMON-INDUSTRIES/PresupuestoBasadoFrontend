import { userStorage } from 'src/utils/userStorage'
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

export function usePoblacionAreaEnfoquePotencial() {
  const router = useRouter()
  const resumen = ref({ identificacion: null, cobertura: null })
  const efectoSuperior = ref('')
  const loading = ref(false)
  const objetivoMunicipal = ref(null)

  onMounted(async () => {
    try {
      const [identificacion, cobertura, alineacion, efecto] = await Promise.allSettled([
        api.get('/IdentificacionDescripcionProblema/ultimo'),
        api.get('/Cobertura/ultimo'),
        api.get('/AlineacionMunicipio/ultimo'),
        api.get('/EfectoSuperior/ultimo'),
      ])

      if (identificacion.status === 'fulfilled')
        resumen.value.identificacion = identificacion.value.data
      if (cobertura.status === 'fulfilled') resumen.value.cobertura = cobertura.value.data
      if (alineacion.status === 'fulfilled') {
        objetivoMunicipal.value = alineacion.value.data?.objetivo || ''
        efectoSuperior.value = objetivoMunicipal.value
      }
      if (efecto.status === 'fulfilled')
        efectoSuperior.value = efecto.value.data?.descripcion || efectoSuperior.value
    } catch (error) {
      console.error(error)
      Notify.create({ type: 'negative', message: 'Error al cargar datos del anexo 3' })
    }
  })

  async function guardarEfectoSuperior() {
    if (loading.value) return
    loading.value = true
    try {
      await api.post('/EfectoSuperior', { descripcion: efectoSuperior.value })
      Notify.create({ type: 'positive', message: 'Efecto superior guardado correctamente' })
      userStorage.setItem('ultimaRutaRegistro', '/FormularioAnalisisInvolucrados')
      router.push('/FormularioAnalisisInvolucrados')
    } catch (error) {
      console.error(error)
      Notify.create({ type: 'negative', message: 'Error al guardar efecto superior' })
    } finally {
      loading.value = false
    }
  }
  return { router, resumen, efectoSuperior, loading, objetivoMunicipal, guardarEfectoSuperior }
}
