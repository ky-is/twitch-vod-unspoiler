import { waitForSelector } from './selectors'
import sync from './sync'

import '@/styles/twitch.css'
import '@/styles/unspoiler.css'

const SEEK_SECONDS = [
	// SECONDS * MINUTES * HOURS
	30,
	60 * 5,
	60 * 15,
	60 * 30,
]
const SECONDS_PER_HOTKEY_SEEK = 10

let mainElement: Element | undefined = undefined

function onSeek (event: Event) {
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

	// const slider = mainElement.querySelector('.js-player-slider')
	// const sliderRect = slider.getBoundingClientRect()
	// const maxSliderPixels = sliderRect.width
	// const seekSecondsNow = parseFloat(slider.getAttribute('aria-valuenow'))
	// const seekSecondsMax = parseFloat(slider.getAttribute('aria-valuemax'))
	// const resultHandleSeconds = seekSecondsNow + (Math.sign(seekVector) * seekDuration)
	// let resultHandlePixels
	// if (resultHandleSeconds < 0) {
	// 	if (seekSecondsNow < 1) {
	// 		return
	// 	}
	// 	resultHandlePixels = 0
	// } else if (resultHandleSeconds > seekSecondsMax) {
	// 	if (seekSecondsNow > seekSecondsMax - 1) {
	// 		return
	// 	}
	// 	resultHandlePixels = maxSliderPixels
	// } else {
	// 	resultHandlePixels = (resultHandleSeconds / seekSecondsMax) * maxSliderPixels
	// }
	// const clickX = Math.round(sliderRect.left + resultHandlePixels)
	// const clickY = Math.round(sliderRect.top)
	// console.log(clickX, clickY)
	// const seekMouseEvent = new MouseEvent('click', {
	// 	bubbles: true,
	// 	cancelable: true,
	// 	clientX: clickX,
	// 	clientY: clickY,
	// 	// screenX: clickX,
	// 	// screenY: clickY + 100,
	// 	// composed: true,
	// })
	// slider.dispatchEvent(seekMouseEvent)
	// slider.setAttribute('aria-valuenow', resultHandleSeconds)
	// console.log(event, seekMouseEvent)

	const playerElement = mainElement!.querySelector('video')
	if (!playerElement) {
		return console.error('Player not found')
	}
	const keyCode = seekVector < 0 ? '37' : '39'
	const keyEvent = new KeyboardEvent('keydown', {
		bubbles: true,
		cancelable: false,
		// key: seekVector < 0 ? 'ArrowLeft' : 'ArrowRight',
		// code: `${keyCode}`,
		keyCode,
		repeat: true,
	} as any) //TODO Twitch.tv uses the deprecated `keyCode` parameter 2019/10/19. We need to wait for them to adopt `code` to remove `as any`.
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
	const seekContainer = mainElement!.querySelector('.player-controls')
	if (!seekContainer) {
		return
	}
	const unspoilDiv = document.createElement('div')
	unspoilDiv.id = UNSPOIL_CONTROLS_ID
	const times = SEEK_SECONDS.map(seconds => (seconds < 90 ? `${seconds}s` : `${seconds / 60}m`))
	unspoilDiv.innerHTML = `
		<span>
			<button u-seek="-4">◀︎<span class="_unspoil-faint">${times[3]}</span></button>
			<button u-seek="-3">◀︎<span class="_unspoil-faint">${times[2]}</span></button>
			<button u-seek="-2">◀︎<span class="_unspoil-faint">${times[1]}</span></button>
			<button u-seek="-1">◀︎<span class="_unspoil-faint">${times[0]}</span></button>
		</span>
		<span class="_unspoil-faint _unspoil-separator"></span>
		<span>
			<button u-seek="1"><span class="_unspoil-faint">${times[0]}</span> ▶︎</button>
			<button u-seek="2"><span class="_unspoil-faint">${times[1]}</span> ▶︎</button>
			<button u-seek="3"><span class="_unspoil-faint">${times[2]}</span> ▶︎</button>
			<button u-seek="4"><span class="_unspoil-faint">${times[3]}</span> ▶︎</button>
		</span>
	`
	seekContainer.insertBefore(unspoilDiv, seekContainer.children[1])
	for (const spanChild of unspoilDiv.children) {
		for (const buttonChild of spanChild.children) {
			buttonChild.addEventListener('click', onSeek, false)
		}
	}
}

const pageObserver = new window.MutationObserver((mutations, observing) => {
	if (!mainElement) {
		return
	}
	const newChannel = guessChannelNameFromContent(mainElement)
	if (newChannel !== sync.currentChannel) {
		// console.log(newChannel)
		sync.setChannel(newChannel ?? undefined)
	}
	injectPlayer()
})

function guessChannelNameFromContent(content: Element): string | null {
	let channelCandidate: string | undefined
	for (const link of content.querySelectorAll('a')) {
		let href = link.getAttribute('href')?.trim()
		if (!href || !href.startsWith('/')) {
			continue
		}
		href = href.slice(1)
		if (href.endsWith('/')) {
			href = href.slice(0, -1)
		}
		if (href.split('/').length === 1) { // Only accept root-level links
			if (channelCandidate === href) { // Must find two instances of candidate link
				return href
			}
			channelCandidate = href
		}
	}
	return null
}

waitForSelector('main', (nextElement) => {
	mainElement = nextElement
	pageObserver.observe(nextElement, { childList: true, subtree: true })
}, 999)
