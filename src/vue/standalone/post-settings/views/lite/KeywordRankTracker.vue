<template>
	<div>
		<div
			v-if="searchStatisticsStore.shouldShowSampleReports"
			class="keyword-rank-tracker-container"
		>
			<div>
				<span>{{ strings.withAioseo }}</span> <span v-html="learnMoreLink"/>
			</div>

			<div class="keyword-rank-tracker-container__card">
				<div class="keyword-rank-tracker-container__card__header">
					{{ strings.keywordPositions }}
				</div>

				<div class="keyword-rank-tracker-container__card__body">
					<graph
						:height="parseInt(graphHeight)"
						:series="positionSeries"
						:loading="false"
						legend-style="simple"
						:chart-overrides="{
							tooltip: {
								y : {
									formatter : (value) => parseFloat(value).toFixed(2)
								}
							}
						}"
					/>
				</div>
			</div>

			<keywords-table :paginated-keywords="parsedKeywords"/>
		</div>

		<template v-else>
			<core-blur class="keyword-rank-tracker-container">
				<div>
					<span>{{ strings.withAioseo }}</span> <span v-html="learnMoreLink"/>
				</div>

				<div class="keyword-rank-tracker-container__card">
					<div class="keyword-rank-tracker-container__card__header">
						{{ strings.keywordPositions }}
					</div>

					<div class="keyword-rank-tracker-container__card__body">
						<graph
							:height="parseInt(graphHeight)"
							:series="positionSeries"
							:loading="false"
							legend-style="simple"
							:chart-overrides="{
							tooltip: {
								y : {
									formatter : (value) => parseFloat(value).toFixed(2)
								}
							}
						}"
						/>
					</div>
				</div>

				<keywords-table :paginated-keywords="parsedKeywords"/>
			</core-blur>

			<connect-cta v-if="showConnectCta"/>

			<cta
				v-else
				cta-second-button-action
				@cta-second-button-click="searchStatisticsStore.showSampleReports"
				:cta-link="links.getPricingUrl('search-statistics', 'search-statistics-upsell', 'keyword-rank-tracker')"
				:button-text="strings.ctaButtonText"
				:second-button-text="strings.ctaSecondButtonText"
				cta-second-button-new-badge
				cta-second-button-visible
				:learn-more-link="links.getUpsellUrl('search-statistics', 'keyword-rank-tracker', rootStore.isPro ? 'pricing' : 'liteUpgrade')"
				:feature-list="[
					strings.feature1,
					strings.feature2,
					strings.feature3,
					strings.feature4
				]"
				align-top
				:hide-bonus="!licenseStore.isUnlicensed"
			>
				<template #header-text>
					{{ strings.ctaHeader }}
				</template>
				<template #description>
					<required-plans :core-feature="[ 'search-statistics' ]"/>

					{{ strings.ctaDescription }}
				</template>
			</cta>
		</template>
	</div>
</template>

<script setup>
import { computed } from 'vue'

import {
	useKeywordRankTrackerStore,
	useLicenseStore,
	useRootStore,
	useSearchStatisticsStore
} from '@/vue/stores'

import { __ } from '@/vue/plugins/translations'
import { useCta } from '@/vue/pages/search-statistics/composables/Cta'

import license from '@/vue/utils/license'
import links from '@/vue/utils/links'

import ConnectCta from '@/vue/pages/search-statistics/views/partials/pro/ConnectCta'
import CoreBlur from '@/vue/components/common/core/Blur'
import Cta from '@/vue/components/common/cta/Index'
import Graph from '@/vue/pages/search-statistics/views/partials/Graph'
import KeywordsTable from '../partials/keyword-rank-tracker/KeywordsTable'
import RequiredPlans from '@/vue/components/lite/core/upsells/RequiredPlans'

const td                      = import.meta.env.VITE_TEXTDOMAIN
const keywordRankTrackerStore = useKeywordRankTrackerStore()
const licenseStore            = useLicenseStore()
const rootStore               = useRootStore()
const searchStatisticsStore   = useSearchStatisticsStore()
const learnMoreLink           = links.getDocLink(__('Learn More', td), 'keywordRankTracker', true)
const graphHeight             = '320px'

const strings = {
	...useCta().strings,
	withAioseo       : __('Below you can track how your page is performing in search results based on your keyword(s).', td),
	keywordPositions : __('Keyword Positions', td)
}

const showConnectCta = computed(() => {
	return (!licenseStore.isUnlicensed && license.hasCoreFeature('search-statistics')) && (!searchStatisticsStore.isConnected || searchStatisticsStore.unverifiedSite)
})

const parsedKeywords = computed(() => {
	return {
		rows : keywordRankTrackerStore.keywords.all.rows.slice(0, 3).map((row) => {
			return {
				...row,
				tracking : true
			}
		})
	}
})

const positionSeries = computed(() => {
	const keywordsByName = {}
	for (const keyword of parsedKeywords.value.rows) {
		if (keyword?.statistics?.history) {
			keywordsByName[keyword.name] = keyword
		}
	}

	const series = []
	for (const name in keywordsByName) {
		series.push({
			name : name,
			data : keywordsByName[name].statistics.history.map((item) => ({ x: item.date, y: item.position }))
		})
	}

	return series
})
</script>

<style lang="scss" scoped>
.keyword-rank-tracker-container {
	display: flex;
	flex-direction: column;
	gap: 20px;

	&__card {
		border: 1px solid $input-border;
		padding: 0 0 18px;

		&__header {
			align-items: center;
			background-color: $background;
			display: flex;
			font-size: 16px;
			font-weight: 600;
			line-height: normal;
			padding: 14px 16px;
		}

		&__body {
			height: v-bind(graphHeight);
		}
	}
}
</style>