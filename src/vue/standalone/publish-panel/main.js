import '@/vue/utils/vue2.js'
import { createApp } from 'vue'

import loadPlugins from '@/vue/plugins'

import loadComponents from '@/vue/components/common'
import loadVersionedComponents from '@/vue/components/AIOSEO_VERSION'

import PrePublish from './PrePublish.vue'
import PostPublish from './PostPublish.vue'

import store from '@/vue/store'
import './registerPublishPanel.js'
import loadTruSeo from '@/vue/standalone/post-settings/loadTruSeo'

import { elemLoaded } from '@/vue/utils/elemLoaded'
import { camelCase } from 'lodash-es'

const loadPublishPanel = block => {
	let app = createApp(block.component)
	app     = loadPlugins(app)
	app     = loadComponents(app)
	app     = loadVersionedComponents(app)

	store._vm  = app
	app.use(store)

	app.mount('#' + block.id)

	window.addEventListener('load', () => {
		// The currentPost state hasn't loaded here yet so we need to prevent that we clear out the hidden post data field.
		loadTruSeo(app, false)
	})

	return app
}

if (window.aioseo.currentPost && 'post' === window.aioseo.currentPost.context) {
	const blockEditorMap = [
		{ id: 'aioseo-pre-publish', component: PrePublish },
		{ id: 'aioseo-document-setting', component: PrePublish },
		{ id: 'aioseo-post-publish', component: PostPublish }
	]

	blockEditorMap.forEach(block => {
		if (!document.getElementById(block.id)) {
			elemLoaded('#' + block.id, camelCase(block.id))
			document.addEventListener('animationstart', function (event) {
				if (camelCase(block.id) === event.animationName) {
					loadPublishPanel(block)
				}
			}, { passive: true })
		} else {
			loadPublishPanel(block)
		}
	})
}