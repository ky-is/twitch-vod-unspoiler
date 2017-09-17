const onBackgroundSync = function (background) {
  if (background.disabled !== undefined) {
    document.body.classList.toggle('_unspoil-off', background.disabled)
  }
}

const requestBackgroundSync = function () {
  chrome.runtime.sendMessage('sync', onBackgroundSync)
}

chrome.runtime.onMessage.addListener(onBackgroundSync)

requestBackgroundSync()
