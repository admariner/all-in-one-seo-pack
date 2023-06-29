import {
	usePostEditorStore,
	useSeoRevisionsStore
} from '@/vue/stores'

import { isEmpty } from 'lodash-es'

/**
 * Save SEO Settings when SeedProd editor is saved.
 *
 * @returns {void}.
 */
const handleEditorSave = () => {
	const postEditorStore = usePostEditorStore()
	if (isEmpty(postEditorStore.currentPost)) {
		return
	}

	postEditorStore.saveCurrentPost(postEditorStore.currentPost).then(() => {
		const seoRevisionsStore = useSeoRevisionsStore()
		seoRevisionsStore.fetch({})
	})
}

export default () => {
	// This hook will fire when the Save button is triggered.
	document.getElementById('seedprod-builder-save').addEventListener('click', handleEditorSave)
}