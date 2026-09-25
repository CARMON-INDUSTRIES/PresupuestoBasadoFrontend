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

  const onTipoChange = async (tipo, restore = true) => {
    const captured = restore
      ? JSON.parse(
          userStorage.getItem(tipo === 'Estado' ? 'alineacionEstatal' : 'alineacionMunicipal') ||
            'null',
        )
      : null
    form.value.acuerdo = null
    form.value.objetivo = null
    form.value.estrategias = []
    form.value.lineasAccion = []
    acuerdos.value = []
    objetivos.value = []
    estrategias.value = []
    lineasAccion.value = []

    if (!tipo) return

    const endpoint = tipo === 'Estado' ? '/PlanEstatal/acuerdos' : '/PlanMunicipal/acuerdos'

    loadingAcuerdos.value = true
    try {
      const { data } = await api.get(endpoint)

      if (!data || data.length === 0) {
        Notify.create({
          type: 'warning',
          message: `No hay acuerdos disponibles para ${tipo}. Contacta al administrador.`,
          timeout: 3000,
        })
        acuerdos.value = []
        return
      }

      acuerdos.value = data.map((a) => ({ label: a.nombre ?? a.Nombre, value: a.id ?? a.Id }))
      if (captured) {
        form.value.tipo = tipo
        await onAcuerdoChange(captured.acuerdo)
        await onObjetivoChange(captured.objetivo)
        await onEstrategiasChange(captured.estrategias || [])
        Object.assign(form.value, captured)
      }
    } catch (error) {
      console.error('Error al cargar acuerdos:', error)

      const mensaje =
        error.response?.status === 401
          ? 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
          : error.response?.status === 403
            ? 'No tienes permisos para acceder a estos datos.'
            : `Error al cargar acuerdos de ${tipo}`

      Notify.create({
        type: 'negative',
        message: mensaje,
        timeout: 3000,
      })

      acuerdos.value = []

      if (error.response?.status === 401) {
        userStorage.removeItem('token')
        setTimeout(() => router.push('/login'), 1500)
      }
    } finally {
      loadingAcuerdos.value = false
    }
  }

  const onAcuerdoChange = async (acuerdoId) => {
    form.value.objetivo = null
    form.value.estrategias = []
    form.value.lineasAccion = []
    objetivos.value = []
    estrategias.value = []
    lineasAccion.value = []

    if (!acuerdoId) return

    const endpoint =
      form.value.tipo === 'Estado'
        ? `/PlanEstatal/acuerdo/${acuerdoId}/objetivos`
        : `/PlanMunicipal/acuerdo/${acuerdoId}/objetivos`

    loadingObjetivos.value = true
    try {
      const { data } = await api.get(endpoint)

      if (!data || data.length === 0) {
        Notify.create({
          type: 'warning',
          message: 'No hay objetivos disponibles para este acuerdo.',
          timeout: 3000,
        })
        objetivos.value = []
        return
      }

      objetivos.value = data.map((o) => ({
        label: o.nombre ?? o.Nombre,
        value: o.id ?? o.Id,
      }))
    } catch (error) {
      console.error('Error al cargar objetivos:', error)
      Notify.create({
        type: 'negative',
        message: 'Error al cargar objetivos',
        timeout: 3000,
      })
      objetivos.value = []
    } finally {
      loadingObjetivos.value = false
    }
  }

  const onObjetivoChange = async (objetivoId) => {
    form.value.estrategias = []
    form.value.lineasAccion = []
    estrategias.value = []
    lineasAccion.value = []

    if (!objetivoId) return

    const endpoint =
      form.value.tipo === 'Estado'
        ? `/PlanEstatal/objetivo/${objetivoId}/estrategias`
        : `/PlanMunicipal/objetivo/${objetivoId}/estrategias`

    loadingEstrategias.value = true
    try {
      const { data } = await api.get(endpoint)

      if (!data || data.length === 0) {
        Notify.create({
          type: 'warning',
          message: 'No hay estrategias disponibles para este objetivo.',
          timeout: 3000,
        })
        estrategias.value = []
        return
      }

      estrategias.value = data.map((e) => ({
        label: e.nombre ?? e.Nombre,
        value: e.id ?? e.Id,
      }))
    } catch (error) {
      console.error('Error al cargar estrategias:', error)
      Notify.create({
        type: 'negative',
        message: 'Error al cargar estrategias',
        timeout: 3000,
      })
      estrategias.value = []
    } finally {
      loadingEstrategias.value = false
    }
  }

  const onEstrategiasChange = async (selectedIds) => {
    form.value.lineasAccion = []
    lineasAccion.value = []

    if (!selectedIds.length) return

    const promises = selectedIds.map((id) => {
      const endpoint =
        form.value.tipo === 'Estado'
          ? `/PlanEstatal/estrategia/${id}/lineas`
          : `/PlanMunicipal/estrategia/${id}/lineas`
      return api.get(endpoint)
    })

    loadingLineas.value = true
    try {
      const results = await Promise.all(promises)
      const allLineas = results.flatMap((r) => r.data)

      if (allLineas.length === 0) {
        Notify.create({
          type: 'warning',
          message: 'No hay líneas de acción disponibles para estas estrategias.',
          timeout: 3000,
        })
        lineasAccion.value = []
        return
      }

      const unique = []
      const idsSet = new Set()
      allLineas.forEach((l) => {
        const val = l.id ?? l.Id
        if (!idsSet.has(val)) {
          idsSet.add(val)
          unique.push({ label: l.nombre ?? l.Nombre, value: val })
        }
      })
      lineasAccion.value = unique
    } catch (error) {
      console.error('Error al cargar líneas de acción:', error)
      Notify.create({
        type: 'negative',
        message: 'Error al cargar líneas de acción',
        timeout: 3000,
      })
      lineasAccion.value = []
    } finally {
      loadingLineas.value = false
    }
  }

  onMounted(async () => {
    const draft = userStorage.getItem(STORAGE_KEY)
    const saved =
      draft && JSON.parse(draft).tipo
        ? draft
        : userStorage.getItem('alineacionMunicipal') || userStorage.getItem('alineacionEstatal')
    if (saved) {
      const snapshot = JSON.parse(saved)
      form.value.tipo = snapshot.tipo
      if (snapshot.tipo) await onTipoChange(snapshot.tipo, false)
      if (snapshot.acuerdo) await onAcuerdoChange(snapshot.acuerdo)
      if (snapshot.objetivo) await onObjetivoChange(snapshot.objetivo)
      if (snapshot.estrategias?.length) await onEstrategiasChange(snapshot.estrategias)
      Object.assign(form.value, snapshot)
    }
    verificarAlineaciones()
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
