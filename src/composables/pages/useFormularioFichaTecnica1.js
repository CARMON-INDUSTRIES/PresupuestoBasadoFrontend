import { reutilizarMirEnFicha } from 'src/utils/reutilizarCaptura'
import { userStorage } from 'src/utils/userStorage'
import { ref, computed } from 'vue'
import { Notify } from 'quasar'
import api from 'src/boot/api'
import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'
import DatosBasicosIndicador from 'src/pages/DatosBasicosIndicador.vue'
import FormulaIndicador from 'src/pages/FormulaIndicador.vue'
import MetasIndicador from 'src/pages/MetasIndicador.vue'
import { reconciliarIndicadores } from 'src/utils/indicadores'
import { prepararFicha, confirmarFicha } from 'src/utils/fichaPersistencia'

export function useFormularioFichaTecnica1() {
  const usuario = ref({})
  const fichaId = ref(0)
  const version = ref('00000000-0000-0000-0000-000000000000')
  const claveIndicador = ref('')
  const tipoIndicador = ref('')
  const indicadores = ref([])
  const indiceSeleccionado = ref(0)

  const siglas = computed(() =>
    Object.fromEntries(
      ['resultadoEsperado', 'numerador', 'denominador'].map((k) => [
        k,
        generarSiglas(indicadorActivo.value?.[k]),
      ]),
    ),
  )
  const loading = ref(false)

  const indicadorActivo = computed({
    get: () => indicadores.value[indiceSeleccionado.value] || null,
    set: (nuevoValor) => {
      indicadores.value[indiceSeleccionado.value] = nuevoValor
    },
  })

  const filtradas = computed(() => {
    const municipal = JSON.parse(userStorage.getItem('LineaMunicipal') || '{}')
    const estatal = JSON.parse(userStorage.getItem('LineaEstatal') || '{}')

    const lineasM =
      municipal.lineasSeleccionadas?.map((l) => ({
        id: l.id,
        lineaAccion: l.nombre,
        tipo: 'Municipal',
      })) || []

    const lineasE =
      estatal.lineasSeleccionadas?.map((l) => ({
        id: l.id,
        lineaAccion: l.nombre,
        tipo: 'Estatal',
      })) || []

    const todas = [...lineasM, ...lineasE]

    return todas.length ? todas : indicadorActivo.value?.lineasAccion || []
  })

  function generarSiglas(texto) {
    if (!texto) return ''
    const blacklist = ['de', 'la', 'el', 'y', 'del', 'para', 'con', 'las', 'los']
    return texto
      .split(/[\s\-/]+/)
      .filter((w) => w && !blacklist.includes(w.toLowerCase()))
      .map((w) => w[0]?.toUpperCase() || '')
      .join('')
  }

  const ficha = computed({
    get: () => ({
      id: fichaId.value,
      version: version.value,
      claveIndicador: claveIndicador.value,
      tipoIndicador: tipoIndicador.value,
      indicadores: indicadores.value,
    }),
    set: (value) => {
      fichaId.value = value.id || 0
      version.value = value.version || '00000000-0000-0000-0000-000000000000'
      claveIndicador.value = value.claveIndicador || ''
      tipoIndicador.value = value.tipoIndicador || ''
      indicadores.value = value.indicadores || []
    },
  })
  const { guardarDatos, notificarErrorGuardado } = useFormularioPersistente({
    form: ficha,
    storageKey: 'fichaIndicador',
    load: async () => {
      const [me, mir, fichas] = await Promise.all([
        api.get('/Cuentas/me'),
        api.get('/MatrizIndicadores/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: {} }
        }),
        api.get('/FichaIndicador', { cache: false }),
      ])
      usuario.value = me.data || {}
      const ultima = [...(fichas.data || [])].sort((a, b) => b.id - a.id)[0]
      const actuales = mir.data?.filas || []
      const filas = actuales.length
        ? reutilizarMirEnFicha(
            actuales.map(({ nivel, indicadores, resumenNarrativo }) => ({
              nivel,
              indicadores,
              resumenNarrativo,
            })),
            ultima?.indicadores || [],
          )
        : ultima?.indicadores || []
      const anteriores = reconciliarIndicadores(
        filas.map(({ nivel }) => ({ nivel })),
        indicadores.value,
      )
      if (actuales.length && filas.length > actuales.length)
        Notify.create({
          type: 'warning',
          message:
            'Se conservaron fichas sin correspondencia con la MIR actual. Revisa los indicadores.',
        })
      const restaurados = filas.map((f, index) => ({
        id: f.id,
        nivel: f.nivel || '',
        resultadoEsperado: f.resumenNarrativo || '',
        dimension: '',
        sentido: '',
        definicion: '',
        unidadMedida: 'Número / Porcentaje',
        rangoValor: '0-100',
        frecuenciaMedicion: '',
        cobertura: 'Municipal',
        numerador: f.numerador || '',
        denominador: f.denominador || '',
        descripcion: f.descripcion || '',

        lineaBaseValor: f.lineaBase?.valor ?? null,
        lineaBaseUnidad: f.lineaBase?.unidad ?? '',
        lineaBaseAnio: f.lineaBase?.anio ?? '',
        lineaBasePeriodo: f.lineaBase?.periodo ?? '',
        ...f,
        metas: f.metas || anteriores[index]?.metas || [],
        metasProgramadas: (f.metasProgramadas?.length
          ? f.metasProgramadas
          : Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, cantidad: 0, alcanzado: 0 }))
        ).map((m, i) => ({ ...anteriores[index]?.metasProgramadas?.[i], ...m })),
        crema: (Object.keys(f.crema || {}).length ? f.crema : anteriores[index]?.crema) || {
          claro: 'No',
          relevante: 'No',
          economico: 'No',
          monitoreable: 'No',
          adecuado: 'No',
        },
        lineaAccionSeleccionada:
          anteriores[index]?.lineaAccionSeleccionada ?? f.lineaAccionSeleccionada ?? null,
        indicadores:
          f.indicadores ||
          anteriores[index]?.indicadores ||
          mir.data?.filas?.[index]?.indicadores ||
          '',
        fuentes: {
          resultadoEsperado: f.fuenteResultado ?? f.fuentes?.resultadoEsperado ?? '',
          numerador: f.fuenteNumerador ?? f.fuentes?.numerador ?? '',
          denominador: f.fuenteDenominador ?? f.fuentes?.denominador ?? '',
        },
        lineasAccion: anteriores[index]?.lineasAccion || f.lineasAccion || [],
      }))
      return {
        id: ultima?.id || 0,
        version: ultima?.version || '00000000-0000-0000-0000-000000000000',
        claveIndicador: ultima?.claveIndicador || claveIndicador.value,
        tipoIndicador:
          ultima?.tipoIndicador ||
          tipoIndicador.value ||
          (/^(fin|prop)/i.test(filas[0]?.nivel || '') ? 'Estratégico' : 'De Gestión'),
        indicadores: restaurados,
      }
    },
    save: (data) =>
      data.id
        ? api.put(`/FichaIndicador/${data.id}`, prepararFicha(data))
        : api.post('/FichaIndicador', prepararFicha(data)),
    onSaved: (response, snapshot) => confirmarFicha(ficha, snapshot, response.data),
  })
  async function guardar() {
    if (loading.value) return
    loading.value = true
    try {
      await guardarDatos()
      Notify.create({ type: 'positive', message: 'Ficha técnica guardada correctamente' })
    } catch (error) {
      notificarErrorGuardado(error)
    } finally {
      loading.value = false
    }
  }
  return {
    usuario,
    claveIndicador,
    tipoIndicador,
    indicadores,
    indiceSeleccionado,
    siglas,
    loading,
    indicadorActivo,
    filtradas,
    generarSiglas,
    ficha,
    guardarDatos,
    guardar,
    DatosBasicosIndicador,
    FormulaIndicador,
    MetasIndicador,
  }
}
