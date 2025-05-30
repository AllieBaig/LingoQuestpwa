
/**
 * Central Event Logger for LingoQuestPWA
 * Logs UI interactions (buttons, menus) to console or external handler
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-30 16:15 | File: tools/eventLogger.js
 */

export function logEvent(eventType, elementId, details = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${eventType} → #${elementId}`, details);
}
