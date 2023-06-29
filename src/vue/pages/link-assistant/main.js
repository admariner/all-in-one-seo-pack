import '@/vue/utils/vue2.js'
import { createApp } from 'vue'

import loadPlugins from '@/vue/plugins'

import loadComponents from '@/vue/components/common'
import loadVersionedComponents from '@/vue/components/AIOSEO_VERSION'

import { loadPiniaStores } from '@/vue/stores'

import App from './App.vue'
import startRouter from '@/vue/router'
import paths from '@/vue/pages/link-assistant/router/paths'

let app = createApp({ ...App, name: 'Pages/LinkAssistant' })
app     = loadPlugins(app)
app     = loadComponents(app)
app     = loadVersionedComponents(app)

const router = startRouter(paths, app)

// Give the router access to the app.
router.app = app

// Use the router.
app.use(router)

// Use the pinia store.
loadPiniaStores(app, router)

// // Set state from the window object.
app.mount('#aioseo-app')

export default app