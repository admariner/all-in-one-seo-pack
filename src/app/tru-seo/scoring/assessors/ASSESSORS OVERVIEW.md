# Assessor types
## SEO Assessors
### Which assessor?
Overview of the used SEO assessors in the TruSEO analysis system:
### Standard SEO assessor (Focus keyphrase)
- Keyphrase in introduction (`IntroductionKeywordAssessment` - located in `src/app/tru-seo/scoring/assessments/seo/`)
- Keyphrase length (`KeyphraseLengthAssessment`)
- Keyphrase density (`KeywordDensityAssessment`)
- Keyphrase in metadescription (`MetaDescriptionKeywordAssessment`)
- Competing links (`TextCompetingLinksAssessment`)
- Internal links (`InternalLinksAssessment`)
- Keyphrase in SEO title (`KeyphraseInSEOTitleAssessment`)
- Keyphrase in slug (`UrlKeywordAssessment`)
- Meta description length (`MetaDescriptionLengthAssessment`) -> [Cornerstone scores!](../assessments/SCORING%20SEO.md#5-meta-description-length)
- Keyphrase in subheadings (`SubHeadingsKeywordAssessment`)
- Images (`ImageCountAssessment`)
- Image keyphrase (`KeyphraseInImageTextAssessment`) -> [Cornerstone scores!](../assessments/SCORING%20SEO.md#7-keyphrase-in-image-alt-attributes)
- Text length (`TextLengthAssessment`) -> [Cornerstone scores and boundaries!](../assessments/SCORING%20SEO.md#1-text-length)
- Outbound links (`OutboundLinksAssessment`)
- SEO title width (`PageTitleWidthAssessment`)
- Function words in keyphrase (`FunctionWordsInKeyphraseAssessment`)
- Previously used keyphrase (`previouslyUsedKeywords`)
- Single title (`SingleH1Assessment`)
- Keyword cannibalization (`KeywordCannibalizationAssessment`)
- Image alt attributes (`ImageAltTagsAssessment`) -> only applies when the content has at least one image
### Taxonomy assessor
- Keyphrase in introduction (`IntroductionKeywordAssessment`)
- Keyphrase length (`KeyphraseLengthAssessment`)
- Keyphrase density (`KeywordDensityAssessment`)
- Keyphrase in meta description (`MetaDescriptionKeywordAssessment`)
- Keyphrase in SEO title (`KeyphraseInSEOTitleAssessment`)
- Keyphrase in slug (`UrlKeywordAssessment`)
- Meta description length (`MetaDescriptionLengthAssessment`)
- Text length (`TextLengthAssessment`)
- SEO Title width (`PageTitleWidthAssesment`)
- Function words in keyphrase (`FunctionWordsInKeyphrase`)
- Previously used Keyphrase (`previouslyUsedKeywords`)
- Single title (`SingleH1Assessment`)
### Related keywords (all keywords after the first)
- Keyphrase in introduction (`IntroductionKeywordAssessment`)
- Keyphrase length (`KeyphraseLengthAssessment`)
- Keyphrase density (`KeywordDensityAssessment`)
- Keyphrase in meta description (`MetaDescriptionKeywordAssessment`)
- Image keyphrase (`KeyphraseInImageTextAssessment`) -> [Cornerstone scores!](../assessments/SCORING%20SEO.md#7-keyphrase-in-image-alt-attributes)
- Competing links (`TextCompetingLinksAssessment`)
- Previously used keyphrase (`previouslyUsedKeywords`)
### Related keywords taxonomy
- Keyphrase in introduction (`IntroductionKeywordAssessment`)
- Keyphrase length (`KeyphraseLengthAssessment`)
- Keyphrase density (`KeywordDensityAssessment`)
- Keyphrase in meta description (`MetaDescriptionKeywordAssessment`)
- Previously used keyphrase (`previouslyUsedKeywords`)
- Keyphrase distribution (not of related keywords) (`KeyphraseDistributionAssessment`)

> `TextTitleAssessment` was previously listed here. It was constructed by no assessor, and nothing
> ever populated `paper.textTitle`, so it could only ever have scored 0. Removed in 5.0.x.

## Content Assessors
### Standard Content (Readability) assessor
- Subheading distribution (`SubheadingDistributionTooLongAssessment`) -> [Cornerstone scores!](../assessments/SCORING%20READABILITY.md#1-subheading-distribution)
- Paragraph length (`ParagraphTooLongAssessment`)
- Sentence length (`SentenceLengthInTextAssessment`) -> [Cornerstone values!](../assessments/SCORING%20READABILITY.md#3-sentence-length)
- Consecutive sentences (`SentenceBeginningsAssessment`)
- Transition words (`TransitionWordsAssessment`)
- Passive voice (`PassiveVoiceAssessment`)
- Text presence (`TextPresenceAssessment`)
- Word complexity (`WordComplexityAssessment`) -> [Cornerstone values!](../assessments/SCORING%20READABILITY.md#8-word-complexity)
- Alignment (`TextAlignmentAssessment`) -> registered at runtime by `registerPremiumAssessments.js`, so it applies to every readability context, not just this one
- Spelling checker (`SpellingCheckerAssessment`) -> registered at runtime, as above