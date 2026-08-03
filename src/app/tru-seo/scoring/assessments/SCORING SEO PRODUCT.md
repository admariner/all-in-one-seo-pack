# Overview of the SEO assessments scoring criteria on product pages
These are the scoring criteria applied when using the product pages SEO assessors.

For information on how the assessments scoring system works, check out these explanations:
* [How are individual and overall traffic lights assigned?](SCORING%20SEO.md#how-are-individual-and-overall-traffic-lights-assigned)
* [How is the overall score calculated?](SCORING%20SEO.md#how-is-the-overall-score-calculated)

**Note**: This document describes the scoring criteria for product page assessments.

## Keyphrase-based SEO assessments scoring criteria
### Assessments with the same scoring criteria as with the regular SEO assessor
- [Keyphrase in introduction](SCORING%20SEO.md#1-keyphrase-in-introduction)
- [Keyphrase density](SCORING%20SEO.md#3-keyphrase-density)
- [Keyphrase in meta description](SCORING%20SEO.md#4-keyphrase-in-meta-description)
- [Keyphrase in subheadings](SCORING%20SEO.md#5-keyphrase-in-subheadings)
- [Competing links](SCORING%20SEO.md#6-competing-links-link-keyphrase)
- [Keyphrase in image alt attributes](SCORING%20SEO.md#7-keyphrase-in-image-alt-attributes)
- [Keyphrase in SEO title](SCORING%20SEO.md#8-keyphrase-in-seo-title)
- [Keyphrase in slug](SCORING%20SEO.md#9-keyphrase-in-slug)
- [Previously used keyphrase](SCORING%20SEO.md#10-previously-used-keyphrase)
- [Keyphrase distribution](SCORING%20SEO.md#11-keyphrase-distribution)

### Assessments with different scoring criteria than with the regular SEO assessor
### 1) Keyphrase length

**What it does**: Checks whether the number of (content) words in the keyphrase is within the recommended limit. For languages with function word support only content words are considered. For languages without function word support all words are considered.
Additionally, Dutch, German and Swedish trigger an orange/red bullet with shorter keyphrases than other languages since keyphrases tend to be shorter in those languages (due to compound words being written as single words).

**Uses synonyms**: no

**When it applies**: Always.

**Name in code**: KeyphraseLengthAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/KeyphraseLengthAssessment.js`

| Traffic light   	 | Score	 | Criterion                                                                                                                                 | Feedback                                                                                                                                                                      |
|-------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red   	           | -999	  | No focus keyword set		                                                                                                                    | **Keyword length**: Add a focus keyword to start scoring this post.                                                                                                                              |
| Red   	           | 3		    | Keyphrase length > 8 words (> 9 for languages without function words support; > 7 for NL, DE, SV, > 18 characters for Japanese)	          | **Keyword length**: Your keyword is X (content) words/characters long well over the recommended Y. **Try a much shorter phrase**.                                                                 |
| Red   	           | 3		    | Keyphrase length 1-2 words (1 word for NL, DE, SV, 1-4 characters for Japanese)	                                                          | **Keyword length**: Your keyword is X (content) word(s)/character(s) long — well under the recommended Y. **Try a longer, more descriptive phrase**.                                              |
| Orange   	        | 6	     | Keyphrase length between 7-8 words (7-9 for languages without function words support; 7 for NL, DE, SV, 13-18 characters for Japanese )		 | **Keyword length**: Your keyword is X (content) words/characters long — more than the recommended Y. **Try shortening it**.                                                                       |
| Orange   	        | 6	     | Keyphrase length 3 words (2 words for NL, DE, SV, 5-7 characters for Japanese)		                                                          | **Keyword length**: Your keyword is X (content) words/characters long — less than the recommended Y. **Try a slightly longer phrase**.                                                            |
| Green   	         | 9	     | Keyphrase length between 4-6 words (3-6 for NL, DE, SV, 8-12 characters for Japanese)		                                                   | **Keyword length**: Your keyword length is just right.                                                                                                                                            |

## Other SEO assessments scoring criteria
### Assessments with the same scoring criteria as with the regular SEO assessor
- [SEO title width](SCORING%20SEO.md#4-seo-title-width)
- [Meta description length](SCORING%20SEO.md#5-meta-description-length)
- [Single title](SCORING%20SEO.md#6-single-title)
- [Function words in keyphrase](SCORING%20SEO.md#7-function-words-in-keyphrase)
- [Images](SCORING%20SEO.md#8-images)
- [Title](SCORING%20SEO.md#9-title)
- [Image alt attributes](SCORING%20SEO.md#11-image-alt-attributes)

### Assessments with different scoring criteria than with the regular SEO assessor
### 1) Text length
**What it does**: Checks if the text is long enough.

**When it applies**: Always.

**Name in code**: TextLengthAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/TextLengthAssessment.js`

| Traffic light   	 | Score	                   | Criterion                                                                                                                               | Feedback                                                                                                                                                                                                                                                                                                                |
|-------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red	              | -20	                     | Between 0 and 49 words (cornerstone: between 0 and 0, Japanese: 0-99 characters)		                                                      | **Text length**: Your post is X words/characters long — well under the recommended Y. **Search engines usually need more text to understand the topic**.                                              |
| Red	              | -10 (cornerstone: -20)		 | Between 50 and 99 words (cornerstone: between 0 and 199, Japanese: 100-199 characters, Japanese cornerstone: 0-399 characters)		        | **Text length**: Your post is X words/characters long — well under the recommended Y. **Search engines usually need more text to understand the topic**.                                              |
| Red	              | 3 (cornerstone: -20)		   | Between 100 and 149 words (cornerstone: between 200 and 299, Japanese: 200-299 characters, Japanese cornerstone: 400-599 characters)			 | **Text length**: Your post is X words/characters long — under the recommended Y. **Add more content**.                                                                                                |
| Orange	           | 6	                       | Between 150 and 199 words (cornerstone: between 300 and 399, Japanese: 300-399 characters, Japanese cornerstone: 600-799 characters)		  | **Text length**: Your post is X words/characters long — slightly under the recommended Y. **Add a bit more content**.                                                                                 |
| Green	            | 9	                       | More than or exactly 200 words (cornerstone: 400, Japanese: 400 characters, Japanese cornerstone: 800 characters)		                     | **Text length**: Your post is X words/characters long — a good length.                                                                                                                                |


### Assessments unique to product pages
### 1) Product identifier
**Name in code**: ProductIdentifiersAssessment

**What it does**: Checks whether a product, or each of its variants if the product has variants, has an identifier.

**When it applies**: For WooCommerce products - checks if product identifier fields can be retrieved and if at least one identifier is found.

**Where the data comes from**: `paper.customData`, populated by
`vue/plugins/tru-seo/utils/wooProductData.js`. The saved product is collected server-side by
`Helpers\ThirdParty::getWooCommerceProductData()` (WooCommerce's native
`get_global_unique_id()` GTIN/UPC/EAN/ISBN field and `get_sku()`), and the classic product
editor's own `#_global_unique_id` / `#_sku` inputs are read on top so an unsaved value counts.
Variations are assessed (`assessVariants: true`), so a variable product needs an identifier on
every variation. NOTE: editing Woo's fields does not itself trigger a re-analysis — the new value
is picked up by the next analysis run, or on save.

**File location**: `src/app/tru-seo/scoring/assessments/seo/ProductIdentifiersAssessment.js`

| Traffic light   	 | Score	 | Criterion                                                                                                                                                  | Feedback                                                                                                                                                                                                                                                                                                                                                                                   |
|-------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Orange	           | 6	     | No product identifier filled in for a simple product or no product identifier filled in for a variable product that doesn't have variations set		 | **Product identifier**: Your product is missing an identifier like a GTIN, ISBN, or MPN. **Adding one helps your product show up in Google Shopping and rich results**.                                       |
| Orange	           | 6	     | One or multiple variants are missing a product identifier		                                                                                                | **Product identifier**: Some of your product variants are missing an identifier (GTIN, ISBN, or MPN). **Adding one to each helps your products show up in Google Shopping and rich results**.                  |
| Green	            | 9	     | Product identifier is filled in for a simple product or product identifier is filled in for a variable product that doesn't have variations set		 | **Product identifier**: Your product has an identifier (GTIN or similar).                                                                                                                                       |
| Green	            | 9	     | If there is at least one variant and a product identifier is filled in for each variant (regardless of whether the default is filled in or not).		         | **Product identifier**: All your product variants have an identifier.                                                                                                                                            |

### 2) SKU
**What it does**: Checks whether a product, or each of its variants if the product has variants, has a SKU.

**When it applies**: For WooCommerce products - checks if SKU fields can be retrieved.

**Name in code**: ProductSKUAssessment

**File location**: `src/app/tru-seo/scoring/assessments/seo/ProductSKUAssessment.js`

| Traffic light   	 | Score	 | Criterion                                                                                                                           | Feedback                                                                                                                                        |
|-------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| Orange	           | 6	     | No SKU filled in for a simple product or (in Woo) no SKU filled in for a variable product that doesn't have variations set		        | **SKU**: Your product is missing a SKU. **Adding one helps with inventory tracking and can improve how the product shows in search results**.                  |
| Orange	           | 6	     | One or multiple variants are missing a SKU		                                                                                        | **SKU**: Some of your product variants are missing a SKU. **Adding one to each helps with inventory tracking and can improve how the product shows in search results**. |
| Green	            | 9	     | SKU is filled in for a simple product or (in Woo) SKU is filled in for a variable product that doesn't have variations set		        | **SKU**: Your product has a SKU.                                                                                                                                |
| Green	            | 9	     | If there is at least one variant and a SKU is filled in for each variant (regardless of whether the default is filled in or not).		 | **SKU**: All your product variants have a SKU.                                                                                                                  |

### Unavailable assessments
The following assessments are not available for product pages:
* Outbound links
* Internal links

When a user is on a product page, the main action you want them to perform is to buy that product, so links to other pages are not actively encouraged.
