import { ref, shallowRef, watch, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { Notify } from 'quasar'
import { storageForUser } from '../utils/userStorage.js'
import { createSaveQueue } from '../utils/saveQueue.js'

export const formSaveStates = shallowRef([])
const activeForms = new Set()
export async function guardarFormulariosPendientes() {
  for (const flush of activeForms) await flush()
}

export function useFormularioPersistente({
  form,
  storageKey,
  load,
  save,
  onSaved,
  autosave = false,
  delay = 1200,
}) {
  const storage = storageForUser()
  const token = localStorage.getItem('token')
  const loading = ref(false)
  const saving = ref(false)
  const saveState = ref('loading')
  let applying = false
  let disposed = false
  let localTimer
  let loadPromise
  let loadFailed = false
  let timer
  let revision = 0
  let persisted
  const original = structuredClone(JSON.parse(JSON.stringify(form.value)))
  const queue = createSaveQueue(
    () => form.value,
    (data) => {
      if (localStorage.getItem('token') !== token) throw new Error('La sesión cambió')
      return save(data)
    },
    (result, snapshot) => {
      const acknowledged = onSaved?.(result, snapshot)
      persist()
      return acknowledged
    },
  )
  function persist(dirty = queue.isDirty()) {
    try {
      storage.setItem(storageKey, JSON.stringify({ data: form.value, dirty }))
    } catch {
      Notify.create({
        type: 'warning',
        message: 'No se pudo conservar el borrador en este navegador.',
      })
    }
  }
  function apply(data) {
    applying = true
    form.value = Array.isArray(original) ? data : { ...original, ...data }
    applying = false
  }
  try {
    persisted = JSON.parse(storage.getItem(storageKey) || 'null')
    if (persisted) apply(persisted.data ?? persisted)
  } catch {
    persisted = null
  }
  if (!persisted?.dirty) queue.markSaved(form.value)
  async function guardarDatos(force = true) {
    await loadPromise
    if (loadFailed) await cargarDatos()
    if (loadFailed) { saveState.value = 'error'; throw new Error('No se pudo recuperar el registro antes de guardar') }
    if (force && !queue.isDirty()) queue.markSaved(undefined)
    clearTimeout(timer)
    saving.value = true
    saveState.value = 'saving'
    try {
      await queue.flush()
      persist(false)
      saveState.value = queue.isDirty() ? 'pending' : 'saved'
      return true
    } catch (error) {
      saveState.value = 'error'
      throw error
    } finally {
      saving.value = false
    }
  }
  function schedule() {
    clearTimeout(timer)
    if (autosave) timer = setTimeout(() => guardarDatos(false).catch(notificarErrorGuardado), delay)
  }
  const stop = watch(
    form,
    () => {
      if (applying) return
      revision++
      saveState.value = 'pending'
      clearTimeout(localTimer)
      localTimer = setTimeout(() => persist(), 200)
      schedule()
    },
    { deep: true, flush: 'sync' },
  )
  async function cargarDatos(preferServer = false) {
    loading.value = true
    loadFailed = false
    const initialRevision = revision
    try {
      const data = await load()
      if (
        disposed ||
        localStorage.getItem('token') !== token ||
        revision !== initialRevision ||
        (persisted?.dirty && !preferServer)
      )
        return
      if (data) apply(data)
      persisted = null
      queue.markSaved(form.value)
      persist(false)
    } catch (error) {
      if (error.response?.status !== 404) {
        loadFailed = true
        Notify.create({
          type: 'warning',
          message: 'No se pudo actualizar la información; se conserva el borrador local.',
        })
      }
    } finally {
      loading.value = false
      saveState.value = loadFailed ? 'error' : queue.isDirty() ? 'pending' : 'ready'
    }
  }
  async function recuperarGuardado() {
    clearTimeout(timer)
    storage.setItem(`${storageKey}:respaldo-conflicto`, JSON.stringify(form.value))
    await cargarDatos(true)
  }
  function notificarErrorGuardado(error) {
    const conflicto = error.response?.status === 409
    Notify.create({
      type: 'warning',
      timeout: conflicto ? 0 : 5000,
      message: conflicto
        ? 'El registro cambió en otra sesión. Puedes cargar lo guardado; conservaremos una copia local de tu borrador.'
        : 'No se pudo guardar. Tu borrador se conserva; vuelve a intentar.',
      actions: conflicto ? [{ label: 'Cargar guardado', handler: recuperarGuardado }] : [],
    })
  }
  const beforeUnload = () => persist()
  onMounted(() => {
    loadPromise = cargarDatos()
    window.addEventListener('beforeunload', beforeUnload)
  })
  onBeforeRouteLeave(async (to) => {
    persist()
    if (!autosave || !queue.isDirty() || to.path === '/login') return true
    try {
      await guardarDatos(false)
      return true
    } catch (error) {
      notificarErrorGuardado(error)
      return false
    }
  })
  const flush = () => {
    persist()
    return autosave && queue.isDirty() ? guardarDatos(false) : Promise.resolve()
  }
  activeForms.add(flush)
  const statusEntry = { key: storageKey, status: saveState, retry: () => guardarDatos(false).catch(notificarErrorGuardado) }
  if (autosave) formSaveStates.value = [...formSaveStates.value, statusEntry]
  onBeforeUnmount(() => {
    disposed = true
    clearTimeout(timer)
    clearTimeout(localTimer)
    window.removeEventListener('beforeunload', beforeUnload)
    stop()
    persist()
    activeForms.delete(flush)
    formSaveStates.value = formSaveStates.value.filter(entry => entry !== statusEntry)
  })
  return { cargarDatos, guardarDatos, loading, saving, notificarErrorGuardado }
}
