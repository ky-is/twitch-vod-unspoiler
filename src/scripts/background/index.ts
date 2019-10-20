import storage from './storage'

let currentChannel: string | undefined = undefined
let activeTabID: number | undefined = undefined

// Primary tab icon

function updateIcon (disabled: boolean) {
	chrome.browserAction.setIcon({ path: `images/icon-${disabled ? 'off' : 'on'}.png` })
}

function setPrimaryTabId (tabID: number) {
	chrome.tabs.sendMessage(tabID, { sync: true })
	activeTabID = tabID
}

function updateCurrentTabInWindow () {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const firstTabID = tabs[0]?.id
		if (firstTabID) {
			setPrimaryTabId(firstTabID)
		}
	})
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
	const toggledDisabled = !storage.isDisabled(currentChannel)
	storage.setDisabled(currentChannel, toggledDisabled)
	updateIcon(toggledDisabled)
	const tabID = tab?.id
	if (tabID) {
		chrome.tabs.sendMessage(tabID, { channel: currentChannel, disabled: toggledDisabled })
	}
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (sender?.tab?.id !== activeTabID) {
		return
	}
	if (request.channel) {
		currentChannel = request.channel
	}
	if (!currentChannel) {
		return
	}
	const isDisabled = storage.isDisabled(currentChannel)
	sendResponse({ channel: currentChannel, disabled: isDisabled })
	updateIcon(isDisabled)
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
