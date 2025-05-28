
/**
 * Word Safari Mode — Normal UI version for category-based word hunts
 * Presents a category clue, then asks the player to pick the correct word
 * Uses: #sentenceClue, #sentenceBuilderArea, #resultSummary, #xpTracker
 * Depends on: questionPool.js, mcqAutoCheck.js, xpTracker.js
 * Related JSON: lang/wordsafari-*.json
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 16:15 | File: scripts/lingoquest/wordsafari.js
 */

import { loadQuestionsForMode } from '../utils/questionPool.js';
import { setupMCQ } from '../utils/mcqAutoCheck.js';
import { awardXP } from '../utils/xpTracker.js';

export async function initWordSafari(lang = 'fr') {
  const clueEl = document.querySelector('#sentenceClue');
  const builderEl = document.querySelector('#sentenceBuilderArea');
  const resultEl = document.querySelector('#resultSummary');

  clueEl.textContent = '🦁 Welcome to the Word Safari!';
  builderEl.innerHTML = '';
  resultEl.textContent = '';

  const questions = await loadQuestionsForMode('wordsafari', lang);
  let currentIndex = 0;

  function showNext() {
    if (currentIndex >= questions.length) {
      resultEl.textContent = '🏁 Safari complete! You found all the animals!';
      return;
    }

    const q = questions[currentIndex];
    clueEl.innerHTML = `🌿 Category: <strong>${q.category}</strong>`;
    builderEl.innerHTML = '';

    setupMCQ(q.options, q.answer, builderEl, (correct) => {
      if (correct) {
        resultEl.textContent = '✅ Correct! +10 XP';
        awardXP(10);
      } else {
        resultEl.textContent = '❌ Nope! Better luck next time.';
      }
      currentIndex++;
      setTimeout(() => {
        resultEl.textContent = '';
        showNext();
      }, 1600);
    });
  }

  showNext();
}
