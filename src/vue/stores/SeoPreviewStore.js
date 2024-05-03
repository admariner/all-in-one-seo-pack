import { defineStore } from 'pinia'

import {
	useTableOfContentsStore,
	useSchemaStore
} from '@/vue/stores'

import { flattenHeadings } from '@/vue/standalone/blocks/table-of-contents/helpers'
import { parseSchemaByType } from '@/vue/utils/html'
import { arrayColumn, arrayUnique } from '@/vue/utils/helpers'

export const useSeoPreviewStore = defineStore('SeoPreviewStore', {
	getters : {
		// Get the rich results for the admin preview.
		richResults () {
			const tableOfContentsStore = useTableOfContentsStore()
			let anchorLinks = (flattenHeadings(tableOfContentsStore.headings, 4) || [])?.map(h => h?.content || '')
			if (!Array.isArray(anchorLinks) || !anchorLinks.length) {
				anchorLinks = []
			}

			const schemaStore = useSchemaStore()
			schemaStore.updateSchemaOutput()

			return {
				anchorLinks   : anchorLinks.filter((c) => !!c),
				reviewSnippet : this.extractReviewSnippet(schemaStore.output),
				faq           : this.extractFaq(schemaStore.output)
			}
		}
	},
	actions : {
		extractReviewSnippet (schemaOutput) {
			let reviewSnippet = {}
			const typesToCheck = [ 'Movie', 'Product', 'SoftwareApplication' ]
			for (const type of typesToCheck) {
				const foundType = parseSchemaByType(type, schemaOutput)
				if (foundType) {
					const aggregateRating = foundType?.aggregateRating || null
					const offers = foundType?.offers || null
					const prices = arrayUnique(Array.isArray(offers) ? arrayColumn(offers, 'price') : [])

					prices.sort((a, b) => a - b)

					reviewSnippet = {
						...(aggregateRating && {
							bestRating  : foundType.aggregateRating.bestRating ?? null,
							ratingValue : foundType.aggregateRating.ratingValue ?? null,
							reviewCount : foundType.aggregateRating.reviewCount ?? null,
							ratingCount : foundType.aggregateRating.ratingCount ?? null
						}),
						...(offers && {
							priceCurrency : offers[0]?.priceCurrency ?? offers.priceCurrency ?? null,
							price         : prices[0] ?? offers.price ?? null,
							priceFrom     : prices[0] ?? null,
							priceTo       : prices[prices.length - 1] ?? null
						})
					}

					break
				}
			}

			return reviewSnippet
		},
		extractFaq (schemaOutput) {
			const foundType = parseSchemaByType('FAQPage', schemaOutput)
			if (!foundType?.mainEntity) {
				return {}
			}

			return Object.values(foundType.mainEntity).map(item => ({
				question : item?.name,
				answer   : item?.acceptedAnswer?.text
			}))
		}
	}
})