let syncChannel = null
let channelDisabled = false

const onBackgroundSync = function (background) {
  if (!background) {
    return
  }
  if (background.sync) {
    if (syncChannel) {
      sendSyncChannel()
    }
  } else {
    if (background.channel !== syncChannel) {
      return
    }
    const disable = background.disabled
    if (disable !== undefined) {
      if (disable !== channelDisabled) {
        document.body.classList.toggle('_unspoil-off', disable)
        channelDisabled = disable
      }
    }
  }
}

const sendMessage = function (body) {
  chrome.runtime.sendMessage(body, onBackgroundSync)
}

chrome.runtime.onMessage.addListener(onBackgroundSync)

//CHANNEL

const sendSyncChannel = function () {
  sendMessage({ channel: syncChannel })
}

const setSyncChannel = function (channel) {
  syncChannel = channel ? channel.toUpperCase() : null
  sendSyncChannel()
}
