
/**
 * UI Footer Renderer for LingoQuestPWA
 * Displays XP tracker and version info
 * Can hide during gameplay for clean interface
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-30 18:10 | File: scripts/utils/uiFooter.js
 */

export function showUIFooter() {
  const footer = document.getElementById('xpTracker');
  if (footer) footer.hidden = false;
}

export function hideUIFooter() {
  const footer = document.getElementById('xpTracker');
  if (footer) footer.hidden = true;
}
