import { createApp } from 'vue'

import loadPlugins from '@/vue/plugins'

import loadComponents from '@/vue/components/common'
import loadVersionedComponents from '@/vue/components/AIOSEO_VERSION'

import { loadPiniaStores } from '@/vue/stores'

import App from './App'
import startRouter from '@/vue/router'
import paths from '@/vue/pages/redirects/router/paths'

let app = createApp({ ...App, name: 'Pages/Redirects' })
app     = loadPlugins(app)
app     = loadComponents(app)
app     = loadVersionedComponents(app)

const filteredPaths = paths
	.filter(p => !p.name || ('undefined' !== typeof p.meta && window.aioseo.user.capabilities[p.meta.access]))

filteredPaths[0].redirect = filteredPaths[1].path

const router = startRouter(filteredPaths, app)

// Give the router access to the app.
router.app = app

// Use the router.
app.use(router)

// Use the pinia store.
loadPiniaStores(app, router)

// // Set state from the window object.
app.mount('#aioseo-app')

export default app