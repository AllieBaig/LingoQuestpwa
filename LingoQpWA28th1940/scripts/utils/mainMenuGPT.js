
/**
 * Shared Main Menu Panel for Minimal UI
 * Displays list of modes when no ?mode= is present
 * Depends on: #modeSelectorPanel in index.html
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 16:45 | File: scripts/utils/mainMenu.js
 */

export function showMainMenu(currentUI = 'normal') {
  const panel = document.querySelector('#modeSelectorPanel');
  if (!panel) return;

  panel.classList.remove('hidden');

  const buttons = panel.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedMode = btn.dataset.mode;
      const selectedLang = btn.dataset.lang || 'fr';
      const targetUrl = `?mode=${selectedMode}&lang=${selectedLang}&ui=${currentUI}`;
      location.href = targetUrl;
    });
  });
}
