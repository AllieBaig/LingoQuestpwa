/**
 * Main Entrypoint for LingoQuestPWA.
 * Dynamically loads mode + UI type based on URL query.
 * Applies dark mode, loads profile, and starts game.
 * Depends on: uiModeManager.js, profileManager.js, version.js
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 15:35 | File: scripts/main.js
 */


import { attachGlobalErrorHandler } from '../tools/errorLog.js';
attachGlobalErrorHandler(); // Setup error logging globally

import { applyUIMode } from './utils/uiModeManager.js';
//import { applyUIMode } from './utils/uiModeManager.js';
import { loadUserProfile } from '../tools/profileManager.js';
import { initVersionDisplay } from './utils/version.js';
import { updateXPDisplay } from './utils/xpTracker.js';

document.addEventListener('DOMContentLoaded', () => {
  // Read URL parameters
  const params = new URLSearchParams(location.search);
  const mode = params.get('mode') || 'solo';
  const lang = params.get('lang') || 'fr';
  const ui = params.get('ui') || 'normal';

  // Apply UI mode and dark mode settings
  applyUIMode(ui);

  // ------------Load and show user profile---------------
  const profile = loadUserProfile();
  document.querySelector('#userNickname').textContent = `👤 ${profile.nickname}`;
  updateXPDisplay(profile.xp || 0);

  // Display version info
  initVersionDisplay();

  // Dynamically import game mode
  async function loadGameMode(mode, lang, ui) {
    try {
      if (ui === 'ascii') {
        switch (mode) {
          case 'mixlingo': {
            const { initAsciiMixLingo } = await import('./ascii/lingoquest/mixlingo.js');
            initAsciiMixLingo(lang);
            break;
          }
          case 'wordrelic': {
            const { initAsciiWordRelic } = await import('./ascii/lingoquest/wordrelic.js');
            initAsciiWordRelic(lang);
            break;
          }
          case 'solo':
          default: {
            const { initAsciiSolo } = await import('./ascii/lingoquest/solo.js');
            initAsciiSolo(lang);
            break;
          }
        }
      } else {
        switch (mode) {
          case 'mixlingo': {
            const { initMixLingo } = await import('./lingoquest/mixlingo.js');
            initMixLingo(lang);
            break;
          }
          case 'wordrelic': {
            const { initWordRelic } = await import('./lingoquest/wordrelic.js');
            initWordRelic(lang);
            break;
          }
          case 'wordsafari': {
            const { initWordSafari } = await import('./lingoquest/wordsafari.js');
            initWordSafari(lang);
            break;
          }
          case 'solo':
          default: {
            const { initSoloFR } = await import('./lingoquest/solo/fr.js');
            initSoloFR();
            break;
          }
        }
      }
    } catch (err) {
      document.querySelector('#sentenceClue').textContent = '[⚠️ Error loading mode]';
      console.error(err);
    }
  }

  // If no mode is passed, show the game selector
  if (!params.has('mode')) {
    document.querySelector('#modeSelectorPanel')?.classList.remove('hidden');
    const buttons = document.querySelectorAll('#modeSelectorPanel button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedMode = btn.dataset.mode;
        const selectedLang = btn.dataset.lang;
        const targetUrl = `?mode=${selectedMode}&lang=${selectedLang}&ui=${ui}`;
        location.href = targetUrl;
      });
    });
  } else {
    loadGameMode(mode, lang, ui); // ⬅ keep this line as-is
  }
});
