let isChannelDisabled = false

const sync = {
	currentChannel: undefined as (string | undefined),

	setChannel (channelName?: string) {
		sync.currentChannel = channelName
		sendSyncChannel()
	},
}

function sendSyncChannel () {
	sendMessage({ channel: sync.currentChannel })
}

function onBackgroundSync (background: any) {
	if (!background) {
		return
	}
	if (background.sync) {
		if (sync.currentChannel) {
			sendSyncChannel()
		}
	} else {
		if (background.channel !== sync.currentChannel) {
			return
		}
		const disable = background.disabled
		if (disable !== undefined) {
			if (disable !== isChannelDisabled) {
				document.body.classList.toggle('_unspoil-off', disable)
				isChannelDisabled = disable
			}
		}
	}
}

function sendMessage (body: any) {
	chrome.runtime.sendMessage(body, onBackgroundSync)
}

chrome.runtime.onMessage.addListener(onBackgroundSync)

export default sync
