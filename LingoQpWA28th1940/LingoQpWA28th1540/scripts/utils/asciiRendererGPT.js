
/**
 * Shared ASCII Renderer for fallback UI in LingoQuestPWA
 * Handles rendering clue, MCQ buttons, and summary in text-mode
 * Applies to #sentenceClue, #sentenceBuilderArea, #resultSummary
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 19:40 | File: scripts/utils/asciiRenderer.js
 */

export function renderClue(text) {
  const clueEl = document.querySelector('#sentenceClue');
  clueEl.textContent = `>>> ${text}`;
}

export function renderSummary(msg) {
  const resultEl = document.querySelector('#resultSummary');
  resultEl.textContent = msg;
}

export function renderMCQ(options, answer, callback) {
  const builderEl = document.querySelector('#sentenceBuilderArea');
  builderEl.innerHTML = ''; // Clear previous

  options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'mcq-option';
    btn.textContent = `[${i + 1}] ${opt}`;
    btn.addEventListener('click', () => {
      const isCorrect = opt === answer;
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      builderEl.querySelectorAll('button').forEach(b => b.disabled = true);
      callback(isCorrect);
    });
    builderEl.appendChild(btn);
  });
}
