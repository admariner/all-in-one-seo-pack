import CollectionSEOAssessor from '../CollectionSEOAssessor'
import TextLengthAssessment from '../../../assessments/seo/TextLengthAssessment.js'
import ValidOnlyResultsScoreAggregator from '../../../scoreAggregators/ValidOnlyResultsScoreAggregator'

/**
 * The CollectionCornerstoneSEOAssessor class is used for the SEO analysis for cornerstone collections.
 */
export default class CollectionCornerstoneSEOAssessor extends CollectionSEOAssessor {
	/**
	 * Creates a new CollectionCornerstoneSEOAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor (researcher, options) {
		super(researcher, options)
		this.type = 'collectionCornerstoneSEOAssessor'

		this.addAssessment('textLength', new TextLengthAssessment({
			recommendedMinimum   : 30,
			slightlyBelowMinimum : 10,
			veryFarBelowMinimum  : 1,
			cornerstoneContent   : true,
			customContentType    : this.type
		}))

		this._scoreAggregator = new ValidOnlyResultsScoreAggregator()
	}
}