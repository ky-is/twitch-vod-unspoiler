const isBeta = document.body.className !== 'ember-application'

const pageObserver = new window.MutationObserver((mutations, observing) => {
  const channelNameElement = document.querySelector(isBeta ? '.channel-header__user h5' : '.cn-bar__displayname')
  if (!channelNameElement) {
    return
  }
  const newChannel = channelNameElement.textContent
  if (newChannel !== syncChannel) {
    setSyncChannel(newChannel)
  }
})

waitForSelector(isBeta ? 'main' : '#main_col', (nextElement) => {
  pageObserver.observe(nextElement, { childList: true, subtree: true })
}, 999)
