# Overview of the assessment scoring criteria on taxonomy pages

The taxonomy analysis has the same SEO and Inclusive language scoring criteria as posts and pages, except for the assessments below.

Which taxonomies are analysed is controlled by `advanced.truSeoObjects.taxonomies` (Content Optimization settings). Product categories are the only default — a term carries no body content, so its description has to double as landing-page copy for the analysis to mean anything.

Note that `product_cat` and `product_tag` resolve to `collectionPage` and are therefore assessed by the collection assessors, not the ones described here — see [SCORING SEO COLLECTION.md](SCORING%20SEO%20COLLECTION.md). This document covers any other taxonomy the user enables.

## 1) Text length assessment
**What it does**: Checks if the taxonomy page has a good length.

**When applies**: Always.

**Name in code**: TextLengthAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/TextLengthAssessment.js`

| Traffic light	 | Score	| Criterion	                                          | Feedback                                                                                                                                             |
|----------------|------------------	|-----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	           | -20	| 0 words/characters	                                 | Text length: Add some content to enable this check.                                                                                                                            |
| Red	           | 3	| From 1 to 9 words	(Japanese: 1-19 characters)       | Text length: Your category is X words/characters long — under the recommended Y. Add more content.                                                                                  |
| Orange         | 6	| From 10 to 29 words	(Japanese: 20-59 characters)    | Text length: Your category is X words/characters long — slightly under the recommended Y. Add a bit more content.                                                                   |
| Green	         | 9	| 30 words or more (Japanese: 60 characters or more)	 | Text length: Your category is X words/characters long — a good length.                                                                                                              |

## 2) Meta description length assessment
**What it does**: Checks if the meta description has a good length. In a taxonomy page, the date is not displayed or included in the meta description. Hence, the date length is not included in the calculation for this assessment.

**When applies**: Always.

**Name in code**: MetaDescriptionLengthAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/MetaDescriptionLengthAssessment.js`

| Traffic light   	            | Score	     | Criterion                                                                       | Feedback |
|------------------------------|------------------	|---------------------------------------------------------------------------------|---------------	|
| Red	                         | 1	| No meta description		                                                           | **Meta description length**: You haven't set a meta description. **Without one, search engines will pick a snippet from your post — usually less compelling than what you'd write yourself**. |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		| Meta description ≤ 120 characters	(Japanese: ≤ 60 characters)	                  | **Meta description length**: Your meta description is under X characters. **You have up to Y available — use the extra space to make the post more clickable**. |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		| Meta description ≥ 157 characters	(Japanese: ≥ 80 characters)                   | **Meta description length**: Your meta description is over X characters. **Search results may cut it off — shorten it to keep the whole thing visible**. |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		| Meta description ≥ 157 characters **and inherited from the term description**    | **Meta description length**: Search engines are falling back to your category description, which is over X characters and will be cut off. **Write a dedicated meta description instead of shortening the description itself**. |
| Green	                       | 9	| Meta description > 120 and < 157 characters (Japanese: > 60 and < 80 characters | **Meta description length**: Your meta description is a good length. |

**Notes**:
* With no dedicated AIOSEO description set, the term's own description becomes the meta description
  — and it is also the analysed content. Text length then asks for at least 30 words while this
  assessment asks for at most 160 characters, and editing that single field cannot satisfy both. The
  score is unchanged in that case, but the feedback names the only real fix: write a dedicated meta
  description. Detected by comparing the paper's description against its text.

## 3) Keyword in term name assessment
**What it does**: Checks whether the focus keyword appears in the term name. The term name is the archive's visible heading, so this is the taxonomy counterpart of checking the keyword against a post's H1.

**When applies**: When both a focus keyword and a term name are set.

**Name in code**: KeyphraseInTermNameAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/KeyphraseInTermNameAssessment.js`

| Traffic light | Score | Criterion                                | Feedback |
|---------------|-------|------------------------------------------|----------|
| Red           | 3     | None of the keyword's words in the name  | **Keyword in term name**: Your keyword "X" is missing from the term name. **The name is the heading people see on the archive, so include it where it reads naturally**. |
| Orange        | 6     | Some of the keyword's words in the name  | **Keyword in term name**: The term name only contains part of your keyword "X". **Using the full keyword makes the archive heading a closer match**. |
| Green         | 9     | All of the keyword's words in the name   | **Keyword in term name**: Your keyword appears in the term name — that helps the archive heading match what people searched for. |

Matching is done on the words themselves rather than through the morphology researcher, since a term name is only a few words long.

## Unavailable assessments
- **Keyphrase distribution** — a term description is one short block, so there is nothing to distribute. It would pass unconditionally and inflate the score, so it is removed from every taxonomy assessor in `AnalysisWebWorker.createSEOAssessor()`.
- **Readability analysis** — the whole tab is hidden for terms. Its assessments assume prose with paragraphs and subheadings, and on a short description they return misleading passes.

## Note on keyphrase density
A term description is almost always under 100 words, which puts keyphrase density on its short-text branch: a minimum of 1 and a maximum of 2 occurrences, rather than the percentage-based boundaries described in [SCORING SEO.md](SCORING%20SEO.md#3-keyphrase-density).
