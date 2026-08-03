import { __, sprintf } from '@/vue/plugins/translations'
import merge from 'lodash-es/merge'
import Assessment from '@/app/tru-seo/scoring/assessments/assessment'
import AssessmentResult from '@/app/tru-seo/values/AssessmentResult'
import japaneseConfig from '@/app/tru-seo/languages/ja/config/metaDescriptionLength'

const td = import.meta.env.VITE_TEXTDOMAIN

/**
 * Assessment for calculating the length of the meta description.
 */
export default class MetaDescriptionLengthAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor (config = {}) {
		super()

		const defaultConfig = {
			recommendedMaximumLength : 120,
			maximumLength            : 160,
			scores                   : {
				noMetaDescription : 1,
				tooLong           : 6,
				tooShort          : 6,
				correctLength     : 9
			}
		}

		this.identifier = 'metaDescriptionLength'
		this._config = merge(defaultConfig, config)
	}

	/**
	 * Returns the maximum length.
	 *
	 * @param {string}  locale  The locale.
	 *
	 * @returns {number} The maximum length.
	 */
	getMaximumLength (locale) {
		return this.getConfig(locale).maximumLength
	}

	/**
	 * Checks if language specific config is available, and overwrite the default config if it is.
	 *
	 * This method of returning the configuration by checking the locale is necessary since this assessment is also
	 * initialized for calculations outside content analysis where we don't have access to the Researcher.
	 *
	 * @param {string}  locale  The locale.
	 *
	 * @returns {Object}    The configuration to use.
	 */
	getConfig (locale) {
		let config = this._config
		if ('ja' === locale) {
			config = merge(config, japaneseConfig)
		}
		return config
	}

	/**
	 * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
	 *
	 * @param {Paper}       _paper      The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult (_paper, researcher) {
		const descriptionLength = researcher.getResearch('metaDescriptionLength')
		const assessmentResult = new AssessmentResult()
		const locale = researcher.getConfig('language')
		const config = this.getConfig(locale)

		assessmentResult.setScore(this.calculateScore(descriptionLength, locale))
		assessmentResult.setTitle(__('Meta description length', td))
		assessmentResult.setText(this.translateScore(descriptionLength, config))
		if (9 > assessmentResult.getScore()) {
			assessmentResult.setHasJumps(true)
		}

		// Max and actual are used in the snippet editor progress bar.
		assessmentResult.max = config.maximumLength
		assessmentResult.actual = descriptionLength

		return assessmentResult
	}

	/**
	 * Returns the score for the descriptionLength.
	 *
	 * @param {number}  descriptionLength The length of the meta description.
	 * @param {string}  locale            The locale.
	 *
	 * @returns {number} The calculated score.
	 */
	calculateScore (descriptionLength, locale) {
		const config = this.getConfig(locale)
		if (0 === descriptionLength) {
			return config.scores.noMetaDescription
		}

		if (descriptionLength <= this._config.recommendedMaximumLength) {
			return config.scores.tooShort
		}

		if (descriptionLength > this._config.maximumLength) {
			return config.scores.tooLong
		}

		return config.scores.correctLength
	}

	/**
	 * Translates the descriptionLength to a message the user can understand.
	 *
	 * @param {number}  descriptionLength   The length of the meta description.
	 * @param {Object}  config              The configuration to use.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore (descriptionLength, config) {
		if (0 === descriptionLength) {
			return __(
				'You haven\'t set a meta description. Without one, search engines will pick a snippet from your post — usually less compelling than what you\'d write yourself.',
				td
			)
		}

		if (descriptionLength <= config.recommendedMaximumLength) {
			return sprintf(
				/* translators: %1$d expands to the number of characters in the meta description, %2$d expands to the total available number of characters in the meta description */
				__(
					'Your meta description is under %1$d characters. You have up to %2$d available — use the extra space to make the post more clickable.',
					td
				),
				config.recommendedMaximumLength,
				config.maximumLength
			)
		}

		if (descriptionLength > config.maximumLength) {
			return sprintf(
				/* translators: %1$d expands to	the total available number of characters in the meta description */
				__(
					'Your meta description is over %1$d characters. Search results may cut it off — shorten it to keep the whole thing visible.',
					td
				),
				config.maximumLength
			)
		}

		return __('Your meta description is a good length.', td)
	}
}