# TruSEO Architecture Overview

This document provides a high-level overview of the TruSEO analysis system architecture.

## System Architecture

### Layer Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│  Vue Components, Stores (Pinia), Composables, UI Components    │
│                                                                 │
│  - Post Editor Sidebar                                          │
│  - Posts Table (with batch scanning)                            │
│  - SEO Score Display                                            │
│  - Analysis Results Display                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Vue Composables / TruSeoWrapper
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                     HIGHLIGHTER LAYER                           │
│  TruSeoHighlighter composable, TruSeoHighlighterStore          │
│                                                                 │
│  - Block Editor: custom RichText format types                   │
│  - Classic Editor: TinyMCE annotation API                       │
│  - Hover popover with assessment text + spelling suggestions    │
│  - DOM mutation observation and copy-without-markup             │
│  - Spelling word replacement via spellingReplace.js             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Analysis results / Highlight state
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                     INTEGRATION LAYER                           │
│  TruSeoWrapper, BatchScanManager, Results Helper                │
│  KeywordCannibalizationService                                  │
│                                                                 │
│  - Analysis orchestration                                       │
│  - Result processing and formatting                             │
│  - Cache management coordination                                │
│  - Custom analysis type detection                               │
│  - Keyword cannibalization REST API integration                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ postMessage / Worker API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    WORKER INTERFACE LAYER                       │
│  AnalysisWorkerWrapper | MainThreadAnalysisRunner (fallback)    │
│  Request/Result, Transporter                                    │
│                                                                 │
│  - Message serialization/deserialization                        │
│  - Promise-based async API                                      │
│  - Request/response matching                                    │
│  - Error handling and timeouts                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Web Worker boundary
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    WEB WORKER THREAD                            │
│  AnalysisWebWorker, Scheduler, Task Queue                       │
│                                                                 │
│  - Background thread execution                                  │
│  - Task scheduling and prioritization                           │
│  - Lazy loading (languages, e-commerce)                         │
│  - Assessor registry management                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Worker uses
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    ANALYSIS ENGINE LAYER                        │
│  Assessors, Researchers, Parsers, Scorers                       │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Assessors   │  │  Researchers │  │   Parsers    │         │
│  │              │  │              │  │              │         │
│  │ - SEO        │  │ - Language-  │  │ - HTML       │         │
│  │ - Readability│  │   specific   │  │ - Sentence   │         │
│  │ - Cornerstone│  │ - Research   │  │ - Word       │         │
│  │ - Product    │  │   functions  │  │ - Tokenize   │         │
│  │ - Collection │  │ - Caching    │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │Score         │  │  Languages   │  │   Cache      │         │
│  │Aggregators   │  │              │  │              │         │
│  │              │  │ - 40+ langs  │  │ - LRU        │         │
│  │ - SEO        │  │ - Lazy load  │  │ - Fingerprint│         │
│  │ - Readability│  │ - Stemming   │  │ - Multi-level│         │
│  │ - Interpreter│  │ - Word forms │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐                                              │
│  │ Spell Check  │                                              │
│  │              │                                              │
│  │ - Hunspell   │                                              │
│  │   WASM       │                                              │
│  │ - Trie index │                                              │
│  │ - Suggestions│                                              │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Analysis Request Flow

```
1. USER INTERACTION
   └─> Click "Save" or edit content
       │
       ▼
2. VUE COMPONENT
   └─> Composable: useTruSeoScore.runAnalysis()
       │
       ▼
3. TRUSEO WRAPPER
   └─> Prepare paper object
   └─> Detect custom analysis type
   └─> Check cache (fingerprint)
       │
       ├─> CACHE HIT: Return cached results ✓
       │
       └─> CACHE MISS: Continue to worker ▼
           │
           ▼
4. WORKER WRAPPER
   └─> Serialize paper and config
   └─> Create Request with Promise
   └─> postMessage to Worker
       │
       ▼
5. WEB WORKER
   └─> Receive message
   └─> Schedule Task
   └─> Execute analysis
       │
       ├─> First time?
       │   └─> Lazy load language pack
       │   └─> Lazy load e-commerce assessors (if needed)
       │
       └─> Select appropriate assessor
           └─> SEO / Readability / Related Keyword
           └─> Default / Cornerstone
           └─> Product / Collection / Store / Standard
           │
           ▼
6. ASSESSOR
   └─> Run registered assessments
       │
       ▼
7. ASSESSMENTS
   └─> Use Researcher to get data
       │
       ▼
8. RESEARCHER
   └─> Execute research functions
   └─> Check research cache
       │
       ├─> CACHE HIT: Return cached research ✓
       │
       └─> CACHE MISS: Continue ▼
           │
           ▼
9. PARSERS / RESEARCH FUNCTIONS
   └─> Parse HTML (check parser cache)
   └─> Count words, sentences, etc.
   └─> Calculate scores
   └─> Cache results
       │
       ▼
10. RESEARCH RESULTS
    └─> Return to Assessments
        │
        ▼
11. ASSESSMENT RESULTS
    └─> Create AssessmentResult objects
    └─> Score: 0-9
    └─> Rating: error/warning/good
    └─> Text: Feedback message
        │
        ▼
12. SCORE AGGREGATOR
    └─> Combine assessment scores
    └─> Calculate overall SEO score
    └─> Calculate readability score
        │
        ▼
13. WORKER RESPONSE
    └─> Serialize results
    └─> postMessage back to main thread
        │
        ▼
14. WORKER WRAPPER
    └─> Deserialize results
    └─> Match Request by ID
    └─> Resolve Promise
        │
        ▼
15. TRUSEO WRAPPER
    └─> Cache results (fingerprint)
    └─> Return to caller
        │
        ▼
16. VUE COMPONENT
    └─> Update store/state
    └─> Render UI
    └─> Show scores and feedback
```

### Highlighting Flow

After analysis completes, the Highlighter layer provides real-time visual feedback in the editor:

```
1. ANALYSIS COMPLETE
   └─> Results stored in postEditorStore.currentPost.truseo
       │
       ▼
2. HIGHLIGHTER STORE
   └─> User toggles analyzer via toggleHighlightAnalyzer()
   └─> allHighlightSentences getter extracts sentences from truseo data
       │
       ▼
3. TRUSEO HIGHLIGHTER COMPOSABLE
   └─> watchHighlightSentences detects change
   └─> reset() cycle begins
       │
       ├─> BLOCK EDITOR PATH
       │   └─> Register custom RichText format types (blockFormats.js)
       │   └─> Apply format to matching text ranges (blockEditor.js)
       │   └─> DOM nodes created by Gutenberg
       │
       └─> CLASSIC EDITOR PATH
           └─> TinyMCE annotator API (classicEditor.js)
           └─> CSS injected for highlight styles (tinymce.js)
           └─> Annotation spans created in iframe
       │
       ▼
4. HOVER INTERACTION
   └─> mouseenter on mark node → show popover
   └─> Popover displays assessment text and feedback
   └─> For spellingChecker: fetch suggestions via requestSuggestions()
   └─> User clicks suggestion → spellingReplace.js applies fix in editor
```

## Module Dependencies

### Core Dependencies

```
index.js (Worker Entry)
├── worker/AnalysisWebWorker.js
│   ├── worker/Scheduler.js
│   ├── worker/Task.js
│   └── scoring/assessors/*
│       └── scoring/assessments/*
│           └── researches/*
│               └── parsers/*
│                   └── languageProcessing/*
├── languages/LanguageFactory.js (Lazy)
│   └── languages/{locale}/* (Lazy, per locale)
└── worker/ecommerceAssessors.js (Lazy, if WC)
    └── scoring/assessors/productPages/*
    └── scoring/assessors/collectionPages/*
    └── scoring/assessors/storeBlog/*
    └── scoring/assessors/storePostsAndPages/*
```

### Main Thread Dependencies

```
TruSeoWrapper
├── AnalysisWorkerWrapper
│   ├── request/Request.js
│   ├── request/Result.js
│   └── transporter/* (serialize/parse)
├── MainThreadAnalysisRunner (fallback, when VITE_TRUSEO_WEB_WORKER is off)
│   ├── AnalysisWebWorker (direct, no Worker boundary)
│   ├── registerPremiumAssessments
│   ├── ecommerceAssessors (lazy)
│   └── Transporter
├── helpers/resultsHelper.js
├── helpers/spellChecker.js (singleton, Hunspell WASM)
├── services/KeywordCannibalizationService.js
├── utils/customAnalysisType.js
└── cache/CacheManager.js

TruSeoHighlighter (composable)
├── TruSeoHighlighterStore (Pinia)
├── highlighter/blockEditor.js
├── highlighter/classicEditor.js
├── highlighter/blockFormats.js
├── highlighter/wpDataStore.js
├── highlighter/tinymce.js
└── highlighter/spellingReplace.js
```

## Caching Strategy

### Three-Level Cache

```
┌─────────────────────────────────────────────────────────────────┐
│                      LEVEL 1: RESULTS CACHE                     │
│  Key: Content fingerprint (SHA-256)                             │
│  Value: Complete analysis results                               │
│  Size: 50 entries (LRU)                                         │
│  Hit Rate: ~70-80% (same content re-analyzed)                   │
└────────────────────────┬────────────────────────────────────────┘
                         │ Cache miss
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LEVEL 2: RESEARCH CACHE                      │
│  Key: Research name + content fingerprint                       │
│  Value: Intermediate research results                           │
│  Size: 100 entries (LRU)                                        │
│  Hit Rate: ~50-60% (shared research across assessments)         │
└────────────────────────┬────────────────────────────────────────┘
                         │ Cache miss
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LEVEL 3: PARSER CACHE                       │
│  Key: HTML fingerprint                                          │
│  Value: Parsed HTML tree                                        │
│  Size: 50 entries (LRU)                                         │
│  Hit Rate: ~40-50% (same HTML structure)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ Cache miss
                         ▼
                   FULL ANALYSIS
```

### Cache Invalidation

```
Content Change
├── User edits content
├── Generate new fingerprint
│   └── Include: content, keyphrase, keywords, locale, analysisType
├── Fingerprint differs from cached
└── All caches invalidated automatically

Navigation
├── User navigates to different post
├── CacheManager.clearAllCaches() called
└── All caches cleared

Manual Clear
├── Debug mode or memory pressure
├── User clicks "Clear Cache" (if available)
└── Specific or all caches cleared
```

## Lazy Loading Strategy

### Loading Timeline

```
Page Load (T=0)
│
├── Main app bundle loads (~200ms)
│   └── TruSeoWrapper, basic UI
│
├── User opens post editor (T=500ms)
│   └── Initialize worker
│       └── Worker file loads (minimal bundle ~50KB)
│           └── Sends 'worker_script_loaded' message
│
├── User starts editing (T=1000ms)
│   └── First analysis triggered
│       │
│       ├── Worker receives first message
│       │   ├── Extract locale: 'en_US'
│       │   └── Dynamic import: LanguageFactory.loadLanguageInstance('en_US')
│       │       └── Load English language pack (~80KB, ~300ms)
│       │
│       └── Check customAnalysisType
│           │
│           ├── If '' (default): Use loaded assessors ✓
│           │
│           └── If 'productPage' (e-commerce):
│               └── Dynamic import: ecommerceAssessors.js (~20KB, ~100ms)
│                   └── Register all e-commerce assessors
│
└── Analysis complete (T=1500ms)
    └── Results returned and cached
    └── Subsequent analyses are fast (~50-200ms)
```

### Bundle Split

```
Initial Bundle (Main Thread)
├── TruSeoWrapper (~10KB)
├── AnalysisWorkerWrapper (~5KB)
├── UI Components (~30KB)
└── Total: ~45KB gzipped

Worker Bundle (Background Thread)
├── Core Worker (~50KB gzipped)
├── Language Pack (~80KB gzipped, lazy)
├── E-commerce (~20KB gzipped, lazy)
└── Total Initial: ~50KB, Total Loaded: ~150KB

Compare to Pre-2.0: ~180KB initial (72% reduction)
```

## Custom Analysis Types

### Decision Tree

```
Is WooCommerce active?
├── NO: customAnalysisType = '' (default assessors)
│
└── YES: Check context and type
    │
    ├── Context: 'post'
    │   ├── postType === 'product'
    │   │   └── customAnalysisType = 'productPage'
    │   │       └── ProductSEOAssessor, ProductContentAssessor
    │   │
    │   ├── postType === 'page' && isShopPage
    │   │   └── customAnalysisType = 'storeBlog'
    │   │       └── StoreBlogSEOAssessor
    │   │
    │   └── postType === 'post' || 'page'
    │       └── customAnalysisType = 'storePostsAndPages'
    │           └── StorePostsAndPagesSEOAssessor
    │
    └── Context: 'term'
        ├── termType === 'product_cat' || 'product_tag'
        │   └── customAnalysisType = 'collectionPage'
        │       └── CollectionSEOAssessor, CollectionContentAssessor
        │
        └── Other term types
            └── customAnalysisType = '' (default taxonomy)
                └── TaxonomyAssessor
```

### Assessor Selection Matrix

| Context | Type | WC Active | Cornerstone | Assessor Used |
|---------|------|-----------|-------------|---------------|
| post | post | No | No | Standard SEO/Content |
| post | post | No | Yes | Cornerstone SEO/Content |
| post | product | Yes | No | Product SEO/Content |
| post | product | Yes | Yes | ProductCornerstone SEO/Content |
| post | page (shop) | Yes | No | StoreBlog SEO |
| post | post/page | Yes | No | StorePostsAndPages SEO/Content |
| term | category | No | No | Taxonomy |
| term | product_cat | Yes | No | Collection SEO/Content |
| term | product_tag | Yes | No | Collection SEO/Content |

## Performance Considerations

### Optimization Techniques

1. **Web Workers**
   - Non-blocking UI
   - Parallel processing capability
   - Memory isolation

2. **Lazy Loading**
   - Reduced initial bundle size
   - Load only what's needed
   - Browser caching of chunks

3. **LRU Caching**
   - Multi-level cache hierarchy
   - Automatic eviction
   - Memory-efficient

4. **Fingerprinting**
   - Fast change detection with strategic sampling
   - Accurate cache invalidation
   - DJB2 hashing algorithm (optimized for speed)

5. **Memoization**
   - Research function results cached
   - Assessment results cached
   - Parser results cached

6. **Code Splitting**
   - Language packs separated
   - E-commerce code separated
   - Smaller initial load

### Performance Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| Worker initialization | ~50ms | First time only |
| Language pack load | ~300ms | First time, then cached |
| E-commerce load | ~100ms | First time, then cached |
| First analysis (500w) | ~200ms | Includes all loading |
| Cached analysis (500w) | ~50ms | Result cache hit |
| First analysis (5000w) | ~800ms | Large content |
| Cached analysis (5000w) | ~150ms | Partial cache hit |
| Batch scan (10 posts) | ~1.2s | Average 500 words each |

### Memory Profile

| Component | Memory | Eviction |
|-----------|--------|----------|
| Worker heap | 5-10MB | - |
| Results cache (50) | 2-4MB | LRU |
| Research cache (100) | 1-2MB | LRU |
| Parser cache (50) | 0.5-1MB | LRU |
| Language pack | 1-2MB | - |
| **Total** | **9.5-19MB** | Auto-managed |

## Security Considerations

1. **Worker Isolation**: Worker runs in separate context, limited access to DOM/APIs
2. **Input Sanitization**: HTML is parsed and sanitized before analysis
3. **Content Fingerprinting**: Uses SHA-256, cryptographically secure
4. **No External Calls**: All analysis is local, no data sent to external servers
5. **Memory Limits**: LRU caching prevents memory leaks

## Scalability

### Horizontal Scaling (Multiple Workers)

Currently single worker, but architecture supports multiple workers:

```javascript
// Future: Multiple workers for parallel processing
const workers = [
	new TruSeoWorker(),
	new TruSeoWorker(),
	new TruSeoWorker()
]

// Load balance requests
const worker = workers[requestId % workers.length]
worker.analyze(paper)
```

### Vertical Scaling (Performance)

- Optimized for content up to 10,000 words
- Cache hit rates improve with usage
- Memory usage stable with LRU eviction
- No performance degradation over time

## Future Enhancements

1. **Inclusive Language Analysis** - Third analysis type (planned)
2. **Multi-language Spell Checking** - Extending dictionary support to additional languages
3. **Highlighter for Page Builder Editors** - Currently disabled for page builders
4. **Service Worker Caching** - Persistent cache across sessions
5. **Multiple Workers** - Parallel batch processing

## See Also

- [Main README](README.md) - Complete documentation
- [Quick Reference](QUICK_REFERENCE.md) - Developer quick start
- [Worker Documentation](worker/readme.md) - Web Worker details
- [Changelog](CHANGELOG.md) - Version history
