
/**
 * MCQ Auto-Check Engine for LingoQuestPWA
 * Renders MCQ options as buttons and calls a callback on selection
 * Touch-friendly, lightweight, reusable across modes
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 16:35 | File: scripts/utils/mcqAutoCheck.js
 */

/**
 * Renders MCQ buttons and sets up auto-check logic
 * @param {string[]} options - List of choices
 * @param {string} correctAnswer - The correct answer string
 * @param {HTMLElement} container - Target element to render buttons in
 * @param {(isCorrect: boolean) => void} callback - Runs on selection
 */
export function setupMCQ(options, correctAnswer, container, callback) {
  const shuffled = shuffleArray([...options]);

  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.setAttribute('data-value', opt);
    btn.classList.add('mcq-option');
    btn.addEventListener('click', () => {
      const isCorrect = opt === correctAnswer;

      // Visual feedback
      btn.style.borderColor = isCorrect ? 'green' : 'red';
      btn.style.backgroundColor = isCorrect ? '#d0ffd0' : '#ffd0d0';

      // Disable all after answer
      container.querySelectorAll('button').forEach(b => b.disabled = true);

      if (typeof callback === 'function') {
        callback(isCorrect);
      }
    });
    container.appendChild(btn);
  });
}

/**
 * Fisher-Yates shuffle
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
