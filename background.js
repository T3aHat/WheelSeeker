chrome.tabs.onUpdated.addListener(function (tabId, Info, tab) {
  var uri = tab.url;
  if (
    tab.status == "complete" &&
    uri.match(/https:\/\/www.youtube.com\/watch*/)
  ) {
    chrome.tabs.sendMessage(tab.id, { message: "watch" }, function (res) {
      if (chrome.runtime.lastError) {
      }
    });
  }
});
