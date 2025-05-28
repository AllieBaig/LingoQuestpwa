/**
 * Shared Navigation Helpers
 * Adds a back-to-main-menu button or ASCII link
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 21:55 | File: scripts/utils/navHelpers.js
 */

export function renderBackToMenu() {
  const container = document.getElementById('backToMenu');
  if (!container) return;

  const isAscii = document.body.classList.contains('ascii-ui');

  if (isAscii) {
    container.innerHTML = '';
    const pre = document.createElement('pre');
    pre.textContent = '← Press [M] to return to Main Menu';
    container.appendChild(pre);

    document.addEventListener(
      'keydown',
      (e) => {
        if (e.key.toLowerCase() === 'm') {
          location.href = './';
        }
      },
      { once: true }
    );
  } else {
    const btn = document.createElement('button');
    btn.textContent = '⬅ Back to Main Menu';
    btn.className = 'mcq-option';
    btn.addEventListener('click', () => {
      location.href = './';
    });
    container.innerHTML = '';
    container.appendChild(btn);
  }
}
