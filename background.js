let off = false

const updateIcon = () => {
  chrome.browserAction.setIcon({ path: `images/icon-${off ? 'off' : 'on'}.png` })
}

chrome.browserAction.onClicked.addListener((tab) => {
  off = !off
  chrome.tabs.executeScript(null, { code: `document.body.classList.toggle('_unspoil-off')` })
  updateIcon()
})

updateIcon()
