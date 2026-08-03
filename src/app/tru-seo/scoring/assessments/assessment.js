/* eslint-disable no-unused-vars */
import { sanitizeString } from '../../languageProcessing'
import { filterShortcodesFromHTML } from '../../languageProcessing/helpers'

/**
 * The base class for an Assessment.
 */
class Assessment {
	/**
	 * Executes the assessment and return its result.
	 *
	 * @param {Paper}       _paper       The paper to run this assessment on.
	 * @param {Researcher}  _researcher  The researcher used for the assessment.
	 *
	 * @returns {AssessmentResult} The result of the assessment.
	 */
	getResult (_paper, _researcher) {
		throw new Error('The method getResult is not implemented')
	}

	/**
	 * Checks whether the assessment is applicable.
	 *
	 * @param {Paper}       _paper       The paper to run this assessment on.
	 * @param {Researcher}  _researcher  The researcher used for the assessment.
	 *
	 * @returns {boolean} Whether the assessment is applicable, defaults to `true`.
	 */
	isApplicable (_paper, _researcher) {
		return true
	}

	/**
	 * Tests whether a `Paper` has enough content for assessments to be displayed.
	 *
	 * @param {Paper} paper 						The paper to run this assessment on.
	 * @param {number} contentNeededForAssessment	The minimum length in characters a text must have for assessments to be displayed.
	 *
	 * @returns {boolean} `true` if the text is of the required length, `false` otherwise.
	 */
	hasEnoughContentForAssessment (paper, contentNeededForAssessment = 50) {
		let text = paper.getText()
		text = filterShortcodesFromHTML(text, paper._attributes?.shortcodes)
		text = sanitizeString(text)
		return sanitizeString(text).length >= contentNeededForAssessment
	}
}

/* eslint-enable no-unused-vars */

export default Assessment