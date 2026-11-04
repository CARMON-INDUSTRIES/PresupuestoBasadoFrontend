import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { Quasar, Notify } from 'quasar'
import 'quasar/src/css/index.sass'
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '../../src/css/app.scss'
import App from '../../src/App.vue'
import routes from '../../src/router/routes.js'

// Este origen local sólo usa datos ficticios. No importa el cliente HTTP del sistema.
localStorage.setItem('userNameActual', 'revision-visual')
localStorage.setItem('token', 'solo-vista-local')
createApp(App).use(Quasar, { plugins: { Notify } })
  .use(createRouter({ history: createWebHashHistory(), routes })).mount('#q-app')
