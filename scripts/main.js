/**
 * Main App Bootstrap for LingoQuestPWA
 * Loads correct mode, language, and UI from URL or settings
 * Handles shared XP, UI init, dark mode, and version display
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 21:50 | File: scripts/main.js
 */

import { applyUIMode } from './utils/uiModeManager.js';
import { loadUserProfile } from '../tools/profileManager.js';
import { initVersionDisplay } from './utils/version.js';
import { updateXPDisplay } from './utils/xpTracker.js';
import { renderGameMenu } from './utils/menuRenderer.js';

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
  
}

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
