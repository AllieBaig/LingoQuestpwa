/**
 * Main App Bootstrap for LingoQuestPWA
 * Routes game modes or shows menu based on query params
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-30 16:00 | File: scripts/main.js
 */

import { renderUIHeader } from './utils/uiHeader.js'; // adjust path if needed
import { initAppMenuUI } from './app/initApp.js';
import { applyUIMode } from './utils/uiModeManager.js';
import { loadUserProfile } from '../tools/profileManager.js';
import { initVersionDisplay } from './utils/version.js';
import { updateXPDisplay } from './utils/xpTracker.js';
import { initStaticThemeSwitcher } from './utils/myTheme.js';


function startMixLingoMode() {
  import('./lingoquest/mixlingo.js').then(m => m.initMixLingo('en'));
}

function startWordRelicMode() {
  import('./lingoquest/wordrelic.js').then(m => m.initWordRelic('en'));
}

function startWordSafariMode() {
  import('./lingoquest/wordsafari.js').then(m => m.initWordSafari('en'));
}

function startNAPTMode() {
  import('./lingoquest/napt.js').then(m => m.initNAPT('en'));
}

function startTrailMode() {
  import('./lingoquest/trail.js').then(m => m.initTrail('en'));
}

function startVsComputerMode() {
  import('./lingoquest/vscomputer.js').then(m => m.initVsComputer('en'));
}

function startNearbyMode() {
  import('./lingoquest/nearby.js').then(m => m.initNearby('en'));
}

/*
function startSoloMode() { console.log('Solo Mode placeholder'); }
function startMixLingoMode() { console.log('MixLingo placeholder'); }
function startWordRelicMode() { console.log('Word Relic placeholder'); }
function startWordSafariMode() { console.log('Word Safari placeholder'); }
function startNAPTMode() { console.log('NAPT placeholder'); }
function startTrailMode() { console.log('Trail placeholder'); }
function startVsComputerMode() { console.log('Vs Computer placeholder'); }
function startNearbyMode() { console.log('Nearby Mode placeholder'); }
*/



// Get params
const params = new URLSearchParams(location.search);
const rawMode = params.get('mode');
const mode = rawMode || null;

// Show menu if no mode selected
if (!mode) {
  initAppMenuUI();
}

// Button event listeners
document.addEventListener('DOMContentLoaded', () => {
  const btnEvents = [
    //{ id: 'btnSolo', handler: startSoloMode },
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

// Load selected mode
const lang = params.get('lang') || localStorage.getItem('selectedLang') || 'fr';
const ui = params.get('ui') || localStorage.getItem('uiMode') || 'normal';

applyUIMode();
loadUserProfile();
initVersionDisplay();
updateXPDisplay();

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
