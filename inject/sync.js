let syncChannel = null

const onBackgroundSync = function (background) {
  if (background.sync) {
    if (syncChannel) {
      sendSyncChannel()
    }
  } else {
    if (background.channel !== syncChannel) {
      return
    }
    if (background.disabled !== undefined) {
      document.body.classList.toggle('_unspoil-off', background.disabled)
    }
  }
}

const sendSyncChannel = function () {
  chrome.runtime.sendMessage({ channel: syncChannel }, onBackgroundSync)
}

const setSyncChannel = function (channel) {
  syncChannel = channel ? channel.toUpperCase() : null
  sendSyncChannel()
}

chrome.runtime.onMessage.addListener(onBackgroundSync)
