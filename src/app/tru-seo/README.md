# TruSEO Analysis System

## Overview

The TruSEO analysis system is a comprehensive content analysis engine that provides real-time SEO and readability feedback in All in One SEO (AIOSEO). Built on a modular architecture with Web Workers for optimal performance, it analyzes content against industry best practices and provides actionable recommendations.

## Table of Contents

- [Architecture](#architecture)
- [Core Features](#core-features)
- [Performance Optimizations](#performance-optimizations)
- [Analysis Types](#analysis-types)
- [Key Components](#key-components)
- [Caching System](#caching-system)
- [Worker System](#worker-system)
- [Custom Assessors](#custom-assessors)
- [Language Support](#language-support)
- [Development Guide](#development-guide)

## Architecture

The TruSEO system is built on a multi-layered architecture:

```
┌─────────────────────────────────────────────────────┐
│                  UI Layer (Vue.js)                  │
│          TruSeoWrapper, Components, Stores          │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│            Highlighter Layer (Phase 2)             │
│   TruSeoHighlighter composable, HighlighterStore   │
│   blockEditor, classicEditor, tinymce, popover     │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│              Worker Interface Layer                 │
│  AnalysisWorkerWrapper | MainThreadAnalysisRunner   │
│  Transporter, KeywordCannibalizationService         │
└─────────────────┬───────────────────────────────────┘
                  │ postMessage/onmessage
┌─────────────────▼───────────────────────────────────┐
│           Web Worker (Background Thread)            │
│     AnalysisWebWorker, Scheduler, Task Queue        │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│             Analysis Engine Layer                   │
│   Assessors, Researchers, Parsers, Scorers          │
└─────────────────────────────────────────────────────┘
```

### Design Principles

1. **Non-Blocking UI**: All analysis runs in Web Workers to prevent UI freezing
2. **Modular Assessors**: Each assessment is independent and can be registered/unregistered
3. **Lazy Loading**: Language packs and e-commerce assessors are loaded on-demand
4. **Efficient Caching**: Multi-level LRU caching with fingerprint-based invalidation
5. **Context-Aware**: Different assessor sets for different content types (products, posts, taxonomies)
6. **Visual Feedback**: Real-time content highlighting surfaces assessment results directly in the editor
7. **Graceful Degradation**: MainThreadAnalysisRunner provides a fallback when Web Workers are unavailable

## Core Features

### Three Types of Analysis

1. **SEO Analysis**
   - Keyphrase optimization (title, meta, content, URL, images)
   - Internal and external linking
   - Content length and structure
   - Keyphrase density and distribution

2. **Readability Analysis**
   - Sentence length and complexity
   - Paragraph length
   - Subheading distribution
   - Passive voice detection
   - Transition words usage
   - Word complexity analysis

3. **Inclusive Language Analysis** *(planned)*
   - Coming in future releases

4. **Content Highlighting** *(Phase 2)*
   - Real-time visual highlighting of assessment issues in both Block Editor (Gutenberg) and Classic Editor (TinyMCE)
   - Block Editor uses custom RichText format types; Classic Editor uses TinyMCE annotation API
   - Interactive hover popover displaying assessment text, feedback, and spelling suggestions
   - Smart positioning (below cursor by default, flips above when space is limited)
   - DOM mutation observation to handle editor state changes
   - Copy-without-markup support and clean mark deletion

5. **Spell Checking** *(Phase 2)*
   - WASM-based Hunspell spell checker (`helpers/spellChecker.js`) for accurate, high-performance spell checking
   - Trie-based prefix search combined with Hunspell edit-distance suggestions for comprehensive correction
   - Lazy dictionary loading from `{baseUrl}/{code}/{locale}.aff/.dic` files
   - Avoids V8's property limit that crashes pure-JS libraries on large dictionaries (312K+ words)
   - Integrates with highlighter popover for interactive spelling correction

6. **Keyword Cannibalization Detection** *(Phase 2)*
   - REST API-based check for competing posts targeting the same focus keyphrase
   - Results cached per keyphrase via `KeywordCannibalizationService`
   - Assessment scores: 9 (no conflict) or 3 (competing posts found)

### Content Type Support

- **Standard Posts & Pages**: Full SEO and readability assessments
- **WooCommerce Products**: Optimized for product descriptions (lower word counts, video support)
- **WooCommerce Categories/Tags**: Collection page assessments
- **WooCommerce Shop Page**: Store blog specific assessments
- **Taxonomies**: Taxonomy-specific requirements
- **Cornerstone Content**: Stricter scoring boundaries for important content

## Performance Optimizations

### 1. Web Workers
All analysis is performed in background threads, preventing UI blocking even on long-form content (10,000+ words).

### 2. Lazy Loading
- **Language Packs**: Loaded dynamically based on user's locale
- **E-commerce Assessors**: Code-split and loaded only when needed
- **Bundle Size**: Initial worker bundle is minimal, ~70% smaller than previous implementation

### 3. Caching System
Three-level caching strategy:

```javascript
// Level 1: Analysis Results Cache (LRU)
// Caches complete analysis results by content fingerprint
resultCache.get(fingerprint) → cachedResults

// Level 2: Research Cache (LRU)
// Caches intermediate research results (word count, sentence parsing, etc.)
researchCache.get(cacheKey) → cachedResearch

// Level 3: Parser Cache (LRU)
// Caches parsed HTML structures
parserCache.get(htmlFingerprint) → cachedTree
```

**Cache Manager**: Centralized cache management for clearing caches on navigation, debugging, and memory management.

### 4. Fingerprint-Based Invalidation
Content changes are detected via fast fingerprint hashing (DJB2 algorithm with strategic sampling):

```javascript
// Fingerprint includes: content, keyphrase, additional keywords, settings
// For large content, samples at multiple strategic points (start, quartiles, end)
// For small content, hashes the entire string
const fingerprint = fingerprintHash(content)
const cacheKey = generateCacheKey(content, keyphrase, additionalKeywords, locale, customAnalysisType)
```

### 5. Batch Processing
Built-in support for batch analysis of multiple posts:
- Progress tracking with callbacks
- Cancellation support
- Error handling and retry logic
- Used by posts table for scanning SEO scores

## Analysis Types

The system automatically detects the appropriate analysis type based on context:

| Type | When Used | Word Count | Assessors |
|------|-----------|------------|-----------|
| `default` | Standard posts/pages | 300+ recommended | Full SEO + Readability |
| `productPage` | WooCommerce products | 200+ recommended | Product-specific (with video) |
| `storeBlog` | WooCommerce shop page | 300+ recommended | Store blog specific |
| `storePostsAndPages` | Posts on WC sites | 300+ recommended | Store-optimized |
| `collectionPage` | Product categories/tags | 30+ minimum | Collection-specific |
| `taxonomy` | Standard taxonomies | 150+ recommended | Taxonomy-specific |
| `cornerstone` | Important content | Stricter boundaries | Enhanced scoring |

**See**: [Custom Analysis Type Documentation](../../vue/plugins/tru-seo/utils/README-customAnalysisType.md)

## Key Components

### Core Modules

#### `/cache/`
- `CacheManager.js` - Centralized cache registry and management
- Provides `registerCache()`, `clearAllCaches()`, `getCacheStats()`

#### `/config/`
- Default analysis configurations
- Language-specific settings
- Assessment thresholds and boundaries

#### `/core/`
- Core utility functions
- Shared business logic

#### `/errors/`
- Custom error types for better error handling

#### `/helpers/`
- Utility functions for text processing
- HTML entity handling
- String formatting
- Type checking
- Shortlinker integration
- `spellChecker.js` - Module-level singleton wrapping Hunspell WASM. Provides `initialize()`, `check()`, `suggest()`, `isReady()`. Uses trie-based prefix search augmented with Hunspell edit-distance for comprehensive suggestions.

#### `/languageProcessing/`
- `AbstractResearcher.js` - Base class for language-specific researchers
- Language-specific helpers (word counting, sentence parsing, etc.)
- Support for 40+ languages with varying capabilities

#### `/languages/`
- Language pack modules (Arabic, English, Spanish, etc.)
- Lazy-loaded via `LanguageFactory.js`
- Language-specific stemming, word forms, function words

#### `/markers/`
- Text highlighting system
- Marks keyphrase occurrences in content
- Used by UI to highlight problematic text

#### `/parsers/`
- HTML parsing and cleaning
- Sentence detection
- Word tokenization
- Language-specific parsing

#### `/researches/`
- Individual research functions (e.g., `getKeywordDensity`, `getFleschReadingScore`)
- Reusable across different assessors
- Cached via research cache

#### `/scoring/`

**`/assessments/`**
- Individual assessment implementations
- Each assessment extends `Assessment` base class
- **Documentation**: [README.md](scoring/assessments/README.md), [KEYPHRASE MATCHING.md](scoring/assessments/KEYPHRASE%20MATCHING.md)

**`/assessors/`**
- Assessor classes that group related assessments
- Context-specific assessors (cornerstone, taxonomy, product, collection)
- **Documentation**: [ASSESSORS OVERVIEW.md](scoring/assessors/ASSESSORS%20OVERVIEW.md)

**`/interpreters/`**
- Score interpretation (rating conversion, result filtering)
- `scoreToRating()` - Converts numeric scores to traffic light ratings

**`/renderers/`**
- `AssessorPresenter.js` - Formats results for UI display

**`/scoreAggregators/`**
- Combines individual assessment scores into overall SEO/Readability scores
- `SEOScoreAggregator.js`, `ReadabilityScoreAggregator.js`

#### `/values/`
- Core data structures
- `Paper.js` - Represents content to be analyzed
- `AssessmentResult.js` - Represents assessment output
- `Mark.js` - Represents text highlight

#### `/worker/`
- Web Worker implementation
- Task scheduling and queue management
- Message passing and serialization
- `MainThreadAnalysisRunner.js` - Fallback when Web Workers are disabled (`VITE_TRUSEO_WEB_WORKER` not set). Same API as `AnalysisWorkerWrapper`, runs analysis on main thread using a fake scope that routes `postMessage` to promise handlers.
- **Documentation**: [readme.md](worker/readme.md)

### Vue Layer Components (Phase 2)

#### `src/vue/plugins/tru-seo/highlighter/`
Six modules for editor-specific content highlighting:
- `blockEditor.js` - Gutenberg custom RichText format type registration and application
- `classicEditor.js` - TinyMCE annotation API integration
- `tinymce.js` - TinyMCE CSS generation for highlight styles and event suppression
- `blockFormats.js` - Block format type definitions
- `wpDataStore.js` - Custom WordPress data store for highlight state persistence
- `spellingReplace.js` - Spelling word replacement logic for both editors

#### `src/vue/composables/TruSeoHighlighter.js`
Orchestrates the highlighting lifecycle: style injection, mark creation, hover popover positioning, editor observation, and reset cycles. Returns the `watchHighlightSentences` watcher.

#### `src/vue/stores/TruSeoHighlighterStore.js`
Pinia store managing highlight state: `highlightAnalyzers`, `highlightMarks`, `highlightPopover`, `hoveredMarkId`, `suggestionsCache`. Key actions: `toggleHighlightAnalyzer()`, `fetchSpellingSuggestions()`, `clearAll()`.

#### `src/vue/plugins/tru-seo/services/KeywordCannibalizationService.js`
REST API integration for keyword cannibalization detection. Provides `fetch(keyphrase, postId)` (cached by normalized keyphrase) and `clear()` to invalidate cache.

## Caching System

### CacheManager

The `CacheManager` provides centralized control over all caches in the TruSEO system:

```javascript
import { registerCache, clearAllCaches, getCacheStats } from './cache/CacheManager'

// Register a cache
registerCache('myCache', {
	clear: () => myCache.clear(),
	size: () => myCache.size
})

// Clear all caches (e.g., on post navigation)
clearAllCaches()

// Get statistics for debugging
const stats = getCacheStats()
// { myCache: 42, researchCache: 128, ... }
```

### Cache Keys

Cache keys are generated from content fingerprints to ensure accurate invalidation:

```javascript
// Analysis result cache key
const fingerprint = generateFingerprint({
	content,
	keyphrase,
	additionalKeywords,
	locale,
	customAnalysisType
})

// Research cache key (for specific research function)
const cacheKey = `${researchName}_${contentFingerprint}`
```

### Cache Strategies

1. **LRU Eviction**: Least Recently Used items are removed when cache is full
2. **Fingerprint Invalidation**: Content changes automatically invalidate related caches
3. **Manual Clearing**: Caches cleared on post navigation or when explicitly requested
4. **Size Limits**: Each cache has configurable maximum size

## Worker System

### Architecture

The worker system uses a request/response pattern with promise-based API:

```javascript
// Main thread
const results = await analysisWorkerWrapper.analyze(paper, customAnalysisType)

// Worker thread receives message, processes, sends response
workerInstance.handleMessage({ data })
```

### Worker Lifecycle

1. **Initialization**: Worker file loads and sends 'worker_script_loaded' message
2. **First Message**: Language pack and assessors are lazy-loaded
3. **Analysis Requests**: Queued via Scheduler, processed by Task
4. **Results**: Serialized and sent back to main thread

### Lazy Loading Flow

```
┌─────────────────────────────────────────────────────┐
│ 1. First analyze() call                            │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│ 2. Worker detects first message                     │
│    - Loads language pack for locale                 │
│    - Creates AnalysisWebWorker instance             │
│    - Registers premium assessments                  │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│ 3. If customAnalysisType is e-commerce:             │
│    - Dynamically import ecommerceAssessors.js       │
│    - Register all e-commerce assessors              │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│ 4. Process queued message                           │
│    - Run analysis with appropriate assessors        │
│    - Return results                                 │
└─────────────────────────────────────────────────────┘
```

**See**: [worker/readme.md](worker/readme.md) for detailed worker documentation.

## Custom Assessors

Custom assessors provide context-specific analysis for different content types.

### E-commerce Assessors (WooCommerce)

Loaded lazily when WooCommerce content is detected:

```javascript
// src/app/tru-seo/worker/ecommerceAssessors.js
export const assessorConfigs = {
	productPage: {
		seo: ProductSEOAssessor,
		content: ProductContentAssessor,
		cornerstoneSeo: ProductCornerstoneSEOAssessor,
		// ...
	},
	collectionPage: { /* ... */ },
	storeBlog: { /* ... */ },
	storePostsAndPages: { /* ... */ }
}
```

### Custom Analysis Type Detection

The system automatically detects the appropriate analysis type:

```javascript
const customAnalysisType = getCustomAnalysisType(currentPost, rootStore)
// Returns: '', 'productPage', 'collectionPage', 'storeBlog', or 'storePostsAndPages'
```

**See**: [Custom Analysis Type Documentation](../../vue/plugins/tru-seo/utils/README-customAnalysisType.md)

## Language Support

### Supported Languages (40+)

The system supports over 40 languages with varying levels of language-specific features:

- Full support: English, German, Spanish, French, Dutch, Italian, Polish, Portuguese, Russian
- Partial support: Arabic, Chinese, Japanese, Korean, and many more
- Basic support: All other languages (word counting, basic readability)

### Language Features

Different languages have different capabilities:

| Feature | Languages |
|---------|-----------|
| Word Forms (stemming) | English, German, Spanish, French, Dutch, etc. (18 languages) |
| Word Complexity | English, German, Spanish, Dutch, French, Italian, Polish, Portuguese, Russian |
| Transition Words | English, German, Spanish, French, Dutch, Italian, Polish, Portuguese, Russian, Swedish |
| Passive Voice | English, German, Spanish, French, Dutch, Italian, Polish, Portuguese, Russian, Swedish |

### Lazy Loading Languages

Languages are loaded on-demand based on the user's locale:

```javascript
// src/app/tru-seo/languages/LanguageFactory.js
export async function loadLanguageInstance(locale) {
	const langCode = getLanguage(locale) // 'en_US' → 'en'

	// Return cached instance if exists
	if (languageInstances[langCode]) {
		return languageInstances[langCode]
	}

	// Load language class dynamically (code-split per language)
	const loader = languageLoaders[langCode]
	if (loader) {
		const LanguageClass = await loader()
		languageInstances[langCode] = new LanguageClass()
		return languageInstances[langCode]
	}

	// Fallback to English
	const EnLanguage = await languageLoaders.en()
	languageInstances.en = new EnLanguage()
	return languageInstances.en
}
```

## Development Guide

### Running Analysis

```javascript
import { TruSeoWrapper } from '@/vue/plugins/tru-seo'

// Initialize wrapper (usually done once on app load)
const truSeo = new TruSeoWrapper()
await truSeo.initializeWorker()

// Run analysis (gets title, description, keyphrase from store/DOM)
const results = await truSeo.runAnalysis({
	postId: 123,                           // Post ID
	content: '<p>Your content here...</p>', // Optional: overrides DOM content
	slug: 'your-slug'                       // Optional: overrides current slug
})

// Results structure (transformed for database/store)
{
	allResults: Map,              // All results indexed by identifier
	seoScore: 78,                 // Combined SEO + readability score
	seoResults: {                 // SEO-specific results
		score: 82,
		results: { ... }
	},
	additionalKeywordsResults: [] // Additional keywords analysis
}
```

### Creating Custom Assessments

```javascript
import { Assessment } from '../assessment'

class MyCustomAssessment extends Assessment {
	/**
	 * Executes the assessment.
	 *
	 * @param {Paper} paper The paper to analyze.
	 * @param {Researcher} researcher The researcher.
	 * @returns {AssessmentResult} The result.
	 */
	getResult (paper, researcher) {
		const wordCount = researcher.getResearch('wordCountInText')

		const result = new AssessmentResult()
		result.setScore(wordCount > 300 ? 9 : 3)
		result.setText(wordCount > 300 ? 'Good length!' : 'Too short.')

		return result
	}
}

export default MyCustomAssessment
```

### Registering Custom Assessments

```javascript
// In worker/registerPremiumAssessments.js or similar
import MyCustomAssessment from '../scoring/assessments/seo/MyCustomAssessment'

export default function registerPremiumAssessments (worker, languageCode) {
	// Register assessment with the worker
	worker.registerAssessment('myCustomAssessment', MyCustomAssessment, 'seo')
}
```

### Debugging

#### Enable Debug Logging

```javascript
// In browser console
localStorage.setItem('aioseo_truseo_debug', 'true')
```

#### Check Cache Statistics

```javascript
import { getCacheStats } from '@/app/tru-seo/cache/CacheManager'

console.log('Cache stats:', getCacheStats())
```

#### Monitor Worker Messages

```javascript
// The worker wrapper logs all messages in debug mode
truSeo.analysisWorkerWrapper.onmessage = (event) => {
	console.log('Worker message:', event.data)
}
```

### Testing

#### Unit Tests
```bash
npm run test:unit -- tru-seo
```

#### Integration Tests
```bash
npm run test:integration -- tru-seo
```

## Migration Notes

### From 4.x to 5.0 (TruSEO 2.0)

**Breaking Changes:**

1. **Removed `App` class**: Analysis now runs exclusively via Web Workers
   - Old: `truSeo.app.analyze()`
   - New: `truSeo.runAnalysis()`

2. **Changed result structure**: Results now include `overallScore` and `readabilityScore`
   - Old: `results.score.overall`
   - New: `results.overallScore`

3. **Custom assessor registration**: Now done in worker context
   - Old: `truSeo.registerAssessment()`
   - New: `worker.registerAssessment()` (in worker file)

**New Features:**

1. Fingerprint-based caching
2. Lazy-loaded language packs
3. Custom analysis types (e-commerce)
4. Batch processing support
5. Centralized cache management

### Phase 2 New Features

1. **TruSEO Highlighter** - Real-time content highlighting in Block Editor and Classic Editor with interactive popover
2. **Spell Checker** - WASM Hunspell integration with trie-based suggestions
3. **Keyword Cannibalization** - SEO assessment for competing focus keyphrases across posts
4. **MainThreadAnalysisRunner** - Fallback for environments without Web Workers
5. **Enhanced BatchScanManager** - Worker pool with configurable concurrency and progress UI

## Additional Documentation

- [Assessment Scoring Overview](scoring/assessments/README.md)
- [Assessors Overview](scoring/assessors/ASSESSORS%20OVERVIEW.md)
- [Keyphrase Matching Criteria](scoring/assessments/KEYPHRASE%20MATCHING.md)
- [Worker Architecture](worker/readme.md)
- [Custom Analysis Types](../../vue/plugins/tru-seo/utils/README-customAnalysisType.md)
- [SEO Scoring Criteria](scoring/assessments/SCORING%20SEO.md)
- [Readability Scoring Criteria](scoring/assessments/SCORING%20READABILITY.md)
- [Taxonomy Scoring](scoring/assessments/SCORING%20TAXONOMY.md)
- [Product Page Scoring](scoring/assessments/SCORING%20SEO%20PRODUCT.md)
- [Collection Page Scoring](scoring/assessments/SCORING%20SEO%20COLLECTION.md)

## Performance Benchmarks

Typical analysis times (on modern hardware):

| Content Length | First Analysis | Cached Analysis | Batch (10 posts) |
|----------------|----------------|-----------------|------------------|
| 500 words | ~200ms | ~50ms | ~1.2s |
| 1,500 words | ~400ms | ~80ms | ~2.5s |
| 5,000 words | ~800ms | ~150ms | ~6s |

*Note: First analysis includes language pack loading time*

## Support

For issues, questions, or contributions:

- **GitHub Issues**: [aioseo/aioseo](https://github.com/awesomemotive/aioseo)
- **Documentation**: [aioseo.com/docs](https://aioseo.com/docs)
- **Support**: [aioseo.com/support](https://aioseo.com/support)

## License

This is proprietary software. All rights reserved by Awesome Motive, Inc.
