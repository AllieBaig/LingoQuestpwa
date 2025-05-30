
/**
 * Button Size Scaler Utility
 * Adjusts UI scale based on <select id="buttonSizeToggle">
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-30 16:00 | File: scripts/utils/buttonScaler.js
 */

export function applyButtonSize(size) {
  const validSizes = ['md', 'lg', 'xl', 'xxl'];
  document.body.classList.remove(...validSizes.map(s => `btn-${s}`));
  if (validSizes.includes(size)) {
    document.body.classList.add(`btn-${size}`);
  }
}

export function initButtonSizeToggle() {
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
