# Overview of the SEO assessments scoring criteria on the store blog page
These are the scoring criteria applied when using the store blog SEO assessors.

The "store blog" is the single page set as WooCommerce's Shop page (`wc_get_page_id( 'shop' )`).
It is resolved in `Api\PostsTerms::getCustomAnalysisType()` and
`vue/plugins/tru-seo/utils/customAnalysisType.js`, and only on sites where WooCommerce is active.

For information on how the assessments scoring system works, check out these explanations:
* [How are individual and overall traffic lights assigned?](SCORING%20SEO.md#how-are-individual-and-overall-traffic-lights-assigned)
* [How is the overall score calculated?](SCORING%20SEO.md#how-is-the-overall-score-calculated)

### Assessments with the same scoring criteria as with the regular SEO assessor
- [Keyphrase length](SCORING%20SEO.md#2-keyphrase-length)
- [Keyphrase in meta description](SCORING%20SEO.md#4-keyphrase-in-meta-description)
- [Keyphrase in SEO title](SCORING%20SEO.md#8-keyphrase-in-seo-title)
- [Keyphrase in slug](SCORING%20SEO.md#9-keyphrase-in-slug)
- [SEO title width](SCORING%20SEO.md#4-seo-title-width)
- [Meta description length](SCORING%20SEO.md#5-meta-description-length)
- [Function words in keyphrase](SCORING%20SEO.md#7-function-words-in-keyphrase)

Cornerstone content uses the same set, with the cornerstone meta description length and slug
thresholds.

### Unavailable assessments
The following assessments are not available for the store blog page:
- Keyphrase in introduction
- Keyphrase density
- Keyphrase in subheadings
- Competing links
- Keyphrase in image alt attributes
- Images
- Text length
- Internal links
- Outbound links
- Single title

Every assessment above reads the page's **content**. Every assessment the store blog page *does*
run reads a field the author fills in — the focus keyphrase, the SEO title, the meta description,
or the slug.

That split is deliberate. WooCommerce renders the shop page's product grid from its own template,
so the page's editor content is normally empty and never reaches the analysis. A content-based
check therefore cannot be satisfied no matter how good the page is: `Text length` would return its
worst score on every store, `Images` and `Internal links` would report none, and so on. Scoring
them would penalise a correctly configured shop page.

`Single title` is excluded for a different reason. It would in fact pass, because
`SingleH1Assessment` counts the page title as the single H1 and there is no body content to supply
a second one. But a check that can essentially never fail adds no information while raising the
page's score — the overall score is an average over the assessments that ran
(`SEOScoreAggregator`), so a permanently green row inflates it. It was left out rather than used
as padding.

### Assessments registered at runtime
These are added by `worker/registerPremiumAssessments.js` rather than by the assessor, so they
apply here as they do everywhere: keyphrase distribution, keyword cannibalization, spelling
checker, word complexity (for supported languages), and text alignment.

### Readability
The store blog page has no dedicated content assessor, so it uses the standard readability
assessor. On a page with no editor content the text presence assessment is what reports that.
