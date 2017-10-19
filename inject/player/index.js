const SEEK_SECONDS = [
  // SECONDS * MINUTES * HOURS
  30,
  60 * 10,
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
  // const clickX = Math.round(sliderRect.left + resultHandlePixels)
  // const clickY = Math.round(sliderRect.top)
  // console.log(clickX, clickY)
  // const seekMouseEvent = new MouseEvent('click', {
  //   bubbles: true,
  //   cancelable: true,
  //   clientX: clickX,
  //   clientY: clickY,
  //   // screenX: clickX,
  //   // screenY: clickY + 100,
  //   // composed: true,
  // })
  // slider.dispatchEvent(seekMouseEvent)
  // slider.setAttribute('aria-valuenow', resultHandleSeconds)
  // console.log(event, seekMouseEvent)

  const playerElement = document.querySelector('.player')
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

const UNSPOIL_CONTROLS_ID = '_unspoil-seek'

const injectPlayer = function() {
  waitForSelector('.player-streaminfo__name', (nextElement) => {
    if (document.getElementById(UNSPOIL_CONTROLS_ID)) {
      return
    }
    setSyncChannel(document.querySelector('.player-streaminfo__name a').textContent)

    const seekContainer = document.querySelector('.player-seek')
    if (!seekContainer) {
      return
    }
    const unspoilDiv = document.createElement('div')
    unspoilDiv.id = UNSPOIL_CONTROLS_ID
    let times = SEEK_SECONDS.map(seconds => seconds < 90 ? `${seconds}s` : `${seconds / 60}m`)
    unspoilDiv.innerHTML = `
      <span>
        <button u-seek="-3">◀︎<span class="_unspoil-faint">${times[2]}</span></button>
        <button u-seek="-2">◀︎<span class="_unspoil-faint">${times[1]}</span></button>
        <button u-seek="-1">◀︎<span class="_unspoil-faint">${times[0]}</span></button>
      </span>
      <span class="_unspoil-faint _unspoil-separator"></span>
      <span>
        <button u-seek="1"><span class="_unspoil-faint">${times[0]}</span> ▶︎</button>
        <button u-seek="2"><span class="_unspoil-faint">${times[1]}</span> ▶︎</button>
        <button u-seek="3"><span class="_unspoil-faint">${times[2]}</span> ▶︎</button>
      </span>
    `
    seekContainer.appendChild(unspoilDiv)
    for (const spanChild of unspoilDiv.children) {
      for (const buttonChild of spanChild.children) {
        buttonChild.addEventListener('click', onSeek, false)
      }
    }
  }, 99)
}

injectPlayer()
