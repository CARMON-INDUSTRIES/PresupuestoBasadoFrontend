import { userStorage } from 'src/utils/userStorage'
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import Swal from 'sweetalert2'
import api from 'src/boot/api'

export function useFormularioAlineacion() {
  const router = useRouter()
  const loading = ref(false)
  const loadingAcuerdos = ref(false)
  const loadingObjetivos = ref(false)
  const loadingEstrategias = ref(false)
  const loadingLineas = ref(false)

  const STORAGE_KEY = 'formAlineacion'
  const ramos = ['Recurso Propio', 'Recurso Estatal', 'Recurso Federal']

  const form = ref({
    tipo: '',
    ramo: '',
    acuerdo: null,
    objetivo: null,
    estrategias: [],
    lineasAccion: [],
  })

  const acuerdos = ref([])
  const objetivos = ref([])
  const estrategias = ref([])
  const lineasAccion = ref([])

  const alineacionMunicipalCompleta = ref(false)
  const alineacionEstatalCompleta = ref(false)

  const ambasCompletas = computed(() => {
    return alineacionMunicipalCompleta.value && alineacionEstatalCompleta.value
  })

  const puedeRegistrar = computed(() => {
    return (
      form.value.tipo &&
      form.value.acuerdo &&
      form.value.objetivo &&
      form.value.estrategias.length > 0 &&
      form.value.lineasAccion.length > 0
    )
  })

  function verificarAlineaciones() {
    const m = userStorage.getItem('alineacionMunicipal')
    const e = userStorage.getItem('alineacionEstatal')
    alineacionMunicipalCompleta.value = !!m
    alineacionEstatalCompleta.value = !!e
  }

  function labelFromList(list, id) {
    if (id === null || id === undefined) return ''
    if (Array.isArray(id)) {
      return id.map((i) => labelFromList(list, i)).filter(Boolean)
    }
    const found = list.find((x) => x.value === id)
    return found ? found.label : ''
  }

  const lists = [acuerdos, objetivos, estrategias, lineasAccion]
  const busy = [loadingAcuerdos, loadingObjetivos, loadingEstrategias, loadingLineas]
  const requests = [0, 0, 0, 0]

  function invalidate(from) {
    for (let i = from; i < lists.length; i++) {
      requests[i]++
      lists[i].value = []
      busy[i].value = false
    }
  }

  async function cargarCatalogo(index, paths) {
    if (!paths.length) return
    const version = ++requests[index]
    const plan = form.value.tipo === 'Estado' ? '/PlanEstatal/' : '/PlanMunicipal/'
    busy[index].value = true
    try {
      const results = await Promise.all(paths.map((path) => api.get(plan + path)))
      if (version !== requests[index]) return
      lists[index].value = [
        ...new Map(
          results
            .flatMap((r) => r.data)
            .map((item) => {
              const value = item.id ?? item.Id
              return [value, { value, label: item.nombre ?? item.Nombre }]
            }),
        ).values(),
      ]
    } catch (error) {
      if (version !== requests[index]) return
      Notify.create({
        type: 'negative',
        message:
          error.response?.status === 401
            ? 'Tu sesión ha expirado. Inicia sesión nuevamente.'
            : 'No se pudo cargar el catálogo. Vuelve a seleccionar para reintentar.',
      })
    } finally {
      if (version === requests[index]) busy[index].value = false
    }
  }

  async function restaurar(snapshot) {
    invalidate(0)
    Object.assign(form.value, snapshot)
    await Promise.all([
      cargarCatalogo(0, ['acuerdos']),
      cargarCatalogo(1, snapshot.acuerdo ? ['acuerdo/' + snapshot.acuerdo + '/objetivos'] : []),
      cargarCatalogo(
        2,
        snapshot.objetivo ? ['objetivo/' + snapshot.objetivo + '/estrategias'] : [],
      ),
      cargarCatalogo(
        3,
        (snapshot.estrategias || []).map((id) => 'estrategia/' + id + '/lineas'),
      ),
    ])
  }

  const onTipoChange = async (tipo) => {
    const captured = JSON.parse(
      userStorage.getItem(tipo === 'Estado' ? 'alineacionEstatal' : 'alineacionMunicipal') ||
        'null',
    )
    invalidate(0)
    form.value = {
      tipo,
      ramo: '',
      acuerdo: null,
      objetivo: null,
      estrategias: [],
      lineasAccion: [],
    }
    if (!tipo) return
    if (captured) return restaurar({ ...captured, tipo })
    await cargarCatalogo(0, ['acuerdos'])
  }

  const onAcuerdoChange = async (id) => {
    invalidate(1)
    Object.assign(form.value, { acuerdo: id, objetivo: null, estrategias: [], lineasAccion: [] })
    await cargarCatalogo(1, id ? ['acuerdo/' + id + '/objetivos'] : [])
  }

  const onObjetivoChange = async (id) => {
    invalidate(2)
    Object.assign(form.value, { objetivo: id, estrategias: [], lineasAccion: [] })
    await cargarCatalogo(2, id ? ['objetivo/' + id + '/estrategias'] : [])
  }

  const onEstrategiasChange = async (ids) => {
    invalidate(3)
    Object.assign(form.value, { estrategias: ids, lineasAccion: [] })
    await cargarCatalogo(
      3,
      ids.map((id) => 'estrategia/' + id + '/lineas'),
    )
  }

  onMounted(async () => {
    const draft = userStorage.getItem(STORAGE_KEY)
    const saved =
      draft && JSON.parse(draft).tipo
        ? draft
        : userStorage.getItem('alineacionMunicipal') || userStorage.getItem('alineacionEstatal')
    verificarAlineaciones()
    if (saved) {
      const snapshot = JSON.parse(saved)
      if (snapshot.tipo) await restaurar(snapshot)
    }
  })

  watch(
    form,
    (val) => {
      userStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  async function registrarAlineacion() {
    if (!puedeRegistrar.value) {
      Notify.create({
        type: 'warning',
        message: 'Por favor completa todos los campos antes de registrar',
      })
      return
    }

    const alineacionConLabels = {
      ...form.value,
      acuerdoLabel: labelFromList(acuerdos.value, form.value.acuerdo),
      objetivoLabel: labelFromList(objetivos.value, form.value.objetivo),
      estrategiasLabels: labelFromList(estrategias.value, form.value.estrategias),
      lineasLabels: labelFromList(lineasAccion.value, form.value.lineasAccion),
      lineasSeleccionadas: form.value.lineasAccion
        .map((id) => {
          const item = lineasAccion.value.find((l) => l.value === id)
          return item ? { id: item.value, nombre: item.label } : null
        })
        .filter(Boolean),
    }

    if (form.value.tipo === 'Municipio') {
      userStorage.setItem('LineaMunicipal', JSON.stringify(alineacionConLabels))
      userStorage.setItem('alineacionMunicipal', JSON.stringify(alineacionConLabels))
      Notify.create({
        type: 'positive',
        message: 'Alineación Municipal registrada correctamente',
      })
    } else if (form.value.tipo === 'Estado') {
      userStorage.setItem('LineaEstatal', JSON.stringify(alineacionConLabels))
      userStorage.setItem('alineacionEstatal', JSON.stringify(alineacionConLabels))
      Notify.create({
        type: 'positive',
        message: ' Alineación Estatal registrada correctamente',
      })
    }

    form.value = {
      tipo: '',
      ramo: '',
      acuerdo: null,
      objetivo: null,
      estrategias: [],
      lineasAccion: [],
    }
    acuerdos.value = []
    objetivos.value = []
    estrategias.value = []
    lineasAccion.value = []
    userStorage.removeItem(STORAGE_KEY)

    verificarAlineaciones()
  }

  async function submitForm() {
    if (loading.value) return
    if (!ambasCompletas.value) {
      await Swal.fire({
        icon: 'warning',
        title: 'Falta información',
        text: 'Debes registrar ambas alineaciones (Municipal y Estatal) antes de continuar.',
        confirmButtonColor: '#691b31',
      })
      return
    }

    loading.value = true
    try {
      const alineacionMunicipal = JSON.parse(userStorage.getItem('alineacionMunicipal'))
      const alineacionEstatal = JSON.parse(userStorage.getItem('alineacionEstatal'))

      const alineaciones = [
        { tipo: 'Municipio', data: alineacionMunicipal },
        { tipo: 'Estado', data: alineacionEstatal },
      ]

      for (const alineacion of alineaciones) {
        const endpoint = alineacion.tipo === 'Estado' ? '/AlineacionEstado' : '/AlineacionMunicipio'

        await api.post(endpoint, {
          acuerdo: alineacion.data.acuerdoLabel,
          objetivo: alineacion.data.objetivoLabel,
          estrategia: alineacion.data.estrategiasLabels.join(', '),
          lineaAccion: alineacion.data.lineasLabels.join(', '),
          ramo: alineacion.data.ramo,
        })
      }

      if (alineacionMunicipal?.objetivoLabel) {
        console.log('EFECTO SUPERIOR:', alineacionMunicipal.objetivoLabel)

        await api.post('/EfectoSuperior', {
          descripcion: alineacionMunicipal.objetivoLabel,
        })
      }

      userStorage.removeItem(STORAGE_KEY)

      Notify.create({
        type: 'positive',
        message: 'Alineaciones guardadas correctamente en el sistema',
      })

      router.push('/formulario-clasificacion')
    } catch (error) {
      console.error('Error al guardar alineaciones:', error)
      Notify.create({
        type: 'negative',
        message: error.response?.data?.message || 'Error al guardar las alineaciones',
      })
    } finally {
      loading.value = false
    }
  }
  return {
    router,
    loading,
    loadingAcuerdos,
    loadingObjetivos,
    loadingEstrategias,
    loadingLineas,
    STORAGE_KEY,
    ramos,
    form,
    acuerdos,
    objetivos,
    estrategias,
    lineasAccion,
    alineacionMunicipalCompleta,
    alineacionEstatalCompleta,
    ambasCompletas,
    puedeRegistrar,
    verificarAlineaciones,
    labelFromList,
    onTipoChange,
    onAcuerdoChange,
    onObjetivoChange,
    onEstrategiasChange,
    registrarAlineacion,
    submitForm,
  }
}
