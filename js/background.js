chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    usersList: [],
    defaultMessage: '',
    defaultPoint: 10
  }, function() {

  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'unipos.me'},
      })
    ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  chrome.alarms.onAlarm.addListener(function(alarm) {
    alert("Got an alarm");
  });
});
