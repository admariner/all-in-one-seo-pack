import { computed } from 'vue'
import { __, _n, sprintf } from '@/vue/plugins/translations'

import { usePostEditorStore } from '@/vue/stores'
import { getTruSeoInstance } from '@/vue/plugins/tru-seo/TruSeoSingleton'
import { updateStoreWithResults } from '@/vue/plugins/tru-seo/helpers/resultsHelper'
import { isBadResult } from '@/app/tru-seo/scoring/interpreters'

const td = import.meta.env.VITE_TEXTDOMAIN

export const useTruSeoScore = () => {
	const postEditorStore = usePostEditorStore()

	const strings = {
		weveGotWorkToDo : sprintf(
			// Translators: 1 - HTML Line break tag.
			__('We\'ve got some%1$swork to do!', td),
			'<br>'
		),
		needsImprovement : sprintf(
			// Translators: 1 - HTML Line break tag.
			__('Needs%1$sImprovement!', td),
			'<br>'
		),
		veryGood               : __('Very Good!', td),
		excellent              : __('Excellent!', td),
		allGood                : __('All Good!', td),
		// Translators: Description text shown below the Readability tab explaining the readability score.
		readabilityDescription : __('The readability score shows how easy your text is to read. Aim between 60-80 for most audiences. Easier-to-read content tends to keep readers engaged longer and can help lower your bounce rate. Simplify sentences and words to improve clarity.', td),
		// Translators: Description text shown for the Keywords section.
		keywordsDescription    : __('Add the keywords you want this post to rank for. AIOSEO checks how thoroughly your content targets each one and gives you specific suggestions to help it rank higher in search results.', td),
		// Translators: Description text shown for the Basics section.
		basicsDescription      : __('The essential checks that help your post get found — your title, meta description, links, and images. Getting these right makes it easier for search engines to understand and rank it, as well as discover other content on your site.', td),
		// Translators: Tooltip shown on the TruSEO score badge.
		seoScoreTooltip        : __('Your TruSEO score rates how well this post is optimized for search engines. Improve it by resolving the improvements flagged under Keywords, Basics, and Readability.', td)
	}

	const getErrorDisplay = (amountOfErrors) => {
		if (0 < amountOfErrors) {
			return sprintf(
				// Translators: 1 - The amount of errors.
				_n('%1$s Issue', '%1$s Issues', amountOfErrors, td),
				amountOfErrors
			)
		}
		return strings.allGood
	}

	const getErrorClass = (errors) => {
		if (0 < errors) {
			return 'red'
		}

		return 'green'
	}

	const getScoreClass = (score) => {
		return 79 < score ? 'green' : (49 < score ? 'orange' : (0 < score ? 'red' : 'none'))
	}

	// The textPresence assessment is TruSEO's own gauge of whether there's enough body
	// text to analyze (its "Not enough content" state). Below that threshold every other
	// check runs on effectively-empty text and only produces noise — a "Not enough content"
	// row sitting next to a pile of trivially-passing "Good" checks. When it flags too
	// little content we treat the whole analysis as not-ready so the tabs fall back to the
	// empty state, matching a brand-new post with no content.
	const hasEnoughContent = computed(() => {
		const textPresence = postEditorStore.truseoData?.truseo?.general?.readability?.textPresence

		return !!textPresence && !isBadResult(textPresence.score)
	})

	const readabilityScore = computed(() => {
		const results = Object.values(postEditorStore.truseoData?.truseo?.general?.readability || {})
		if (!results.length) {
			return 0
		}

		const validResults = results.filter(item => '' !== item?.title)
		if (!validResults.length) {
			return 0
		}

		const totalScore = validResults.reduce((sum, item) => sum + (item?.score || 0), 0)

		return Math.round((totalScore / (validResults.length * 9)) * 100)
	})

	const getReadabilityScoreClass = (score) => {
		if (60 <= score) {
			return 'score--green'
		}
		if (40 <= score) {
			return 'score--orange'
		}
		return 'score--red'
	}

	const runAnalysis = async (options = {}) => {
		try {
			const truSeo = await getTruSeoInstance()
			const results = await truSeo?.runAnalysis(options)

			if (results) {
				updateStoreWithResults(results)
			}
		} catch (error) {
			console.error('TruSEO analysis failed:', error)
		}
	}

	return {
		getErrorClass,
		getErrorDisplay,
		getReadabilityScoreClass,
		getScoreClass,
		hasEnoughContent,
		readabilityScore,
		runAnalysis,
		strings
	}
}