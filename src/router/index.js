import { userStorage } from 'src/utils/userStorage'
import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.afterEach((to, from, failure) => {
    if (
      !failure &&
      to.matched.some((record) => record.meta.requiresAuth) &&
      to.path !== '/registro-usuario-detalle'
    ) {
      userStorage.setItem('ultimaRutaRegistro', to.path)
    }
  })

  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const token = localStorage.getItem('token')

    if (requiresAuth && !token) {
      next('/') // Redirige al login si no hay token
      return
    }

    next()
  })

  return Router
})
