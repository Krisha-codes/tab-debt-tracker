document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['tabTimestamps'], (result) => {
    const timestamps = result.tabTimestamps || {};
    const now = Date.now();

    chrome.tabs.query({}, (tabs) => {
      const tabList = document.getElementById('tabList');
      const totalDebtEl = document.getElementById('totalDebt');
      let totalDebtMinutes = 0;

      tabs.forEach((tab) => {
        const lastActive = timestamps[tab.id] || now;
        const idleMinutes = Math.floor((now - lastActive) / 60000);
        totalDebtMinutes += idleMinutes;

        const row = document.createElement('div');
        row.className = 'tab-row';

        const bar = document.createElement('div');
        bar.className = 'debt-bar';
        bar.style.backgroundColor = getDebtColor(idleMinutes);
        bar.style.width = Math.min(idleMinutes, 100) + 'px';

        const label = document.createElement('span');
        label.textContent = `${tab.title} — ${idleMinutes} min idle`;

        row.appendChild(bar);
        row.appendChild(label);
        tabList.appendChild(row);
      });

      totalDebtEl.textContent = `Total Debt: ${totalDebtMinutes} tab-minutes`;
    });
  });
});

function getDebtColor(minutes) {
  if (minutes < 5) return '#4CAF50';   // green — fresh
  if (minutes < 30) return '#FFC107';  // yellow — getting stale
  return '#F44336';                    // red — seriously neglected
}