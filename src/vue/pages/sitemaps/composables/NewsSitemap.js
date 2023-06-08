import { __, sprintf } from '@wordpress/i18n'

const td = import.meta.env.VITE_TEXTDOMAIN

export const useNewsSitemap = () => {
	const strings = {
		news               : __('News Sitemap', td),
		setPublicationName : __('Set Publication Name', td),
		publicationName    : __('Publication Name', td),
		postTypes          : __('Post Types', td),
		exclude            : __('Exclude Pages/Posts', td),
		description        : __('Our Google News Sitemap lets you control which content you submit to Google News and only contains articles that were published in the last 48 hours. In order to submit a News Sitemap to Google, you must have added your site to Google’s Publisher Center and had it approved.', td),
		enableSitemap      : __('Enable Sitemap', td),
		openSitemap        : __('Open News Sitemap', td),
		noIndexDisplayed   : __('Noindexed content will not be displayed in your sitemap.', td),
		doYou404           : __('Do you get a blank sitemap or 404 error?', td),
		ctaButtonText      : __('Upgrade to Pro and Unlock News Sitemaps', td),
		ctaHeader          : sprintf(
			// Translators: 1 - Plugin short name ("AIOSEO"), 2 - "Pro".
			__('News Sitemaps are only available for licensed %1$s %2$s users.', td),
			import.meta.env.VITE_SHORT_NAME,
			'Pro'
		),
		includeAllPostTypes : __('Include All Post Types', td),
		selectPostTypes     : __('Select which Post Types appear in your sitemap.', td)
	}

	return {
		strings
	}
}