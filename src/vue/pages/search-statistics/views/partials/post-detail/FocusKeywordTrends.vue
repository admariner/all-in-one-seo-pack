<template>
	<div class="aioseo-search-statistics-focus-keyword-trends">
		<div
			v-if="focusKeyword"
			class="title"
		>
			{{ strings.focusKeyword }}
			<span class="keyword-tag">{{ focusKeyword }}</span>
		</div>

		<core-alert
			v-else
			type="yellow"
			size="small"
		>
			{{ strings.youDontHaveKeyword }}
			<br><br>
			<base-button
				type="blue"
				tag="a"
				:v-if="editUrl"
				:href="editUrl"
				size="small"
			>
				{{ strings.addKeyword }}
			</base-button>
		</core-alert>

		<div
			:class="[{
				blurred : loading,
			}]"
		>
			<graph
				invert-y-axis
				:series="series"
			/>

			<core-loader v-if="loading" dark />
		</div>
	</div>
</template>

<script>
import {
	useSearchStatisticsStore
} from '@/vue/stores'

import CoreAlert from '@/vue/components/common/core/alert/Index'
import CoreLoader from '@/vue/components/common/core/Loader'
import Graph from '../Graph'

import { __ } from '@/vue/plugins/translations'

const td = import.meta.env.VITE_TEXTDOMAIN

export default {
	setup () {
		return {
			searchStatisticsStore : useSearchStatisticsStore()
		}
	},
	components : {
		CoreAlert,
		CoreLoader,
		Graph
	},
	props : {
		focusKeyword : String,
		editUrl      : {
			type : String,
			default () {
				return ''
			}
		}
	},
	data () {
		return {
			loading   : false,
			intervals : [],
			strings   : {
				focusKeyword       : __('Focus Keyword', td),
				youDontHaveKeyword : __('You don\'t yet have a Focus Keyword for this post. Add one to track trends and get suggested changes for your content to help you rank higher in search results.', td),
				addKeyword         : __('Add Focus Keyword', td)
			}
		}
	},
	computed : {
		series () {
			if (!this.focusKeyword) {
				return []
			}

			if (!this.intervals.length) {
				return []
			}

			return [ {
				name : __('Position', td),
				data : this.intervals.map((tick) => ({ x: tick.date, y: tick.position, label: tick.positionLabel }))
			} ]
		}
	},
	beforeMount () {
		if (!this.focusKeyword) {
			return
		}

		this.loading = true
		this.searchStatisticsStore.getPostDetailFocusKeywordTrend({
			focusKeyword : this.focusKeyword
		}).then((response) => {
			this.intervals = response.body.data.intervals
		}).finally(() => {
			this.loading = false
		})
	}
}
</script>

<style lang="scss">
.aioseo-search-statistics-focus-keyword-trends {
	.title {
		font-size: 14px;

		.keyword-tag {
			margin-left: 10px;
			display: inline-block;
			color: $black2;
			font-size: 14px;
			font-weight: 700;
			padding: 3px 10px;
			background-color: $background;
			border-radius: 3px;
		}
	}

	.aioseo-alert {
		font-weight: normal;
		font-size: 14px;
		margin-bottom: 20px;
	}

	div {
		&.blurred {
			filter: blur(2px);
			pointer-events: none;
			user-select: none;
		}

		.aioseo-loading-spinner {
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
		}
	}
}
</style>