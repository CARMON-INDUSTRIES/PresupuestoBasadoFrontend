import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import * as Vue from 'vue'
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc'
import { createSaveQueue } from '../src/utils/saveQueue.js'

// Sin red ni escrituras en la API: se montan formularios con un servidor simulado.
const values = new Map([
  ['userNameActual', 'ana'],
  ['token', 'ana-token'],
])
const storage = {
  getItem: (k) => values.get(k) ?? null,
  setItem: (k, v) => values.set(k, String(v)),
  removeItem: (k) => values.delete(k),
}
const calls = [],
  notices = [],
  errors = [],
  guards = []
const records = new Map()
const router = {
  push: async (p) => calls.push(['navigate', p]),
  resolve: () => ({ matched: [{ meta: { requiresAuth: true } }] }),
}
const api = {
  get: async (url) => {
    calls.push(['get', url])
    if (records.has(url)) return { data: structuredClone(records.get(url)) }
    throw { response: { status: 404 } }
  },
  post: async (url, data) => {
    calls.push(['post', url, JSON.parse(JSON.stringify(data))])
    return { data: { id: 1, token: 'ana-token', username: 'ana' } }
  },
  put: async (url, data) => {
    calls.push(['put', url, JSON.parse(JSON.stringify(data))])
    return { data }
  },
}
const context = vm.createContext({
  console: { log() {}, warn() {}, error() {} },
  localStorage: storage,
  sessionStorage: storage,
  structuredClone,
  setTimeout,
  clearTimeout,
  URL,
  Blob,
  FormData,
  window: { location: { hostname: 'localhost' }, addEventListener() {}, removeEventListener() {} },
  fetch: async () => ({ ok: true, json: async () => [] }),
  process: { env: { NODE_ENV: 'test' } },
})
const modules = new Map()
function synthetic(key, exports) {
  const m = new vm.SyntheticModule(
    Object.keys(exports),
    function () {
      for (const [k, v] of Object.entries(exports)) this.setExport(k, v)
    },
    { context, identifier: key },
  )
  modules.set(key, m)
  return m
}
synthetic('vue', Vue)
synthetic('quasar', {
  Notify: { create: (n) => notices.push(n) },
  useQuasar: () => ({ notify: (n) => notices.push(n) }),
})
synthetic('vue-router', { useRouter: () => router, onBeforeRouteLeave: (fn) => guards.push(fn) })
synthetic('sweetalert2', {
  default: { fire: async () => ({ isConfirmed: true }), DismissReason: { cancel: 'cancel' } },
})
synthetic(path.resolve('src/boot/api.js'), { default: api, clearApiCache: () => {} })
function resolve(spec, from) {
  if (modules.has(spec)) return spec
  let p = spec.startsWith('src/') ? path.resolve(spec) : path.resolve(path.dirname(from), spec)
  if (!path.extname(p)) p += '.js'
  return p
}
function load(key) {
  if (modules.has(key)) return modules.get(key)
  let source = fs.readFileSync(key, 'utf8')
  if (key.endsWith('.vue')) {
    const { descriptor: d } = parse(source)
    const script =
      d.script || d.scriptSetup
        ? compileScript(d, { id: key, genDefaultAs: '__component__' })
        : { content: 'const __component__ = {}', bindings: {} }
    const template = compileTemplate({
      source: d.template.content,
      filename: key,
      id: key,
      compilerOptions: { bindingMetadata: script.bindings },
      transformAssetUrls: false,
    })
    assert.equal(template.errors.length, 0, key)
    source =
      script.content +
      '\n' +
      template.code.replace('export function render', 'function render') +
      '\n__component__.render=render; export default __component__'
  }
  const m = new vm.SourceTextModule(source, {
    context,
    identifier: key,
    initializeImportMeta: (meta) => {
      meta.env = {}
    },
  })
  modules.set(key, m)
  return m
}
async function moduleAt(p) {
  const m = load(path.resolve(p))
  if (m.status === 'unlinked') await m.link((spec, ref) => load(resolve(spec, ref.identifier)))
  if (m.status === 'linked') await m.evaluate()
  return m.namespace
}
const host = Vue.createRenderer({
  createElement: (tag) => ({ tag, children: [] }),
  createText: (text) => ({ text }),
  createComment: (text) => ({ text }),
  insert: (child, parent) => {
    child.parent = parent
    parent.children.push(child)
  },
  remove: (child) => {
    if (child?.parent) child.parent.children = child.parent.children.filter((c) => c !== child)
  },
  setText: (n, t) => (n.text = t),
  setElementText: (n, t) => (n.text = t),
  parentNode: (n) => n.parent,
  nextSibling: (n) => n.parent?.children[n.parent.children.indexOf(n) + 1] || null,
  patchProp: () => {},
})
const settle = async () => {
  await new Promise((r) => setTimeout(r, 5))
  await Vue.nextTick()
}
function mount(setup) {
  let state
  const app = host.createApp({
    setup() {
      state = setup()
      return () => Vue.h('div')
    },
  })
  app.config.errorHandler = (e) => errors.push(e)
  app.mount({ children: [] })
  return { state, unmount: () => app.unmount() }
}

// La cola no duplica envíos y conserva cambios introducidos durante la petición.
let value = { text: 'uno' },
  release
const writes = []
const queue = createSaveQueue(
  () => value,
  async (data) => {
    writes.push(data)
    if (writes.length === 1) await new Promise((r) => (release = r))
  },
)
const first = queue.flush()
assert.equal(queue.flush(), first)
value = { text: 'dos' }
release()
await first
assert.deepEqual(writes, [{ text: 'uno' }, { text: 'dos' }])
await queue.flush()
assert.equal(writes.length, 2)
let fail = true
const retry = createSaveQueue(
  () => value,
  async () => {
    if (fail) throw Error('offline')
  },
)
await assert.rejects(retry.flush())
assert.equal(retry.isDirty(), true)
fail = false
await retry.flush()
assert.equal(retry.isDirty(), false)

const { useFormularioPersistente, guardarFormulariosPendientes } = await moduleAt(
  'src/composables/useFormularioPersistente.js',
)
let saved = { text: 'servidor' },
  count = 0
function form() {
  const data = Vue.ref({ text: '' })
  const controls = useFormularioPersistente({
    form: data,
    storageKey: 'regression',
    autosave: true,
    delay: 10,
    load: async () => saved,
    save: async (d) => {
      count++
      saved = d
    },
  })
  return { data, ...controls }
}
let page = mount(form)
await settle()
assert.equal(page.state.data.value.text, 'servidor')
assert.equal(count, 0)
page.state.data.value.text = 'guardado'
await guardarFormulariosPendientes()
assert.equal(count, 1)
await new Promise((r) => setTimeout(r, 25))
assert.equal(count, 1)
page.unmount()
storage.removeItem('token')
storage.setItem('token', 'ana-token-new')
page = mount(form)
await settle()
assert.equal(page.state.data.value.text, 'guardado')
page.unmount()
storage.setItem('userNameActual', 'bea')
storage.setItem('token', 'bea-token')
saved = null
page = mount(form)
await settle()
assert.equal(page.state.data.value.text, '')
page.unmount()
storage.setItem('userNameActual', 'ana')
storage.setItem('token', 'ana-token')
saved = { text: 'guardado' }
let finishLoad
page = mount(() => {
  const data = Vue.ref({ text: '' })
  useFormularioPersistente({
    form: data,
    storageKey: 'late',
    load: () => new Promise((r) => (finishLoad = r)),
    save: async () => {},
  })
  return { data }
})
page.state.data.value.text = 'edición durante la carga'
finishLoad({ text: 'dato anterior' })
await settle()
assert.equal(page.state.data.value.text, 'edición durante la carga')
page.unmount()
page = mount(() => {
  const data = Vue.ref({ text: '' })
  const c = useFormularioPersistente({
    form: data,
    storageKey: 'offline',
    autosave: true,
    delay: 10000,
    load: async () => null,
    save: async () => {
      throw Error('offline')
    },
  })
  return { data, ...c }
})
page.state.data.value.text = 'no perder'
assert.equal(await guards.at(-1)({ path: '/otra' }), false)
assert.equal(JSON.parse(storage.getItem('pbr:ana:offline')).data.text, 'no perder')
page.unmount()

// Inicio de sesión: Enter/clic repetidos comparten una única operación.
records.set('/Cuentas/me', {
  userName: 'ana',
  nombreCompleto: 'Ana',
  cargo: 'Dirección',
  unidadesPresupuestales: 'U',
  programaPresupuestario: 'P',
  nombreMatriz: 'M',
  coordinador: 'C',
  unidadAdministrativaId: 1,
  entidadId: 1,
})
const { useLoginPage } = await moduleAt('src/composables/pages/useLoginPage.js')
page = mount(useLoginPage)
page.state.login.value = { user: 'ana', password: 'test-only' }
const before = calls.filter((c) => c[1] === '/Cuentas/Login').length
await Promise.all([page.state.handleLogin(), page.state.handleLogin()])
assert.equal(calls.filter((c) => c[1] === '/Cuentas/Login').length - before, 1)
page.unmount()

// Ficha: recuperar servidor, conservar captura y fuentes; guardar con contrato de la API.
records.set('/MatrizIndicadores/ultimo', {
  filas: [{ nivel: 'Fin', indicadores: 'Indicador', resumenNarrativo: 'MIR' }],
})
records.set('/FichaIndicador', [
  {
    id: 9,
    claveIndicador: 'CLAVE',
    tipoIndicador: 'Estratégico',
    indicadores: [
      {
        nivel: 'Fin',
        dimension: 'Calidad',
        resultadoEsperado: 'Capturado',
        fuenteResultado: 'Fuente guardada',
        metasProgramadas: [{ mes: 1, cantidad: 10, alcanzado: 4 }],
      },
    ],
  },
])
const { useFormularioFichaTecnica1 } = await moduleAt(
  'src/composables/pages/useFormularioFichaTecnica1.js',
)
page = mount(useFormularioFichaTecnica1)
await settle()
assert.equal(page.state.indicadores.value[0].dimension, 'Calidad')
assert.equal(page.state.indicadores.value[0].metasProgramadas[0].alcanzado, 4)
page.state.indicadores.value[0].fuentes.resultadoEsperado = 'Nueva fuente'
await page.state.guardar()
assert.equal(
  calls.findLast((c) => c[1] === '/FichaIndicador' && c[0] === 'post')[2].indicadores[0]
    .fuenteResultado,
  'Nueva fuente',
)
page.unmount()

// Montar las pantallas y sus secciones detecta referencias perdidas al separarlas.
const slotComponent = {
  setup(props, { slots }) {
    return () => Vue.h('div', slots.default?.())
  },
}
const warnings = []
for (const folder of ['src/pages', 'src/layouts'])
  for (const f of fs.readdirSync(folder).filter((f) => f.endsWith('.vue'))) {
    const file = folder + '/' + f
    if (
      [
        'IndexPage.vue',
        'ErrorNotFound.vue',
        'MenuIndicadores.vue',
        'LineaBase.vue',
        'PlanEditor.vue',
        'LandingPage.vue',
        'LoginLayout.vue',
      ].includes(f)
    )
      continue
    const { default: component } = await moduleAt(file)
    const app = host.createApp(component, {
      modelValue: { fuentes: {}, crema: {}, metas: [], metasProgramadas: [] },
      siglas: {},
      lineasAccion: [],
    })
    for (const source of [
      fs.readFileSync(file, 'utf8'),
      ...fs
        .readdirSync('src/components/sections', { recursive: true })
        .filter((p) => p.endsWith('.vue'))
        .map((p) => fs.readFileSync('src/components/sections/' + p, 'utf8')),
    ])
      for (const m of source.matchAll(/<(q-[a-z-]+)/g))
        if (!app._context.components[m[1]]) app.component(m[1], slotComponent)
    if (!app._context.components['q-radio']) app.component('q-radio', slotComponent)
    app.component('router-view', slotComponent)
    app.directive('ripple', {})
    app.directive('close-popup', {})
    app.config.warnHandler = (message) => {
      if (/not defined|Failed to resolve|injection.*not found/.test(message))
        warnings.push(f + ': ' + message)
    }
    app.config.errorHandler = (e) => errors.push(new Error(f + ': ' + e.message))
    app.mount({ children: [] })
    await settle()
    app.unmount()
  }
assert.deepEqual(warnings, [])
assert.deepEqual(errors, [])
console.log(
  'OK: cola, recuperación, cuentas, navegación fallida, login, ficha y montaje de pantallas/secciones.',
)

// La caché evita lecturas duplicadas y se invalida al guardar o cambiar de cuenta.
const { default: axios } = await import('axios')
const cacheContext = vm.createContext({
  localStorage: storage,
  structuredClone,
  process: { env: { NODE_ENV: 'test' } },
})
const axiosModule = new vm.SyntheticModule(
  ['default'],
  function () {
    this.setExport('default', axios)
  },
  { context: cacheContext },
)
const apiModule = new vm.SourceTextModule(fs.readFileSync('src/boot/api.js', 'utf8'), {
  context: cacheContext,
})
await apiModule.link(() => axiosModule)
await apiModule.evaluate()
const cachedApi = apiModule.namespace.default
let requests = 0
cachedApi.defaults.adapter = async (config) => {
  requests++
  await new Promise((resolve) => setTimeout(resolve, 2))
  return { data: { value: requests }, status: 200, statusText: 'OK', headers: {}, config }
}
const [read1, read2] = await Promise.all([
  cachedApi.get('/Cobertura/ultimo'),
  cachedApi.get('/Cobertura/ultimo'),
])
assert.equal(requests, 1)
read1.data.value = 99
assert.equal(read2.data.value, 1)
await cachedApi.put('/Cobertura/autosave', {})
await cachedApi.get('/Cobertura/ultimo')
assert.equal(requests, 3)
storage.setItem('token', 'another-account')
await cachedApi.get('/Cobertura/ultimo')
assert.equal(requests, 4)
for (const directory of ['src/pages', 'src/layouts', 'src/components']) {
  for (const file of fs
    .readdirSync(directory, { recursive: true })
    .filter((file) => file.endsWith('.vue'))) {
    assert.ok(
      fs.readFileSync(path.join(directory, file), 'utf8').split('\n').length <= 150,
      `${file} supera 150 líneas`,
    )
  }
}
console.log('OK: caché, invalidación después de guardar y límite de 150 líneas por componente.')
