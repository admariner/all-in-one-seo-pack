import { parse } from '@/vue/utils/robots'
export default {
	isUnlicensed                : state => 'pro' !== import.meta.env.VITE_VERSION.toLowerCase() || !state.license.isActive,
	isConnected                 : state => ('pro' !== import.meta.env.VITE_VERSION.toLowerCase() && state.internalOptions.internal.siteAnalysis.connectToken) || state.license.isActive,
	settings                    : state => state.settings,
	activeNotifications         : state => state.notifications.active,
	activeNotificationsCount    : state => state.notifications.active.length,
	dismissedNotifications      : state => state.notifications.dismissed,
	dismissedNotificationsCount : state => state.notifications.dismissed.length,
	currentPost                 : state => state.currentPost,
	helpPanel                   : state => state.helpPanel,
	getSiteAnalysisResults      : state => {
		let value = {}
		try {
			value = JSON.parse(state.internalOptions.internal.siteAnalysis.results)
		} catch (error) {
			value = {}
		}
		return value
	},
	getCompetitorSiteAnalysisResults : state => state.internalOptions.internal.siteAnalysis.competitors || {},
	getHeadlineAnalysisResults       : state => state.internalOptions.internal.headlineAnalysis.headlines || {},
	getNetworkRobotsRules            : state => state.networkOptions.tools ? parse(state.networkOptions.tools.robots.rules) : [],
	allItemsCount                    : (state, getters) => results => getters.recommendedCount(results) + getters.criticalCount(results) + getters.goodCount(results),
	recommendedCount                 : (state, getters) => results => {
		let total     = 0
		results = results || getters.getSiteAnalysisResults || {}
		Object.keys(results).forEach(group => {
			const groupResults = results[group]
			Object.keys(groupResults).forEach(r => {
				const result = groupResults[r]
				if ('warning' === result.status) {
					total++
				}
			})
		})

		return total
	},
	criticalCount : (state, getters) => results => {
		let total     = 0
		results = results || getters.getSiteAnalysisResults || {}
		Object.keys(results).forEach(group => {
			const groupResults = results[group]
			Object.keys(groupResults).forEach(r => {
				const result = groupResults[r]
				if ('error' === result.status) {
					total++
				}
			})
		})

		return total
	},
	goodCount : (state, getters) => results => {
		let total     = 0
		results = results || getters.getSiteAnalysisResults || {}
		Object.keys(results).forEach(group => {
			const groupResults = results[group]
			Object.keys(groupResults).forEach(r => {
				const result = groupResults[r]
				if ('passed' === result.status) {
					total++
				}
			})
		})

		return total
	}
}