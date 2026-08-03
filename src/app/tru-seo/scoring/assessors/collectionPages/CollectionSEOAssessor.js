import SEOAssessor from '../seoAssessor.js'
import IntroductionKeywordAssessment from '../../assessments/seo/IntroductionKeywordAssessment.js'
import KeyphraseLengthAssessment from '../../assessments/seo/KeyphraseLengthAssessment.js'
import KeyphraseDensityAssessment from '../../assessments/seo/KeywordDensityAssessment.js'
import MetaDescriptionKeywordAssessment from '../../assessments/seo/MetaDescriptionKeywordAssessment.js'
import FunctionWordsInKeyphraseAssessment from '../../assessments/seo/FunctionWordsInKeyphraseAssessment.js'
import MetaDescriptionLengthAssessment from '../../assessments/seo/MetaDescriptionLengthAssessment.js'
import TextLengthAssessment from '../../assessments/seo/TextLengthAssessment.js'
import KeyphraseInSEOTitleAssessment from '../../assessments/seo/KeyphraseInSEOTitleAssessment.js'
import PageTitleWidthAssessment from '../../assessments/seo/PageTitleWidthAssessment.js'
import SlugKeywordAssessment from '../../assessments/seo/UrlKeywordAssessment.js'
import SingleH1Assessment from '../../assessments/seo/SingleH1Assessment.js'
import ValidOnlyResultsScoreAggregator from '../../scoreAggregators/ValidOnlyResultsScoreAggregator'

/**
 * The CollectionSEOAssessor class is used for the SEO analysis for collections.
 */
export default class CollectionSEOAssessor extends SEOAssessor {
	/**
	 * Creates a new CollectionSEOAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor (researcher, options) {
		super(researcher, options)
		this.type = 'collectionSEOAssessor'

		this._assessments = [
			new IntroductionKeywordAssessment(),
			new KeyphraseLengthAssessment(),
			new KeyphraseDensityAssessment(),
			new MetaDescriptionKeywordAssessment(),
			new MetaDescriptionLengthAssessment(),
			new TextLengthAssessment({
				recommendedMinimum   : 30,
				slightlyBelowMinimum : 10,
				veryFarBelowMinimum  : 1,
				customContentType    : this.type
			}),
			new KeyphraseInSEOTitleAssessment(),
			new PageTitleWidthAssessment({
				scores : {
					widthTooShort : 9
				}
			}, true),
			new SlugKeywordAssessment(),
			new FunctionWordsInKeyphraseAssessment(),
			new SingleH1Assessment()
		]

		this._scoreAggregator = new ValidOnlyResultsScoreAggregator()
	}
}