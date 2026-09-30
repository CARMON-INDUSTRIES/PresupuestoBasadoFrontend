import { ref, watch, onBeforeUnmount } from 'vue'
import { Notify } from 'quasar'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import api from 'src/boot/api'
import { useFormularioPersistente } from 'src/composables/useFormularioPersistente'
import {
  itemToString,
  normalizarComponentes,
  completarEstructura,
  destinosVacios,
  aplicarPropuestas,
} from 'src/utils/arbolObjetivos'

export function useFormularioArbolObjetivos(pageExpose) {
  const router = useRouter()
  const loading = ref(false)
  const generandoIA = ref(false)
  const fuentesListas = ref(false)
  const token = localStorage.getItem('token')
  let solicitud
  const arbolProblemas = ref({ efectoSuperior: null, problemaCentral: null, componentes: [] })
  const arbolObjetivos = ref({ fin: '', objetivoCentral: '', componentes: [] })

  function estaVacioArbolObjetivos(arbol) {
    return (
      !arbol.fin &&
      !arbol.objetivoCentral &&
      arbol.componentes.every(
        (c) => !c.nombre && c.medios.every((m) => !m) && c.resultados.every((r) => !r),
      )
    )
  }
  async function convertirConIA(textoBase, nivel) {
    if (!itemToString(textoBase)) return ''
    const { data } = await api.post(
      '/ArbolObjetivos/convertir-positivo',
      { textoBase: itemToString(textoBase), nivel },
      { timeout: 65000 },
    )
    if (!data?.textoPositivo?.trim()) throw new Error('La IA no devolvió un texto válido.')
    return data.textoPositivo.trim()
  }
  onBeforeRouteLeave(() => {
    if (!generandoIA.value) return true
    Notify.create({
      type: 'info',
      message: 'Espera a que termine la generación antes de cambiar de pantalla.',
    })
    return false
  })
  onBeforeUnmount(() => solicitud?.abort())
  const { guardarDatos, loading: cargandoDatos } = useFormularioPersistente({
    form: arbolObjetivos,
    storageKey: 'arbolObjetivos',
    autosave: true,
    load: async () => {
      fuentesListas.value = false
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
      const componentes = normalizarComponentes(diseno)
      arbolProblemas.value = { efectoSuperior: efecto, problemaCentral: problema, componentes }
      fuentesListas.value = true
      return completarEstructura(guardado, componentes)
    },
    save: (data) => api.put('/ArbolObjetivos/autosave', data),
  })
  // También completar un borrador local pendiente sin sustituir sus textos por los del servidor.
  watch(cargandoDatos, (cargando) => {
    if (!cargando && fuentesListas.value) {
      const completo = completarEstructura(arbolObjetivos.value, arbolProblemas.value.componentes)
      if (JSON.stringify(completo) !== JSON.stringify(arbolObjetivos.value))
        arbolObjetivos.value = completo
    }
  })
  async function generarObjetivosAutomaticamente() {
    if (generandoIA.value || loading.value || cargandoDatos.value || !fuentesListas.value) return
    const destinos = destinosVacios(arbolProblemas.value, arbolObjetivos.value)
    if (!destinos.length) {
      Notify.create({
        type: 'info',
        message: 'No hay campos vacíos con un texto de origen para convertir.',
      })
      return
    }
    if (
      destinos.length > 100 ||
      destinos.some((d) => d.nodo.textoBase.length > 4000) ||
      destinos.reduce((total, d) => total + d.nodo.textoBase.length, 0) > 60000
    ) {
      Notify.create({
        type: 'warning',
        message:
          'La IA admite hasta 100 textos de 4000 caracteres y 60000 caracteres en total. Puedes completar el árbol manualmente.',
      })
      return
    }
    generandoIA.value = true
    solicitud = new AbortController()
    try {
      const { data } = await api.post(
        '/ArbolObjetivos/convertir-arbol',
        destinos.map((d) => d.nodo),
        { timeout: 65000, signal: solicitud.signal },
      )
      if (solicitud.signal.aborted || localStorage.getItem('token') !== token) return
      const cantidad = aplicarPropuestas(destinos, data)
      try {
        await guardarDatos()
        Notify.create({
          type: 'positive',
          message: `${cantidad} campos completados y guardados. Revisa la redacción antes de continuar.`,
        })
      } catch {
        Notify.create({
          type: 'warning',
          message:
            'La propuesta está en tu borrador, pero no se pudo guardar en el servidor. Pulsa Guardar para reintentar.',
        })
      }
    } catch (error) {
      if (!solicitud.signal.aborted && localStorage.getItem('token') === token)
        Notify.create({
          type: 'negative',
          message:
            error.response?.data?.mensaje ||
            'No se pudo generar una propuesta completa. Puedes reintentar o continuar manualmente.',
        })
    } finally {
      generandoIA.value = false
    }
  }
  async function guardar() {
    if (loading.value || generandoIA.value || cargandoDatos.value) return
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
  pageExpose({ generarObjetivosAutomaticamente, estaVacioArbolObjetivos })
  return {
    router,
    loading,
    generandoIA,
    cargandoDatos,
    fuentesListas,
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
