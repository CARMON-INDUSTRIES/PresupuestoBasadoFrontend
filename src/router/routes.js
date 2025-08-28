const routes = [
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LandingPage.vue') },
      // Otras páginas del sistema
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/formulario-alineacion',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioAlineacion.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-justificacion',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioJustificacion.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-poblacion',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioPoblacion.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-entorno',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioEntorno.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/resumen-final',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ResumenFinal.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/registro-usuario',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/RegistroUsuario.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-ramo',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioRamo.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-clasificacion',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioClasificacion.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-antecedente',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioAntecedente.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-identificacion-problema',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioIdentificacionProblema.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-determinacion-justificacion',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioDeterminacionJustificacionObjetivos.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-cobertura',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioCobertura.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-diseno-intervencion',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioDisenoIntervencion.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-programa-social',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioProgramaSocial.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-padron-beneficiarios',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioPadronBeneficiarios.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/formulario-reglas-operacion',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioReglasOperacion.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/PoblacionAreaEnfoquePotencial',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/PoblacionAreaEnfoquePotencial.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/FormularioAnalisisInvolucrados',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioAnalisisInvolucrados.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/resumenes',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ResumenesFormularios.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/Formulario-arbol-problemas',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioArbolProblemas.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/Formulario-arbol-objetivos',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/FormularioArbolObjetivos.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
]

export default routes
