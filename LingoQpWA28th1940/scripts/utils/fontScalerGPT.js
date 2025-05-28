
/**
 * Font Scaler UI Module
 * Provides a slider + checkbox to adjust text size for accessibility
 * Affects game content and optionally menus/buttons
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 22:45 | File: scripts/utils/fontScaler.js
 */

export function renderFontScaler() {
  const container = document.getElementById('fontSizeControl');
  if (!container) return;

  // Create label + slider
  const label = document.createElement('label');
  label.textContent = 'Text Size: ';
  label.style.marginRight = '0.5rem';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '80';
  slider.max = '160';
  slider.step = '10';
  slider.value = localStorage.getItem('fontSize') || '100';

  const sizeDisplay = document.createElement('span');
  sizeDisplay.textContent = `${slider.value}%`;
  sizeDisplay.style.marginLeft = '0.5rem';

  // Create checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'scaleMenus';
  checkbox.style.marginLeft = '1rem';
  checkbox.checked = localStorage.getItem('scaleMenus') === 'true';

  const checkLabel = document.createElement('label');
  checkLabel.textContent = ' Also scale menus/buttons';
  checkLabel.htmlFor = 'scaleMenus';

  // Append elements
  container.innerHTML = '';
  container.appendChild(label);
  container.appendChild(slider);
  container.appendChild(sizeDisplay);
  container.appendChild(checkbox);
  container.appendChild(checkLabel);

  // Apply font scaling
  function applyScaling(scale) {
    const percent = `${scale}%`;
    const gameAreas = ['#sentenceClue', '#sentenceBuilderArea', '#resultSummary'];
    gameAreas.forEach(id => {
      const el = document.querySelector(id);
      if (el) el.style.fontSize = percent;
    });

    if (checkbox.checked) {
      const menuEls = document.querySelectorAll('.mcq-option, #gameSwitchDropdown, #backToMenu button, #backToMenu pre');
      menuEls.forEach(el => el.style.fontSize = percent);
    } else {
      // Reset if previously scaled
      const menuEls = document.querySelectorAll('.mcq-option, #gameSwitchDropdown, #backToMenu button, #backToMenu pre');
      menuEls.forEach(el => el.style.fontSize = '');
    }

    localStorage.setItem('fontSize', scale);
    localStorage.setItem('scaleMenus', checkbox.checked);
    sizeDisplay.textContent = `${scale}%`;
  }

  slider.addEventListener('input', () => {
    applyScaling(slider.value);
  });

  checkbox.addEventListener('change', () => {
    applyScaling(slider.value);
  });

  // Initial apply
  applyScaling(slider.value);
}
