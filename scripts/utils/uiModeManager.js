/**
 * UI Mode & Appearance Manager
 * Applies dark mode, ASCII/Normal UI, and button size settings.
 * Used by main.js on page load. Saves state in localStorage.
 * Related: styles/main.css, minimal-ui.css, index.html dropdowns
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 18:55 | File: scripts/utils/uiModeManager.js
 */

export function applyUIMode() {
  const html = document.documentElement;
  const body = document.body;

  // UI Mode: normal or ascii
  const uiDropdown = document.querySelector('#uiModeToggle');
  const storedUIMode = localStorage.getItem('uiMode') || 'normal';
  body.classList.add(`${storedUIMode}-ui`);
  if (uiDropdown) {
    uiDropdown.value = storedUIMode;
    uiDropdown.addEventListener('change', (e) => {
      localStorage.setItem('uiMode', e.target.value);
      location.reload(); // reload with new class
    });
  }

  // Dark Mode
  const darkToggle = document.querySelector('#darkModeToggle');
  const darkPref = localStorage.getItem('darkMode') === 'true';
  if (darkPref) {
    body.classList.add('dark');
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      body.classList.toggle('dark');
      localStorage.setItem('darkMode', body.classList.contains('dark'));
    });
  }

  // Button Size Mode
  const sizeDropdown = document.querySelector('#buttonSizeToggle');
  const storedBtnSize = localStorage.getItem('buttonSize');
  const isMobile = window.innerWidth < 640;
  const isFirstVisit = !storedBtnSize;

  let btnSize = storedBtnSize;
  if (isFirstVisit) {
    btnSize = isMobile ? 'xl' : 'md';
    localStorage.setItem('buttonSize', btnSize);
  }

  body.classList.add(`btn-${btnSize}`);
  if (sizeDropdown) {
    sizeDropdown.value = btnSize;
    sizeDropdown.addEventListener('change', () => {
      const newSize = sizeDropdown.value;
      ['btn-md', 'btn-lg', 'btn-xl', 'btn-xxl'].forEach(cls => body.classList.remove(cls));
      body.classList.add(`btn-${newSize}`);
      localStorage.setItem('buttonSize', newSize);
    });
  }

  // One-time mobile hint
  if (isMobile && !localStorage.getItem('btnSizeHintShown')) {
    alert("Tip: For easier tapping, choose 🟥 Extra Large or 🧱 Extra Very Large button size in settings.");
    localStorage.setItem('btnSizeHintShown', 'true');
  }
}
