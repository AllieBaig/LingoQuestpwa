
/**
 * MCQ Generator for LingoQuestPWA
 * Builds MCQ option buttons and returns them as DOM elements.
 * Use generateMCQ(...) to attach to any container dynamically.
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 16:40 | File: scripts/utils/mcqEngine.js
 */

/**
 * Creates and returns MCQ buttons with auto-check logic.
 * @param {string[]} options - Array of string choices
 * @param {string} correctAnswer - The correct answer
 * @param {(isCorrect: boolean) => void} callback - Fires on selection
 * @returns {HTMLElement[]} - Array of <button> elements
 */
export function generateMCQ(options, correctAnswer, callback) {
  const shuffled = shuffleArray([...options]);
  const buttons = [];

  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.setAttribute('data-value', opt);
    btn.classList.add('mcq-option');

    btn.addEventListener('click', () => {
      const isCorrect = opt === correctAnswer;
      btn.style.borderColor = isCorrect ? 'green' : 'red';
      btn.style.backgroundColor = isCorrect ? '#d0ffd0' : '#ffd0d0';

      buttons.forEach(b => b.disabled = true);

      if (typeof callback === 'function') {
        callback(isCorrect);
      }
    });

    buttons.push(btn);
  });

  return buttons;
}

/**
 * Fisher-Yates Shuffle
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}