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

        const emoji = document.createElement('span');
        emoji.className = 'emoji';
        emoji.textContent = getDebtEmoji(idleMinutes);

        const info = document.createElement('div');
        info.className = 'tab-info';

        const title = document.createElement('div');
        title.className = 'tab-title';
        title.textContent = tab.title;

        const badge = document.createElement('span');
        badge.className = 'debt-badge';
        badge.style.backgroundColor = getDebtColor(idleMinutes);
        badge.textContent = `${idleMinutes} min idle`;

        info.appendChild(title);
        info.appendChild(badge);
        row.appendChild(emoji);
        row.appendChild(info);
        tabList.appendChild(row);
      });

      totalDebtEl.textContent = `Total Debt: ${totalDebtMinutes} tab-minutes`;
    });
  });
});

function getDebtColor(minutes) {
  if (minutes < 5) return '#c3b8e8';   
  if (minutes < 30) return '#a594d1';  
  return '#8e7cc3';                     
}
function getDebtEmoji(minutes) {
  if (minutes < 5) return '🌱';
  if (minutes < 30) return '🥀';
  return '💀';
}
