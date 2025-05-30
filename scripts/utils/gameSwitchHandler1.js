
// 📁 File: scripts/utils/gameSwitchHandler.js
// 🔄 Game Mode Dropdown Listener

export function initGameSwitchListener() {
  const dropdown = document.getElementById('gameSwitchDropdown');
  if (!dropdown) return;

  dropdown.addEventListener('change', () => {
    const selectedMode = dropdown.value;
    const currentUI = document.body.classList.contains('minimal-ui') ? 'normal' : 'ascii';
    const lang = localStorage.getItem('lingoLang') || 'fr';

    if (selectedMode) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('mode', selectedMode);
      newUrl.searchParams.set('ui', currentUI);
      newUrl.searchParams.set('lang', lang);
      window.location.href = newUrl.toString();
    }
  });
}
