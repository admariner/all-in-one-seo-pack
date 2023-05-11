import '@/vue/utils/vue2.js'
import { createApp } from 'vue'

import App from './App.vue'

if (document.getElementById('aioseo-admin')) {
	const app = createApp(App)

	app.mount('#aioseo-admin')
}