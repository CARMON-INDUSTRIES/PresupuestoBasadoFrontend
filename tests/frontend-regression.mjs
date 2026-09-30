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
  AbortController,
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
    importModuleDynamically: (specifier) => import(specifier),
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

// Catálogos: una respuesta lenta no oculta la que ya terminó.
const originalGet = api.get
let releaseEntity
api.get = (url) =>
  url === '/Entidad'
    ? new Promise((resolve) => {
        releaseEntity = resolve
      })
    : Promise.resolve({ data: [{ id: 1, unidad: 'Unidad visible' }] })
const { useRegistroUsuario } = await moduleAt('src/composables/pages/useRegistroUsuario.js')
page = mount(useRegistroUsuario)
await settle()
assert.equal(page.state.unidades.value[0].id, 1)
assert.equal(page.state.loadingUnidades.value, false)
assert.equal(page.state.loadingEntidad.value, true)
releaseEntity({ data: [] })
await settle()
page.unmount()

// Recuperación paralela y rechazo de respuestas de selecciones anteriores.
const pendingCatalogs = new Map()
api.get = (url) => new Promise((resolve) => pendingCatalogs.set(url, resolve))
storage.setItem(
  'pbr:ana:formAlineacion',
  JSON.stringify({ tipo: 'Estado', acuerdo: 1, objetivo: 2, estrategias: [3], lineasAccion: [4] }),
)
const { useFormularioAlineacion } = await moduleAt(
  'src/composables/pages/useFormularioAlineacion.js',
)
page = mount(useFormularioAlineacion)
assert.equal(pendingCatalogs.size, 4)
for (const resolve of pendingCatalogs.values()) resolve({ data: [{ id: 4, nombre: 'Catálogo' }] })
await settle()
assert.equal(page.state.form.value.lineasAccion[0], 4)
const oldRequest = page.state.onAcuerdoChange(5)
const newRequest = page.state.onAcuerdoChange(6)
pendingCatalogs.get('/PlanEstatal/acuerdo/6/objetivos')({ data: [{ id: 60, nombre: 'Actual' }] })
await newRequest
pendingCatalogs.get('/PlanEstatal/acuerdo/5/objetivos')({ data: [{ id: 50, nombre: 'Antiguo' }] })
await oldRequest
assert.equal(page.state.objetivos.value[0].value, 60)
page.unmount()
storage.removeItem('pbr:ana:formAlineacion')
api.get = originalGet

// MIR/ficha: actualizar títulos, incluir filas nuevas, conservar capturas y texto completo.
const { reconciliarIndicadores } = await moduleAt('src/utils/indicadores.js')
const merged = reconciliarIndicadores(
  [{ nivel: 'Fin: nuevo' }, { nivel: 'Actividad: nueva' }],
  [{ nivel: 'Fin: anterior', definicion: 'Conservar' }],
)
assert.equal(merged.length, 2)
assert.equal(merged[0].definicion, 'Conservar')
const leftovers = reconciliarIndicadores(
  [{ nivel: 'Fin: nuevo' }],
  [{ nivel: 'Actividad: anterior', definicion: 'No borrar' }],
)
assert.equal(leftovers[1].definicion, 'No borrar')
const { useFormularioMatrizIndicadores } = await moduleAt(
  'src/composables/pages/useFormularioMatrizIndicadores.js',
)
page = mount(useFormularioMatrizIndicadores)
await settle()
const narrative = {
  nivel: 'Fin: prueba',
  resumenNarrativo: 'Contribuir al bienestar de toda la población',
}
page.state.abrirModal(narrative)
page.state.guardarNarrativo()
assert.equal(narrative.resumenNarrativo, 'Contribuir al bienestar de toda la población')
page.unmount()
records.set('/MatrizIndicadores/ultimo', {
  filas: [
    { nivel: 'Fin', indicadores: 'Actualizado' },
    { nivel: 'Actividad: nueva', indicadores: 'Nuevo' },
  ],
})
storage.removeItem('pbr:ana:fichaIndicador')
page = mount(useFormularioFichaTecnica1)
await settle()
assert.equal(page.state.indicadores.value.length, 2)
assert.equal(page.state.indicadores.value[0].dimension, 'Calidad')
assert.equal(page.state.indicadores.value[1].indicadores, 'Nuevo')
page.unmount()

// Confirmación: no navegar mientras guarda ni validar cambios posteriores.
const { useFormularioAnalisisAlternativas } = await moduleAt(
  'src/composables/pages/useFormularioAnalisisAlternativas.js',
)
page = mount(useFormularioAnalisisAlternativas)
await settle()
page.state.tabla.value = [
  {
    nombre: 'Componente',
    facultad: 3,
    presupuesto: 3,
    cortoPlazo: 3,
    recursosTecnicos: 3,
    recursosAdm: 3,
    cultural: 3,
    impacto: 3,
  },
]
const originalPost = api.post
let finishConfirmation
api.post = () =>
  new Promise((resolve) => {
    finishConfirmation = resolve
  })
const confirmation = page.state.validarConfirmar()
assert.equal(page.state.saving.value, true)
const navigationCount = calls.filter((c) => c[0] === 'navigate').length
await page.state.continuarFlujo()
assert.equal(calls.filter((c) => c[0] === 'navigate').length, navigationCount)
finishConfirmation({ data: {} })
await confirmation
assert.equal(page.state.confirmado.value, true)
page.state.tabla.value[0].facultad = 1
assert.equal(page.state.confirmado.value, false)
page.unmount()
api.post = originalPost

// PDF parcial: nombre y aviso inequívocos, sin afirmar éxito completo.
const { PDFDocument } = await import('pdf-lib')
const sample = await PDFDocument.create()
sample.addPage()
const pdfBytes = await sample.save()
const downloads = []
context.document = {
  createElement: () => ({
    click() {
      downloads.push(this.download)
    },
  }),
}
api.get = async (url) => {
  if (url.includes('FormatoAlineacion')) throw Error('Servicio no disponible')
  return { data: pdfBytes, headers: { 'content-type': 'application/pdf' } }
}
const { useResumenDownload } = await moduleAt('src/router/useResumenDownload.js')
const pdfDownloads = useResumenDownload()
const noticeStart = notices.length
await pdfDownloads.descargarTodos()
assert.equal(downloads.length, 1)
assert.ok(downloads[0].includes('_INCOMPLETO_'))
assert.ok(
  notices
    .slice(noticeStart)
    .some((n) => n.type === 'warning' && n.message.includes('FormatoAlineacion')),
)
assert.ok(!notices.slice(noticeStart).some((n) => n.type === 'positive'))
assert.equal(pdfDownloads.descargando.value, false)
api.get = originalGet

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

// Guardar formularios conserva catálogos; editarlos sí los invalida.
const beforeCatalog = requests
await cachedApi.get('/UnidadAdministrativa')
await cachedApi.put('/Cobertura/autosave', {})
await cachedApi.get('/UnidadAdministrativa')
assert.equal(requests - beforeCatalog, 2)
await cachedApi.put('/UnidadAdministrativa/1', {})
await cachedApi.get('/UnidadAdministrativa')
assert.equal(requests - beforeCatalog, 4)
console.log(
  'OK: catálogos independientes, restauración paralela, respuestas tardías, sincronización y PDF parcial.',
)

// Gemini: una llamada por árbol, conservar ediciones, no aplicar respuestas parciales ni mezclar sesiones.
const { useFormularioArbolObjetivos } = await moduleAt(
  'src/composables/pages/useFormularioArbolObjetivos.js',
)
const { completarEstructura, normalizarComponentes, destinosVacios, aplicarPropuestas } =
  await import('../src/utils/arbolObjetivos.js')
const fuenteIA = normalizarComponentes({
  componentes: [
    {
      nombre: 'Causa',
      acciones: ['Acción', { nombre: 'Otra' }],
      resultado: { descripcion: 'Efecto' },
    },
  ],
})
const conservado = completarEstructura(
  {
    fin: 'Fin escrito',
    componentes: [
      {
        nombre: 'Nombre escrito',
        medios: ['Medio escrito'],
        resultados: ['Resultado escrito', 'Extra'],
      },
      { nombre: 'Histórico', medios: [], resultados: [] },
    ],
  },
  fuenteIA,
)
assert.equal(conservado.componentes.length, 2)
assert.equal(conservado.componentes[0].medios[0], 'Medio escrito')
assert.equal(conservado.componentes[0].medios[1], '')
assert.equal(conservado.componentes[0].resultados[1], 'Extra')
const vacio = completarEstructura({ componentes: [] }, fuenteIA)
assert.equal(vacio.componentes[0].medios.length, 2)
const destinosIA = destinosVacios({ componentes: fuenteIA }, vacio)
assert.throws(() => aplicarPropuestas(destinosIA, []))
assert.equal(vacio.componentes[0].nombre, '')
const duplicadas = destinosIA.map(() => ({ id: destinosIA[0].nodo.id, textoPositivo: 'Propuesta' }))
assert.throws(() => aplicarPropuestas(destinosIA, duplicadas))
assert.equal(vacio.componentes[0].nombre, '')

storage.setItem('token', 'ana-token')
storage.setItem('userNameActual', 'ana')
values.delete('pbr:ana:arbolObjetivos')
values.delete('arbolObjetivos')
records.set('/EfectoSuperior/ultimo', { descripcion: 'Baja calidad de vida' })
records.set('/IdentificacionDescripcionProblema/ultimo', { problemaCentral: 'Falta de agua' })
records.set('/DisenoIntervencionPublica/ultimo', {
  componentes: [{ nombre: 'Causa', acciones: [{ nombre: 'Acción' }], resultado: 'Efecto' }],
})
records.set('/ArbolObjetivos/ultimo', { fin: 'Fin manual', objetivoCentral: '', componentes: [] })
const postAnteriorIA = api.post
let liberarIA,
  llamadasIA = 0
api.post = async (url, datos) => {
  assert.equal(url, '/ArbolObjetivos/convertir-arbol')
  llamadasIA++
  await new Promise((resolve) => {
    liberarIA = resolve
  })
  return {
    data: [...datos]
      .reverse()
      .map((n) => ({ id: n.id, textoPositivo: 'Positivo: ' + n.textoBase })),
  }
}
let arbolIA = mount(() => useFormularioArbolObjetivos(() => {}))
await settle()
const generacionIA = arbolIA.state.generarObjetivosAutomaticamente()
await arbolIA.state.generarObjetivosAutomaticamente()
assert.equal(llamadasIA, 1)
arbolIA.state.arbolObjetivos.value.objetivoCentral = 'Edición durante generación'
liberarIA()
await generacionIA
assert.equal(arbolIA.state.arbolObjetivos.value.fin, 'Fin manual')
assert.equal(arbolIA.state.arbolObjetivos.value.objetivoCentral, 'Edición durante generación')
assert.equal(arbolIA.state.arbolObjetivos.value.componentes[0].medios[0], 'Positivo: Acción')
assert.ok(
  calls.some(
    ([verb, url, data]) =>
      verb === 'put' &&
      url === '/ArbolObjetivos/autosave' &&
      data.componentes[0]?.medios[0] === 'Positivo: Acción',
  ),
)
await arbolIA.state.generarObjetivosAutomaticamente()
assert.equal(llamadasIA, 1)
records.set(
  '/ArbolObjetivos/ultimo',
  JSON.parse(JSON.stringify(arbolIA.state.arbolObjetivos.value)),
)
arbolIA.unmount()
values.delete('pbr:ana:arbolObjetivos')
arbolIA = mount(() => useFormularioArbolObjetivos(() => {}))
await settle()
assert.equal(arbolIA.state.arbolObjetivos.value.componentes[0].medios[0], 'Positivo: Acción')
arbolIA.state.arbolObjetivos.value.objetivoCentral = ''
api.post = async () => {
  throw { response: { status: 429, data: { mensaje: 'Cuota agotada' } } }
}
await arbolIA.state.generarObjetivosAutomaticamente()
assert.equal(arbolIA.state.arbolObjetivos.value.objetivoCentral, '')
assert.ok(notices.some((n) => n.message === 'Cuota agotada'))
api.post = async () => {
  await new Promise((resolve) => {
    liberarIA = resolve
  })
  return { data: [{ id: 'central', textoPositivo: 'Respuesta tardía' }] }
}
const otraSesionIA = arbolIA.state.generarObjetivosAutomaticamente()
storage.setItem('token', 'otro-token')
liberarIA()
await otraSesionIA
assert.equal(arbolIA.state.arbolObjetivos.value.objetivoCentral, '')
arbolIA.unmount()
api.post = postAnteriorIA
assert.deepEqual(errors, [])
console.log(
  'OK: Gemini por árbol, datos guardados y borradores, ediciones concurrentes, cuotas y cambio de sesión.',
)

// El contrato de IdentificacionDescripcionProblema exige Id numérico, incluso al crear un borrador.
const { useFormularioIdentificacionProblema } = await moduleAt(
  'src/composables/pages/useFormularioIdentificacionProblema.js',
)
const putAntesIdentificacion = api.put
const endpointIdentificacion = '/IdentificacionDescripcionProblema/ultimo'
const textosIdentificacion = {
  problemaCentral: 'Problema de prueba',
  involucrados: 'Causas de prueba',
  causaBeneficiados: 'Beneficiados',
  causaOpositores: 'Opositores',
  causaEjecutores: 'Ejecutores',
  causaIndiferentes: 'Indiferentes',
  efectos: 'Efectos',
  evolucion: 'Evolución',
}
storage.setItem('token', 'ana-token')
storage.setItem('userNameActual', 'ana')
for (const caso of ['nuevo', 'borrador-null', 'existente']) {
  values.delete('pbr:ana:FormularioIdentificacionProblema')
  values.delete('FormularioIdentificacionProblema')
  records.delete(endpointIdentificacion)
  if (caso === 'borrador-null')
    storage.setItem(
      'pbr:ana:FormularioIdentificacionProblema',
      JSON.stringify({
        data: { ...textosIdentificacion, id: null },
        dirty: true,
      }),
    )
  if (caso === 'existente') records.set(endpointIdentificacion, { ...textosIdentificacion, id: 37 })
  let enviadosIdentificacion = 0
  api.put = async (url, data) => {
    assert.equal(url, '/IdentificacionDescripcionProblema/autosave')
    assert.equal(data.id, caso === 'existente' ? 37 : 0, 'Id compatible con int del backend')
    for (const campo of Object.keys(textosIdentificacion))
      assert.equal(typeof data[campo], 'string')
    records.set(endpointIdentificacion, { ...structuredClone(data), id: 37 })
    enviadosIdentificacion++
    return { data }
  }
  const identificacion = mount(useFormularioIdentificacionProblema)
  await settle()
  Object.assign(identificacion.state.form.value, textosIdentificacion)
  identificacion.state.form.value.efectos += ' editados'
  // Antes de corregirlo, esta escritura reproduce el rechazo de id:null.
  await identificacion.state.guardarDatos()
  identificacion.state.form.value.evolucion += ' actualizada'
  await new Promise((resolve) => setTimeout(resolve, 1300))
  assert.equal(enviadosIdentificacion, 2, 'El guardado automático también debe funcionar')
  identificacion.state.form.value.causaBeneficiados += ' actualizados'
  assert.equal(await guards.at(-1)({ path: '/formulario-antecedente' }), true)
  await identificacion.state.submitForm()
  assert.equal(calls.at(-1)[1], '/formulario-determinacion-justificacion')
  assert.equal(records.get(endpointIdentificacion).efectos, 'Efectos editados')
  identificacion.unmount()
}
api.put = putAntesIdentificacion
console.log(
  'OK: identificación nueva, borrador antiguo, actualización, autoguardado y navegación en ambos sentidos.',
)
