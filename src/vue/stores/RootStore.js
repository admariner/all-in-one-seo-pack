import { defineStore } from 'pinia'
import http from '@/vue/utils/http'
import links from '@/vue/utils/links'

import { getAllResultsGrouped } from '@/app/tru-seo/helpers/resultsFilter'

export const useRootStore = defineStore('RootStore', {
	state : () => ({
		pong     : true,
		loaded   : false,
		loading  : false,
		isPro    : 'pro' === import.meta.env.VITE_VERSION.toLowerCase(),
		aioseo   : {},
		navigate : {
			scroll    : null,
			highlight : null
		},
		modals : {
			active   : null,
			all      : new Set(),
			rendered : new Set()
		}
	}),
	getters : {
		truseoData () {
			const {
				truseo,
				focus_keyword: focusKeyword,
				additional_keywords: additionalKeywords
			} = this.aioseo

			const focusKeywordAnalysis = truseo?.focus_keyword || null
			const generalAnalysis      = truseo?.general || null

			// The preview payload leaves additional_keywords as '' when unavailable, so
			// normalize to an array before any iteration here or in the inspector.
			const additionalKeywordsList = Array.isArray(additionalKeywords) ? additionalKeywords : []

			// Collect identifiers already shown under the focus/additional keyword rows so
			// they are not counted again under Basic SEO/Readability, matching the metabox.
			const excludeIds = new Set()
			if (focusKeyword && focusKeywordAnalysis?.items) {
				Object.keys(focusKeywordAnalysis.items).forEach(id => excludeIds.add(id))
			}
			additionalKeywordsList.forEach(keyword => {
				if (keyword?.items) {
					Object.keys(keyword.items).forEach(id => excludeIds.add(id))
				}
			})

			const allResults = generalAnalysis ? getAllResultsGrouped(generalAnalysis, excludeIds) : null

			return {
				focusKeyword,
				additionalKeywords : additionalKeywordsList,
				truseo             : {
					focus_keyword : focusKeywordAnalysis,
					general       : {
						basic       : allResults?.basic,
						readability : allResults?.readability,
						spelling    : allResults?.spelling
					}
				}
			}
		}
	},
	actions : {
		ping () {
			http.get(links.restUrl('ping'))
				.catch(() => {
					this.pong = false
				})
		},
		setActiveModal (modal) {
			this.modals.active = modal

			this.modals.all.add(modal)
		},
		unsetActiveModal (activeModal) {
			// Remove the active modal from the list of all modals.
			this.modals.all.delete(activeModal)

			// Get the last modal in the list of all modals and set it as the active modal.
			this.modals.active = [ ...this.modals.all ].pop() || null
		}
	}
})