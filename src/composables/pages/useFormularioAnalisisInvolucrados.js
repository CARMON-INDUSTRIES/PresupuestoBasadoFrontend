import { userStorage } from 'src/utils/userStorage'
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

export function useFormularioAnalisisInvolucrados() {
  const router = useRouter()

  const resumen = ref({
    problemaCentral: '',
    causaBeneficiados: '',
    causaOpositores: '',
    causaEjecutores: '',
    causaIndiferentes: '',
  })

  async function cargarDatos() {
    try {
      const res = await api.get('/IdentificacionDescripcionProblema/ultimo')
      resumen.value = {
        problemaCentral: res.data.problemaCentral,
        causaBeneficiados: res.data.causaBeneficiados,
        causaOpositores: res.data.causaOpositores,
        causaEjecutores: res.data.causaEjecutores,
        causaIndiferentes: res.data.causaIndiferentes,
      }
      console.log('Datos Anexo 3:', resumen.value)
    } catch (err) {
      console.error('Error al cargar datos del Anexo 3:', err)
      Notify.create({ type: 'negative', message: 'Error al cargar datos del Anexo 3' })
    }
  }

  function irArbolProblemas() {
    userStorage.setItem('ultimaRutaRegistro', '/formulario-arbol-problemas')
    router.push('/formulario-arbol-problemas')
  }

  onMounted(() => {
    cargarDatos()
  })
  return { router, resumen, cargarDatos, irArbolProblemas }
}
