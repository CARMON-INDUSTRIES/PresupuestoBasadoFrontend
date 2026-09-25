import axios from 'axios'

export const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'https://localhost:7125/api'
    : 'https://presupuesto-basado.somee.com/api'
const api = axios.create({ baseURL, timeout: 20000 })
const reads = new Map()
let generation = 0
export function clearApiCache() {
  generation++
  reads.clear()
}
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use((response) => {
  if (!['get', 'head', 'options'].includes(response.config.method)) clearApiCache()
  return response
})
const get = api.get.bind(api)
api.get = (url, config = {}) => {
  if (config.responseType || config.signal || config.headers || config.cache === false)
    return get(url, config)
  const token = localStorage.getItem('token') || ''
  const key = JSON.stringify([token, url, config.params])
  const existing = reads.get(key)
  const clone = (r) => ({ ...r, data: structuredClone(r.data) })
  if (existing && existing.expires > Date.now()) return existing.promise.then(clone)
  const version = generation
  const ttl =
    url === '/Cuentas/me' ||
    /\/(PlanEstatal|PlanMunicipal|ClasificadorFuncional|UnidadAdministrativa|Entidad)(\/|$)/.test(
      url,
    )
      ? 300000
      : 30000
  const entry = { expires: Infinity }
  entry.promise = get(url, config)
    .then((response) => {
      entry.expires = Date.now() + ttl
      if (generation !== version && reads.get(key) === entry) reads.delete(key)
      return response
    })
    .catch((error) => {
      if (reads.get(key) === entry) reads.delete(key)
      throw error
    })
  reads.set(key, entry)
  return entry.promise.then(clone)
}
export default api
