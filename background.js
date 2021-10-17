chrome.tabs.onUpdated.addListener(function (tabId, Info, tab) {
  var uri = tab.url;

  if (
    Info.status == "complete" &&
    uri.match(/https:\/\/www.youtube.com\/watch/)
  ) {
    chrome.tabs.sendMessage(tab.id, { message: "watch" }, function (res) {
      if (chrome.runtime.lastError) {
      }
    });
  } else if (Info.status == "complete") {
    chrome.tabs.sendMessage(tab.id, { message: "watchGen" }, function (res) {
      if (chrome.runtime.lastError) {
      }
    });
  }
});
