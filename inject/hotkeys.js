let changingSpeed = 0
let speedChangeTimeout = null

const waitForSelector = function (selector, callback) {
  let attempts = 0
  const waitInterval = window.setInterval(() => {
    attempts += 1
    const element = document.querySelector(selector)
    if (element) {
      callback(element)
    }
    if (element || attempts > 9) {
      window.clearInterval(waitInterval)
    }
  }, 0)
}

const resetSpeedChange = function () {
  if (speedChangeTimeout) {
    return
  }
  speedChangeTimeout = window.setTimeout(() => {
    changingSpeed = 0
    speedChangeTimeout = null
  }, 0)
}

window.addEventListener('keypress', event => {
  const keyCode = event.keyCode
  let speedChange = 0
  if (event.shiftKey) {
    if (keyCode === 60) {
      speedChange = -1
    } else if (keyCode === 62) {
      speedChange = 1
    }
  }
  if (speedChange !== 0) {
    if (speedChange === changingSpeed) {
      return
    }
    const settingsIcon = document.querySelector('.pl-settings-icon')
    if (!settingsIcon) {
      resetSpeedChange()
      return
    }
    const menuAlreadyOpen = !!document.querySelector('.pl-menu__inner')
    if (changingSpeed !== 0) {
      resetSpeedChange()
      if (menuAlreadyOpen) {
        settingsIcon.click()
      }
      return
    }
    const currentSpeed = document.querySelector('.pl-settings-container > .qa-settings-banner-span')
    if (currentSpeed) {
      const currentSpeedText = currentSpeed.innerHTML
      if ((speedChange < 0 && currentSpeedText === '0.25x') || (speedChange > 0 && currentSpeedText === '2x')) {
        if (menuAlreadyOpen) {
          settingsIcon.click()
        }
        return
      }
    }
    settingsIcon.click()
    if (menuAlreadyOpen) {
      resetSpeedChange()
      return
    }
    changingSpeed = speedChange

    waitForSelector('.pl-menu__inner > .pl-menu__section > .pl-menu__item:first-child button', (nextElement) => {
      nextElement.click()
      const speedsSelector = '.pl-menu__inner > .pl-menu__section > .pl-menu__item'
      waitForSelector(speedsSelector, (nextElement) => {
        const speedSettings = document.querySelectorAll(speedsSelector)
        const speedsCount = speedSettings.length
        let didSelectSpeed = false
        for (let idx = 0; idx < speedsCount; idx += 1) {
          const speedMenuItem = speedSettings[idx]
          if (speedMenuItem.classList.contains('pl-menu__item--active')) {
            const nextSpeed = speedSettings[idx + speedChange]
            if (nextSpeed) {
              nextSpeed.children[0].click()
              didSelectSpeed = true
            }
            break
          }
        }
        if (!didSelectSpeed) {
          settingsIcon.click()
        }
        resetSpeedChange()
      })
    })
  }
}, { passive: true })
