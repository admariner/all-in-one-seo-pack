# Overview of the SEO assessments scoring criteria
## How are individual and overall traffic lights assigned?
| Individual score	                            | Rating	                       |
|----------------------------------------------|-------------------------------|
| <0		                                         | Very bad (red traffic light)  |
| 0 (if it is not explicitly set as a score)		 | Feedback (gray traffic light) |
| ≤4		                                         | Bad (red traffic light)       |
| 5-7		                                        | OK (orange traffic light)     |
| 8-9		                                        | Good (green traffic light)    |

## How is the overall score calculated?

* Overall score<sup>1</sup> = ( sum of individual scores from each assessment ) / ( number of individual scores * 9 ) * 100
* Round this number
* Example with three individual scores of 3, 6, and 9:

( 3 + 6 + 9 ) / ( 3 * 9 ) * 100 = **66.67** ---> rounded to **67**

<sup>1</sup>The logic behind the formula is as follows:
* The overall score is the mean of individual scores adjusted to fit a 0-100 scale.
* Multiplying the result by 100 is necessary to fit a 0-100 instead of a 0-10 scale.
* Dividing the sum of individual scores by the number of scores * 9 (rather than simply by the number of scores) is necessary because the maximum score an individual assessment can have is 9.
Thus, this calculation make the overall score work on a 0-100/0-10 scale rather than a 0-90/0-9 scale.
* For reference in the code, see `src/app/tru-seo/scoring/assessors/assessor.js`

## Keyphrase-based SEO assessments scoring criteria
### 1) Keyphrase in introduction
**What it does**: Checks whether words from the keyphrase can be found in the first paragraph of the text.

**Uses synonyms**: yes

**When it applies**: Always.

**Name in code**: IntroductionKeywordAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/IntroductionKeywordAssessment.js`

| Traffic light   	 | Score	 | Criterion                                                                                              | Feedback                                                                                                                                            |
|-------------------|--------|--------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Red   	           | 3	     | There is no keyphrase and/or content	                                                                  | **Keyphrase in introduction**: Add a focus keyword to enable this check.                                                                                                                                       |
| Red   	           | 3	     | Not all content words are found in the first paragraph	                                                | **Keyphrase in introduction**: Your keyword doesn't appear in the first paragraph. **Mention it (or a synonym) early so readers and search engines see what the post is about**.                                |
| Orange   	        | 6	     | All content words are found in the first paragraph, but not in the same sentence	                      | **Keyphrase in introduction**: Your keyword (or a synonym) appears in the first paragraph, but it's split across multiple sentences. **Try fitting it into one sentence so the topic is clear right away**.     |
| Green   	         | 9	     | All content words from the keyphrase or synonym phrase are within one sentence in the first paragraph	 | **Keyphrase in introduction**: Your keyword appears in the first paragraph.                                                                                                                                     |

### 2) Keyphrase length
**What it does**: Checks whether the number of (content) words in the keyphrase is within the recommended limit. For languages with function word support only content words are considered. For languages without function word support all words are considered.

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: KeyphraseLengthAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/KeyphraseLengthAssessment.js`

| Traffic light   	 | Score	 | Criterion                                                                                                              | Feedback                                                                                                                                                                      |
|-------------------|--------|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red   	           | -999	  | No focus keyphrase set		                                                                                               | **Keyword length**: Add a focus keyword to start scoring this post.                                                                                                                                                                |
| Red   	           | 3		    | Keyphrase length > 8 words (> 9 for languages without function words support, > 18 characters for Japanese)	           | **Keyword length**: Your keyword is X (content) words/characters long well over the recommended Y. **Try a much shorter phrase**.                                                                                                  |
| Orange   	        | 6	     | Keyphrase length between 5-8 words (7-9 for languages without function words support, 13-18 characters for Japanese)		 | **Keyword length**: Your keyword is X (content) words/characters long — more than the recommended Y. **Try shortening it**.                                                                                                        |
| Green   	         | 9	     | Keyphrase length between 1-4 words (1-6 for languages without function words support, 1-12 characters for Japanese)		  | **Keyword length**: Your keyword length is just right.                                                                                                                                                                             |

### 3) Keyphrase density
**What it does**: Checks whether the (content) words from the keyphrase are used in the text and whether they are used often enough (but not too often). For a match to be found, all content words should occur in one sentence. Multiple occurrences of all content words within one sentence are considered multiple matches.

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: KeywordDensityAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/KeywordDensityAssessment.js`

| Traffic light   	    | Score	 | Criterion                                              | Feedback                                                                                                                                                           |
|----------------------|--------|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	                 | -50	   | No keyphrase and/or content		                          | **Keyword density**: Add a focus keyword to enable this check.                                                                                                                                       |
| Red	                 | 4	     | Keyphrase not found in content		                       | **Keyword density**: Your keyword doesn't appear in the post yet. For a post this length, **try using it at least X times**.                                                                          |
| **Texts 100+ words** |
| Red	                 | -50	   | kd > 4		                                               | **Keyword density**: Your keyword appears X times — well over the recommended Y for a post this length. **Cut down to keep the text natural**.                                                        |
| Red	                 | -10	   | 3 < kd ≤ 4 (3.5 < kd ≤ 4 for multiple word forms)		    | **Keyword density**: Your keyword appears X times — more than the recommended Y for a post this length. **Using it too often can hurt readability and look spammy**.                                  |
| Red	                 | 4	     | 0 < kd < 0.5		                                         | **Keyword density**: Your keyword appears X times — less than the recommended Y for a post this length.                                                                                               |
| Green	               | 9	     | 0.5 ≤ kd ≤ 3 (0.5 ≤ kd ≤ 3.5 for multiple word forms)	 | **Keyword density**: Your keyword appears X times — that's a healthy amount.                                                                                                                          |
| **Texts 51-99 words** |
| Red	                 | -50	   | Keyphrase found 4+ times		                             | **Keyword density**: Your keyword appears X times — well over the recommended Y for a post this length. **Cut down to keep the text natural**.                                                        |
| Red	                 | -10	   | Keyphrase found 3 times	                               | **Keyword density**: Your keyword appears X times — more than the recommended Y for a post this length. **Using it too often can hurt readability and look spammy**.                                  |
| Green	               | 9	     | Keyphrase found 1-2 times                              | **Keyword density**: Your keyword appears X times — that's a healthy amount.                                                                                                                          |
| **Texts <51 words**  |
| Red	                 | -50	   | Keyphrase found 3+ times		                             | **Keyword density**: Your keyword appears X times — well over the recommended Y for a post this length. **Cut down to keep the text natural**.                                                        |
| Red	                 | -10	   | Keyphrase found 2 times	                               | **Keyword density**: Your keyword appears X times — more than the recommended Y for a post this length. **Using it too often can hurt readability and look spammy**.                                  |
| Green	               | 9	     | Keyphrase found once		                                 | **Keyword density**: Your keyword appears 1 time — that's a healthy amount.                                                                                                                           |


#### More on our minimal keyphrase usage requirements
A simple model shows that as the text length (in words) goes up, the keyphrase density assessment requires a larger number of keyphrase usages. This happens in steps, which are determined by keyphrase length (shorter step for shorter keyphrases) and which do not depend on text length. The step size for the shortest keyphrase (1 word) is 214 words.

### 4) Keyphrase in meta description
**What it does**: Checks whether all (content) words from the keyphrase are used in the meta description. A match is counted if all words from the keyphrase appear in a sentence. Multiple matches per sentence are counted multiple times.

**Uses synonyms**: yes

**When it applies**: Always.

**Name in code**: MetaDescriptionKeywordAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/MetaDescriptionKeywordAssessment.js`

| Traffic light   	 | Score	 | Criterion                                       | Feedback                                                                                                                                               |
|-------------------|--------|-------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 3	     | There is no keyphrase and/or meta description		 | **Keyphrase in meta description**: **Please add both a keyphrase and a meta description containing the keyphrase.**                                    |
| Red	              | 3	     | 0 keyphrase matches		                           | **Keyphrase in meta description**: The meta description has been specified, but it does not contain the keyphrase. **Fix that!**                       |
| Red	              | 3	     | >2 found matches		                              | **Keyphrase in meta description**: The meta description contains the keyphrase __ times, which is over the advised maximum of 2 times. **Limit that!** |
| Green	            | 9	     | 1-2 sentences with a found match		              | **Keyphrase in meta description**: Keyphrase or synonym appear in the meta description. Well done!                                                     |

### 5) Keyphrase in subheadings
**What it does**: Checks whether H2 and H3 subheadings reflect the topic of the copy (based on keyphrase or synonyms). For languages with function word support, a subheading is considered to reflect the topic if at least half of words from the keyphrase are used in it. For languages without function word support, a subheading is considered to reflect the topic if all content words from the keyphrase are used in it.

**Uses synonyms**: yes

**When it applies**: Always applicable, except in taxonomies.

**Name in code**: SubHeadingsKeywordAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/SubHeadingsKeywordAssessment.js`

| Traffic light   	 | Score	 | Criterion                                                                                                                                                                                              | Feedback                                                                                                                                          |
|-------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 1	     | No focus keyphrase set an/or no content			                                                                                                                                                             | **Keyword in subheading**: Add a focus keyword and some content to enable this check.                                                                                                                                                              |
| Red	              | 2	     | **Default**: A text with more than 300 words (cornerstone: 250) and no subheading is present. <br> **Japanese**: A text with more than 600 characters (cornerstone: 500) and no subheading is present. | **Keyword in subheading**: None of your subheadings mention your keyword. **Add it (or a synonym) to at least one subheading**.                                                                                                                    |
| Red	              | 3	     | Less than 30% of H2/H3 headings reflect the topic		                                                                                                                                                    | **Keyword in subheading**: None of your subheadings mention your keyword. **Add it (or a synonym) to at least one subheading to reinforce the topic**.                                                                                             |
| Red	              | 3	     | More than 75% of H2/H3 headings reflect the topic		                                                                                                                                                    | **Keyword in subheading**: More than 75% of your subheadings include your keyword — that's repetitive. **Vary the wording so the post reads naturally**.                                                                                           |
| Green	            | 9	     | Between 30 and 75% of H2/H3 headings reflect the topic		                                                                                                                                               | **Keyword in subheading**: (X of) your subheadings mention your keyword.                                                                                                                                                                            |
| Green	            | 9	     | The only H2/H3 subheading used in the text reflects the topic		                                                                                                                                        | **Keyword in subheading**: Your subheading mentions your keyword.                                                                                                                                                                                   |
| Green	            | 9	     | **Default**: A text with 300 (cornerstone: 250) or less words and no subheading is present. <br> **Japanese**: A text with 600 (cornerstone: 500) or less characters and no subheading is present.		   | **Keyword in subheading**: Your post is short enough that subheadings aren't needed.                                                                                                                                                                |

### 6) Competing links
**What it does**: Checks if there are any links in the text, which use the keyphrase or its synonym as the anchor text.

**Uses synonyms**: yes

**When it applies**: Always. Does not apply to taxonomies.

**Name in code**: TextCompetingLinksAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/TextCompetingLinksAssessment.js`

| Traffic light   	 | Score	 | Criterion                                                 | Feedback                                                                                                            |
|-------------------|--------|-----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| Red	              | 2	     | There’s a link attached to the keyphrase or synonym		     | **Competing links**: One of your internal links uses your keyword as link text. **That link can compete with this post in search — change the link text to something else**. |
| Green	            | 8	     | There are no links attached to the keyphrase or synonym		 | **Competing links**: No internal links use your keyword as link text.                                                                                                          |

With the example keyphrase `cat and dog` the following criteria would apply to count as a competing link:

| Link text	   	    | Regarded as competing link		 | Notes                                                                                                     |
|-------------------|------------------------------|-----------------------------------------------------------------------------------------------------------|
| cat and dog		     | yes	                         | full match                                                                                                |
| cat		             | no	                          | partial match of keyphrase not regarded as competing link                                                 |
| cat and dog food	 | no 	                         | full match of keyphrase not regarded as competing link if the link text contains additional content words |

### 7) Keyphrase in image alt attributes

**What it does**: Checks if there are keyphrase or synonyms in the alt attributes of images.

**Uses synonyms**: yes

**When it applies**: Always, except in taxonomies.

**Name in code**: KeyphraseInImageTextAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/KeyphraseInImagesAssessment.js`

**What is counted as a keyphrase match**: ≥50% of all (content) words from the keyphrase in the alt attributes.

| Traffic light   	           | Score	               | Criterion                                                                                                     | Feedback                                                                                                                                                                                       |
|-----------------------------|----------------------|---------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red		                       | 3		                  | No images or no keyphrase set		                                                                               | **Keyword in image alt attributes**: Add a focus keyword and at least one image to enable this check.                                                                                          |
| Orange (cornerstone: red)		 | 6 (cornerstone: 3)		 | No images with alt attributes while the keyphrase is set	                                                     | **Keyword in image alt attributes**: Your image alt text doesn't mention your keyword. **Add it (or a synonym) where it genuinely describes the image**.                                       |
| Orange (cornerstone: red)		 | 6 (cornerstone: 3)		 | There are images with alt attributes, but they don't contain the keyphrase even though the keyphrase is set		 | **Keyword in image alt attributes**: None of your images have alt text that includes your keyword. **Add it (or a synonym) where it genuinely describes the image**.                           |
| Orange	                     | 6	                   | There are at least 5 images and less than 30% have an alt-tag with keyphrase/synonym		                        | **Keyword in image alt attributes**: Only X of your Y images have alt text that mentions your keyword. **Add your keyword (or a synonym) to the alt text of more images where it fits naturally**. |
| Orange	                     | 6	                   | There are at least 5 images and more than 75% have an alt-tag with keyphrase/synonym		                        | **Keyword in image alt attributes**: X of your Y images include your keyword in the alt text — that's more than needed. **Only include it where it genuinely describes the image**.            |
| Green	                      | 9	                   | There are 5 images and 2-4 images have an alt-tag with keyphrase/synonym		                                    | **Keyword in image alt attributes**: Your image alt text mentions your keyword in the right amount.                                                                                            |
| Green	                      | 9	                   | There are less than 5 images and at least one has an alt-tag with a keyphrase/synonym		                       | **Keyword in image alt attributes**: Your image alt text mentions your keyword in the right amount.                                                                                            |
| Green	                      | 9	                   | There are at least 5 images and between 30 and 75% have an alt-tag with a keyphrase/synonym		                 | **Keyword in image alt attributes**: Your image alt text mentions your keyword in the right amount.                                                                                            |

### 8) Keyphrase in SEO title
**What it does**: Checks if the keyphrase is used in the page title (when function words precede the keyphrase in the title they are filtered out when determining the position of the keyphrase in the title).

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: KeyphraseInSEOTitleAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/KeyphraseInSEOTitleAssessment.js`

| Traffic light   	 | Score	 | Criterion                                                                                              | Feedback                                                                                                                                                                                                                                                     |
|-------------------|--------|--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 2	     | There is no keyphrase and/or SEO title		                                                               | **Keyword in SEO title**: Add a focus keyword to enable this check.                                                                                                                                          |
| Red	              | 2	     | You haven't used all the content words from your keyphrase and your keyphrase isn’t at the beginning		 | **Keyword in SEO title**: Your SEO title is missing some words from your keyword 'your_keyword_here'. **For the best results, include all words of your keyword in the SEO title — ideally at the start**.   |
| Red	              | 2	     | You haven’t used your exact keyphrase, when the keyphrase is enclosed in quotation marks		             | **Keyword in SEO title**: Your SEO title doesn't include your exact keyword. **Add it — ideally at the start — for better results**.                                                                          |
| Orange	           | 6	     | The exact match of the keyphrase doesn’t appear at the beginning of the SEO title		                    | **Keyword in SEO title**: Your keyword appears in the SEO title, but not at the start. **Moving it to the start usually works better in search results**.                                                     |
| Orange	           | 6	     | SEO title does not contain an exact match of your keyphrase		                                          | **Keyword in SEO title**: Your SEO title doesn't include your exact keyword. **Add it — ideally at the start — for better results**.                                                                          |
| Green	            | 9	     | SEO title contains the exact match of the focus keyphrase at beginning		                               | **Keyword in SEO title**: Your keyword appears at the start of the SEO title.                                                                                                                                 |

### 9) Keyphrase in slug
**What it does**: Checks if the keyphrase is used in the slug.

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: UrlKeywordAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/UrlKeywordAssessment.js`

| Traffic light   	              | Score	                  | Criterion                                                                                | Feedback                                                                                      |
|--------------------------------|-------------------------|------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Red		                          | 3		                     | There is no keyphrase and/or slug		                                                      | **Keyword in slug**: Add a focus keyword to enable this check.                                                                       |
| Orange (in cornerstone: Red)		 | 6 (in cornerstone: 3)		 | Not all content words are in the slug		                                                  | **Keyword in slug**: Your URL doesn't include your keyword. **Edit the URL slug below the title to add it**.                          |
| Green	                         | 9	                      | For short keyphrases (1-2 content words): All content words are in the slug			           | **Keyword in slug**: Your keyword is in the URL.                                                                                      |
| Green	                         | 9	                      | For longer keyphrases (>2 content words): More than half content words are in the slug		 | **Keyword in slug**: Most of your keyword is in the URL.                                                                              |

### 10) Previously used keyphrase

**What it does**: Checks if the words from the keyphrase were previously used in a keyphrase for a different post.

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: PreviouslyUsedKeyword

**Note**: This assessment is handled by backend logic in the AIOSEO plugin.

| Traffic light   	 | Score	 | Criterion                                        | Feedback                                                                                                                                             |
|-------------------|--------|--------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 1	     | There is no keyphrase	                           | **Previously used keyphrase**: No focus keyphrase was set for this page. **Please add a focus keyphrase you haven't used before on other content**.	 |
| Red	              | 1	     | The keyphrase is previously used more than once	 | **Previously used keyphrase**: You've used this keyphrase X times before. **Do not use your keyphrase more than once.**	                             |
| Orange	           | 6	     | The keyphrase is previously used once	           | **Previously used keyphrase**: You've used this keyphrase once before. **Do not use your keyphrase more than once.**	                                |
| Green	            | 9	     | The keyphrase hasn't been used before	           | **Previously used keyphrase**: You've not used this keyphrase before, very good.	                                                                    |

### 11) Keyphrase distribution
**What it does**: Checks how well the words from the keyphrase are distributed throughout the text.

**Uses synonyms**: yes

**When it applies**: Always.

**Name in code**: KeyphraseDistributionAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/KeyphraseDistributionAssessment.js`

| Traffic light   	 | Score	 | Criterion                                                                           | Feedback                                                                                                                                         |
|-------------------|--------|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 1	     | Keyphrase was not set and/or keyphrase not found in the text		                      | **Keyphrase distribution**: Add a focus keyword to enable this check.                                                                                                                                |
| Red	              | 1	     | Texts 15 sentences or longer: The score<sup>1</sup> is >0.5	                        | **Keyphrase distribution**: Large sections of your post don't mention your keyword. **Try working it (or a synonym) into those sections so the topic stays clear throughout**.                       |
| Orange	           | 6	     | Texts 15 sentences or longer: The score is between 0.3 and 0.5		                    | **Keyphrase distribution**: Some sections of your post don't mention your keyword (or a synonym). **Try working it into those sections naturally**.                                                  |
| Green	            | 9	     | Texts 15 sentences or longer: The score is <0.3		                                   | **Keyphrase distribution**: Your keyword is spread evenly through your post.                                                                                                                          |
| Green	            | 9	     | Texts shorter than 15 sentences: The keyphrase is found in the text at least once		 | **Keyphrase distribution**: Your keyword is spread evenly through your post.                                                                                                                          |


<sup>1</sup> The score is calculated using the following formula:

(maximum number of consecutive sentences that don't contain the keyphrase)/(total number of sentences) * 100.

Example: 6/15*100 = 0.4


## Other SEO assessments scoring criteria
### 1) Text length
**What it does**: Checks if the text is long enough.

**When it applies**: Always.

**Name in code**: TextLengthAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/TextLengthAssessment.js`

| Traffic light   	 | Score	                   | Criterion                                                                                                                               | Feedback                                                                                                                                                                                                                                                                                                                  |
|-------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | -20	                     | Between 0 and 99 words (_cornerstone_: between 0 and 0, _Japanese_: 0-199)		                                                            | **Text length**: Your post is X words/characters long — well under the recommended Y. **Search engines usually need more text to understand the topic**.                                                                                                                                                                                                            |
| Red	              | -10 (cornerstone: -20)		 | Between 100 and 199 words (cornerstone: between 0 and 299, Japanese: 200-399 characters, Japanese cornerstone: 0-599 characters)		      | **Text length**: Your post is X words/characters long — well under the recommended Y. **Search engines usually need more text to understand the topic**.                                                                                                                                                                                                            |
| Red	              | 3 (cornerstone: -20)		   | Between 200 and 249 words (cornerstone: between 300 and 399, Japanese: 400-499 characters, Japanese cornerstone: 600-799 characters)			 | **Text length**: Your post is X words/characters long — under the recommended Y. **Add more content**.                                                                                                                                                                                                                                                              |
| Orange	           | 6	                       | Between 250 and 299 words (cornerstone: between 400 and 899, Japanese: 500-599 characters, Japanese cornerstone: 800-1799 characters)		 | **Text length**: Your post is X words/characters long — slightly under the recommended Y. **Add a bit more content**.                                                                                                                                                                                                                                               |
| Green	            | 9	                       | More than or exactly 300 words (cornerstone: 900, Japanese: 600 characters, Japanese cornerstone: 1800 characters)		                    | **Text length**: Your post is X words/characters long — a good length.                                                                                                                                                                                                                                                                                              |

### 2) Outbound links
**What it does**: Checks if outbound links are present and followed.

**When it applies**: Always.

**Name in code**: OutboundLinksAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/OutboundLinksAssessment.js`

| Traffic light | Score | Criterion                                     | Feedback                                                                                        |
|---------------|-------|-----------------------------------------------|-------------------------------------------------------------------------------------------------|
| Red           | 3     | No links                                      | **Outbound links**: Your post has no external links. **Linking to a few credible sources adds context and trust**.          |
| Orange        | 7     | All links are no-followed                     | **Outbound links**: All your external links are nofollow. **Add at least one regular link to a trusted source**.            |
| Green         | 8     | There are both followed and no-followed links | **Outbound links**: Your external links include a mix of regular and nofollow links.                                         |
| Green         | 9     | All links are followed                        | **Outbound links**: You're linking out to other sites.                                                                       |

### 3) Internal links
**What it does**: Checks if internal links are present and followed.

**When it applies**: Always.

**Name in code**: InternalLinksAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/InternalLinksAssessment.js`

| Traffic light | Score | Criterion                                              | Feedback                                                                                                  |
|---------------|-------|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Red           | 3     | No internal links                                      | **Internal links**: Your post has no internal links. **Add at least one link to a related post or page on your site**.                                |
| Orange        | 7     | Only no-followed internal links                        | **Internal links**: All your internal links are nofollow, which tells search engines not to follow them. **Add at least one regular link to pass on link value**. |
| Green         | 8     | There are both followed and no-followed internal links | **Internal links**: Your internal links include a mix of regular and nofollow links.                                                                   |
| Green         | 9     | All internal links are followed                        | **Internal links**: You have internal links to other parts of your site.                                                                                |

### 4) SEO Title width
**What it does**: Checks if the SEO title has a good length. Note that this assessment checks the SEO title as it appears in the snippet preview. Therefore, it also takes into account the content from replacement variables. However, we exclude the separator and the site title replacement variables from the calculation.

**When it applies**: Always.

**Name in code**: PageTitleWidthAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/PageTitleWidthAssessment.js`

| Traffic light   	 | Score	 | Criterion                                 | Feedback                                                                                      |
|-------------------|--------|-------------------------------------------|-----------------------------------------------------------------------------------------------|
| Red	              | 1	     | No SEO title		                            | **SEO title width**: Add an SEO title to enable this check.                                                                                  |
| Red	              | 3	     | SEO title width > 600 px		                | **SEO title width**: Your SEO title is too long for search results — Google may cut it off. **Shorten it to keep the whole title visible**.  |
| Green	            | 9	     | SEO title width between 1 px and 600 px		 | **SEO title width**: Your SEO title is a good length.                                                                                        |

### 5) Meta description length
**What it does**: Checks if the meta description has a good length. The date (and the separator ' - ') length are also included in the calculation, if the date is shown in the Google preview.

**When it applies**: Always.

**Name in code**: MetaDescriptionLengthAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/MetaDescriptionLengthAssessment.js`

| Traffic light   	            | Score	                | Criterion                                                                               | Feedback                                                                                                                                                     |
|------------------------------|-----------------------|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	                         | 1	                    | No meta description		                                                                   | **Meta description length**: You haven't set a meta description. **Without one, search engines will pick a snippet from your post — usually less compelling than what you'd write yourself**.   |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		 | Meta description (incl. the date)  ≤ 120 characters (Japanese: ≤ 60 characters)		       | **Meta description length**: Your meta description is under X characters. **You have up to Y available — use the extra space to make the post more clickable**.                                  |
| Orange (corner stone: red)		 | 6 (corner stone: 3)		 | Meta description (incl. the date)  ≥ 157 characters (Japanese: ≥ 80 characters) 		      | **Meta description length**: Your meta description is over X characters. **Search results may cut it off — shorten it to keep the whole thing visible**.                                         |
| Green	                       | 9	                    | Meta description (incl. the date) > 120 and < 157 characters	(Japanese: > 60 and < 80)	 | **Meta description length**: Your meta description is a good length.                                                                                                                              |

### 6) Single title
**What it does**: Checks if there are multiple H1 headings present in the text.

**When it applies**: When there are at least two H1 headings in the text.

**Name in code**: SingleH1Assessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/SingleH1Assessment.js`

| Traffic light   	 | Score	 | Criterion                                          | Feedback                                                                                                                                                          |
|-------------------|--------|----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | 1	     | There are at least two H1 headings in the text		   | **Single title**: Your post has more than one H1 heading. The H1 should be your main title — **change the others to H2 or H3 so search engines know which heading is the most important**. |
| Green	            | 9	     | There are less than two H1 headings in the text	 	 | **Single title**: You have one main heading.                                                                                                                                                |

### 7) Function words in keyphrase
**What it does**: Checks if the keyphrase consists of only function words.

**When it applies**: When the keyphrase consists of only function words (and the language has function word support).

**Name in code**: FunctionWordsInKeyphraseAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/FunctionWordsInKeyphraseAssessment.js`

| Traffic light   	 | Score	 | Criterion                                                 | Feedback                                                                                                                          |
|-------------------|--------|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Grey	             | 0	     | There is a keyphrase consisting only of function words			 | **Function words in keyword**: Your keyword "X" only consists of filler words like "the" or "and". **Pick a more specific term someone might search for**. |

### 8) Images
**What it does**: Checks the presence of images in the text.

**When it applies**: Always.

**Name in code**: TextImagesAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/TextImagesAssessment.js`

| Traffic light | Score | Criterion                  | Feedback                                                                                                                                                                       |
|---------------|-------|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red           | 3     | No images                  | **Images**: Your post has no images. **Even one supporting image makes posts easier to read and share**.                                                                       |
| Orange        | 6     | Fewer than recommended     | **Images**: You have X images. We recommend at least Y — **try adding a screenshot, photo, or illustration that supports your text**.                                          |
| Green         | 9     | Enough images              | **Images**: You have enough images.                                                                                                                                            |

### 9) Removed: Title

A `TextTitleAssessment` check existed here but was constructed by no assessor, so it never ran.
It was removed in 5.0.x. Nothing in the plugin ever populated `paper.textTitle`, so the check
would have scored 0 on every post had it been wired.

### 10) Keyword Cannibalization
**What it does**: Checks whether other posts on the site target the same focus keyphrase, which can cause them to compete against each other in search results.

**Uses synonyms**: no

**When it applies**: When a keyphrase is set and cannibalization data is available (fetched via REST API by `KeywordCannibalizationService` and passed through `paper.getCustomData().keywordCannibalization`).

**Name in code**: KeywordCannibalizationAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/KeywordCannibalizationAssessment.js`

| Traffic light | Score | Criterion                                    | Feedback                                                                                                                                                     |
|---------------|-------|----------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red           | 3     | Other posts target the same focus keyphrase  | **Keyword cannibalization**: These posts also target the same keyword: "Post A", "Post B". **Consider giving each post a different keyword, or combining them into one**. |
| Green         | 9     | No other posts target the same keyphrase     | **Keyword cannibalization**: No other posts on your site target this keyword.                                                                                              |

**Notes**:
* Cannibalization data is fetched from the `tru-seo/keyword-cannibalization` REST endpoint.
* Results are cached per keyphrase by `KeywordCannibalizationService` to avoid redundant API calls during re-analysis.
* The assessment returns a neutral (empty) result if cannibalization data is not yet available.

### 11) Image alt attributes
**What it does**: Checks whether every image in the content has an alt attribute.

**When it applies**: Only when the content contains at least one image. Content with no images is
not assessed — the separate Images assessment already reports their absence, so scoring both would
flag one problem twice and count it twice toward the score.

**Name in code**: ImageAltTagsAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/ImageAltTagsAssessment.js`

| Traffic light | Score | Criterion                                 | Feedback                                                                                                                                                                                                                |
|---------------|-------|-------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| n/a           | —     | No images                                 | Not assessed — see "When it applies" above.                                                                                                                                                                             |
| Red           | 3     | None of the images have alt attributes    | **Image alt attributes**: None of your images have alt text. **Add a short description to each one**.                                                                                                                    |
| Red           | 3     | Not all of the images have alt attributes | **Image alt attributes**: Some of your images are missing alt text. **Add a short description to each one**. (When only one image is missing: One of your images is missing alt text. **Add a short description to it**.) |
| Green         | 9     | All of the images have alt attributes     | **Image alt attributes**: Every image has alt text.                                                                                                                                                                     |

**Notes**:
* Alt text is an accessibility and image-SEO concern on any content type, so this applies to every
  post type rather than products only. The SEO Audit reports the same problem via its
  `image-missing-alt` check.
* Only images in the analysed content are counted. Images attached outside it — notably the
  WooCommerce product image and gallery — are not visible to this check, or to Images.
