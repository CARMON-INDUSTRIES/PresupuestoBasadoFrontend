import { ref } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'
import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'

export function useFormularioArbolObjetivos(pageExpose) {
  const router = useRouter()
  const loading = ref(false)
  const generandoIA = ref(false)

  const arbolProblemas = ref({
    efectoSuperior: null,
    problemaCentral: null,
    componentes: [],
  })

  const arbolObjetivos = ref({
    fin: '',
    objetivoCentral: '',
    componentes: [],
  })

  function itemToString(item) {
    if (!item) return ''
    return typeof item === 'string' ? item : (item.descripcion ?? '')
  }

  function estaVacioArbolObjetivos(arbol) {
    if (arbol.fin) return false
    if (arbol.objetivoCentral) return false

    return arbol.componentes.every(
      (c) => !c.nombre && c.medios.every((m) => !m) && c.resultados.every((r) => !r),
    )
  }

  async function convertirConIA(textoBase, nivel) {
    if (!textoBase) return ''
    try {
      const { data } = await api.post('/ArbolObjetivos/convertir-positivo', {
        textoBase,
        nivel,
      })
      return data?.textoPositivo || ''
    } catch {
      return ''
    }
  }

  async function generarObjetivosAutomaticamente() {
    generandoIA.value = true

    try {
      if (!arbolObjetivos.value.fin && arbolProblemas.value.efectoSuperior?.descripcion) {
        arbolObjetivos.value.fin = await convertirConIA(
          arbolProblemas.value.efectoSuperior.descripcion,
          'FIN',
        )
      }

      if (
        !arbolObjetivos.value.objetivoCentral &&
        arbolProblemas.value.problemaCentral?.problemaCentral
      ) {
        arbolObjetivos.value.objetivoCentral = await convertirConIA(
          arbolProblemas.value.problemaCentral.problemaCentral,
          'OBJETIVO_CENTRAL',
        )
      }

      for (let i = 0; i < arbolObjetivos.value.componentes.length; i++) {
        const compObj = arbolObjetivos.value.componentes[i]
        const compProb = arbolProblemas.value.componentes[i]

        if (!compObj.nombre && compProb?.nombre) {
          compObj.nombre = await convertirConIA(compProb.nombre, 'COMPONENTE')
        }

        for (let r = 0; r < compObj.resultados.length; r++) {
          if (!compObj.resultados[r] && compProb?.resultados?.[r]) {
            compObj.resultados[r] = await convertirConIA(compProb.resultados[r], 'RESULTADO')
          }
        }

        for (let m = 0; m < compObj.medios.length; m++) {
          if (!compObj.medios[m] && compProb?.acciones?.[m]?.descripcion) {
            compObj.medios[m] = await convertirConIA(compProb.acciones[m].descripcion, 'MEDIO')
          }
        }
      }
    } finally {
      generandoIA.value = false
    }
  }

  // Se conserva la IA para activarla después, sin solicitudes automáticas al entrar.
  pageExpose({ generarObjetivosAutomaticamente, estaVacioArbolObjetivos })
  const { guardarDatos } = useFormularioPersistente({
    form: arbolObjetivos,
    storageKey: 'arbolObjetivos',
    autosave: true,
    load: async () => {
      const endpoints = [
        '/EfectoSuperior/ultimo',
        '/IdentificacionDescripcionProblema/ultimo',
        '/DisenoIntervencionPublica/ultimo',
        '/ArbolObjetivos/ultimo',
      ]
      const [efecto, problema, diseno, guardado] = await Promise.all(
        endpoints.map((url) =>
          api
            .get(url)
            .then((r) => r.data)
            .catch((e) => {
              if (e.response?.status !== 404) throw e
              return null
            }),
        ),
      )
      const componentes = (diseno?.componentes || []).map((c) => ({
        nombre: c.nombre || '',
        acciones: c.acciones || [],
        resultados: c.resultado ? [itemToString(c.resultado)] : [],
      }))
      arbolProblemas.value = { efectoSuperior: efecto, problemaCentral: problema, componentes }
      return (
        guardado || {
          fin: '',
          objetivoCentral: '',
          componentes: componentes.map((c) => ({
            nombre: '',
            medios: c.acciones.map(() => ''),
            resultados: c.resultados.map(() => ''),
          })),
        }
      )
    },
    save: (data) => api.put('/ArbolObjetivos/autosave', data),
  })
  async function guardar() {
    if (loading.value) return
    loading.value = true
    try {
      await guardarDatos()
      await router.push('/formulario-analisis-alternativas')
    } catch {
      Notify.create({
        type: 'negative',
        message: 'No se pudo guardar el árbol; se conserva tu borrador.',
      })
    } finally {
      loading.value = false
    }
  }
  return {
    router,
    loading,
    generandoIA,
    arbolProblemas,
    arbolObjetivos,
    itemToString,
    estaVacioArbolObjetivos,
    convertirConIA,
    generarObjetivosAutomaticamente,
    guardarDatos,
    guardar,
  }
}
