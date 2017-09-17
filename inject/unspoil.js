const SEEK_SECONDS = [
  // SECONDS * MINUTES * HOURS
  30,
  60 * 5,
  60 * 30,
]

const seek = function (event) {
  const seekVector = parseInt(event.currentTarget.getAttribute('u-seek'))
  if (isNaN(seekVector)) {
    console.error('Invalid seek target', event.currentTarget, event.target)
    return
  }

  const slider = document.querySelector('.js-player-slider')
  const sliderRect = slider.getBoundingClientRect()
  const maxSliderPixels = sliderRect.width

  const seekSecondsNow = parseFloat(slider.getAttribute('aria-valuenow'))
  const seekSecondsMax = parseFloat(slider.getAttribute('aria-valuemax'))
  const seekIndex = Math.abs(seekVector) - 1
  const resultHandleSeconds = seekSecondsNow + (Math.sign(seekVector) * SEEK_SECONDS[seekIndex])
  let resultHandlePixels
  if (resultHandleSeconds < 0) {
    if (seekSecondsNow < 1) {
      return
    }
    resultHandlePixels = 0
  } else if (resultHandleSeconds > seekSecondsMax) {
    if (seekSecondsNow > seekSecondsMax - 1) {
      return
    }
    resultHandlePixels = maxSliderPixels
  } else {
    resultHandlePixels = (resultHandleSeconds / seekSecondsMax) * maxSliderPixels
  }
  const seekMouseEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    clientX: sliderRect.left + resultHandlePixels,
    clientY: sliderRect.top,
  })
  slider.dispatchEvent(seekMouseEvent)
}

const pageObserver = new window.MutationObserver((mutations, observing) => {
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
        buttonChild.addEventListener('click', seek, false)
      }
    }
  }
})

waitForSelector('#main_col', (nextElement) => {
  pageObserver.observe(nextElement, { childList: true, subtree: true })
}, 999)
