import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import api from 'src/boot/api'

export function useEditarComponentes() {
  const router = useRouter()
  const loading = ref(false)
  const showModal = ref(false)

  const componentes = ref([])
  const componenteEdit = ref({
    id: 0,
    nombre: '',
    acciones: [],
    resultado: { id: 0, descripcion: '' },
  })

  const idRegistroDiseno = ref(0)
  let disenoOriginal = {}

  const obtenerComponentes = async () => {
    loading.value = true
    try {
      const res = await api.get('/DisenoIntervencionPublica/ultimo')
      disenoOriginal = res.data
      idRegistroDiseno.value = res.data.id
      componentes.value = res.data.componentes.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        acciones: (c.acciones || []).map((a) => ({
          id: a.id,
          descripcion: a.descripcion,
          cantidad: a.cantidad,
        })),
        resultado: { id: c.resultado?.id || 0, descripcion: c.resultado?.descripcion || '' },
      }))
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response?.data?.message || 'Error al obtener componentes',
      })
    } finally {
      loading.value = false
    }
  }

  const editarComponente = (comp) => {
    componenteEdit.value = JSON.parse(JSON.stringify(comp))
    showModal.value = true
  }

  const guardarEdicionComponente = async () => {
    if (loading.value) return
    if (!componenteEdit.value.nombre.trim()) {
      Notify.create({ type: 'warning', message: 'El componente debe tener un nombre' })
      return
    }

    loading.value = true
    try {
      const index = componentes.value.findIndex((c) => c.id === componenteEdit.value.id)
      if (index !== -1) {
        componentes.value[index] = JSON.parse(JSON.stringify(componenteEdit.value))
      }

      const payload = {
        id: idRegistroDiseno.value,
        componentes: componentes.value,
        etapasIntervencion: disenoOriginal.etapasIntervencion || '',
        escenariosFuturosEsperar: disenoOriginal.escenariosFuturosEsperar || '',
      }

      await api.put(`/DisenoIntervencionPublica/${idRegistroDiseno.value}`, payload)
      Notify.create({ type: 'positive', message: 'Componente actualizado correctamente' })
      showModal.value = false
      await obtenerComponentes()
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response?.data?.message || 'Error al actualizar componente',
      })
    } finally {
      loading.value = false
    }
  }

  obtenerComponentes()
  return {
    router,
    loading,
    showModal,
    componentes,
    componenteEdit,
    idRegistroDiseno,
    disenoOriginal,
    obtenerComponentes,
    editarComponente,
    guardarEdicionComponente,
  }
}
