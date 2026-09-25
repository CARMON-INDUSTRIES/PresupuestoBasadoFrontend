import { userStorage } from 'src/utils/userStorage'
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import Swal from 'sweetalert2'
import api from 'src/boot/api'
import { useRouter } from 'vue-router'

export function useFormularioAnalisisAlternativas() {
  const router = useRouter()
  const tabla = ref([])
  const confirmado = ref(false)
  const saving = ref(false)

  const columns = [
    { name: 'nombre', label: 'Alternativas (Componentes y Actividades)', align: 'left' },
    { name: 'facultad', label: 'a) Facultad Jurídica', editable: true },
    { name: 'presupuesto', label: 'b) Presupuesto Disponible', editable: true },
    { name: 'cortoPlazo', label: 'c) Realizable en Corto Plazo', editable: true },
    { name: 'recursosTecnicos', label: 'd) Recursos Técnicos', editable: true },
    { name: 'recursosAdm', label: 'e) Recursos Administrativos', editable: true },
    { name: 'cultural', label: 'f) Cultural y Socialmente Aceptable', editable: true },
    { name: 'impacto', label: 'g) Estudio de Impacto', editable: true },
    { name: 'total', label: 'Total', align: 'center' },
    { name: 'probabilidad', label: 'Probabilidad de Éxito', align: 'center' },
  ]

  const opciones = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: 'N/A', value: 0 },
  ]

  onMounted(async () => {
    try {
      const [res, saved] = await Promise.all([
        api.get('/DisenoIntervencionPublica/ultimo'),
        api.get('/AnalisisAlternativas/ultimo').catch((e) => {
          if (e.response?.status !== 404) throw e
          return { data: null }
        }),
      ])
      const comps = res.data.componentes || []

      const estructuraNueva = comps.flatMap((c) => {
        const filaComponente = {
          nombre: `Componente: ${c.nombre}`,
          facultad: 0,
          presupuesto: 0,
          cortoPlazo: 0,
          recursosTecnicos: 0,
          recursosAdm: 0,
          cultural: 0,
          impacto: 0,
        }

        const filasActividades = (c.acciones || []).map((a) => {
          const actividadNombre =
            typeof a === 'string' ? a : (a.nombre ?? a.titulo ?? a.descripcion ?? JSON.stringify(a))

          return {
            nombre: `Actividad: ${actividadNombre}`,
            facultad: 0,
            presupuesto: 0,
            cortoPlazo: 0,
            recursosTecnicos: 0,
            recursosAdm: 0,
            cultural: 0,
            impacto: 0,
          }
        })

        return [filaComponente, ...filasActividades]
      })

      const borrador = saved.data

      if (borrador && Array.isArray(borrador.alternativas)) {
        const mapa = new Map()
        borrador.alternativas.forEach((a) => mapa.set(a.nombre, a))

        tabla.value = estructuraNueva.map((fila) => {
          const existente = mapa.get(fila.nombre)

          if (!existente) return fila

          return {
            nombre: fila.nombre,
            facultad: existente.facultad ?? 0,
            presupuesto: existente.presupuesto ?? 0,
            cortoPlazo: existente.cortoPlazo ?? 0,
            recursosTecnicos: existente.recursosTecnicos ?? 0,
            recursosAdm: existente.recursosAdministrativos ?? 0,
            cultural: existente.culturalSocial ?? 0,
            impacto: existente.impacto ?? 0,
          }
        })
      } else {
        tabla.value = estructuraNueva
      }
    } catch (error) {
      console.error('Error al cargar alternativas:', error)
      Notify.create({
        type: 'negative',
        message: 'Error al cargar alternativas',
      })
    }
  })

  function calcularTotal(row) {
    const valores = [
      row.facultad,
      row.presupuesto,
      row.cortoPlazo,
      row.recursosTecnicos,
      row.recursosAdm,
      row.cultural,
      row.impacto,
    ]
    return valores.reduce((sum, v) => sum + (v || 0), 0)
  }

  function calcularProbabilidad(row) {
    const valores = [
      row.facultad,
      row.presupuesto,
      row.cortoPlazo,
      row.recursosTecnicos,
      row.recursosAdm,
      row.cultural,
      row.impacto,
    ]
    const criteriosValidos = valores.filter((v) => v !== 0)
    const maximo = criteriosValidos.length * 3
    const obtenido = criteriosValidos.reduce((sum, v) => sum + (v || 0), 0)
    return maximo > 0 ? Math.round((obtenido / maximo) * 100) : 0
  }

  function getColor(valor) {
    if (valor <= 70) return 'red'
    if (valor <= 85) return 'orange'
    return 'green'
  }

  async function guardarAnalisis() {
    if (saving.value) return false
    saving.value = true
    try {
      const payload = {
        alternativas: tabla.value.map((row) => ({
          nombre: row.nombre,
          facultad: row.facultad || 0,
          presupuesto: row.presupuesto || 0,
          cortoPlazo: row.cortoPlazo || 0,
          recursosAdministrativos: row.recursosAdm || 0,
          recursosTecnicos: row.recursosTecnicos || 0,
          culturalSocial: row.cultural || 0,
          impacto: row.impacto || 0,
        })),
      }

      await api.post('/AnalisisAlternativas', payload)
      confirmado.value = true
      return true
    } catch (e) {
      console.error('Error al guardar Anexo 6:', e)
      Notify.create({ type: 'negative', message: 'Error al guardar Anexo 6' })
      return false
    } finally {
      saving.value = false
    }
  }

  function validarConfirmar() {
    const porcentajes = tabla.value
      .map((row) => {
        const valores = [
          row.facultad,
          row.presupuesto,
          row.cortoPlazo,
          row.recursosTecnicos,
          row.recursosAdm,
          row.cultural,
          row.impacto,
        ]
        const criteriosValidos = valores.filter((v) => v !== 0)
        if (criteriosValidos.length === 0) return null
        const maximo = criteriosValidos.length * 3
        const obtenido = criteriosValidos.reduce((sum, v) => sum + (v || 0), 0)
        return Math.round((obtenido / maximo) * 100)
      })
      .filter((p) => p !== null)

    if (porcentajes.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin criterios capturados',
        text: 'Captura al menos una fila antes de confirmar.',
        confirmButtonText: 'OK',
      })
      return
    }

    const tieneRojo = porcentajes.some((p) => p <= 69.99)
    const tieneAmarillo = porcentajes.some((p) => p >= 70 && p <= 84)

    if (tieneRojo) {
      Swal.fire({
        icon: 'error',
        title: 'Correcciones necesarias',
        text: 'Existen alternativas en rojo (≤70%). Debes corregir antes de continuar.',
        confirmButtonText: 'Regresar',
      }).then(() => router.push('/formulario-editar-componentes'))
    } else if (tieneAmarillo) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Hay alternativas en amarillo (71–85%). ¿Confirmar de todas formas?',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Corregir',
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (!(await guardarAnalisis())) return
          Swal.fire('Confirmado', 'Se guardó el análisis correctamente.', 'success')
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          router.push('/formulario-editar-componentes')
        }
      })
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Todo en orden!',
        text: 'Todas las alternativas están en verde.',
        confirmButtonText: 'OK',
      }).then(() => {
        guardarAnalisis()
      })
    }
  }

  async function continuarFlujo() {
    if (!confirmado.value) {
      Swal.fire({
        icon: 'info',
        title: 'Primero confirma',
        text: 'Debes presionar "Confirmar" antes de continuar.',
      })
      return
    }
    if (!(await guardarAnalisis())) return
    userStorage.setItem('ultimaRutaRegistro', '/formulario-estructura-analitica')
    router.push('/formulario-estructura-analitica')
  }
  return {
    router,
    tabla,
    confirmado,
    saving,
    columns,
    opciones,
    calcularTotal,
    calcularProbabilidad,
    getColor,
    guardarAnalisis,
    validarConfirmar,
    continuarFlujo,
  }
}
