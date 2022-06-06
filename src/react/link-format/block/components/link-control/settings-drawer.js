/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { ToggleControl, TextControl, VisuallyHidden } from '@wordpress/components'
import { Component } from '@wordpress/element'

const defaultSettings = [
	{
		id    : 'opensInNewTab',
		title : __('Open in new tab'),
		type  : 'ToggleControl'
	},
	{
		id    : 'nofollow',
		title : __('Add "nofollow" to link', 'all-in-one-seo-pack'),
		type  : 'ToggleControl'
	},
	{
		id    : 'sponsored',
		title : __('Add "sponsored" to link', 'all-in-one-seo-pack'),
		type  : 'ToggleControl'
	},
	{
		id    : 'ugc',
		title : __('Add "ugc" to link', 'all-in-one-seo-pack'),
		type  : 'ToggleControl'
	},
	{
		id    : 'title',
		title : __('Add title attribute to link', 'all-in-one-seo-pack'),
		type  : 'TextControl'
	}
]

class LinkControlSettingsDrawer extends Component {
	constructor (props) {
		super(props)

		this.state = {
			textValue : props.value.title
		}
	}

	render () {
		const { value, onChange } = this.props
		const settings = defaultSettings

		if (!settings || !settings.length) {
			return null
		}

		const handleSettingChange = (setting) => (newValue) => {
			onChange({
				...value,
				[setting.id] : newValue
			})
		}

		const theSettings = settings.map((setting) => {
			if ('TextControl' === setting.type) {
				return <TextControl
					data-aioseop="true"
					className="block-editor-link-control__setting aioseo-link-title"
					key={setting.id}
					label={setting.title}
					onChange={(val) => {
						this.setState({ textValue: val })
					}}
					onBlur={(event) => {
						// This prevents the link drawer from crashing if no URL is set.
						if (!value.url) {
							this.setState({ textValue: event.target.value })
							return
						}
						onChange({
							...value,
							[setting.id] : event.target.value
						})
					}}
					value={this.state.textValue}
				/>
			} else if ('ToggleControl' === setting.type) {
				return <ToggleControl
					className="block-editor-link-control__setting"
					key={setting.id}
					label={setting.title}
					onChange={handleSettingChange(setting)}
					checked={value ? !!value[setting.id] : false}
				/>
			}

			return null
		})

		return (
			<fieldset className="block-editor-link-control__settings">
				<VisuallyHidden as="legend">
					{__('Currently selected link settings')}
				</VisuallyHidden>
				{theSettings}
			</fieldset>
		)
	}
}

export default LinkControlSettingsDrawer