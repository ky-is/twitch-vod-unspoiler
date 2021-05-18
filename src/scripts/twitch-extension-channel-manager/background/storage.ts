function getStorageKey(channelName: string) {
	return `__${channelName?.toUpperCase()}`
}

export function isChannelDisabled(channelName: string) {
	return !!localStorage.getItem(getStorageKey(channelName))
}

export function setChannelDisabled(channelName: string, disabled: boolean) {
	localStorage.setItem(getStorageKey(channelName), disabled ? '1' : '')
}
