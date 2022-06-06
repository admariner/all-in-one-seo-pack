const { __, sprintf } = window.wp.i18n

/**
 * Translation comments are not picked up in .jsx files, so we are adding them here
 * as a way to workaround that.
 */

export const typeLinkText = sprintf(
	// Translators: 1 - HTML line break tag, 2 - Opening HTML link tag, 3 - Closing HTML link tag.
	__('Headlines that are lists and how-to get more engagement on average than other types of headlines. %1$s%2$sLearn More%3$s →', import.meta.env.VITE_TEXTDOMAIN),
	'<br /><br />',
	'<a href="https://optinmonster.com/why-these-21-headlines-went-viral-and-how-you-can-copy-their-success/" target="_blank" className="aioseo-headline-analyzer-link"><span>',
	'</span></a>'
)

export const veryGoodScore = sprintf(
	// Translators: 1 - Initial score range, 2 - Final score range.
	__('A very good score is between %1$d and %2$d.', import.meta.env.VITE_TEXTDOMAIN),
	70,
	90
)
export const forBetterResults = sprintf(
	// Translators: 1 - Score.
	__('For best results, you should strive for %1$d and above.', import.meta.env.VITE_TEXTDOMAIN),
	70
)

export const headlineAnalyzerNotice = sprintf(
	// Translators: 1 - Opening link and span tags, 2 - Closing span tag, 3 - Closing link tag.
	__('This headline analyzer is part of AIOSEO to help you increase your traffic. %1$sAnalyze your site further here%2$s →%3$s', import.meta.env.VITE_TEXTDOMAIN),
	sprintf(
		'<a href="%1$s" className="aioseo-headline-analyzer-link" target="_blank"><span>',
		window.aioseo.urls.aio.seoAnalysis
	),
	'</span>',
	'</a>'
)