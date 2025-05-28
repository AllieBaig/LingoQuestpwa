
/**
 * Version Info Display for LingoQuestPWA
 * Shows current app version in #versionInfo footer element
 * Optionally warns about outdated cache or build mismatch
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 16:10 | File: scripts/utils/version.js
 */

const BUILD_VERSION = '2025.05.28.01'; // Update on every deploy

/**
 * Displays the version info in the UI footer.
 * If mismatch detected in cache/localStorage, it can warn user.
 */
export function initVersionDisplay() {
  const versionEl = document.querySelector('#versionInfo');
  if (!versionEl) return;

  const cached = localStorage.getItem('lingoquest-version');
  if (cached && cached !== BUILD_VERSION) {
    versionEl.textContent = `⚠️ New version available! (${BUILD_VERSION})`;
    versionEl.style.color = 'orange';
  } else {
    versionEl.textContent = `📦 v${BUILD_VERSION}`;
  }

  localStorage.setItem('lingoquest-version', BUILD_VERSION);
}
