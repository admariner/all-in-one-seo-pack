/** @module stringProcessing/stripHTMLTags */

import stripSpaces from '../stringProcessing/stripSpaces.js'

import { blockElements } from '../helpers/html.js'

const blockElementStartRegex = new RegExp('^<(' + blockElements.join('|') + ')[^>]*?>', 'i')
const blockElementEndRegex = new RegExp('</(' + blockElements.join('|') + ')[^>]*?>$', 'i')

/**
 * Strip incomplete tags within a text. Strips an endtag at the beginning of a string and the start tag at the end of a
 * start of a string.
 * @param {string} text The text to strip the HTML-tags from at the begin and end.
 * @returns {string} The text without HTML-tags at the begin and end.
 */
const stripIncompleteTags = function (text) {
	text = text.replace(/^(<\/([^>]+)>)+/i, '')
	text = text.replace(/(<([^/>]+)>)+$/i, '')
	return text
}

/**
 * Removes the block element tags at the beginning and end of a string and returns this string.
 *
 * @param {string} text The unformatted string.
 * @returns {string} The text with removed HTML begin and end block elements
 */
const stripBlockTagsAtStartEnd = function (text) {
	text = text.replace(blockElementStartRegex, '')
	text = text.replace(blockElementEndRegex, '')
	return text
}

/**
 * Strip HTML-tags from text
 *
 * @param {string} text The text to strip the HTML-tags from.
 * @returns {string} The text without HTML-tags.
 */
const stripFullTags = function (text) {
	text = text.replace(/(<([^>]+)>)/ig, ' ')
	text = stripSpaces(text)
	return text
}

export {
	stripFullTags,
	stripIncompleteTags,
	stripBlockTagsAtStartEnd
}

export default {
	stripFullTags            : stripFullTags,
	stripIncompleteTags      : stripIncompleteTags,
	stripBlockTagsAtStartEnd : stripBlockTagsAtStartEnd
}