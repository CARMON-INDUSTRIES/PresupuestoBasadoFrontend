import { ref } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'
import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'

export function useFormularioMatrizIndicadores() {
  const router = useRouter()
  const loading = ref(false)

  const usuario = ref({})
  const filas = ref([])

  const modalVisible = ref(false)
  const filaSeleccionada = ref(null)
  const camposNarrativos = ref([])
  const labelsNarrativos = ref([])
  const indicadoresTemp = ref('')
  const mediosTemp = ref('')
  const supuestosTemp = ref('')

  const columns = [
    { name: 'nivel', label: 'Nivel', align: 'left' },
    { name: 'resumenNarrativo', label: 'Resumen Narrativo' },
    { name: 'indicadores', label: 'Indicadores (solo nombre)' },
    { name: 'medios', label: 'Medios de verificación' },
    { name: 'supuestos', label: 'Supuestos' },
  ]

  function textoBaseNivel(nivel) {
    if (!nivel) return ''
    if (nivel.startsWith('Fin')) return 'Fin'
    if (nivel.startsWith('Propósito')) return 'Propósito'
    if (nivel.startsWith('Componente')) return 'Componente'
    if (nivel.startsWith('Actividad')) return 'Actividad'
    return nivel
  }

  function crearFila(nivel) {
    return {
      nivel,
      resumenNarrativo: '',
      indicadores: '',
      medios: '',
      supuestos: '',
    }
  }

  function construirEstructura(objetivo) {
    const estructura = []

    estructura.push(`Fin: ${objetivo.fin || ''}`)
    estructura.push(`Propósito: ${objetivo.objetivoCentral || ''}`)

    objetivo.componentes?.forEach((c, ci) => {
      estructura.push(`Componente: ${c?.nombre || `Componente ${ci + 1}`}`)
      c.medios?.forEach((m, mi) => {
        estructura.push(`Actividad: ${m || `Actividad ${mi + 1}`}`)
      })
    })

    return estructura
  }

  const { guardarDatos } = useFormularioPersistente({
    form: filas,
    storageKey: 'matrizIndicadores',
    autosave: true,
    load: async () => {
      const [me, objetivo, matriz] = await Promise.all([
        api.get('/Cuentas/me'),
        api.get('/ArbolObjetivos/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: {} }
        }),
        api.get('/MatrizIndicadores/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
      ])
      usuario.value = me.data || {}
      return matriz.data?.filas ?? construirEstructura(objetivo.data).map(crearFila)
    },
    save: (data) =>
      api.post('/MatrizIndicadores/borrador', {
        UnidadResponsable: usuario.value.nombreMatriz || usuario.value.cargo || '',
        UnidadPresupuestal: usuario.value.unidadesPresupuestales || '',
        ProgramaSectorial: usuario.value.programaSectorial || '',
        ProgramaPresupuestario: usuario.value.programaPresupuestario || '',
        ResponsableMIR: usuario.value.nombreCompleto || '',
        Filas: data,
      }),
  })
  async function guardarMatriz() {
    if (loading.value) return
    loading.value = true
    try {
      await guardarDatos()
      await router.push('/formulario-ficha-tecnica-1')
    } catch {
      Notify.create({
        type: 'negative',
        message: 'No se pudo guardar la MIR; se conserva tu borrador.',
      })
    } finally {
      loading.value = false
    }
  }

  function obtenerLabelsParaNivel(nivel) {
    if (nivel.startsWith('Fin')) return ['Contribuir a un objetivo superior']
    if (nivel.startsWith('Propósito'))
      return ['Sujeto beneficiario', 'Verbo en presente', 'Resultado logrado']
    if (nivel.startsWith('Componente')) return ['Producto o servicio', 'Verbo en participio']
    if (nivel.startsWith('Actividad')) return ['Acción', 'Proceso']
    return ['Texto general']
  }

  function abrirModal(row) {
    filaSeleccionada.value = row
    labelsNarrativos.value = obtenerLabelsParaNivel(row.nivel)

    const partes = (row.resumenNarrativo || '').split(' ')
    camposNarrativos.value = labelsNarrativos.value.map((_, i) => partes[i] ?? '')

    indicadoresTemp.value = row.indicadores || ''
    mediosTemp.value = row.medios || ''
    supuestosTemp.value = row.supuestos || ''

    modalVisible.value = true
  }

  function guardarNarrativo() {
    if (!filaSeleccionada.value) return

    filaSeleccionada.value.resumenNarrativo = camposNarrativos.value.join(' ')
    filaSeleccionada.value.indicadores = indicadoresTemp.value
    filaSeleccionada.value.medios = mediosTemp.value
    filaSeleccionada.value.supuestos = supuestosTemp.value
  }
  return {
    router,
    loading,
    usuario,
    filas,
    modalVisible,
    filaSeleccionada,
    camposNarrativos,
    labelsNarrativos,
    indicadoresTemp,
    mediosTemp,
    supuestosTemp,
    columns,
    textoBaseNivel,
    crearFila,
    construirEstructura,
    guardarDatos,
    guardarMatriz,
    obtenerLabelsParaNivel,
    abrirModal,
    guardarNarrativo,
  }
}
