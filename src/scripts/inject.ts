import { injectTwitchPageOnBehalfOf } from '@ky-is/twitch-extension-channel-manager/inject'

import '../styles/twitch.css'
import '../styles/unspoil.css'

const SEEK_SECONDS = [
	// SECONDS * MINUTES * HOURS
	30,
	60 * 5,
	60 * 15,
	60 * 30,
]
const SECONDS_PER_HOTKEY_SEEK = 10

function onSeek (event: Event) {
	(document.activeElement as HTMLElement)?.blur()
	const currentTarget = event.currentTarget
	if (!currentTarget) {
		return console.log('No currentTarget for seek')
	}
	const seekAttribute = (currentTarget as HTMLInputElement).getAttribute('u-seek')
	if (!seekAttribute) {
		return console.error('No seek attribute for currentTarget')
	}
	const seekVector = parseInt(seekAttribute)
	if (isNaN(seekVector)) {
		return console.error('Invalid seek target', seekAttribute, currentTarget, event.target)
	}
	const seekIndex = Math.abs(seekVector) - 1
	const seekDuration = SEEK_SECONDS[seekIndex]
	const playerElement = document.querySelector('video')
	if (!playerElement) {
		return console.error('Player not found')
	}
	const keyCode = seekVector < 0 ? 37 : 39
	const keyEvent = new KeyboardEvent('keydown', {
		bubbles: true,
		cancelable: false,
		keyCode,
		repeat: true,
	})
	const arrowSeeks = Math.ceil(seekDuration / SECONDS_PER_HOTKEY_SEEK)
	for (let idx = 0; idx < arrowSeeks; idx += 1) {
		playerElement.dispatchEvent(keyEvent)
	}
}

const UNSPOIL_CONTROLS_ID = '_unspoil-seek'

function injectPlayer () {
	if (document.getElementById(UNSPOIL_CONTROLS_ID)) {
		return
	}
	const video = document.querySelector('video')
	if (!video) {
		return
	}

	const seekContainer = document.querySelector('.video-player__overlay .player-controls') ?? document.querySelector('.player-controls')
	const homeVideoWrapper = document.querySelector('.home-video__wrapper')
	if (!seekContainer || homeVideoWrapper) {
		video.hidden = true
		video.pause()
		return
	}
	if (video.hidden) {
		video.hidden = false
		video.play()
	}

	if (document.querySelector('#root[data-a-page-loaded-name="ChannelWatchPage"]')) {
		return
	}

	const unspoilDiv = document.createElement('div')
	unspoilDiv.id = UNSPOIL_CONTROLS_ID
	const times = SEEK_SECONDS.map(seconds => (seconds < 90 ? `${seconds}s` : `${seconds / 60}m`))
	unspoilDiv.innerHTML = `
		<div>
			<button u-seek="-4">◀︎<span class="_unspoil-faint">${times[3]}</span></button>
			<button u-seek="-3">◀︎<span class="_unspoil-faint">${times[2]}</span></button>
			<button u-seek="-2">◀︎<span class="_unspoil-faint">${times[1]}</span></button>
			<button u-seek="-1">◀︎<span class="_unspoil-faint">${times[0]}</span></button>
		</div>
		<div class="_unspoil-faint _unspoil-separator"></div>
		<div>
			<button u-seek="1"><span class="_unspoil-faint">${times[0]}</span> ▶︎</button>
			<button u-seek="2"><span class="_unspoil-faint">${times[1]}</span> ▶︎</button>
			<button u-seek="3"><span class="_unspoil-faint">${times[2]}</span> ▶︎</button>
			<button u-seek="4"><span class="_unspoil-faint">${times[3]}</span> ▶︎</button>
		</div>
	`
	seekContainer.insertBefore(unspoilDiv, seekContainer.children[1])
	for (const wrapperChild of unspoilDiv.children) {
		for (const buttonChild of wrapperChild.children) {
			buttonChild.addEventListener('click', onSeek, false)
		}
	}
}

injectTwitchPageOnBehalfOf('unspoil', injectPlayer)
