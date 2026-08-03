# Overview of the SEO assessments scoring criteria on collection pages
These are the scoring criteria applied when using the collection pages SEO assessors.

For information on how the assessments scoring system works, check out these explanations:
* [How are individual and overall traffic lights assigned?](SCORING%20SEO.md#how-are-individual-and-overall-traffic-lights-assigned)
* [How is the overall score calculated?](SCORING%20SEO.md#how-is-the-overall-score-calculated)

### Assessments with the same scoring criteria as with the regular SEO assessor
- [Keyphrase in introduction](SCORING%20SEO.md#1-keyphrase-in-introduction)
- [Keyphrase length](SCORING%20SEO.md#2-keyphrase-length)
- [Keyphrase density](SCORING%20SEO.md#3-keyphrase-density)
- [Keyphrase in meta description](SCORING%20SEO.md#4-keyphrase-in-meta-description)
- [Keyphrase in SEO title](SCORING%20SEO.md#8-keyphrase-in-seo-title)
- [Keyphrase in slug](SCORING%20SEO.md#9-keyphrase-in-slug)
- [Keyphrase distribution](SCORING%20SEO.md#11-keyphrase-distribution)
- [SEO title width](SCORING%20SEO.md#4-seo-title-width)
- [Meta description length](SCORING%20SEO.md#5-meta-description-length)
- [Single title](SCORING%20SEO.md#6-single-title)
- [Function words in keyphrase](SCORING%20SEO.md#7-function-words-in-keyphrase)

### Assessments with the same scoring criteria as with the taxonomy assessor
- [Text length assessment](SCORING%20TAXONOMY.md#1-text-length-assessment)

### Unavailable assessments
- Keyphrase in subheadings
- Competing links
- Keyphrase in image alt attributes
- Images
- Internal links
- Outbound links

The assessments related to images are unavailable because they might not make sense for this type of content from an SEO perspective. In addition, collection pages are advised to have minimal content.

Internal and outbound links are unavailable for the same reason they are on product pages: a
collection page exists to move the visitor into a product, so links away from it are not actively
encouraged.

**Note on "Previously used keyphrase"**: this was previously listed as unavailable, but
`keywordCannibalization` is registered at runtime to every SEO assessor
(`AnalysisWebWorker.js:468`), so collection pages do receive it. The list above reflects what the
code actually does.
