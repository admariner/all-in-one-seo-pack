import '@/vue/utils/vue2.js'
import { h, createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import loadPlugins from '@/vue/plugins'

import loadComponents from '@/vue/components/common'
import loadVersionedComponents from '@/vue/components/AIOSEO_VERSION'

import { loadPiniaStores } from '@/vue/stores'

import TruSeo from '@/vue/plugins/tru-seo'

import initWatcher from './watcher'
import initLimitModifiedDate from './limit-modified-date'

import App from '@/vue/standalone/post-settings/App.vue'

import { maybeUpdatePost as updatePostData } from '@/vue/plugins/tru-seo/components/helpers'

/**
 * Mount our Component inside the SEO tab.
 *
 * @param {Object} seedprodApp The SeedProd Vue instance.
 * @returns {void}
 */
const mountComponent = (seedprodApp) => {
	// Check whether the route to SEO tab is active. If so, render our Vue component.
	seedprodApp.$watch('$route.name', (newVal) => {
		if ('setup_settings_seo' === newVal) {
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

			let app = createApp({
				name : 'Standalone/SeedProd',
				data () {
					return {
						tableContext  : window.aioseo.currentPost.context,
						screenContext : 'metabox'
					}
				},
				mounted : () => {
					setTimeout(updatePostData)
				},
				render : () => h(App)
			})

			app = loadPlugins(app)
			app = loadComponents(app)
			app = loadVersionedComponents(app)

			app.use(router)

			router.app = app

			// Use the pinia store.
			loadPiniaStores(app, router)

			app.config.globalProperties.$truSeo = new TruSeo()

			app.mount('#seedprod-preview-wrapper .seedprod-settings-page-wrapper')

			// Remove the class to prevent the styles from being applied our app.
			document.querySelector('.seedprod-settings-page-wrapper').classList.remove('seedprod-settings-page-wrapper')
		}
	},
	{
		immediate : true
	})
}

/**
 * Replace the data-href attribute to load our styles.
 *
 * @returns {void}
 */
const fixStyleTag = () => {
	const style = document.getElementById('aioseo-seedprod-common-css')
	if (style) {
		style.setAttribute('href', style.getAttribute('data-href'))
	}
}

/**
 * Init the SeedProd integration.
 *
 * @param {Object} seedprodApp The SeedProd Vue instance.
 * @returns {void}
 */
const init = (seedprodApp) => {
	// Mount our Vue component in the SEO tab.
	mountComponent(seedprodApp)

	// Fix the link tag to load our styles.
	fixStyleTag()

	// Initialize the editor data watcher.
	initWatcher()

	// Initialize the Limit Modified Date integration.
	initLimitModifiedDate(seedprodApp)
}

document.addEventListener('DOMContentLoaded', () => {
	if (window.seedprod_app?._isMounted) {
		init(window.seedprod_app)
	}
})