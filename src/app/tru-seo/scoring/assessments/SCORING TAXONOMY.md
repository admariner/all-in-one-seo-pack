# Overview of the assessment scoring criteria on taxonomy pages

The taxonomy analysis has the same SEO, Readability, and Inclusive language scoring criteria as posts and pages, except for the SEO assessments below:

## 1) Text length assessment
**What it does**: Checks if the taxonomy page has a good length.

**When applies**: Always.

**Name in code**: TextLengthAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/TextLengthAssessment.js`

| Traffic light	 | Score	| Criterion	                                          | Feedback                                                                                                                                             |
|----------------|------------------	|-----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	           | -20	| 0 words/characters	                                 | Text length: Add some content to enable this check.                                                                                                                            |
| Red	           | 3	| From 1 to 9 words	(Japanese: 1-19 characters)       | Text length: Your post is X words/characters long — under the recommended Y. Add more content.                                                                                  |
| Orange         | 6	| From 10 to 29 words	(Japanese: 20-59 characters)    | Text length: Your post is X words/characters long — slightly under the recommended Y. Add a bit more content.                                                                   |
| Green	         | 9	| 30 words or more (Japanese: 60 characters or more)	 | Text length: Your post is X words/characters long — a good length.                                                                                                              |

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
| Green	                       | 9	| Meta description > 120 and < 157 characters (Japanese: > 60 and < 80 characters | **Meta description length**: Your meta description is a good length. |
