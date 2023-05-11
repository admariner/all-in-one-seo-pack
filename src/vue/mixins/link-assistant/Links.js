import { mapState, mapActions } from 'vuex'

import { isBlockEditor, isClassicEditor } from '@/vue/utils/context'
import { escapeRegex } from '@/vue/utils/regex'
import CommonMixin from './Common'
export default {
	emits  : [ 'updatingLinks', 'linksUpdated' ],
	mixins : [ CommonMixin ],
	props  : {
		post : {
			type     : Object,
			required : true
		},
		postIndex : {
			type     : Number,
			required : false
		},
		postId : {
			type     : Number,
			required : false
		},
		linksReport : {
			type : Boolean,
			default () {
				return false
			}
		},
		postReport : {
			type : Boolean,
			default () {
				return false
			}
		},
		metabox : {
			type : Boolean,
			default () {
				return false
			}
		}
	},
	beforeMount () {
		this.$bus.$on('updatingLinks', (loading) => {
			this.wpTableLoading = loading
		})
		this.pageNumber = this.linkType ? this.linkAssistant.postReport[this.linkType].totals.page : 1
	},
	data () {
		return {
			changeItemsPerPageSlug : 'linkAssistantPostsReport',
			action                 : '',
			showModal              : false,
			selectedRows           : [],
			bulkOptions            : [
				{ label: this.$t.__('Delete', this.$td), value: 'delete' }
			],
			strings : {
				frontPage  : this.$t.__('Front Page', this.$td),
				deleteLink : this.$t.__('Delete Link', this.$td)
			},
			modalStrings : {
				areYouSureSingle     : this.$t.__('Are you sure you want to delete this link?', this.$td),
				areYouSureMultiple   : this.$t.__('Are you sure you want to delete these links?', this.$td),
				areYouSureAll        : this.$t.__('Are you sure you want to delete all links?', this.$td),
				actionCannotBeUndone : this.$t.__('This action cannot be undone.', this.$td),
				yesSingle            : this.$t.__('Yes, I want to delete this link', this.$td),
				yesMultiple          : this.$t.__('Yes, I want to delete these links', this.$td),
				yesAll               : this.$t.__('Yes, I want to delete all links', this.$td),
				noChangedMind        : this.$t.__('No, I changed my mind', this.$td)
			}
		}
	},
	computed : {
		...mapState([ 'linkAssistant', 'currentPost' ]),
		rows () {
			if (!this.metabox) {
				return this.post.links[this.linkType].rows
			}

			const offset = 1 === this.pageNumber ? 0 : (this.pageNumber - 1) * 10
			return this.post.links[this.linkType].rows.slice(offset, offset + 10)
		}
	},
	methods : {
		...mapActions('linkAssistant', [
			'linkDelete',
			'linksBulk',
			'fetchPostReport',
			'fetchLinksReportInner',
			'postSettingsUpdate'
		]),
		fetchData (payload) {
			this.$bus.$emit('updatingLinks', true)

			const newPayload = {
				...payload,
				additionalFilters : {
					postId    : this.post.ID || this.currentPost.id,
					postIndex : this.postIndex,
					type      : this.linkType
				}
			}

			const action = this.postReport ? 'fetchPostReport' : 'fetchLinksReportInner'
			return this[action](newPayload).finally(() => {
				this.$bus.$emit('updatingLinks', false)
			})
		},
		openPostReport (initialTab) {
			window.location.href = `#/post-report?postId=${this.postId}&postIndex=${this.postIndex}&initialTab=${initialTab}`
		},
		maybeDoBulkAction ({ action, selectedRows }) {
			if (false === selectedRows || !action) {
				return
			}

			this.action       = action
			this.selectedRows = selectedRows
			this.showModal    = true
		},
		doBulkAction () {
			this.showModal    = false
			if (false === this.selectedRows || 'undefined' === typeof this.selectedRows) {
				return
			}

			if ('number' === typeof this.selectedRows) {
				this.doDeleteLink(this.selectedRows)
				return
			}

			if (this.metabox && 'inboundInternal' !== this.linkType) {
				const indexes = this.idsToIndexes(this.selectedRows)
				indexes.forEach((index) => {
					this.editorRemoveLink(index)
				})
				return
			}

			this.$bus.$emit('updatingLinks', true)
			this.linksBulk({
				postIndex   : this.postIndex,
				postId      : this.post.ID || this.currentPost.id,
				action      : this.action,
				linkType    : this.linkType,
				linkIds     : this.selectedRows,
				linksReport : this.linksReport,
				postReport  : this.postReport
			}).finally(() => {
				this.$bus.$emit('updatingLinks', false)
				this.$emit('linksUpdated')
				this.refreshTable()
			})
		},
		doDeleteLink (index) {
			const linkId = this.post.links[this.linkType].rows[index].id
			if (!linkId) {
				return
			}

			if (this.metabox && 'inboundInternal' !== this.linkType) {
				this.editorRemoveLink(index)
				return
			}

			this.$bus.$emit('updatingLinks', true)
			this.linkDelete({
				postIndex   : this.postIndex,
				postId      : this.post.ID || this.currentPost.id,
				linkId,
				linksReport : this.linksReport,
				postReport  : this.postReport
			}).finally(() => {
				this.$bus.$emit('updatingLinks', false)
				this.$emit('linksUpdated')
				this.refreshTable()
			})
		},
		editorRemoveLink (rowIndex) {
			if (isBlockEditor()) {
				this.$bus.$emit('updatingLinks', false)
				this.blockEditorRemoveLink(rowIndex)
				this.$bus.$emit('updatingLinks', false)
			}
			if (isClassicEditor()) {
				this.classicEditorRemoveLink(rowIndex)
			}
		},
		blockEditorRemoveLink (rowIndex) {
			const link = this.currentPost.linkAssistant.links[this.linkType].rows[rowIndex]
			if (!link) {
				return
			}

			this.$bus.$emit('updatingLinks', true)

			const escapedAnchor     = escapeRegex(link.anchor.trim())
			const phraseHtml        = link.phrase_html.trim()
			const escapedPhraseHtml = escapeRegex(phraseHtml)

			const blocks         = window.wp.data.select('core/block-editor').getBlocks()
			const targetBlockId  = this.findTargetBlock(blocks, phraseHtml)

			if (!targetBlockId) {
				this.$bus.$emit('updatingLinks', false)
				return
			}

			const targetBlock = window.wp.data.select('core/block-editor').getBlock(targetBlockId)
			if (!targetBlock) {
				this.$bus.$emit('updatingLinks', false)
				return
			}

			// eslint-disable-next-line one-var
			let pattern         = new RegExp(`(<t?a[^<>]*>)(.*)?(${escapedAnchor})(.*)?(</t?a[^<>]*>)`, 'i')
			const newPhraseHtml = phraseHtml.replace(pattern, '$2$3$4')

			pattern = new RegExp(`${escapedPhraseHtml}`, 'i')

			window.wp.data.dispatch('core/block-editor').updateBlockAttributes(targetBlockId, {
				content : targetBlock.attributes.content.replace(pattern, newPhraseHtml)
			}).then(() => {
				this.post.links[this.linkType].rows.splice(rowIndex, 1)
			}).catch((error) => {
				console.error(`Couldn\t delete link with type "${this.linkType}" and index ${rowIndex}:`, error)
			}).finally(() => {
				this.$bus.$emit('updatingLinks', false)
				this.$emit('linksUpdated')
			})
		},
		classicEditorRemoveLink (rowIndex) {
			const link = this.currentPost.linkAssistant.links[this.linkType].rows[rowIndex]
			if (!link || !window.tinyMCE) {
				return
			}

			this.$bus.$emit('updatingLinks', true)

			let postContent = '',
			 editor         = null,
			 textEditor     = null
			if (document.querySelector('#wp-content-wrap.tmce-active')) {
				editor      = window.tinyMCE.get('content')
				postContent = editor.getContent({ format: 'raw' })
			} else {
				textEditor = document.querySelector('textarea#content')
				postContent = textEditor ? textEditor.value : ''
			}

			if (!postContent) {
				this.$bus.$emit('updatingLinks', false)
				return
			}

			// eslint-disable-next-line one-var
			let phraseHtml      = link.phrase_html.trim()
			if (!editor) {
				// We need to strip off the data attribute in case the user switched from the visual to HTML editor.
				phraseHtml = phraseHtml.replace(/(\sdata-mce-href=".*")/gi, '')
			}

			const escapedAnchor = escapeRegex(link.anchor.trim())
			// eslint-disable-next-line one-var
			let pattern         = new RegExp(`(<t?a[^<>]*>)(.*)?(${escapedAnchor})(.*)?(</t?a[^<>]*>)`, 'i')

			const newPhraseHtml     = phraseHtml.replace(pattern, '$2$3$4')
			const escapedPhraseHtml = escapeRegex(phraseHtml)
			pattern                 = new RegExp(`${escapedPhraseHtml}`, 'i')
			postContent             = postContent.replace(pattern, newPhraseHtml)

			if (editor) {
				editor.setContent(postContent)
			} else {
				textEditor.value = postContent
			}

			this.post.links[this.linkType].rows.splice(rowIndex, 1)

			this.postSettingsUpdate({ postContent: postContent })
				.finally(() => {
					this.$bus.$emit('updatingLinks', false)
					this.$emit('linksUpdated')
				})
		},
		idsToIndexes (selectedRows) {
			let ids, indexes = []
			if (Array.isArray(selectedRows)) {
				ids = selectedRows.map(Number)
			}

			if (ids) {
				this.post.links[this.linkType].rows.forEach((link, index) => {
					if (ids.includes(link.id)) {
						indexes.push(index)
					}
				})
			}

			if ('all' === selectedRows) {
				indexes = this.post.links[this.linkType].rows.map((link, index) => index)
			}

			// Reverse the indexes so that we start deleting them from behind, to prevent us from messing up the order and deleting the wrong ones.
			return indexes.sort(function (a, b) {
				return b - a
			})
		}
	}
}