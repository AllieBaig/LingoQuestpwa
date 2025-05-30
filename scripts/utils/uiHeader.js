

/**
 * UI Header Renderer for LingoQuestPWA
 * Dynamically renders top controls (UI mode, language, theme)
 * Can hide/show on gameplay toggle
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-30 18:10 | File: scripts/utils/uiHeader.js
 */

export function renderUIHeader() {
  const header = document.getElementById('uiControls');
  if (!header) return;

  header.hidden = false;
}

export function hideUIHeader() {
  const header = document.getElementById('uiControls');
  if (header) header.hidden = true;
}