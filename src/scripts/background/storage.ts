function getStorageKey (channelName: string) {
	return `__${channelName?.toUpperCase()}`
}

export default {

	isDisabled (channelName: string) {
		return !!localStorage.getItem(getStorageKey(channelName))
	},

	setDisabled (channelName: string, disabled: boolean) {
		localStorage.setItem(getStorageKey(channelName), disabled ? '1' : '')
	},

}
