<template>
	<div class="aioseo-search-appearance-advanced">
		<core-card
			slug="searchAdvanced"
			:header-text="strings.advanced"
		>
			<core-settings-row
				:name="strings.globalRobotsMeta"
			>
				<template #content>
					<core-robots-meta
						:options="optionsStore.options.searchAppearance.advanced.globalRobotsMeta"
						global
					/>
				</template>
			</core-settings-row>

			<core-settings-row
				v-if="optionsStore.internalOptions.internal.deprecatedOptions.includes('autogenerateDescriptions')"
				:name="strings.autogenerateDescriptions"
				align
			>
				<template #content>
					<base-radio-toggle
						v-model="optionsStore.options.deprecated.searchAppearance.advanced.autogenerateDescriptions"
						name="autogenerateDescriptions"
						:options="[
							{ label: GLOBAL_STRINGS.off, value: false, activeClass: 'dark' },
							{ label: GLOBAL_STRINGS.on, value: true }
						]"
					/>
				</template>
			</core-settings-row>

			<core-settings-row
				v-if="optionsStore.internalOptions.internal.deprecatedOptions.includes('useContentForAutogeneratedDescriptions') && (!optionsStore.internalOptions.internal.deprecatedOptions.includes('autogenerateDescriptions') || optionsStore.options.deprecated.searchAppearance.advanced.autogenerateDescriptions)"
				:name="strings.useContentForAutogeneratedDescriptions"
				align
			>
				<template #content>
					<base-radio-toggle
						v-model="optionsStore.options.deprecated.searchAppearance.advanced.useContentForAutogeneratedDescriptions"
						name="useContentForAutogeneratedDescriptions"
						:options="[
							{ label: GLOBAL_STRINGS.off, value: false, activeClass: 'dark' },
							{ label: GLOBAL_STRINGS.on, value: true }
						]"
					/>
				</template>
			</core-settings-row>

			<core-settings-row
				v-if="optionsStore.internalOptions.internal.deprecatedOptions.includes('noPaginationForCanonical')"
				:name="strings.noPaginationForCanonical"
				align
			>
				<template #content>
					<base-radio-toggle
						v-model="optionsStore.options.deprecated.searchAppearance.advanced.noPaginationForCanonical"
						name="noPaginationForCanonical"
						:options="[
							{ label: GLOBAL_STRINGS.off, value: false, activeClass: 'dark' },
							{ label: GLOBAL_STRINGS.on, value: true }
						]"
					/>
				</template>
			</core-settings-row>

			<core-settings-row
				:name="strings.useKeywords"
				align
			>
				<template #content>
					<base-radio-toggle
						v-model="optionsStore.options.searchAppearance.advanced.useKeywords"
						name="useKeywords"
						:options="[
							{ label: GLOBAL_STRINGS.no, value: false, activeClass: 'dark' },
							{ label: GLOBAL_STRINGS.yes, value: true }
						]"
					/>

					<div class="aioseo-description">
						{{ strings.useKeywordsDescription }}
					</div>
				</template>
			</core-settings-row>

			<core-settings-row
				v-if="optionsStore.options.searchAppearance.advanced.useKeywords"
				:name="strings.useCategoriesForMetaKeywords"
				align
			>
				<template #content>
					<base-radio-toggle
						v-model="optionsStore.options.searchAppearance.advanced.useCategoriesForMetaKeywords"
						name="useCategoriesForMetaKeywords"
						:options="[
							{ label: GLOBAL_STRINGS.no, value: false, activeClass: 'dark' },
							{ label: GLOBAL_STRINGS.yes, value: true }
						]"
					/>

					<div class="aioseo-description">
						{{ strings.useCategoriesDescription }}
					</div>
				</template>
			</core-settings-row>

			<core-settings-row
				v-if="optionsStore.options.searchAppearance.advanced.useKeywords"
				:name="strings.useTagsForMetaKeywords"
				align
			>
				<template #content>
					<base-radio-toggle
						v-model="optionsStore.options.searchAppearance.advanced.useTagsForMetaKeywords"
						name="useTagsForMetaKeywords"
						:options="[
							{ label: GLOBAL_STRINGS.no, value: false, activeClass: 'dark' },
							{ label: GLOBAL_STRINGS.yes, value: true }
						]"
					/>

					<div class="aioseo-description">
						{{ strings.useTagsDescription }}
					</div>
				</template>
			</core-settings-row>

			<core-settings-row
				v-if="optionsStore.options.searchAppearance.advanced.useKeywords"
				:name="strings.dynamicallyGenerateKeywords"
				align
			>
				<template #content>
					<base-radio-toggle
						v-model="optionsStore.options.searchAppearance.advanced.dynamicallyGenerateKeywords"
						name="dynamicallyGenerateKeywords"
						:options="[
							{ label: GLOBAL_STRINGS.no, value: false, activeClass: 'dark' },
							{ label: GLOBAL_STRINGS.yes, value: true }
						]"
					/>

					<div class="aioseo-description">
						{{ strings.dynamicallyGenerateDescription }}
					</div>
				</template>
			</core-settings-row>

			<core-settings-row
				id="description-format"
				v-if="optionsStore.internalOptions.internal.deprecatedOptions.includes('descriptionFormat')"
				:name="strings.descriptionFormat"
				align
			>
				<template #content>
					<core-html-tags-editor
						class="description-format"
						v-model="optionsStore.options.deprecated.searchAppearance.global.descriptionFormat"
						:line-numbers="false"
						single
						:show-tags-description="false"
						tags-context="descriptionFormat"
						:default-tags="[
							'description',
							'site_title',
							'tagline'
						]"
						:show-all-tags-link="true"
					>
						<template #tags-description>
							{{ emptyString }}
						</template>
					</core-html-tags-editor>

					<core-alert
						class="description-notice"
						v-if="!optionsStore.options.deprecated.searchAppearance.global.descriptionFormat.includes('#description')"
						type="red"
					>
						{{ strings.descriptionTagRequired }}
					</core-alert>
				</template>
			</core-settings-row>

			<core-settings-row
				:name="strings.runShortcodes"
				align
			>
				<template #content>
					<base-radio-toggle
						v-model="optionsStore.options.searchAppearance.advanced.runShortcodes"
						name="runShortcodes"
						:options="[
							{ label: GLOBAL_STRINGS.off, value: false, activeClass: 'dark' },
							{ label: GLOBAL_STRINGS.on, value: true }
						]"
					/>

					<core-alert
						class="run-shortcodes-alert"
						v-if="optionsStore.options.searchAppearance.advanced.runShortcodes"
						type="yellow"
						v-html="strings.runShortcodesWarning"
					/>

					<div
						class="aioseo-description"
						v-html="strings.runShortcodesDescription"
					/>
				</template>
			</core-settings-row>

			<core-settings-row
				:name="strings.pagedFormat"
				align
			>
				<template #content>
					<core-html-tags-editor
						class="paged-format"
						v-model="optionsStore.options.searchAppearance.advanced.pagedFormat"
						:line-numbers="false"
						single
						tags-context="pagedFormat"
						:default-tags="[
							'page_number'
						]"
						:show-all-tags-link="false"
					>
						<template #tags-description>
							{{ emptyString }}
						</template>
					</core-html-tags-editor>

					<div class="aioseo-description">
						{{ strings.pagedFormatDescription }}
					</div>
				</template>
			</core-settings-row>

			<core-settings-row
				v-if="optionsStore.internalOptions.internal.deprecatedOptions.includes('excludePosts')"
				:name="strings.excludePostsPages"
				class="aioseo-exclude-pages-posts"
				align
			>
				<template #content>
					<core-exclude-posts
						:options="optionsStore.options.deprecated.searchAppearance.advanced"
						type="posts"
					/>
				</template>
			</core-settings-row>

			<core-settings-row
				v-if="optionsStore.internalOptions.internal.deprecatedOptions.includes('excludeTerms')"
				:name="strings.excludeTerms"
				class="aioseo-exclude-terms"
				align
			>
				<template #content>
					<core-exclude-posts
						:options="optionsStore.options.deprecated.searchAppearance.advanced"
						type="terms"
					/>
				</template>
			</core-settings-row>
		</core-card>

		<core-card
			class="aioseo-rss-content-advanced"
			slug="searchAdvancedCrawlCleanup"
			:toggles="optionsStore.options.searchAppearance.advanced.crawlCleanup.enable"
		>
			<template #header>

				<base-toggle
					v-model="optionsStore.options.searchAppearance.advanced.crawlCleanup.enable"
				/>

				<span>{{ strings.crawlCleanup }}</span>

				<core-tooltip
					v-if="!optionsStore.options.searchAppearance.advanced.crawlCleanup.enable"
				>
					<svg-circle-question-mark />

					<template #tooltip>
						{{ strings.crawlCleanupDescription }}

						<span
							v-html="links.getDocLink(GLOBAL_STRINGS.learnMore, 'crawlCleanup', true)"
						/>
					</template>
				</core-tooltip>
			</template>

			<template #tabs>
				<core-main-tabs
					:tabs="tabs"
					:showSaveButton="false"
					:active="tab"
					@changed="value => processChangeTab(value)"
					internal
				/>

				<transition name="route-fade" mode="out-in">
					<component
						:is="tab"
						:active="tab"
					/>
				</transition>
			</template>

		</core-card>

		<core-card
			id="aioseo-query-arg-monitoring"
			slug="queryArgLogs"
			:toggles="optionsStore.options.searchAppearance.advanced.blockArgs.enable"
		>
			<template #header>
				<base-toggle
					v-model="optionsStore.options.searchAppearance.advanced.blockArgs.enable"
				/>
				<span>{{ strings.queryArgMonitoring }}</span>
			</template>

			<div class="aioseo-settings-row aioseo-section-description">
				{{ strings.queryArgMonitorDescription }}

				<span
					v-html="links.getDocLink(GLOBAL_STRINGS.learnMore, 'queryArgMonitor', true)"
				/>
			</div>

			<core-settings-row
				id="search-cleanup-optimize-utm-parameters"
				:name="strings.optimizeUtmParameters"
				align
			>
				<template #content>
					<base-radio-toggle
						v-model="optionsStore.options.searchAppearance.advanced.blockArgs.optimizeUtmParameters"
						name="optimizeUtmParameters"
						:options="[
							{ label: GLOBAL_STRINGS.off, value: false, activeClass: 'dark' },
							{ label: GLOBAL_STRINGS.on, value: true }
						]"
					/>

					<div class="aioseo-description">
						<div v-html="strings.optimizeUtmParametersDescription"></div>
					</div>
				</template>
			</core-settings-row>

			<core-settings-row
				:name="strings.logsRetention"
				class="table-retention"
			>
				<template #content>
					<base-select
						size="medium"
						:options="logsRetentionOptions"
						:modelValue="getJsonValue(optionsStore.options.searchAppearance.advanced.blockArgs.logsRetention)"
						@update:modelValue="value => optionsStore.options.searchAppearance.advanced.blockArgs.logsRetention = setJsonValue(value)"
					/>
				</template>
			</core-settings-row>

			<query-arg-monitor-block-arg />

			<query-arg-monitor-table />
		</core-card>
	</div>
</template>

<script>
import { GLOBAL_STRINGS } from '@/vue/plugins/constants'
import links from '@/vue/utils/links'
import {
	useOptionsStore,
	useRootStore
} from '@/vue/stores'

import { useJsonValues } from '@/vue/composables/JsonValues'

import BaseRadioToggle from '@/vue/components/common/base/RadioToggle'
import BaseSelect from '@/vue/components/common/base/Select'
import CoreMainTabs from '@/vue/components/common/core/main/Tabs'
import CoreAlert from '@/vue/components/common/core/alert/Index'
import CoreCard from '@/vue/components/common/core/Card'
import CoreExcludePosts from '@/vue/components/common/core/ExcludePosts'
import CoreHtmlTagsEditor from '@/vue/components/common/core/HtmlTagsEditor'
import CoreRobotsMeta from '@/vue/components/common/core/RobotsMeta'
import CoreSettingsRow from '@/vue/components/common/core/SettingsRow'
import CoreTooltip from '@/vue/components/common/core/Tooltip'
import SvgCircleQuestionMark from '@/vue/components/common/svg/circle/QuestionMark'
import QueryArgMonitorBlockArg from './partials/query-arg-monitor/BlockArg'
import QueryArgMonitorTable from './partials/query-arg-monitor/Table'
import RssFeeds from './partials/crawl-cleanup/RssFeeds'
import SearchCleanup from './partials/crawl-cleanup/SearchCleanup'
import UnwantedBots from './partials/crawl-cleanup/UnwantedBots'

import { __, sprintf } from '@/vue/plugins/translations'

const td = import.meta.env.VITE_TEXTDOMAIN

export default {
	setup () {
		const {
			getJsonValue,
			setJsonValue
		} = useJsonValues()

		return {
			GLOBAL_STRINGS,
			getJsonValue,
			links,
			optionsStore : useOptionsStore(),
			rootStore    : useRootStore(),
			setJsonValue
		}
	},
	components : {
		BaseRadioToggle,
		BaseSelect,
		CoreMainTabs,
		CoreAlert,
		CoreCard,
		CoreExcludePosts,
		CoreHtmlTagsEditor,
		CoreRobotsMeta,
		CoreSettingsRow,
		CoreTooltip,
		SvgCircleQuestionMark,
		QueryArgMonitorBlockArg,
		QueryArgMonitorTable,
		RssFeeds,
		SearchCleanup,
		UnwantedBots
	},
	data () {
		return {
			emptyString : '',
			strings     : {
				advanced                               : __('Advanced Settings', td),
				globalRobotsMeta                       : __('Global Robots Meta', td),
				autogenerateDescriptions               : __('Autogenerate Descriptions', td),
				useContentForAutogeneratedDescriptions : __('Use Content for Autogenerated Descriptions', td),
				runShortcodes                          : __('Run Shortcodes', td),
				runShortcodesDescription               : sprintf(
					// Translators: 1 - The short plugin name ("AIOSEO"), 2 - "Learn More" link.
					__('This option allows you to control whether %1$s should parse shortcodes when generating data such as the SEO title/meta description. Enabling this setting may cause conflicts with third-party plugins/themes. %2$s', td),
					import.meta.env.VITE_SHORT_NAME,
					links.getDocLink(GLOBAL_STRINGS.learnMore, 'runningShortcodes', true)
				),
				runShortcodesWarning : sprintf(
					// Translators: 1 - "Learn More" link.
					__('NOTE: Enabling this setting may cause conflicts with third-party plugins/themes. %1$s', td),
					links.getDocLink(GLOBAL_STRINGS.learnMore, 'runningShortcodes', true)
				),
				noPaginationForCanonical         : __('No Pagination for Canonical URLs', td),
				useKeywords                      : __('Use Meta Keywords', td),
				useKeywordsDescription           : __('This option allows you to toggle the use of Meta Keywords throughout the whole of the site.', td),
				useCategoriesForMetaKeywords     : __('Use Categories for Meta Keywords', td),
				useCategoriesDescription         : __('Check this if you want your categories for a given post used as the Meta Keywords for this post (in addition to any keywords you specify on the Edit Post screen).', td),
				useTagsForMetaKeywords           : __('Use Tags for Meta Keywords', td),
				useTagsDescription               : __('Check this if you want your tags for a given post used as the Meta Keywords for this post (in addition to any keywords you specify on the Edit Post screen).', td),
				dynamicallyGenerateKeywords      : __('Dynamically Generate Meta Keywords', td),
				dynamicallyGenerateDescription   : __('Check this if you want your keywords on your Posts page (set in WordPress under Settings, Reading, Front Page Displays) and your archive pages to be dynamically generated from the keywords of the posts showing on that page. If unchecked, it will use the keywords set in the edit page screen for the posts page.', td),
				pagedFormat                      : __('Paged Format', td),
				pagedFormatDescription           : __('This string gets appended to the titles and descriptions of paginated pages (like term or archive pages).', td),
				descriptionFormat                : __('Description Format', td),
				excludePostsPages                : __('Exclude Posts / Pages', td),
				excludeTerms                     : __('Exclude Terms', td),
				descriptionTagRequired           : __('A Description tag is required in order to properly display your meta descriptions on your site.', td),
				crawlCleanup                     : __('Crawl Cleanup', td),
				crawlCleanupDescription          : __('Disabling unnecessary features can help save search engine crawl quota and speed up content indexing for larger sites.', td),
				queryArgMonitoring               : __('Query Arg Monitoring', td),
				optimizeUtmParameters            : __('Optimize UTM Parameters', td),
				optimizeUtmParametersDescription : sprintf(
					// Translators: 1 - "utm", 2 - "#", 3 - "301", 4 - <br>, 5 - Example URL, 6 - Example URL.
					__('Replaces %1$s tracking parameters for Google Analytics with the (more performant) %2$s equivalent, via a %3$s redirect. e.g., %4$s %5$s will be redirected to %6$s. This also helps to prevent duplicate URLs in search results.', td),
					'<code>utm</code>',
					'<code>#</code>',
					'<code>301</code>',
					'<br>',
					'<code>https://example.com/?utm_medium=organic</code>',
					'<code>https://example.com/#utm_medium=organic</code>'
				),
				logsRetention              : __('Logs Retention', td),
				queryArgMonitorDescription : __('This feature allows you to log all query arguments that are used on your site and block them. This will help prevent search engines from crawling every variation of your pages with unrecognized query arguments and help save search engine crawl quota.', td)
			},
			logsRetentionOptions : [
				{ label: __('1 hour', td), value: 'hour' },
				{ label: __('1 day', td), value: 'day' },
				{ label: __('1 week', td), value: 'week' },
				{ label: __('Forever', td), value: 'forever' }
			],
			tab  : 'rss-feeds',
			tabs : [
				{
					slug   : 'rss-feeds',
					name   : __('RSS Feeds', td),
					access : 'aioseo_general_settings',
					pro    : false
				},
				{
					slug   : 'unwanted-bots',
					name   : __('Unwanted Bots', td),
					access : 'aioseo_general_settings',
					pro    : false
				},
				{
					slug   : 'search-cleanup',
					name   : __('Internal Site Search Cleanup', td),
					access : 'aioseo_general_settings',
					pro    : false
				}
			]
		}
	},
	methods : {
		processChangeTab (newTabValue) {
			if (newTabValue) {
				this.tab = newTabValue
			}
		}
	}
}
</script>

<style lang="scss">
.aioseo-search-appearance-advanced {
	.description-format,
	.paged-format {
		.add-tags {
			margin-top: 0;
		}
	}

	.description-notice {
		margin-top: 10px;
	}

	.run-shortcodes-alert {
		margin-top: 12px;
	}

	svg.aioseo-external {
		width: 14px;
		height: 14px;
		margin-right: 10px;
	}

	.aioseo-alert {
		margin-top: 16px;
	}

	.aioseo-rss-content-advanced,
	#aioseo-query-arg-monitoring {
		.aioseo-settings-row {
			.aioseo-col {
				padding-top: 0;
			}
		}

		.aioseo-description {
			p {
				font-size: 14px;
				line-height: 1.8;
				margin: 8px 0 0;
			}

			div.rss-link {
				margin: 8px 0 0;
			}
		}
	}

	.card-block-query {
		.header {
			height: unset;
		}

		.content {
			padding: 0 !important;
		}
	}

	.table-retention {
		.aioseo-select {
			max-width: 200px;
		}
	}
}
</style>