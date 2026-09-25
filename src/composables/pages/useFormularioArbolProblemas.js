import { userStorage } from 'src/utils/userStorage'
import { ref, onMounted, computed } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/boot/api'

export function useFormularioArbolProblemas() {
  const router = useRouter()

  const resumen = ref({
    identificacion: null,
    disenio: null,
    efectoSuperior: null,
  })

  const hayResultados = computed(() => {
    return (
      Array.isArray(resumen.value?.disenio?.componentes) &&
      resumen.value.disenio.componentes.some(
        (c) => Array.isArray(c.resultados) && c.resultados.length > 0,
      )
    )
  })

  function itemToString(item) {
    if (item == null) return ''
    if (typeof item === 'string') return item
    return item.nombre ?? item.Nombre ?? item.descripcion ?? item.Descripcion ?? String(item)
  }

  async function cargarDatos() {
    try {
      const [identificacionRes, disenioRes, efectoRes] = await Promise.all([
        api.get('/IdentificacionDescripcionProblema/ultimo'),
        api.get('/DisenoIntervencionPublica/ultimo'),
        api.get('/EfectoSuperior/ultimo'),
      ])

      const rawDisenio = disenioRes.data ?? {}
      const rawComps = Array.isArray(rawDisenio.componentes)
        ? rawDisenio.componentes
        : Array.isArray(rawDisenio)
          ? rawDisenio
          : []

      const componentesNormalizados = (rawComps || []).map((comp) => {
        const accionesRaw =
          comp.acciones ?? comp.actividades ?? comp.Acciones ?? comp.Actividades ?? []

        const resultadosRaw = comp.resultado
          ? [comp.resultado]
          : (comp.resultados ?? comp.efectos ?? comp.Resultados ?? comp.Efectos ?? [])

        const acciones = Array.isArray(accionesRaw)
          ? accionesRaw
              .map((a) => (typeof a === 'string' ? a : (a.descripcion ?? '')))
              .filter(Boolean)
          : []

        const resultados = Array.isArray(resultadosRaw)
          ? resultadosRaw.map(itemToString).filter(Boolean)
          : []

        const nombre = comp.nombre ?? comp.Nombre ?? itemToString(comp)

        return {
          ...(comp.id ? { id: comp.id } : {}),
          ...comp,
          nombre,
          acciones,
          resultados,
        }
      })

      const disenioNormalizado = {
        ...rawDisenio,
        componentes: componentesNormalizados,
      }

      resumen.value = {
        identificacion: identificacionRes.data ?? null,
        disenio: disenioNormalizado,
        efectoSuperior: efectoRes.data ?? null,
      }

      console.log('Datos Anexo 4 (normalizados):', JSON.parse(JSON.stringify(resumen.value)))
    } catch (err) {
      console.error('Error al cargar Anexo 4:', err)
      Notify.create({ type: 'negative', message: 'Error al cargar datos del Anexo 4' })
    }
  }

  function irArbolObjetivos() {
    userStorage.setItem('ultimaRutaRegistro', '/formulario-arbol-objetivos')
    router.push('/formulario-arbol-objetivos')
  }

  onMounted(() => {
    cargarDatos()
  })
  return { router, resumen, hayResultados, itemToString, cargarDatos, irArbolObjetivos }
}
