import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { fileURLToPath } from 'node:url'
const path = (relative) => fileURLToPath(new URL(relative, import.meta.url))
export default defineConfig({
  root: path('./'), publicDir: path('../../public'),
  plugins: [vue({ template: { transformAssetUrls } }), quasar({ sassVariables: path('../../src/css/quasar.variables.scss') })],
  resolve: { alias: [
    { find: /^src\/boot\/api(?:\.js)?$/, replacement: path('./api.js') },
    ...['src', 'pages', 'layouts'].map((name) => ({ find: name, replacement: path(name === 'src' ? '../../src' : `../../src/${name}`) })),
  ] },
  define: { 'process.env': JSON.stringify({ NODE_ENV: 'development', CLIENT: true, SERVER: false, MODE: 'spa' }) },
  server: { host: '127.0.0.1', port: 5173, strictPort: true, open: false },
})
