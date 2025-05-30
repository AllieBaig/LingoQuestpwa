/**
 * Minimal UI Theme Manager
 * Switches class based on OS-style emoji themes for Minimal UI
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-30 16:45 | File: scripts/utils/themeManager.js
 */

const themeMap = {
  windows98: 'theme-w98',
  windowsxp: 'theme-wxp',
  android: 'theme-android',
  ios: 'theme-ios',
  redhat: 'theme-redhat',
  ubuntu: 'theme-ubuntu',
};

export function applyThemeFromSelector() {
  const selector = document.getElementById('themeSelector');
  if (!selector) return;

  const saved = localStorage.getItem('uiTheme');
  if (saved) {
    // Ensure no previous theme class remains
    Object.values(themeMap).forEach(cls => document.body.classList.remove(cls));
    document.body.classList.add(saved);
    selector.value = Object.keys(themeMap).find(key => themeMap[key] === saved) || '';
  }

  selector.addEventListener('change', () => {
    const selected = selector.value;
    const themeClass = themeMap[selected];
    if (!themeClass) return;

    Object.values(themeMap).forEach(cls => document.body.classList.remove(cls));
    document.body.classList.add(themeClass);
    localStorage.setItem('uiTheme', themeClass);
  });
}
