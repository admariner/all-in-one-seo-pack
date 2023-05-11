import { upperFirst } from 'lodash-es'
import store from '@/vue/store'

const getAddon = slug => {
	return store.state.addons.length ? store.state.addons.find(item => slug === item.sku) : null
}

const isActive = slug => {
	const addon = getAddon(slug)
	return addon && addon.isActive
}

const isInstalled = slug => {
	const addon = getAddon(slug)
	return addon && addon.installed
}

const requiresUpgrade = slug => {
	const addon = getAddon(slug)
	return !addon || addon.requiresUpgrade
}

const canActivate = slug => {
	const addon = getAddon(slug)
	return addon && !addon.isActive
}

const userCanActivate = slug => {
	const addon = getAddon(slug)
	return addon && addon.installed && !addon.isActive && addon.canActivate
}

const userCanInstall = slug => {
	const addon = getAddon(slug)
	return addon && !addon.installed && addon.canInstall
}

const userCanInstallOrActivate = slug => {
	return userCanInstall(slug) || userCanActivate(slug)
}

const userCanUpdate = slug => {
	const addon = getAddon(slug)
	return addon && addon.canUpdate
}

const currentPlans = slug => {
	const addon = getAddon(slug)
	return !addon
		? null
		: addon.currentLevels
			.map(level => upperFirst(level))
}

const hasMinimumVersion = slug => {
	const addon = store.state.addons.find(item => slug === item.sku)
	return addon && addon.hasMinimumVersion
}

export default {
	canActivate,
	currentPlans,
	getAddon,
	hasMinimumVersion,
	isActive,
	isInstalled,
	requiresUpgrade,
	userCanActivate,
	userCanInstall,
	userCanInstallOrActivate,
	userCanUpdate
}