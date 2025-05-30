
/**
 * App Initializer for LingoQuestPWA
 * Sets up menu display, UI mode, XP, version info, and user profile
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-30 16:00 | File: scripts/app/initApp.js
 */

import { applyUIMode } from '../utils/uiModeManager.js';
import { loadUserProfile } from '../../tools/profileManager.js';
import { initVersionDisplay } from '../utils/version.js';
import { updateXPDisplay } from '../utils/xpTracker.js';
import { renderGameMenu } from '../utils/menuRenderer.js';
import { initGameSwitchListener } from '../utils/gameSwitchHandler.js';
import { attachBackToMenuListener } from '../utils/menuBackHandler.js';
import { initButtonSizeToggle } from '../utils/buttonScaler.js';

export function initAppMenuUI() {
  renderGameMenu();
  applyUIMode();
  loadUserProfile();
  initVersionDisplay();
  updateXPDisplay();
  initGameSwitchListener();
  attachBackToMenuListener();
  initButtonSizeToggle();
}
