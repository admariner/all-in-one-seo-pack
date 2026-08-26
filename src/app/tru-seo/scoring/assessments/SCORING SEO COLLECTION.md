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
- [SEO title width](SCORING%20SEO.md#4-seo-title-width)
- [Meta description length](SCORING%20SEO.md#5-meta-description-length)
- [Function words in keyphrase](SCORING%20SEO.md#7-function-words-in-keyphrase)
- [Title](SCORING%20SEO.md#9-title)
- Keyword cannibalization (registered for licensed installs)

### Assessments specific to terms
- **Keyword in term name** — the term name is the archive's visible heading, so this is the taxonomy
  counterpart of checking the keyword against a post's H1. All of the keyword's words present in the
  name scores 9, some of them 6, none of them 3. Matching is done on the words themselves rather than
  through the morphology researcher, since a term name is only a few words long.

### Assessments with the same scoring criteria as with the taxonomy assessor
- [Text length assessment](SCORING%20TAXONOMY.md#1-text-length-assessment)

### Unavailable assessments
- Keyphrase in subheadings
- Competing links
- Keyphrase in image alt attributes
- Images
- Internal links
- Outbound links
- Keyphrase distribution
- Single title
- Readability analysis (the whole tab is hidden for terms)

The assessments related to images are unavailable because they might not make sense for this type of content from an SEO perspective. In addition, collection pages are advised to have minimal content.

Internal and outbound links are unavailable for the same reason they are on product pages: a
collection page exists to move the visitor into a product, so links away from it are not actively
encouraged.

Keyphrase distribution and Single title are unavailable because a term description is one short block: it has no headings, so Single title would always pass, and there is nothing for distribution to measure. Both would return a free good result and inflate the score. Readability is unavailable for the same reason — its assessments assume prose with paragraphs and subheadings.

Note that keyphrase density applies the short-text branch here (under 100 words): a minimum of 1 and a maximum of 2 occurrences, rather than the percentage-based boundaries.

**Note on "Previously used keyphrase"**: this was previously listed as unavailable, but
`keywordCannibalization` is registered at runtime to every SEO assessor, so collection pages do
receive it. The list above reflects what the code actually does.
