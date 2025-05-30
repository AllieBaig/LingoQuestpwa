
/**
 * Minimal UI Theme Manager
 * Switches class based on OS-style emoji themes for Minimal UI
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-29 21:30 | File: scripts/utils/themeManager.js
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

  // Load saved theme
  const saved = localStorage.getItem('uiTheme');
  if (saved) document.body.classList.add(saved);

  selector.addEventListener('change', () => {
    const selected = selector.value;
    const themeClass = themeMap[selected];
    if (!themeClass) return;

    // Remove old themes
    Object.values(themeMap).forEach(cls => document.body.classList.remove(cls));
    document.body.classList.add(themeClass);
    localStorage.setItem('uiTheme', themeClass);
  });
}
