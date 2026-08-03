import SEOAssessor from './seoAssessor.js'
import { getAssessment } from '../AssessmentRegistry'
import TextLengthAssessment from '../assessments/seo/TextLengthAssessment.js'

/**
 * Text length options for taxonomy assessor.
 *
 * @since 5.0.0
 */
const TAXONOMY_TEXT_LENGTH_OPTIONS = {
	recommendedMinimum   : 30,
	slightlyBelowMinimum : 10,
	veryFarBelowMinimum  : 1,
	customContentType    : 'taxonomyAssessor'
}

/**
 * Returns the text length assessment to use.
 *
 * @returns {TextLengthAssessment} The text length assessment (with taxonomy configuration) to use.
 */
export const getTextLengthAssessment = () => {
	// Export so it can be used in tests.
	return getAssessment(TextLengthAssessment, TAXONOMY_TEXT_LENGTH_OPTIONS)
}

/**
 * The TaxonomyAssessor is used for the assessment of terms.
 */
export default class TaxonomyAssessor extends SEOAssessor {
	/**
	 * Creates a new TaxonomyAssessor instance.
	 *
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor (researcher, options) {
		super(researcher, options)
		this.type = 'taxonomyAssessor'

		/*
		 * SCORING TAXONOMY.md specifies the same criteria as posts and pages, differing only in
		 * text length thresholds. The documented meta-description difference — the date is not
		 * counted — needs no configuration: `metaDescriptionLength` derives it from
		 * `paper.getDate()`, and a term carries no date.
		 */
		this.addAssessment('textLength', getTextLengthAssessment())
	}
}