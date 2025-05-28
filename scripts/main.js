
/**
 * Main Entry Script for LingoQuest
 * Handles mode + UI loading via buttons and URL params
 * Applies Minimal UI and persistent Dark Mode support
 * Uses: utils/version.js, tools/buildInfo.js, utils/uiModeManager.js, ascii/lingoquest, lingoquest/
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-27 23:50 | File: scripts/main.js
 */

import { showVersion, checkVersionChanges } from './utils/version.js';
import { logBuildInfo } from '../tools/buildInfo.js';
import { applyMinimalUI, toggleDarkMode } from './utils/uiModeManager.js';

document.addEventListener('DOMContentLoaded', () => {
  showVersion('versionLabel');
  logBuildInfo();
  checkVersionChanges();

  const params = new URLSearchParams(window.location.search);
  const uiMode = params.get('ui') || 'normal';
  const mode = params.get('mode') || null;
  const lang = params.get('lang') || 'fr';

  console.log(`[LingoQuest] Mode: ${mode || 'none'} | UI: ${uiMode} | Lang: ${lang}`);

  // Apply Minimal UI and Dark Mode based on localStorage
  applyMinimalUI(uiMode);

  // Dark Mode toggle button
  document.getElementById('darkModeToggle')?.addEventListener('click', () => {
    toggleDarkMode();
  });

  // UI Mode dropdown selector
  const uiSelector = document.getElementById('uiModeSelector');
  if (uiSelector) {
    uiSelector.value = uiMode;
    uiSelector.addEventListener('change', () => {
      const newUI = uiSelector.value;
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('ui', newUI);
      window.location.href = newUrl.toString();
    });
  }

  // Mode launch buttons
  document.getElementById('startSolo')?.addEventListener('click', () => {
    launchMode('solo', uiMode, lang);
  });

  document.getElementById('startMixLingo')?.addEventListener('click', () => {
    launchMode('mixlingo', uiMode, lang);
  });

  // Auto-launch from URL
  if (mode) {
    launchMode(mode, uiMode, lang);
  }
});

async function launchMode(mode, ui, lang) {
  console.log(`[LingoQuest] Launching: ${mode} (${ui})`);
  clearUI();

  if (ui === 'ascii') {
    if (mode === 'solo') {
      const { initSoloMode } = await import('./ascii/lingoquest/solo.js');
      initSoloMode('easy');
    } else if (mode === 'mixlingo') {
      const { initMixLingoAscii } = await import('./ascii/lingoquest/mixlingo.js');
      initMixLingoAscii();
    }
  } else {
    if (mode === 'solo') {
      const { initSoloModeFR } = await import('./lingoquest/solo/fr.js');
      initSoloModeFR();
    } else if (mode === 'mixlingo') {
      const { initMixLingoMode } = await import('./lingoquest/mixlingo.js');
      initMixLingoMode();
    }
  }
}

function clearUI() {
  document.getElementById('sentenceClue').textContent = '';
  document.getElementById('sentenceBuilderArea').innerHTML = '';
  document.getElementById('resultSummary').hidden = true;
  document.getElementById('asciiOutput').hidden = true;
}
