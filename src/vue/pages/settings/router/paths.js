import { __ } from '@wordpress/i18n'

const td       = import.meta.env.VITE_TEXTDOMAIN
const loadView = view => {
	return () => import(`../views/${view}.vue`)
}

export default [
	{
		path     : '*',
		redirect : '/general-settings'
	},
	{
		path      : '/general-settings',
		name      : 'general-settings',
		component : loadView('Main'),
		meta      : {
			access         : 'aioseo_general_settings',
			hideSaveButton : true,
			name           : window.aioseo.data.isNetworkAdmin
				? __('Network Settings', td)
				: __('General Settings', td)
		}
	},
	{
		path      : '/webmaster-tools',
		name      : 'webmaster-tools',
		component : loadView('Main'),
		meta      : {
			access : 'aioseo_general_settings',
			name   : __('Webmaster Tools', td)
		}
	},
	{
		path      : '/breadcrumbs',
		name      : 'breadcrumbs',
		component : loadView('Main'),
		meta      : {
			access : 'aioseo_general_settings',
			name   : __('Breadcrumbs', td)
		}
	},
	{
		path      : '/rss-content',
		name      : 'rss-content',
		component : loadView('Main'),
		meta      : {
			access : 'aioseo_general_settings',
			name   : __('RSS Content', td)
		}
	},
	{
		path      : '/access-control',
		name      : 'access-control',
		component : loadView('Main'),
		meta      : {
			home   : 'general-settings',
			access : 'aioseo_admin',
			name   : __('Access Control', td)
		}
	},
	{
		path      : '/advanced',
		name      : 'advanced',
		component : loadView('Main'),
		meta      : {
			access : 'aioseo_general_settings',
			name   : __('Advanced', td)
		}
	}
]