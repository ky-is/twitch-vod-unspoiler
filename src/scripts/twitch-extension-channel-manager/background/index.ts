import { isChannelDisabled, setChannelDisabled } from './storage'

let currentChannel: string | undefined = undefined
let activeTabId: number | undefined = undefined

function updateIcon (disabled: boolean) {
	chrome.browserAction.setIcon({ path: `images/icon-${disabled ? 'off' : 'on'}.png` })
}

function setPrimaryTabId (tabId: number) {
	chrome.tabs.sendMessage(tabId, { sync: true })
	activeTabId = tabId
}

function resetTabState () {
	currentChannel = undefined
	updateIcon(true)
}

// Listeners

chrome.browserAction.onClicked.addListener((tab) => {
	if (!currentChannel) {
		return
	}
	const toggledDisabled = !isChannelDisabled(currentChannel)
	setChannelDisabled(currentChannel, toggledDisabled)
	updateIcon(toggledDisabled)
	const tabId = tab?.id
	if (tabId) {
		chrome.tabs.sendMessage(tabId, { channel: currentChannel, disabled: toggledDisabled })
	}
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (sender.tab?.id !== activeTabId || request.channel === undefined) {
		return
	}
	currentChannel = request.channel
	if (!currentChannel) {
		return
	}
	const isDisabled = isChannelDisabled(currentChannel)
	sendResponse({ channel: currentChannel, disabled: isDisabled })
	updateIcon(isDisabled)
})

chrome.tabs.onActivated.addListener((tab) => {
	resetTabState()
	setPrimaryTabId(tab.tabId)
})

function updateCurrentTabInWindow () {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const firstTabId = tabs[0]?.id
		if (firstTabId) {
			setPrimaryTabId(firstTabId)
		}
	})
}

chrome.windows.onFocusChanged.addListener(() => {
	resetTabState()
	updateCurrentTabInWindow()
})
