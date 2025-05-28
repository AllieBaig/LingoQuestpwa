
/**
 * UI Mode Manager — Handles ASCII/Normal toggle and Dark Mode
 * Loads preferred UI from URL or localStorage and updates body class.
 * Applies changes to dropdowns and dark mode button if present.
 * Depends on: #uiModeToggle, #darkModeToggle, body.minimal-ui
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 15:45 | File: scripts/utils/uiModeManager.js
 */

export function applyUIMode(defaultUI = 'normal') {
  const params = new URLSearchParams(location.search);
  const storedUI = localStorage.getItem('uiMode');
  const storedDark = localStorage.getItem('darkMode');

  const urlUIMode = params.get('ui');
  const urlDark = params.get('dark');

  const uiMode = urlUIMode || storedUI || defaultUI;
  const darkMode = urlDark === 'true' || storedDark === 'true';

  const body = document.body;

  // UI Class
  body.classList.add('minimal-ui');
  if (darkMode) body.classList.add('dark');
  else body.classList.remove('dark');

  // Persist state
  localStorage.setItem('uiMode', uiMode);
  localStorage.setItem('darkMode', darkMode ? 'true' : 'false');

  // Reflect dropdown toggle
  const uiDropdown = document.querySelector('#uiModeToggle');
  if (uiDropdown) {
    uiDropdown.value = uiMode;
    uiDropdown.addEventListener('change', () => {
      localStorage.setItem('uiMode', uiDropdown.value);
      reloadWithParam('ui', uiDropdown.value);
    });
  }

  // Dark mode toggle
  const darkToggle = document.querySelector('#darkModeToggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark');
      localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    });
  }
}

function reloadWithParam(key, value) {
  const url = new URL(location.href);
  url.searchParams.set(key, value);
  location.href = url.toString();
}

