
/**
 * Shared UI Footer for LingoQuestPWA
 * Renders "Back to Menu" button and XP Tracker for all game modes
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-30 23:55 | File: scripts/ui/uiFooter.js
 */

export function renderFooter() {
  const footer = document.querySelector('footer#xpTracker');
  if (!footer) return;

  // Clear any existing content
  footer.innerHTML = '';

  // ⬅️ Back to Menu Button
  const backBtn = document.createElement('button');
  backBtn.id = 'backToMenuBtn';
  backBtn.className = 'back-button';
  backBtn.textContent = '⬅️ Back to Menu';

  backBtn.addEventListener('click', () => {
    // Reset game area and show menu
    const gameArea = document.getElementById('gameArea');
    if (gameArea) {
      gameArea.querySelector('#sentenceClue')?.replaceChildren();
      gameArea.querySelector('#sentenceBuilderArea')?.replaceChildren();
      gameArea.querySelector('#resultSummary')?.replaceChildren();
      gameArea.querySelector('#submitSentence')?.classList.remove('show');
    }

    document.getElementById('gameMenu')?.classList.remove('hidden');
    document.getElementById('xpTracker')?.classList.remove('hidden');
    document.getElementById('uiControls')?.classList.remove('hidden');
  });

  footer.appendChild(backBtn);

  // 🧪 XP Display (empty, to be updated by xpTracker.js)
  const xpDisplay = document.createElement('div');
  xpDisplay.id = 'xpDisplay';
  xpDisplay.textContent = 'XP: 0';

  footer.appendChild(xpDisplay);
}
