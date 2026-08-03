# TruSEO Quick Reference Guide

Quick reference for developers working with the TruSEO analysis system.

## Table of Contents

- [Common Tasks](#common-tasks)
- [API Reference](#api-reference)
- [File Structure](#file-structure)
- [Code Patterns](#code-patterns)
- [Debugging](#debugging)
- [Testing](#testing)

## Common Tasks

### Running Analysis

```javascript
// Basic analysis using composable
import { useTruSeoScore } from '@/vue/composables/TruSeoScore'

const { runAnalysis } = useTruSeoScore()
await runAnalysis(postId)

// Or using TruSeoWrapper directly
import { getTruSeoInstance } from '@/vue/plugins/tru-seo/TruSeoSingleton'
const truSeo = await getTruSeoInstance()
const results = await truSeo.runAnalysis({ postId })
```

### Getting Analysis Results

```javascript
// Access from store (after analysis)
import { usePostEditorStore } from '@/vue/stores'
const postEditorStore = usePostEditorStore()

// SEO and readability results
const seoAnalysis = postEditorStore.seoAnalysis
const contentAnalysis = postEditorStore.contentAnalysis
```

### Batch Scanning Posts

```javascript
import BatchScanManager from '@/vue/standalone/posts-table/BatchScanManager'

const batchManager = new BatchScanManager({
	maxWorkers: 5,
	posts: postsArray,
	startDelay: 2000
})

// Start batch scanning
await batchManager.start()

// Cancel scanning if needed
batchManager.cleanup()
```

### Clearing Caches

```javascript
import { clearAllCaches, clearCache, getCacheStats } from '@/app/tru-seo/cache/CacheManager'

// Clear all caches (on post navigation)
clearAllCaches()

// Clear specific cache
clearCache('researchCache')

// Get cache stats
const stats = getCacheStats()
console.log('Cache stats:', stats)
```

### Toggling Highlighter

```javascript
import { useTruSeoHighlighterStore } from '@/vue/stores'

const store = useTruSeoHighlighterStore()

// Toggle a specific analyzer
store.toggleHighlightAnalyzer('sentenceLength')

// Check which analyzers are active
store.highlightAnalyzers // Map of active analyzers
```

### Debugging Spell Checker

```javascript
// In worker context (or via MainThreadAnalysisRunner)
import spellChecker from '@/app/tru-seo/helpers/spellChecker'

console.log('Spell checker ready:', spellChecker.isReady())
console.log('Check "test":', spellChecker.check('test'))
console.log('Suggestions for "tset":', spellChecker.suggest('tset'))
```

### Custom Analysis Type

```javascript
import { getCustomAnalysisType } from '@/vue/plugins/tru-seo/utils/customAnalysisType'

const customAnalysisType = getCustomAnalysisType(currentPost, rootStore)
// Returns: '', 'productPage', 'collectionPage', 'storeBlog', or 'storePostsAndPages'
```

## API Reference

### TruSeoWrapper

Main interface for TruSEO analysis.

```javascript
import { TruSeoWrapper } from '@/vue/plugins/tru-seo'

const truSeo = new TruSeoWrapper()

// Initialize worker (call once)
await truSeo.initializeWorker()

// Run analysis (gets most data from store/DOM)
const results = await truSeo.runAnalysis({
	postId: 123,     // Required: Post ID
	content: '...',  // Optional: Override content
	slug: 'slug'     // Optional: Override slug
})
```

### useTruSeoScore Composable

Vue composable for TruSEO score utilities and helpers.

```javascript
import { useTruSeoScore } from '@/vue/composables/TruSeoScore'

const {
	getErrorClass,     // Function: Get CSS class based on error count
	getErrorDisplay,   // Function: Get error count display text
	getScoreClass,     // Function: Get CSS class based on score
	runAnalysis,       // Function: Run analysis for a post
	strings            // Object: Translated UI strings
} = useTruSeoScore()

// Example usage
const errorClass = getErrorClass(5) // Returns 'red' or 'green'
const scoreClass = getScoreClass(78) // Returns 'green', 'orange', 'red', or 'none'
```

### CacheManager

Centralized cache management.

```javascript
import {
	registerCache,
	unregisterCache,
	clearAllCaches,
	clearCache,
	getCacheSize,
	getCacheStats
} from '@/app/tru-seo/cache/CacheManager'

// Register a cache
registerCache('myCache', {
	clear: () => myCache.clear(),
	size: () => myCache.size
})

// Clear all caches
clearAllCaches()

// Get statistics
const stats = getCacheStats()
// { myCache: { size: 10 }, researchCache: { size: 50 }, ... }
```

### BatchScanManager

Batch scanning for posts table.

```javascript
import BatchScanManager from '@/vue/standalone/posts-table/BatchScanManager'

// Initialize with configuration
const manager = new BatchScanManager({
	maxWorkers: 5,           // Concurrent workers
	posts: postsArray,       // Array of post objects
	startDelay: 2000         // Delay before starting (ms)
})

// Start batch scan
await manager.start()

// Cleanup (called automatically on navigation)
manager.cleanup()
```

### TruSeoHighlighterStore

Pinia store managing highlight state and popover interactions.

```javascript
import { useTruSeoHighlighterStore } from '@/vue/stores'

const store = useTruSeoHighlighterStore()

// Toggle an analyzer for highlighting
store.toggleHighlightAnalyzer('spellingChecker')

// Check if highlighting is active
store.highlightingEnabled // boolean

// Get all highlight sentences from analysis results
store.allHighlightSentences // computed getter

// Get hovered mark's assessment text
store.hoveredMarkAssessmentText // string

// Fetch spelling suggestions for a word
await store.fetchSpellingSuggestions('mispeled')
store.hoveredMarkSuggestions // string[]

// Clear all highlights
store.clearAll()
```

### KeywordCannibalizationService

REST API integration for keyword cannibalization checks.

```javascript
import KeywordCannibalizationService from '@/vue/plugins/tru-seo/services/KeywordCannibalizationService'

const service = new KeywordCannibalizationService()

// Fetch cannibalization data (cached by keyphrase)
const result = await service.fetch('focus keyphrase', 123)
// { cannibalizingPosts: [{ title: '...', id: 456 }] }

// Clear cache
service.clear()
```

### SpellChecker (worker context)

Hunspell WASM singleton for spell checking inside the worker.

```javascript
import spellChecker from '@/app/tru-seo/helpers/spellChecker'

// Initialize (lazy, fetches dictionary files)
await spellChecker.initialize('en', 'en_US', '/wp-content/uploads/aioseo/dictionaries')

spellChecker.isReady()         // true
spellChecker.check('hello')    // true (correctly spelled)
spellChecker.check('helllo')   // false (misspelled)
spellChecker.suggest('helllo', 5) // ['hello', 'hell', ...]
```

### Results Helper

Process and update results in UI.

```javascript
import { updateResults, filterResults } from '@/vue/plugins/tru-seo/helpers/resultsHelper'

// Update analysis results in store
updateResults(postEditorStore, results)

// Filter results by rating
const errors = filterResults(results.seo, 'error')
const warnings = filterResults(results.seo, 'warning')
const goods = filterResults(results.seo, 'good')
```

## File Structure

```
src/app/tru-seo/
├── cache/                      # Cache management
│   ├── CacheManager.js         # Centralized cache registry
│   └── index.js
├── config/                     # Configuration files
├── core/                       # Core utilities
├── errors/                     # Custom error types
├── helpers/                    # Utility functions
│   ├── hash.js                 # Fingerprint generation
│   ├── spellChecker.js         # Hunspell WASM spell checker singleton
│   ├── createMeasurementElement.js
│   └── ...
├── languageProcessing/         # Language processing
│   ├── AbstractResearcher.js   # Base researcher class
│   └── helpers/                # Processing helpers
├── languages/                  # Language packs (lazy-loaded)
│   ├── LanguageFactory.js      # Dynamic language loading
│   ├── en/                     # English
│   ├── es/                     # Spanish
│   └── ...
├── markers/                    # Text marking/highlighting
├── parsers/                    # HTML/text parsing
├── researches/                 # Research functions
│   ├── getKeywordDensity.js
│   ├── getFleschReadingScore.js
│   ├── getSpellingErrors.js    # Spelling error detection research
│   └── ...
├── scoring/                    # Scoring system
│   ├── assessments/            # Individual assessments
│   │   ├── seo/
│   │   └── readability/
│   ├── assessors/              # Assessor classes
│   │   ├── cornerstone/
│   │   ├── productPages/
│   │   ├── collectionPages/
│   │   └── ...
│   ├── interpreters/           # Score interpretation
│   └── scoreAggregators/       # Score aggregation
├── values/                     # Data structures
│   ├── Paper.js                # Content representation
│   ├── AssessmentResult.js     # Assessment output
│   └── Mark.js                 # Text highlight
├── worker/                     # Web Worker
│   ├── AnalysisWebWorker.js    # Worker implementation
│   ├── AnalysisWorkerWrapper.js # Main thread wrapper
│   ├── MainThreadAnalysisRunner.js # Main-thread fallback runner
│   ├── ecommerceAssessors.js   # E-commerce (lazy-loaded)
│   ├── scheduler/              # Task scheduling
│   └── transporter/            # Message serialization
├── index.js                    # Worker entry point
├── README.md                   # Main documentation
├── CHANGELOG.md                # Version history
└── QUICK_REFERENCE.md          # This file
```

### Vue Layer (src/vue/)

```
src/vue/plugins/tru-seo/
├── highlighter/                    # Editor highlighting modules
│   ├── blockEditor.js              # Gutenberg custom RichText format types
│   ├── classicEditor.js            # TinyMCE annotation API
│   ├── blockFormats.js             # Block format registration
│   ├── wpDataStore.js              # Custom WP data store for highlight state
│   ├── tinymce.js                  # TinyMCE CSS generation and event suppression
│   └── spellingReplace.js          # Spelling word replacement in editors
├── services/
│   └── KeywordCannibalizationService.js  # REST API cannibalization check
└── ...

src/vue/composables/TruSeoHighlighter.js  # Highlighting lifecycle orchestration
src/vue/stores/TruSeoHighlighterStore.js   # Pinia store for highlight state
```

## Code Patterns

### Creating a Custom Assessment

```javascript
import { Assessment } from '../assessment'
import AssessmentResult from '../../values/AssessmentResult'

/**
 * Custom assessment description.
 *
 * @since {next}
 */
class MyCustomAssessment extends Assessment {
	/**
	 * Constructor.
	 *
	 * @param {Object} config Configuration options.
	 * @since {next}
	 */
	constructor (config = {}) {
		super()
		this._config = config
	}

	/**
	 * Executes the assessment.
	 *
	 * @param {Paper} paper The paper to analyze.
	 * @param {Researcher} researcher The researcher.
	 * @returns {AssessmentResult} The assessment result.
	 * @since {next}
	 */
	getResult (paper, researcher) {
		// Get research data
		const data = researcher.getResearch('researchName')

		// Create result
		const result = new AssessmentResult()

		// Calculate score (0-9)
		if (data.meetsRequirement) {
			result.setScore(9)
			result.setText('Great job!')
			result.setHasMarks(false)
		} else {
			result.setScore(3)
			result.setText('Needs improvement.')
			result.setHasMarks(false)
		}

		return result
	}

	/**
	 * Checks if assessment is applicable.
	 *
	 * @param {Paper} paper The paper to check.
	 * @returns {boolean} True if applicable.
	 * @since {next}
	 */
	isApplicable (paper) {
		return paper.hasText()
	}
}

export default MyCustomAssessment
```

### Creating a Custom Research

```javascript
import { memoize } from 'lodash-es'

/**
 * Custom research function.
 *
 * @param {Paper} paper The paper to analyze.
 * @returns {Object} Research results.
 * @since {next}
 */
function myCustomResearch (paper) {
	const text = paper.getText()

	// Perform analysis
	const result = {
		count: 0,
		percentage: 0
	}

	// ... analysis logic ...

	return result
}

// Memoize for caching (automatic cache key based on arguments)
export default memoize(myCustomResearch)
```

### Registering Custom Assessments

```javascript
// In worker/registerPremiumAssessments.js
import MyCustomAssessment from '../scoring/assessments/seo/MyCustomAssessment'

export default function registerPremiumAssessments (worker, languageCode) {
	// Register SEO assessment
	worker.registerAssessment(
		'myCustomAssessment',
		MyCustomAssessment,
		'seo'
	)

	// Language-specific registration
	if ([ 'en', 'de', 'es' ].includes(languageCode)) {
		worker.registerAssessment(
			'languageSpecificAssessment',
			LanguageSpecificAssessment,
			'readability'
		)
	}
}
```

### Using Cache with Research

```javascript
import { registerCache } from '../../cache/CacheManager'

// Create LRU cache
const cache = new Map()
const MAX_SIZE = 100

// Register with CacheManager
registerCache('myResearchCache', {
	clear: () => cache.clear(),
	size: () => cache.size
})

/**
 * Research with manual caching.
 *
 * @param {Paper} paper The paper.
 * @returns {Object} Results.
 * @since {next}
 */
export function myResearch (paper) {
	const key = generateKey(paper)

	// Check cache
	if (cache.has(key)) {
		return cache.get(key)
	}

	// Perform research
	const result = performAnalysis(paper)

	// Cache result (with LRU eviction)
	if (cache.size >= MAX_SIZE) {
		const firstKey = cache.keys().next().value
		cache.delete(firstKey)
	}
	cache.set(key, result)

	return result
}
```

## Debugging

### Enable Debug Logging

```javascript
// In browser console
localStorage.setItem('aioseo_truseo_debug', 'true')
localStorage.setItem('aioseo_worker_debug', 'true')

// Reload page
location.reload()
```

### Check Cache Statistics

```javascript
import { getCacheStats } from '@/app/tru-seo/cache/CacheManager'

// In browser console
console.table(getCacheStats())
```

### Monitor Worker Messages

```javascript
// In TruSeoWrapper or similar
truSeo.analysisWorkerWrapper.worker.addEventListener('message', (event) => {
	console.log('[Worker Message]', event.data)
})
```

### Inspect Analysis Results

```javascript
// In browser console (assuming you have access to the store)
const results = window.$store?.state.postEditorStore?.analysis
console.log('SEO Results:', results?.seo)
console.log('Readability Results:', results?.readability)
console.log('Overall Score:', results?.overallScore)
```

### Check Custom Analysis Type

```javascript
import { getCustomAnalysisType } from '@/vue/plugins/tru-seo/utils/customAnalysisType'

// In component
const customAnalysisType = getCustomAnalysisType(
	this.postEditorStore.currentPost,
	this.rootStore
)
console.log('Analysis Type:', customAnalysisType)
```

### Profile Performance

```javascript
// Measure analysis time
console.time('TruSEO Analysis')
await truSeo.runAnalysis()
console.timeEnd('TruSEO Analysis')

// Measure with details
performance.mark('analysis-start')
await truSeo.runAnalysis()
performance.mark('analysis-end')
performance.measure('analysis', 'analysis-start', 'analysis-end')
console.log(performance.getEntriesByName('analysis'))
```

## Testing

### Unit Test Example

```javascript
import MyCustomAssessment from '../MyCustomAssessment'
import Paper from '../../../values/Paper'
import EnglishResearcher from '../../../languages/en/Researcher'

describe('MyCustomAssessment', () => {
	let assessment
	let paper
	let researcher

	beforeEach(() => {
		assessment = new MyCustomAssessment()
		researcher = new EnglishResearcher(paper)
	})

	test('returns good score for valid content', () => {
		paper = new Paper('Content with requirement met', {
			keyword: 'requirement'
		})

		const result = assessment.getResult(paper, researcher)

		expect(result.getScore()).toBe(9)
		expect(result.getText()).toContain('Great job')
	})

	test('returns bad score for invalid content', () => {
		paper = new Paper('Content without requirement', {
			keyword: 'requirement'
		})

		const result = assessment.getResult(paper, researcher)

		expect(result.getScore()).toBe(3)
		expect(result.getText()).toContain('improvement')
	})
})
```

### Integration Test Example

```javascript
import { TruSeoWrapper } from '@/vue/plugins/tru-seo'

describe('TruSeoWrapper Integration', () => {
	let truSeo

	beforeEach(async () => {
		truSeo = new TruSeoWrapper()
		await truSeo.initializeWorker()
	})

	test('analyzes content successfully', async () => {
		const results = await truSeo.runAnalysis({
			postId: 123,
			content: '<p>Test content with test keyphrase.</p>',
			slug: 'test-slug'
		})

		expect(results).toHaveProperty('seoScore')
		expect(results).toHaveProperty('seoResults')
		expect(results).toHaveProperty('additionalKeywordsResults')
		expect(results.seoScore).toBeGreaterThanOrEqual(0)
		expect(results.seoScore).toBeLessThanOrEqual(100)
	})
})
```

## Common Gotchas

### 1. Worker Not Initialized

```javascript
// BAD - Worker not initialized
const results = await truSeo.runAnalysis({ postId: 123 })
// Error: Worker not initialized

// GOOD - Initialize first (happens automatically in most cases)
await truSeo.initializeWorker()
const results = await truSeo.runAnalysis({ postId: 123 })
```

### 2. Cache Not Cleared on Navigation

```javascript
// BAD - Old cache persists
router.push('/new-post')

// GOOD - Clear cache on navigation
import { clearAllCaches } from '@/app/tru-seo/cache/CacheManager'

router.beforeEach((to, from, next) => {
	if (to.params.postId !== from.params.postId) {
		clearAllCaches()
	}
	next()
})
```

### 3. Missing Custom Analysis Type

```javascript
// BAD - Wrong analysis used
await truSeo.runAnalysis({ content, keyphrase })

// GOOD - Include custom analysis type
const customAnalysisType = getCustomAnalysisType(currentPost, rootStore)
await truSeo.runAnalysis({
	content,
	keyphrase,
	customAnalysisType // Important!
})
```

### 4. Not Handling Async Properly

```javascript
// BAD - Not awaited
truSeo.runAnalysis({ postId: 123 })
// Results not ready yet

// GOOD - Await result
const results = await truSeo.runAnalysis({ postId: 123 })
// Now results are available
```

### 5. Highlighter Disabled in Page Builders

The TruSEO Highlighter is explicitly disabled for page builder editors (`isPageBuilderEditor()`). It only works in the Block Editor (Gutenberg) and Classic Editor (TinyMCE).

### 6. Spell Checker Dictionary Not Loading

The spell checker fails silently if dictionary files are not found at the expected URL. Check that `.aff` and `.dic` files exist at `{dictionaryBaseUrl}/{code}/{locale}.aff`. The spell checker sets `_failed = true` on error and will not retry for the same locale — a page reload is needed to retry.

## Quick Links

- [Main README](README.md) - Complete documentation
- [Worker Documentation](worker/readme.md) - Web Worker details
- [Assessment Scoring](scoring/assessments/README.md) - Scoring criteria
- [Assessors Overview](scoring/assessors/ASSESSORS%20OVERVIEW.md) - Assessor types
- [Custom Analysis Types](../../vue/plugins/tru-seo/utils/README-customAnalysisType.md) - Analysis type detection
- [Changelog](CHANGELOG.md) - Version history

## Support

For questions or issues:
- Check existing documentation first
- Review code examples in this guide
- Check browser console for errors
- Enable debug logging
- Create a GitHub issue with reproducible example
