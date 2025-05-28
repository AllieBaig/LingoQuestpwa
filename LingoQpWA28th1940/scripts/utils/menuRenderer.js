
/**
 * Game Mode Menu Renderer
 * Renders the game mode selection menu for Normal UI and ASCII
 * Depends on asciiRenderer for ASCII output
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 21:40 | File: scripts/utils/menuRenderer.js
 */

import { printAscii, renderClueBlock } from './asciiRenderer.js';

const GAME_MODES = [
  { mode: 'solo', label: '🇫🇷 Solo Mode', lang: 'fr' },
  { mode: 'mixlingo', label: '🌍 MixLingo' },
  { mode: 'wordrelic', label: '🔑 Word Relic' },
  { mode: 'wordsafari', label: '🦁 Word Safari' }
];

export function renderGameMenu() {
  const body = document.body;

  if (body.classList.contains('ascii-ui')) {
    renderAsciiGameMenu();
  } else {
    renderNormalGameMenu();
  }
}

function renderNormalGameMenu() {
  const container = document.getElementById('sentenceBuilderArea');
  container.innerHTML = '';

  GAME_MODES.forEach(({ mode, label, lang }) => {
    const btn = document.createElement('button');
    btn.className = 'mcq-option';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      const selectedLang =
        lang || localStorage.getItem('selectedLang') || 'fr';
      const ui = localStorage.getItem('uiMode') || 'normal';
      window.location.href = `?mode=${mode}&lang=${selectedLang}&ui=${ui}`;
    });
    container.appendChild(btn);
  });

  const clueEl = document.getElementById('sentenceClue');
  if (clueEl) clueEl.textContent = '🎮 Choose a Game Mode';
}

function renderAsciiGameMenu() {
  const blocks = [
    renderClueBlock('🎮 Choose a Game Mode', [
      '[1] 🇫🇷 Solo Mode',
      '[2] 🌍 MixLingo',
      '[3] 🔑 Word Relic',
      '[4] 🦁 Word Safari'
    ])
  ];
  printAscii(...blocks);

  // Add key listeners
  document.addEventListener('keydown', (e) => {
    const selected = parseInt(e.key);
    const selectedMode = GAME_MODES[selected - 1];
    if (selectedMode) {
      const lang =
        selectedMode.lang || localStorage.getItem('selectedLang') || 'fr';
      const ui = 'ascii';
      window.location.href = `?mode=${selectedMode.mode}&lang=${lang}&ui=${ui}`;
    }
  }, { once: true });
}
