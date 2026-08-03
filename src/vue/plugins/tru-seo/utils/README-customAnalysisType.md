# Custom Analysis Type Detection

## Overview

The `customAnalysisType` is used to determine which set of custom assessors should be used for TruSEO analysis based on the current editing context (post type or taxonomy term).

## Implementation

### Detection Logic (`customAnalysisType.js`)

The `getCustomAnalysisType()` function detects the appropriate analysis type based on:

1. **WooCommerce Active**: Only applies custom types when WooCommerce is active
2. **Context**: Differentiates between post editing (`'post'`) and term editing (`'term'`)
3. **Type**: Uses `postType` or `termType` to determine the specific variant

### Analysis Types

| Type | When Used | Context | Assessors |
|------|-----------|---------|-----------|
| `productPage` | WooCommerce product | `post`, `postType === 'product'` | ProductSEOAssessor, ProductContentAssessor, etc. |
| `storeBlog` | WooCommerce shop page | `post`, `postType === 'page'` and is shop page | StoreBlogSEOAssessor |
| `storePostsAndPages` | Posts/Pages on WC site | `post`, `postType === 'post' \|\| 'page'` | StorePostsAndPagesSEOAssessor, etc. |
| `collectionPage` | Product categories/tags | `term`, `termType === 'product_cat' \|\| 'product_tag'` | CollectionSEOAssessor, etc. |
| `''` (empty) | All other cases | Any | Default assessors |

## Usage

The detection happens automatically during worker initialization in `TruSeoWrapper.initializeWorker()`:

```javascript
const customAnalysisType = getCustomAnalysisType(
    postEditorStore.currentPost,
    rootStore
)

await sharedWorker.initialize({
    locale: locale,
    contentAnalysisActive: true,
    keywordAnalysisActive: true,
    useCornerstone: postEditorStore.currentPost?.cornerstone || false,
    customAnalysisType: customAnalysisType, // ← Passed to worker
    translations: window.aioseo?.translations || {}
})
```

## Data Structure

### For Posts

```javascript
currentPost = {
    context: 'post',
    postType: 'product', // or 'post', 'page', etc.
    // ... other fields
}
```

### For Terms

```javascript
currentPost = {
    context: 'term',
    termType: 'product_cat', // or 'product_tag', 'category', etc.
    // ... other fields
}
```

## Custom Assessors

The custom assessors are registered in the worker (`src/app/tru-seo/index.js`) and selected based on the `customAnalysisType`:

- **Product Pages**: Lower content requirements (200 words), image assessment with video support
- **Store Blog**: Shop page-specific SEO assessments
- **Store Posts & Pages**: Standard post/page assessments for WooCommerce sites
- **Collection Pages**: Taxonomy-specific requirements (30 words minimum, no image assessments)

## Notes

- The detection only applies when WooCommerce is active
- Default assessors are used when `customAnalysisType` is empty
- All analysis is performed using Web Workers for optimal performance
- Worker initialization happens once and is shared across the session
