let disabled = localStorage.getItem('disabled')

const updateIcon = function () {
  chrome.browserAction.setIcon({ path: `images/icon-${disabled ? 'off' : 'on'}.png` })
}

const getSyncMessage = function () {
  return { disabled }
}

//LISTENERS

chrome.browserAction.onClicked.addListener((tab) => {
  disabled = !disabled
  localStorage.setItem('disabled', disabled)
  updateIcon()

  chrome.tabs.query({ discarded: false }, (tabs) => {
    const message = getSyncMessage()
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, message)
    }
  })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse(getSyncMessage())
})

//SETUP

updateIcon()
