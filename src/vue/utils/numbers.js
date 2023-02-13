import animate from 'animate-vanilla-js'

const numberFormat = (number, decimals = 2) => {
	number = parseFloat(number).toFixed(decimals)

	return Number(number).toLocaleString('en')
}

const compactNumber = (number, digits = 1) => {
	const lookup = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'K' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'B' },
		{ value: 1e12, symbol: 't' },
		{ value: 1e15, symbol: 'q' },
		{ value: 1e18, symbol: 'Q' }
	]

	const rx = /\.0+$|(\.\d*[1-9])0+$/
	const item = lookup.slice().reverse().find(function (exponential) {
		return number >= exponential.value
	})

	return item ? (number / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0'
}

const getDuration = (from, to) => {
	let duration     = 500
	const difference = to - from

	if (500 >= difference) {
		return duration
	}

	duration = difference / 10
	if (1000 > duration) {
		duration = 1000
	}

	if (3500 < duration) {
		duration = 3500
	}

	return duration
}

const animateNumbers = (from, to, callback, duration = null) => {
	return animate(
		from,
		to,
		duration || getDuration(0, to),
		'easeInOutQuad',
		value => callback instanceof Function ? callback(value.toFixed(0)) : (callback = value.toFixed(0))
	)
}

export default {
	numberFormat,
	compactNumber,
	getDuration,
	animateNumbers
}