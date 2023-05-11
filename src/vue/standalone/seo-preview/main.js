import '@/vue/utils/vue2.js'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import translate from '@/vue/plugins/translations'

// Router placeholder to prevent errors when using router-link.
const router = createRouter({
	history : createWebHistory(),
	routes  : [
		{
			path      : '/',
			component : App
		}
	]
})

const app = createApp(App)

app.use(router)
router.app = app

app.$t      = app.config.globalProperties.$t      = translate
app.$td     = app.config.globalProperties.$td     = import.meta.env.VITE_TEXTDOMAIN
app.$aioseo = app.config.globalProperties.$aioseo = window.aioseoSeoPreview

const elemDiv = document.createElement('div')

// If building for production.
if (false !== import.meta.env.PROD) {
	const elemShadowWrapper = document.createElement('div')
	const elemShadowRoot = elemShadowWrapper.attachShadow({ mode: 'open' })
	const elemDir = document.createElement('div')

	elemShadowWrapper.setAttribute('class', 'aioseo-seo-preview-shadow-wrapper')
	elemShadowWrapper.setAttribute('style', 'margin:0;padding:0;border:0')
	elemDir.setAttribute('dir', document?.dir || 'ltr')
	elemDir.setAttribute('style', 'margin:0;padding:0;border:0')
	elemShadowRoot.appendChild(elemDir)
	elemDir.appendChild(elemDiv)

	document.body.appendChild(elemShadowWrapper)
} else {
	document.body.appendChild(elemDiv)
}

app.mount(elemDiv)