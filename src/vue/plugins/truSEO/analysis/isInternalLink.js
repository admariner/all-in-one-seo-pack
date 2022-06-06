import getLinkStats from '../researches/getLinkStats'
import { __ } from '@wordpress/i18n'
import { td } from '@/vue/plugins/constants'

const scores = {
	noMatches           : 3,
	goodNumberOfMatches : 9
}

function isInternalLink (content) {
	if (!content) {
		return {}
	}

	const linkStatistics = getLinkStats(content)

	if (0 < linkStatistics.internalTotal) {
		return {
			title       : __('Internal links', td),
			description : __('You are linking to other resources on your website which is great.', td),
			score       : scores.goodNumberOfMatches,
			maxScore    : scores.goodNumberOfMatches,
			error       : 0
		}
	}

	return {
		title       : __('Internal links', td),
		description : __('We couldn\'t find any internal links in your content. Add internal links in your content.', td),
		score       : scores.noMatches,
		maxScore    : scores.goodNumberOfMatches,
		error       : 1
	}
}

export default isInternalLink