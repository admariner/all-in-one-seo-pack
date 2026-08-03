# Overview of the Readability assessments scoring criteria
These are the scoring criteria applied when using the product pages content assessor.

Readability analysis is a collection of assessments that check how easy to read a text is.

Some of the readability assessments are language-independent (e.g. paragraph length, subheading distribution), but many are language-specific (e.g. passive voice, transition words) and are made available for different languages on a case-by-case basis.

For information on how the assessments scoring system works, check out these explanations:
* [How are individual traffic lights assigned?](SCORING%20READABILITY.md#how-are-individual-traffic-lights-assigned)
* [How is the overall score calculated?](SCORING%20READABILITY.md#how-is-the-overall-score-calculated)

**Note**: This document describes the readability scoring criteria for product page assessments.

## Scoring criteria for the readability assessments
### Assessments with the same scoring criteria as with the regular SEO assessor
* [Subheading distribution](SCORING%20READABILITY.md#1-subheading-distribution)
* [Sentence length](SCORING%20READABILITY.md#3-sentence-length)
* [Passive voice](SCORING%20READABILITY.md#5-passive-voice)
* [Transition words](SCORING%20READABILITY.md#6-transition-words)
* [Text presence](SCORING%20READABILITY.md#7-text-presence)
* [Word complexity](SCORING%20READABILITY.md#8-word-complexity)

### Assessments with different scoring criteria than with the regular SEO assessor
### 1) Paragraph length
**What it does**: Checks whether the paragraphs exceed the recommended maximum length.

**When applies**: Always.

**Name in code**: ParagraphTooLongAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/ParagraphTooLongAssessment.js`

| Traffic light 	 | Score	| Criterion                                               | Feedback                                                                                                                                            |
|------------|------------------	|---------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Red        |3	                | > 100 words (Japanese: 200 characters)	   	             | **Paragraph length**: X paragraph(s) are over the recommended Y words/characters. **Long paragraphs are hard to read on phones — try splitting them**. |
| Orange     |6                 | Between 70 and 100 words (Japanese: 140-200 characters) | **Paragraph length**: X paragraph(s) are over the recommended Y words/characters. **Long paragraphs are hard to read on phones — try splitting them**. |
| Green      |9                 | ≤ 70 words (Japanese: 140 characters)	                  | **Paragraph length**: All your paragraphs are a comfortable length.                                                                                     |

### Assessments unique to product pages
None. A "Lists" check (`ListAssessment`) existed but was never wired into any assessor, and was
removed in 5.0.x: content can legitimately contain no lists, so scoring its absence penalised
valid pages, and the assessment produced no marks so the failing row had nothing to highlight.

### Unavailable assessments
The following assessments are not available for product pages:
* Consecutive sentences - removed because product pages typically have more descriptive texts where repetition is acceptable
