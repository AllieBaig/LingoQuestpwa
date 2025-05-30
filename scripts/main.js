/**
 * Main App Bootstrap for LingoQuestPWA
 * Loads correct mode, language, and UI from URL or settings
 * Handles shared XP, UI init, dark mode, and version display
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 21:50 | File: scripts/main.js
 */

import { applyUIMode } from './utils/uiModeManager.js';
import { loadUserProfile } from './tools/profileManager.js';
import { initVersionDisplay } from './utils/version.js';
import { updateXPDisplay } from './utils/xpTracker.js';
import { renderGameMenu } from './utils/menuRenderer.js';
import { initGameSwitchListener } from './utils/gameSwitchHandler.js';
import { attachBackToMenuListener } from './utils/menuBackHandler.js';
import { applyThemeFromSelector } from './utils/themeManager.js';



// Read URL parameters
const params = new URLSearchParams(location.search);
const rawMode = params.get('mode');
const mode = rawMode || null;

// Show menu if no mode is selected
if (!mode) {
  renderGameMenu();
  applyUIMode();
  loadUserProfile();
  initVersionDisplay();
  updateXPDisplay();
  initGameSwitchListener();
  attachBackToMenuListener();
  applyThemeFromSelector(); // adds listener and sets saved theme
  initButtonSizeToggle(); // ✅ call here
}

// ✅ Moved outside of block
function applyButtonSize(size) {
  const validSizes = ['md', 'lg', 'xl', 'xxl'];
  document.body.classList.remove(...validSizes.map(s => `btn-${s}`));
  if (validSizes.includes(size)) {
    document.body.classList.add(`btn-${size}`);
  }
}

// ✅ Newly added helper
function initButtonSizeToggle() {
  const sizeSelector = document.getElementById('buttonSizeToggle');

  if (sizeSelector) {
    const savedSize = localStorage.getItem('btnSizePref');
    if (savedSize) {
      sizeSelector.value = savedSize;
      applyButtonSize(savedSize);
    }

    sizeSelector.addEventListener('change', (e) => {
      const newSize = e.target.value;
      applyButtonSize(newSize);
      localStorage.setItem('btnSizePref', newSize);
    });
  }
}
// 🧠 MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// 📅 Timestamp: 2025-05-30 14:45 | File: js/main.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Game Button Event Listeners ---
  const btnEvents = [
    { id: 'btnSolo', handler: startSoloMode },
    { id: 'btnMixLingo', handler: startMixLingoMode },
    { id: 'btnWordRelic', handler: startWordRelicMode },
    { id: 'btnWordSafari', handler: startWordSafariMode },
    { id: 'btnNAPT', handler: startNAPTMode },
    { id: 'btnTrail', handler: startTrailMode },
    { id: 'btnVsComputer', handler: startVsComputerMode },
    { id: 'btnNearby', handler: startNearbyMode }
  ];

  btnEvents.forEach(({ id, handler }) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', handler);
  });
});



// Else: load mode
const lang = params.get('lang') || localStorage.getItem('selectedLang') || 'fr';
const ui = params.get('ui') || localStorage.getItem('uiMode') || 'normal';

// Apply all UI & shared systems
applyUIMode();
loadUserProfile();
initVersionDisplay();
updateXPDisplay();

// Mode loader
if (mode === 'mixlingo') {
  if (ui === 'ascii') {
    import('./ascii/lingoquest/mixlingo.js').then(m => m.initAsciiMixLingo(lang));
  } else {
    import('./lingoquest/mixlingo.js').then(m => m.initMixLingo(lang));
  }
} else if (mode === 'wordrelic') {
  if (ui === 'ascii') {
    import('./ascii/lingoquest/wordrelic.js').then(m => m.initAsciiWordRelic(lang));
  } else {
    import('./lingoquest/wordrelic.js').then(m => m.initWordRelic(lang));
  }
} else if (mode === 'wordsafari') {
  if (ui === 'ascii') {
    import('./ascii/lingoquest/wordsafari.js').then(m => m.initAsciiWordSafari(lang));
  } else {
    import('./lingoquest/wordsafari.js').then(m => m.initWordSafari(lang));
  }
} else if (mode === 'solo') {
  if (ui === 'ascii') {
    import('./ascii/lingoquest/solo.js').then(m => m.initAsciiSolo(lang));
  } else {
    import(`./lingoquest/solo/${lang}.js`).then(m => m.initSolo(lang));
  }
}
