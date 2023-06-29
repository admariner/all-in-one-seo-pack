import {
	useTagsStore
} from '@/vue/stores'

import tags from '@/vue/utils/tags'
import { customFieldValue } from '@/vue/plugins/tru-seo/components/customFields'

export const Tags = {
	methods : {
		parseTags (string) {
			const tagsStore = useTagsStore()

			if (!string) {
				return string
			}

			if (!tagsStore.tags) {
				return string
			}

			tagsStore.tags.forEach(tag => {
				if ('custom_field' === tag.id) {
					const customFieldRegex   = new RegExp(`#${tag.id}-([a-zA-Z0-9_-]+)`)
					const customFieldMatches = string.match(customFieldRegex)
					if (customFieldMatches && customFieldMatches[1]) {
						string = string.replace(customFieldRegex, customFieldValue(customFieldMatches[1]))
					}
					return
				}

				if ('tax_name' === tag.id) {
					const taxNameRegex = new RegExp(`#${tag.id}-([a-zA-Z0-9_-]+)`, 'g')
					string             = string.replace(taxNameRegex, `[${tag.name} - $1]`)
					return
				}

				// Pattern explained: Exact match of tag, not followed by any additional letter, number or underscore.
				// This allows us to have tags like: #post_link and #post_link_alt
				// and it will always replace the correct one.
				const regex = new RegExp(`#${tag.id}(?![a-zA-Z0-9_])`, 'g')

				// If this is the separator, use the most recent value from the props.
				if ('separator_sa' === tag.id && undefined !== this.separator) {
					string = string.replace(regex, this.separator)
				}

				const matches = string.match(regex)
				const value   = (tagsStore.liveTags[tag.id] || tag.value)
				if (matches) {
					string = string.replace(regex, '%|%' + value)
				}
			})

			// Since we added a delimiter, let's remove all of that now.
			string = string.replace(/%\|%/g, '')

			return tags.decodeHTMLEntities(tags.decodeHTMLEntities(string.replace(/<(?:.|\n)*?>/gm, ' ').replace(/\s/g, ' ')))
		}
	}
}