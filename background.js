let currentChannel = null
let activeTabId = null

const updateIcon = function (disabled) {
	chrome.browserAction.setIcon({ path: `images/icon-${disabled ? 'off' : 'on'}.png` })
}

//STORAGE

const getChannelKey = function () {
	return `__${currentChannel}`
}

const getChannelDisabled = function () {
	return !!localStorage.getItem(getChannelKey())
}

const setChannelDisabled = function (disabled) {
	localStorage.setItem(getChannelKey(), disabled ? '1' : '')
}

const setPrimaryTabId = function (tabId) {
	chrome.tabs.sendMessage(tabId, { sync: true })
	activeTabId = tabId
}

const updateCurrentTabInWindow = function () {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const firstTab = tabs[0]
		if (firstTab) {
			setPrimaryTabId(firstTab.id)
		}
	})
}

const resetTabState = function () {
	currentChannel = null
	updateIcon(true)
}

//LISTENERS

chrome.browserAction.onClicked.addListener((tab) => {
	if (!currentChannel) {
		return
	}
	const disabled = !getChannelDisabled()
	setChannelDisabled(disabled)
	updateIcon(disabled)
	chrome.tabs.sendMessage(tab.id, { channel: currentChannel, disabled })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (sender.tab.id !== activeTabId) {
		return
	}
	if (request.channel) {
		currentChannel = request.channel
	}
	const disabled = getChannelDisabled()
	sendResponse({ channel: currentChannel, disabled })
	updateIcon(disabled)
})

chrome.tabs.onActivated.addListener((tab) => {
	resetTabState()
	setPrimaryTabId(tab.tabId)
})

chrome.windows.onFocusChanged.addListener((windowId) => {
	resetTabState()
	updateCurrentTabInWindow()
})

updateCurrentTabInWindow()
