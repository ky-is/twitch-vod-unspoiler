let mainElement

const pageObserver = new window.MutationObserver((mutations, observing) => {
	const channelNameElement = mainElement.querySelector('.channel-header__user h5')
	if (!channelNameElement) {
		return
	}
	const newChannel = channelNameElement.textContent
	if (newChannel !== syncChannel) {
		setSyncChannel(newChannel)
	}
	if (injectPlayer) {
		injectPlayer()
	}
})

waitForSelector('main', (nextElement) => {
	mainElement = nextElement
	pageObserver.observe(nextElement, { childList: true, subtree: true })
}, 999)
