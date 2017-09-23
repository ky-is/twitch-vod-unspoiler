const SEEK_SECONDS = [
  // SECONDS * MINUTES * HOURS
  30,
  60 * 5,
  60 * 30,
]

const onSeek = function (event) {
  const seekVector = parseInt(event.currentTarget.getAttribute('u-seek'))
  if (isNaN(seekVector)) {
    console.error('Invalid seek target', event.currentTarget, event.target)
    return
  }
  const seekIndex = Math.abs(seekVector) - 1
  const seekDuration = SEEK_SECONDS[seekIndex]

  // const slider = document.querySelector('.js-player-slider')
  // const sliderRect = slider.getBoundingClientRect()
  // const maxSliderPixels = sliderRect.width
  // const seekSecondsNow = parseFloat(slider.getAttribute('aria-valuenow'))
  // const seekSecondsMax = parseFloat(slider.getAttribute('aria-valuemax'))
  // const resultHandleSeconds = seekSecondsNow + (Math.sign(seekVector) * seekDuration)
  // let resultHandlePixels
  // if (resultHandleSeconds < 0) {
  //   if (seekSecondsNow < 1) {
  //     return
  //   }
  //   resultHandlePixels = 0
  // } else if (resultHandleSeconds > seekSecondsMax) {
  //   if (seekSecondsNow > seekSecondsMax - 1) {
  //     return
  //   }
  //   resultHandlePixels = maxSliderPixels
  // } else {
  //   resultHandlePixels = (resultHandleSeconds / seekSecondsMax) * maxSliderPixels
  // }
  // const clickX = sliderRect.left + resultHandlePixels
  // const clickY = sliderRect.top + 1
  // const seekMouseEvent = new MouseEvent('click', {
  //   // bubbles: true,
  //   // cancelable: true,
  //   clientX: clickX,
  //   clientY: clickY,
  //   // screenX: clickX,
  //   // screenY: clickY + 100,
  //   // composed: true,
  // })
  // slider.dispatchEvent(seekMouseEvent)
  // slider.setAttribute('aria-valuenow', resultHandleSeconds)
  // console.log(event, seekMouseEvent)

  const playerElement = document.querySelector('#player')
  const keyEvent = new KeyboardEvent('keydown', {
    bubbles: false,
    cancelable: false,
    key: seekVector < 0 ? 'ArrowLeft' : 'ArrowRight',
    repeat: true,
  })
  const arrowSeeks = Math.ceil(seekDuration / 5)
  for (let idx = 0; idx < arrowSeeks; idx += 1) {
    playerElement.dispatchEvent(keyEvent)
  }
}

const pageObserver = new window.MutationObserver((mutations, observing) => {
  const channelNameElement = document.querySelector('.cn-bar__displayname')
  if (!channelNameElement) {
    return
  }
  const newChannel = channelNameElement.textContent
  if (newChannel !== syncChannel) {
    setSyncChannel(newChannel)
  }

  const seekContainer = document.querySelector('#js-player-seek')
  if (seekContainer && seekContainer.children.length && !document.querySelector('#_unspoil-seek')) {
    const unspoilDiv = document.createElement('div')
    unspoilDiv.id = '_unspoil-seek'
    seekContainer.appendChild(unspoilDiv)
    unspoilDiv.innerHTML = `
      <span>
        <button u-seek="-3">◀︎<span class="_unspoil-faint">30m</span></button>
        <button u-seek="-2">◀︎<span class="_unspoil-faint">5m</span></button>
        <button u-seek="-1">◀︎<span class="_unspoil-faint">30s</span></button>
      </span>
      <span class="_unspoil-faint _unspoil-separator"></span>
      <span>
        <button u-seek="1"><span class="_unspoil-faint">30s</span> ▶︎</button>
        <button u-seek="2"><span class="_unspoil-faint">5m</span> ▶︎</button>
        <button u-seek="3"><span class="_unspoil-faint">30m</span> ▶︎</button>
      </span>
    `
    for (const spanChild of unspoilDiv.children) {
      for (const buttonChild of spanChild.children) {
        buttonChild.addEventListener('click', onSeek, false)
      }
    }
  }
})

waitForSelector('#main_col', (nextElement) => {
  pageObserver.observe(nextElement, { childList: true, subtree: true })
}, 999)
