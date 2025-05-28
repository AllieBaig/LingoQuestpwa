/**
 * UI Mode Manager
 * Handles UI toggles: ASCII vs Normal, dark mode, button size, color themes
 * Syncs dropdowns with localStorage and applies class changes to <body>
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 21:20 | File: scripts/utils/uiModeManager.js
 */

export function applyUIMode() {
  const body = document.body;

  // === UI MODE (normal / ascii) ===
  const uiToggle = document.getElementById('uiModeToggle');
  if (uiToggle) {
    const stored = localStorage.getItem('uiMode') || 'normal';
    body.classList.add(`${stored}-ui`);
    uiToggle.value = stored;

    uiToggle.addEventListener('change', () => {
      localStorage.setItem('uiMode', uiToggle.value);
      location.reload(); // reload to re-initialize mode script
    });
  }

  // === BUTTON SIZE (md / lg / xl / xxl) ===
  const btnSizeToggle = document.getElementById('buttonSizeToggle');
  if (btnSizeToggle) {
    const stored = localStorage.getItem('buttonSize') || 'md';
    body.classList.add(`btn-${stored}`);
    btnSizeToggle.value = stored;

    btnSizeToggle.addEventListener('change', () => {
      body.classList.remove(`btn-${stored}`);
      body.classList.add(`btn-${btnSizeToggle.value}`);
      localStorage.setItem('buttonSize', btnSizeToggle.value);
    });
  }

  // === DARK MODE LOCK ===
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) {
    const saved = localStorage.getItem('darkMode') || 'auto';
    if (saved === 'dark') body.classList.add('dark');
    else if (saved === 'light') body.classList.remove('dark');
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add('dark');
    }

    updateDarkToggleText();

    darkToggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark');
      const mode = isDark ? 'dark' : 'light';
      localStorage.setItem('darkMode', mode);
      updateDarkToggleText();
    });
  }

  function updateDarkToggleText() {
    const current = localStorage.getItem('darkMode');
    if (darkToggle) {
      darkToggle.textContent = current === 'dark' ? '🌙' : '☀️';
      darkToggle.title = `Theme: ${current === 'dark' ? 'Dark' : 'Light'}`;
    }
  }

  // === ASCII TEXT COLOR THEME ===
  const asciiColorToggle = document.getElementById('asciiColorToggle');
  if (asciiColorToggle) {
    const stored = localStorage.getItem('asciiColor') || 'default';
    body.classList.add(`ascii-color-${stored}`);
    asciiColorToggle.value = stored;

    asciiColorToggle.addEventListener('change', () => {
      body.classList.remove(`ascii-color-${stored}`);
      body.classList.add(`ascii-color-${asciiColorToggle.value}`);
      localStorage.setItem('asciiColor', asciiColorToggle.value);
    });
  }

  // === ASCII EMOJI MODE ===
  const asciiEmojiToggle = document.getElementById('asciiEmojiModeToggle');
  if (asciiEmojiToggle) {
    const stored = localStorage.getItem('asciiEmojiMode') || 'emoji';
    asciiEmojiToggle.value = stored;

    asciiEmojiToggle.addEventListener('change', () => {
      localStorage.setItem('asciiEmojiMode', asciiEmojiToggle.value);
      location.reload(); // restart renderer to apply emoji stripping
    });
  }

  // === QUIZ LANGUAGE MODE (specific / random) ===
  const quizLangToggle = document.getElementById('quizLangModeToggle');
  if (quizLangToggle) {
    const stored = localStorage.getItem('quizLangMode') || 'specific';
    quizLangToggle.value = stored;

    quizLangToggle.addEventListener('change', () => {
      localStorage.setItem('quizLangMode', quizLangToggle.value);
      location.reload(); // to re-pick lang logic
    });
  }

  // === LANGUAGE SELECTOR (en / fr / de) ===
  const langToggle = document.getElementById('langChoiceToggle');
  if (langToggle) {
    const stored = localStorage.getItem('selectedLang') || 'fr';
    langToggle.value = stored;

    langToggle.addEventListener('change', () => {
      localStorage.setItem('selectedLang', langToggle.value);
      location.reload();
    });

    // Hide language select if quiz mode is random
    if (localStorage.getItem('quizLangMode') === 'random') {
      langToggle.style.display = 'none';
    }
  }

  // === ☰ ASCII Settings Toggle ===
  const asciiToggle = document.getElementById('asciiSettingsToggle');
  const asciiPanel = document.getElementById('asciiSettingsPanel');
  if (asciiToggle && asciiPanel) {
    asciiToggle.addEventListener('click', () => {
      asciiPanel.hidden = !asciiPanel.hidden;
    });
  }
}
