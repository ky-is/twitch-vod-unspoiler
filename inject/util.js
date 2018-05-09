const waitForSelector = function (selector, callback, maxAttemptFrames) {
	let attempts = 0
	const waitInterval = window.setInterval(() => {
		attempts += 1
		const element = document.querySelector(selector)
		if (element || attempts > maxAttemptFrames) {
			if (attempts > 999) {
				console.error('Failed to load', selector, attempts)
			}
			window.clearInterval(waitInterval)
		}
		if (element) {
			callback(element)
		}
	}, 0)
}
