chrome.runtime.onStartup.addListener(initializeAllTabs);
chrome.runtime.onInstalled.addListener(initializeAllTabs);

function initializeAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    const now = Date.now();
    const data = {};
    tabs.forEach((tab) => {
      data[tab.id] = now;
    });
    chrome.storage.local.set({ tabTimestamps: data });
  });
}

// Whenever a tab is created, start its clock at "now"
chrome.tabs.onCreated.addListener((tab) => {
  updateTimestamp(tab.id);
});
// Whenever the user switches to a tab, reset that tab's clock to "now"
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateTimestamp(activeInfo.tabId);
});

// Whenever a tab is closed, remove it from our tracked data so it doesn't pile up forever
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.get(['tabTimestamps'], (result) => {
    const data = result.tabTimestamps || {};
    delete data[tabId];
    chrome.storage.local.set({ tabTimestamps: data });
  });
});

function updateTimestamp(tabId) {
  chrome.storage.local.get(['tabTimestamps'], (result) => {
    const data = result.tabTimestamps || {};
    data[tabId] = Date.now();
    chrome.storage.local.set({ tabTimestamps: data });
  });
}