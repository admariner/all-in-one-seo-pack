# TruSEO Analysis Web Worker

## Overview

The TruSEO Analysis Web Worker performs SEO and readability analysis in a background thread, preventing UI blocking. The worker uses lazy loading to minimize initial bundle size and optimize performance.

## Architecture

### Main Components

#### Plugin (AIOSEO)
The main application that requests analysis.

#### AnalysisWorkerWrapper
The main-thread API for the worker. Provides a promise-based interface for analysis requests:

```javascript
const results = await analysisWorkerWrapper.analyze(paper, customAnalysisType)
```

The wrapper handles:
- Message serialization/deserialization
- Promise management (resolve/reject)
- Worker lifecycle management
- Error handling and retry logic

##### Request
A request holds promise information (resolve & reject) along with optional extra data. Matches requests with responses using unique IDs.

##### Result
A result object contains the analysis payload and optional metadata.

#### AnalysisWebWorker
The worker instance that performs analysis in a background thread. Features:
- Task queue management
- Custom assessor registration
- Language-specific analysis
- Result caching and optimization

##### Scheduler
Polls for queued tasks and manages execution. Implements task prioritization and queue cleanup.

##### Task
Executes analysis and returns results. Each task has:
- `execute()` - Runs the analysis
- `done()` - Returns results to main thread
- Error handling and timeout management

#### MainThreadAnalysisRunner
Main-thread fallback that runs analysis without a Web Worker. Used when `VITE_TRUSEO_WEB_WORKER` is not enabled (e.g. development mode). Provides the same promise-based API as `AnalysisWorkerWrapper`:

- `initialize(configuration)` - Loads language pack, creates `AnalysisWebWorker`, registers premium + e-commerce assessments
- `analyze(paper)` - Runs analysis synchronously on the main thread
- `clearCaches()` - Clears all analysis caches
- `getCacheStats()` - Returns cache statistics
- `requestSuggestions(word)` - Gets spelling suggestions from the spell checker

Uses a fake `scope` object that intercepts `postMessage` calls from `AnalysisWebWorker` and routes them to pending-request promise resolvers. This avoids the Web Worker message boundary while maintaining full API compatibility.

```javascript
// Automatic selection in TruSeoWrapper
const runner = import.meta.env.VITE_TRUSEO_WEB_WORKER
	? new AnalysisWorkerWrapper()
	: new MainThreadAnalysisRunner()
```

## Lazy Loading Architecture

### Initial Load (Minimal Bundle)

The worker file loads with minimal dependencies:
- Core worker infrastructure
- Message handling
- No language packs (loaded on-demand)
- No e-commerce assessors (loaded on-demand)

### Lazy Loading Flow

```
┌─────────────────────────────────────────────────────┐
│ 1. Worker file loads                                │
│    - Sends 'worker_script_loaded' message           │
│    - Sets up message listener                       │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│ 2. First message received                           │
│    - Extract locale from message                    │
│    - Dynamic import: loadLanguageInstance(locale)   │
│    - Creates AnalysisWebWorker with Language        │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│ 3. Register premium assessments                     │
│    - registerPremiumAssessments(worker, langCode)   │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│ 4. Check if e-commerce assessors needed             │
│    - If customAnalysisType is e-commerce:           │
│      - Dynamic import: ecommerceAssessors.js        │
│      - Register all e-commerce assessor classes     │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│ 5. Process message and return results               │
└─────────────────────────────────────────────────────┘
```

### Language Pack Loading

Languages are loaded dynamically based on the user's locale:

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

**Benefits:**
- Users only download the language pack they need
- Initial bundle is ~70% smaller
- Language packs are cached by browser

### E-commerce Assessors Loading

E-commerce assessors are loaded only when WooCommerce content is detected:

```javascript
// src/app/tru-seo/worker/ecommerceAssessors.js
export const assessorConfigs = {
	productPage: {
		seo: ProductSEOAssessor,
		content: ProductContentAssessor,
		cornerstoneSeo: ProductCornerstoneSEOAssessor,
		cornerstoneContent: ProductCornerstoneContentAssessor,
		relatedKeyword: ProductRelatedKeywordAssessor,
		cornerstoneRelatedKeyword: ProductCornerstoneRelatedKeywordAssessor
	},
	collectionPage: { /* ... */ },
	storeBlog: { /* ... */ },
	storePostsAndPages: { /* ... */ }
}
```

**Loading Trigger:**
- `customAnalysisType` is set to an e-commerce type (`productPage`, `collectionPage`, etc.)
- All e-commerce assessors are loaded in a single dynamic import
- Assessors are registered for all post types to support navigation

### Spell Checker Dictionary Loading

The spell checker dictionary is loaded lazily inside the worker (or `MainThreadAnalysisRunner`) after the first analysis message that includes spell checker configuration:

```
1. Worker receives message with spellChecker config
   └─> spellChecker.initialize(code, locale, dictionaryBaseUrl)
       │
       ├─> Fetch {baseUrl}/{code}/{locale}.aff (binary ArrayBuffer)
       ├─> Fetch {baseUrl}/{code}/{locale}.dic (binary ArrayBuffer)
       │
       ├─> Initialize Hunspell WASM module
       │   └─> Mount .aff and .dic into Emscripten virtual filesystem
       │   └─> Create Hunspell instance from mounted files
       │
       ├─> Build trie index from .dic base forms
       │   └─> Capped at 400K words to limit memory
       │   └─> Used for prefix-based suggestion augmentation
       │
       └─> Send 'spellChecker:ready' message to main thread
```

Dictionary files are fetched as binary `ArrayBuffer`s and mounted into the Emscripten virtual filesystem. The WASM approach avoids V8's plain-object property limit that crashes pure-JS libraries (typo-js, nspell) on large dictionaries (e.g. pt_BR with 312K+ words).

If dictionary files are not found, the spell checker sets `_failed = true` and will not retry for the same locale.

## Custom Assessor System

### Assessor Registration

The worker maintains a registry of assessor classes for different analysis types:

```javascript
const assessorMethodMap = {
	seo: 'setCustomSEOAssessorClass',
	cornerstoneSeo: 'setCustomCornerstoneSEOAssessorClass',
	content: 'setCustomContentAssessorClass',
	cornerstoneContent: 'setCustomCornerstoneContentAssessorClass',
	relatedKeyword: 'setCustomRelatedKeywordAssessorClass',
	cornerstoneRelatedKeyword: 'setCustomCornerstoneRelatedKeywordAssessorClass'
}
```

### Analysis Type Selection

The appropriate assessor is selected based on:

1. **customAnalysisType**: Determines which set of assessors to use
   - `productPage` → Product assessors
   - `collectionPage` → Collection assessors
   - `storeBlog` → Store blog assessors
   - `storePostsAndPages` → Store post/page assessors
   - `''` (empty) → Default assessors

2. **Cornerstone Flag**: If `useCornerstone: true`, stricter cornerstone assessors are used

3. **Assessment Type**: SEO vs. Readability vs. Related Keyword

### Assessor Lookup Flow

```
Request: analyze(paper, 'productPage', useCornerstone=true, 'seo')
                         │
                         ▼
         ┌───────────────────────────────┐
         │ Check customAnalysisType      │
         │ 'productPage' → Product       │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │ Check cornerstone flag        │
         │ true → Cornerstone variant    │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │ Select assessor               │
         │ ProductCornerstoneSEOAssessor │
         └───────────┬───────────────────┘
                     │
                     ▼
         ┌───────────────────────────────┐
         │ Run analysis                  │
         │ Return results                │
         └───────────────────────────────┘
```

## Message Protocol

### Request Message Format

```javascript
{
	type: 'analyze', // or 'initialize', 'loadScript', etc.
	id: 'unique-request-id',
	payload: {
		paper: {
			text: '<p>Content...</p>',
			keyword: 'focus keyphrase',
			// ... other paper properties
		},
		customAnalysisType: 'productPage',
		useCornerstone: false,
		locale: 'en_US'
	}
}
```

### Response Message Format

```javascript
{
	type: 'analyzeResult',
	id: 'unique-request-id',
	payload: {
		seo: [
			{ score: 9, rating: 'good', text: 'Assessment result...' },
			// ... more results
		],
		readability: [
			// ... readability results
		],
		overallScore: 78,
		readabilityScore: 65
	}
}
```

### Error Message Format

```javascript
{
	type: 'error',
	id: 'unique-request-id',
	error: {
		message: 'Error description',
		stack: '...'
	}
}
```

## Command Flow

![Command flow](http://www.plantuml.com/plantuml/png/VP3FIiOm4CJlVOezLcXzW1wa1o_UYWgUbsQjeJ79bpyVLF7TtQqXH0Hlk-nl9fEPOyAGyhlf5fCtRM6yWvU0tbEO02sQuuDwM91tkEdA1SQMMWDXeaUwP8hfGVKDnfGB-oyhhGRu12-60wpElkej1qpQMVYI5qvUb4_h6wbiH1pBsBDIzCMi3lVEykBnC0xLQLF5ulICSMyI58ufEVmDANObQA2OJQgnQZd_myttVqgTeBHpoumpLnPKU2QhkFvl)

See this on [PlantUML](http://www.plantuml.com/plantuml/uml/VP3FIiOm4CJlVOezLcXzW1wa1o_UYWgUbsQjeJ79bpyVLF7TtQqXH0Hlk-nl9fEPOyAGyhlf5fCtRM6yWvU0tbEO02sQuuDwM91tkEdA1SQMMWDXeaUwP8hfGVKDnfGB-oyhhGRu12-60wpElkej1qpQMVYI5qvUb4_h6wbiH1pBsBDIzCMi3lVEykBnC0xLQLF5ulICSMyI58ufEVmDANObQA2OJQgnQZd_myttVqgTeBHpoumpLnPKU2QhkFvl)

**Flow:**
1. Main thread calls `analysisWorkerWrapper.analyze(paper, customAnalysisType)`
2. Wrapper creates Request with unique ID and promise
3. Wrapper serializes payload and posts message to worker
4. Worker receives message, schedules Task
5. Task executes analysis with appropriate assessors
6. Worker serializes results and posts message back
7. Wrapper receives message, matches Request by ID
8. Promise resolves with results

The Wrapper returns a Promise which resolves to data and possibly rejects to an error message. The Wrapper encodes the payload when sending the message to the Worker, and vice versa.

## Error Handling

### Worker Errors

```javascript
// Worker catches errors and sends error message
try {
	const results = await runAnalysis(paper)
	postMessage({ type: 'analyzeResult', id, payload: results })
} catch (error) {
	postMessage({
		type: 'error',
		id,
		error: {
			message: error.message,
			stack: error.stack
		}
	})
}
```

### Main Thread Handling

```javascript
// Wrapper rejects promise on error
try {
	const results = await analysisWorkerWrapper.analyze(paper)
} catch (error) {
	console.error('Analysis failed:', error)
	// Display error to user or use fallback
}
```

### Timeout Handling

The wrapper implements timeout logic:

```javascript
const timeout = setTimeout(() => {
	reject(new Error('Analysis timeout'))
}, 30000) // 30 second timeout

// Clear timeout on response
clearTimeout(timeout)
```

## Performance Considerations

### Worker Thread Benefits

- **Non-blocking**: Analysis runs in background, UI remains responsive
- **Parallelism**: Multiple workers can run simultaneously (if needed)
- **Memory Isolation**: Worker memory is separate from main thread

### Bundle Size Optimization

| Optimization | Size Reduction |
|-------------|----------------|
| Lazy-load language packs | ~60% |
| Lazy-load e-commerce assessors | ~10% |
| Code-split parsers | ~5% |
| **Total** | **~70%** |

### Typical Loading Times

| Asset | Size | Load Time (3G) |
|-------|------|----------------|
| Initial worker bundle | ~50KB (gzip) | ~200ms |
| Language pack (English) | ~80KB (gzip) | ~300ms |
| E-commerce assessors | ~20KB (gzip) | ~100ms |
| Spell checker dictionary | ~200-500KB | ~500ms-1s |

### Memory Usage

- Worker heap: ~5-10MB (with language pack)
- Cache memory: ~2-5MB (LRU, auto-managed)
- Total: ~7-15MB per worker instance

## Development Guide

### Debugging Worker

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('aioseo_worker_debug', 'true')
```

### Testing Worker

```javascript
// Unit test
import AnalysisWebWorker from './AnalysisWebWorker'

test('worker analyzes content', () => {
	const worker = new AnalysisWebWorker(self, researcher)
	const results = worker.analyze(paper)
	expect(results).toHaveProperty('seo')
})
```

### Adding New Assessor Type

1. Create assessor file in `scoring/assessors/`
2. Add to `ecommerceAssessors.js` if e-commerce related
3. Register in worker initialization or lazy-load module
4. Update `assessorMethodMap` if needed

## See Also

- [TruSEO README](../README.md) - Main documentation
- [Custom Analysis Types](../../../vue/plugins/tru-seo/utils/README-customAnalysisType.md) - Analysis type detection
- [Assessors Overview](../scoring/assessors/ASSESSORS%20OVERVIEW.md) - Assessor types and usage
