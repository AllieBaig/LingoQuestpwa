
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
import { logEvent } from '../../tools/eventLogger.js';
import { applyThemeFromSelector } from '../utils/themeManager.js';


export function initAppMenuUI() {
  renderGameMenu();
  applyUIMode();
  loadUserProfile();
  initVersionDisplay();
  updateXPDisplay();
  initGameSwitchListener();
  attachBackToMenuListener();
  initButtonSizeToggle();
  attachEventLoggerToUI();
  applyThemeFromSelector(); // ✅ This enables theme switching + saving
  
}

function attachEventLoggerToUI() {
  // Log all button clicks
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      logEvent('button-click', btn.id || '(no-id)', {
        text: btn.textContent.trim()
      });
    });
  });

  // Log all menu changes
  document.querySelectorAll('select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      logEvent('menu-change', sel.id || '(no-id)', {
        value: e.target.value
      });
    });
  });
}





