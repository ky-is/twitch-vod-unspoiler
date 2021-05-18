import { waitForSelector } from './selectors'

let isChannelDisabled = false

let extensionIdentifier = undefined as (string | undefined)
let currentChannel = null as (string | null)

function sendSyncChannel() {
	chrome.runtime.sendMessage({ channel: currentChannel }, onBackgroundSync)
}

export function setCurrentChannel(channelName: string | null) {
	if (channelName === currentChannel) {
		return false
	}
	currentChannel = channelName
	sendSyncChannel()
	return true
}

function connectToBackground(extensionName: string) {
	extensionIdentifier = extensionName
	chrome.runtime.onMessage.addListener(onBackgroundSync)
}

export function injectTwitchPageOnBehalfOf(extensionName: string, mutationCallback: ((mutations?: MutationRecord[]) => void)) {
	let mainElement: Element | undefined = undefined

	const pageObserver = new window.MutationObserver((mutations) => {
		if (!mainElement) {
			return
		}
		const newChannel = guessChannelNameFromContent(mainElement)
		setCurrentChannel(newChannel ?? null)
		mutationCallback(mutations)
	})

	function guessChannelNameFromContent(content: Element): string | undefined {
		return content.querySelector('h1')?.innerText
	}

	waitForSelector('main', (nextElement) => {
		mainElement = nextElement
		pageObserver.observe(nextElement, { childList: true, subtree: true })
	}, 999)

	connectToBackground(extensionName)
}

function onBackgroundSync (background: any) {
	if (!background) {
		return
	}
	if (background.sync) {
		if (currentChannel) {
			sendSyncChannel()
		}
	} else {
		if (background.channel !== currentChannel) {
			return
		}
		const disable = background.disabled
		if (disable !== undefined) {
			if (disable !== isChannelDisabled) {
				document.body.classList.toggle(`_${extensionIdentifier}-off`, disable)
				isChannelDisabled = disable
			}
		}
	}
}
