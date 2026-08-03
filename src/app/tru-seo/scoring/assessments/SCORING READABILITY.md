# Overview of the Readability assessments scoring criteria

Readability analysis is a collection of assessments that check how easy to read a text is.

Some of the readability assessments are language-independent (e.g. paragraph length, subheading distribution), but many are language-specific (e.g. passive voice, transition words) and are made available for different languages on a case-by-case basis.

## How are individual traffic lights assigned?
| Individual Score | Rating 	                        | Individual penalty points |
|------------	   |---------------------------------|---------------------|
|0 (if it is not explicitly set as a score) | Feedback (gray traffic light)		 |-	                        |
|0-4	                                	| Bad (red traffic light)		       |3 (partial support: 4)	    |
|5-7		                                | Ok (orange traffic light)	      |2	                        |
|8-10	                                    | Good (green traffic light)	     |0	                        |

## How is the overall score calculated?
| Sum of penalty points	 | Total score	| Divide by 10:|
|------------	         |------------------	|---------------------|
| 6 (partial: 4)         |30		            |3	                               |
| 4 (partial: 2)         |60		            |6	                               |
| <4 (partial: < 2)	     |90                    |9                                 |


## Scoring criteria for the readability assessments
### 1) Subheading distribution
**What it does**: Checks whether long texts are divided by subheadings.

**When applies**: Always.

**Name in code**: SubheadingDistributionTooLongAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/SubheadingDistributionTooLongAssessment.js`

| Traffic light 	 | Score	| Criterion | Feedback                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-----------------|------------------	|--------------------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red             |2	| **Default**: A text with more than 300 words (cornerstone: 250) and no subheading is present. **Japanese**: A text with more than 600 characters (cornerstone: 500) and no subheading is present. | **Subheading distribution**: Your post is long but has no subheadings. **Add a few to break it into sections — readers (and search engines) follow long posts much more easily that way**.                                                                                                                                                                                                                                                                                                                                            |
| Red             |3	| **Default**: There is subheading(s) in the text and it is followed and preceded (if applicable) by more than 350 words (cornerstone: 300). **Japanese**: There is subheading(s) in the text and it is followed and preceded (if applicable) by more than 700 characters (cornerstone: 600).| **DEFAULT**: **Subheading distribution**: X section(s) of your post are over Y words and have no subheading. **Add subheadings to break them up**. <br> **JAPANESE:** **Subheading distribution**: X section(s) of your post are over Y characters and have no subheading. **Add subheadings to break them up**.                                                                                                                                                                                                                       |
| Red             |3	| **Default**: There is subheading(s) in the text in which the first one is preceded by a text longer than 350 words (cornerstone: 300). And the texts following the subheading(s) is less than 300 words (cornerstone: 250). **Japanese**: There is subheading(s) in the text in which the first one is preceded by a text longer than 700 characters (cornerstone: 600). And the texts following the subheading(s) is less than 600 characters (cornerstone: 500).  | **DEFAULT:** **Subheading distribution**: Your post's opening section is over X words with no subheading. **Add a subheading to break it up**. <br> **JAPANESE**: **Subheading distribution**: Your post's opening section is over X characters with no subheading. **Add a subheading to break it up**.                                                                                                                                                                                                                              |
| Orange          |6 | **Default**: Subheading followed by 300-350 words (cornerstone: 250-300). **Japanese**: Subheading followed by 600-700 characters (cornerstone: 500-600) | **DEFAULT:** **Subheading distribution**: X section(s) of your post are over Y words and have no subheading. **Add subheadings to break them up**. <br> **JAPANESE:** **Subheading distribution**: X section(s) of your post are over Y characters and have no subheading. **Add subheadings to break them up**.                                                                                                                                                                                                                       |
| Orange          |6	| **Default**: There is subheading(s) in the text in which the first one is preceded by a text between 300-350 words (cornerstone: 250-300). And the texts following the subheading(s) is less than 300 words (cornerstone: 250). **Japanese**: There is subheading(s) in the text in which the first one is preceded by a text between 600-700 characters (cornerstone: 500-600). And the texts following the subheading(s) is less than 600 characters (cornerstone: 500).      | **DEFAULT:** **Subheading distribution**: Your post's opening section is over X words with no subheading. **Add a subheading to break it up**. <br> **JAPANESE:** **Subheading distribution**: Your post's opening section is over X characters with no subheading. **Add a subheading to break it up**.                                                                                                                                                                                                                              |
| Green           |9 | **Default**: A text with 300 or less words and no subheading is present. **Japanese**: A text with 600 or less characters and no subheading is present. | **Subheading distribution**: Your post is short enough that subheadings aren't needed.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Green           |9 | **Default**: There is subheading(s) in the text and it is followed and preceded (if applicable) by less than 300 words (cornerstone: 250). **Japanese**: There is subheading(s) in the text and it is followed and preceded (if applicable) by less than 600 characters (cornerstone: 500). | **Subheading distribution**: Your post is well-organized with subheadings.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### 2) Paragraph length
**What it does**: Checks whether the paragraphs exceed the recommended maximum length.

**When applies**: Always.

**Name in code**: ParagraphTooLongAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/ParagraphTooLongAssessment.js`

| Traffic light 	 | Score	| Criterion                                                | Feedback                                                                                                                                            |
|------------|------------------	|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Red        |3	                | > 200 words (Japanese: 400 characters)	   	              | **Paragraph length**: X paragraph(s) are over the recommended Y words/characters. **Long paragraphs are hard to read on phones — try splitting them**. |
| Orange     |6                 | Between 150 and 200 words (Japanese: 300-400 characters) | **Paragraph length**: X paragraph(s) are over the recommended Y words/characters. **Long paragraphs are hard to read on phones — try splitting them**. |
| Green      |9                 | ≤ 150 words (Japanese: 300 characters)	                  | **Paragraph length**: All your paragraphs are a comfortable length.                                                                                     |

### 3) Sentence length
**What it does**: Checks whether the sentences exceed the recommended maximum length (default: 20 words, CA, ES, FA, IT, PT: 25 words, HE, RU, TR: 15 words, JA: 40 characters).

**When applies**: Always.

**Name in code**: SentenceLengthInTextAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/SentenceLengthInTextAssessment.js`

|Traffic light |	Score |	Criterion | 	Feedback                                                                                                                                                         |
|------------------  |------------------	|--------------------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Red	| 3 |> 30% (cornerstone: 25%)                                                  | **Sentence length**: X% of your sentences are over Y words/characters — more than the recommended Z%. **Long sentences are harder to follow; try splitting them**. |
|Orange	| 6 |Between 25 and 30% (cornerstone: 20-25%, Turkish: 20-25%, Polish: 15-20%) | **Sentence length**: X% of your sentences are over Y words/characters — more than the recommended Z%. **Long sentences are harder to follow; try splitting them**. |
|Green	| 9 |≤ 25% (cornerstone: ≤ 20%; Polish: ≤ 15%)                                 | **Sentence length**: Your sentences are a comfortable length.                                                                                                       |

### 4) Consecutive sentences
**What it does**: Checks whether there are more than 3 sentences in a row that start with the same word.

**When applies**: When the researcher has a research (the assessment is supported in the researcher's language).

**Name in code**: SentenceBeginningsAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/SentenceBeginningsAssessment.js`

| Traffic light | Score | Criterion                                                  | Feedback                                                                                                                    |
|---------------|-------|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Red           | 3     | 3 or more consecutive sentences start with the same word   | **Repeated sentence starts**: X sentences in a row start with the same word. **Vary the openings to keep the rhythm fresh**. |
| Green         | 9     | Less than 3 consecutive sentences start with the same word | **Repeated sentence starts**: Your sentences start with a good variety of words.                                              |

### 5) Passive voice
**What it does**: Checks whether the number of sentences containing passive voice exceeds the recommended maximum amount.

**When applies**: When the researcher has a research (the assessment is supported in the researcher's language).

**Name in code**: PassiveVoiceAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/PassiveVoiceAssessment.js`

| Traffic light | Score | Criterion                       | Feedback                                                                                                                                                |
|---------------|-------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Red           | 3     | > 15% of sentences              | **Passive voice**: X% of your sentences are in passive voice — more than the recommended Y%. **Active voice ("we shipped the feature") is usually clearer than passive ("the feature was shipped")**. |
| Orange        | 6     | Between 10 and 15% of sentences | **Passive voice**: X% of your sentences are in passive voice — more than the recommended Y%. **Active voice ("we shipped the feature") is usually clearer than passive ("the feature was shipped")**. |
| Green         | 9     | ≤ 10% of sentences              | **Passive voice**: You're using mostly active voice.                                                                                                                                                   |

### 6) Transition words
**What it does**: Checks whether there are enough sentences containing transition words.

**When applies**: When the researcher has a research (the assessment is supported in the researcher's language).

**Name in code**: TransitionWordsAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/TransitionWordsAssessment.js`

|Traffic light	|Score	| Criterion                                                                                                        |	Feedback|
|-------|------	|------------------------------------------------------------------------------------------------------------------|------- |
|Red	|3| 	No transition words found in a long text (more than 200 words or 400 characters in Japanese)	                   |**Transition words**: None of your sentences use transition words like "however", "because", or "for example". **Adding a few helps your post flow**.|
|Red	|3| 	< 20% of sentences in a long text (more than 200 words or 400 characters in Japanese)	                          |**Transition words**: Only X% of your sentences use transition words like "however", "because", or "for example". **Adding more helps your post flow**.|
|Orange	|6| 	Between 20 and 30% of sentences in a long text (more than 200 words or 400 characters in Japanese)              |**Transition words**: Only X% of your sentences use transition words like "however", "because", or "for example". **Adding more helps your post flow**.|
|Green	|9| 	≥ 30% of sentences in a long text (more than 200 words or 400 characters in Japanese)                           |**Transition words**: Your post uses transition words to connect ideas.|
|Green	|9| 	At least one sentence with transition words in a short text (less than 200 words or 400 characters in Japanese) |**Transition words**: Your post uses transition words to connect ideas.|
|Green	|9| 	No transition words found in a short text (less than 200 words or 400 characters in Japanese)                   |**Transition words**: Your post is short enough that transition words aren't needed.|


### 7) Text presence
**What it does**: Checks whether there is enough text in the copy

**Name in code**: TextPresenceAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/TextPresenceAssessment.js`

|Traffic light	|Score|	Criterion|	Feedback|
|-------|------	|----- |------- |
|Red	|3	|< 50 characters	|**Content length**: Your post is too short for a full analysis. **Add at least a few paragraphs to get useful recommendations**.|
|Green	|9	|≥ 50 characters	|**Content length**: Your post has enough content to analyze.|

### 8) Word complexity
**What it does**: Checks whether the text contains complex words. Word forms from the keyphrase are excluded.

**When applies**: When the researcher has a research (the assessment is supported in the researcher's language).

**Name in code**: WordComplexityAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/WordComplexityAssessment.js`

| Traffic light             | Score              | Criterion                                          | Feedback                                                                                                                                         |
|---------------------------|--------------------|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Orange (cornerstone: red) | 6 (cornerstone: 3) | If the complex words are more than 10% in the text | **Word complexity**: Your post uses some long or uncommon words. **Hover over highlighted words to see simpler alternatives where they fit**. |
| Green                     | 9                  | If the complex words are less than 10% in the text | **Word complexity**: Your post uses mostly familiar words — easy to read.                                                                       |

### 9) Text alignment
**What it does**: Checks whether there is an over-use of center-alignment in the text. By default, we check for the `.has-text-align-center` class, but this can be changed in the researcher configuration (`centerClasses`).

**When applies**: When the (sanitized) text has more than 50 characters and at least one paragraph or heading with center-alignment.

**Name in code**: TextAlignmentAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/TextAlignmentAssessment.js`


| Traffic light | Score | Criterion                                                                   | Feedback                                                                                                          |
|---------------|-------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Red           | 2     | There is one center-aligned element that is over 50 characters long         | LTR: **Alignment**: 1 long section of your post is center-aligned. **For readable paragraphs, switch it to left-aligned**.    |
|               |       |                                                                             | RTL: **Alignment**: 1 long section of your post is center-aligned. **For readable paragraphs, switch it to right-aligned**.   |
| Red           | 2     | There are multiple center-aligned elements that are over 50 characters long | LTR: **Alignment**: X long sections of your post are center-aligned. **For readable paragraphs, switch them to left-aligned**.  |
|               |       |                                                                             | RTL: **Alignment**: X long sections of your post are center-aligned. **For readable paragraphs, switch them to right-aligned**. |

**Notes**:
* LTR: The feedback shown for languages written from left to right.
* RTL: The feedback shown for languages written from right to left.

### 10) Spelling Checker
**What it does**: Checks the text for spelling errors using a WASM-based Hunspell dictionary with trie-based prefix search for suggestions.

**When applies**: Always. Returns a neutral score (0) if the dictionary is not loaded.

**Name in code**: SpellingCheckerAssessment

**File location**: `src/app/tru-seo/scoring/assessments/readability/SpellingCheckerAssessment.js`

**Research**: `getSpellingErrors` (`src/app/tru-seo/researches/getSpellingErrors.js`)

| Traffic light | Score | Criterion                    | Feedback                                                                                  |
|---------------|-------|------------------------------|-------------------------------------------------------------------------------------------|
| Gray          | 0     | Dictionary not installed     | **Spelling**: Spell-check isn't set up for this language yet. **Download the dictionary** to enable it.                                                                  |
| Gray          | 0     | Dictionary not available     | **Spelling**: Spell-check isn't available for this language yet.                                                                                                          |
| Green         | 9     | 0 misspelled words           | **Spelling**: No spelling errors found.                                                                                                                                   |
| Orange        | 6     | 1-3 misspelled words         | **Spelling**: Found X possible spelling error(s). **Hover over the highlighted words to see suggestions**.                                                                |
| Red           | 3     | 6+ misspelled words          | **Spelling**: Found X possible spelling errors. **Hover over the highlighted words to see suggestions — typos can hurt how readers trust your content**.                  |

**Notes**:
* Words skipped during checking: single characters, numbers, camelCase/intercaps terms, URLs, emails, hashtags/mentions, words with mixed numbers.
* The assessment produces marks (`getMarks()`) for each misspelled word, enabling integration with the TruSEO Highlighter for visual feedback.
* Spelling suggestions are fetched on-demand via the highlighter popover using `requestSuggestions()`.
* Error thresholds are configurable: `config.thresholds.fewErrors` (default 3) and `config.thresholds.manyErrors` (default 6).
