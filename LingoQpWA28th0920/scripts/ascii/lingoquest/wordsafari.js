
/**
 * ASCII Word Safari — Text-only fallback for category-based MCQ game
 * Presents a category and asks the player to select the right word
 * Uses: #sentenceClue, #sentenceBuilderArea, #resultSummary, #xpTracker
 * Depends on: questionPool.js, mcqAutoCheck.js, xpTracker.js
 * Related JSON: lang/wordsafari-*.json
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 16:20 | File: scripts/ascii/lingoquest/wordsafari.js
 */

import { loadQuestionsForMode } from '../../utils/questionPool.js';
import { setupMCQ } from '../../utils/mcqAutoCheck.js';
import { awardXP } from '../../utils/xpTracker.js';

export async function initAsciiWordSafari(lang = 'fr') {
  const clueEl = document.querySelector('#sentenceClue');
  const builderEl = document.querySelector('#sentenceBuilderArea');
  const resultEl = document.querySelector('#resultSummary');

  clueEl.textContent = '[🦁 ASCII SAFARI] Match the correct word:';
  builderEl.innerHTML = '';
  resultEl.textContent = '';

  const questions = await loadQuestionsForMode('wordsafari', lang);
  let index = 0;

  function next() {
    if (index >= questions.length) {
      resultEl.textContent = '[✔] Safari complete!';
      return;
    }

    const q = questions[index];
    clueEl.textContent = `[Category ${index + 1}] ${q.category}`;
    builderEl.innerHTML = '';

    setupMCQ(q.options, q.answer, builderEl, (correct) => {
      if (correct) {
        resultEl.textContent = '[+] Correct! +10 XP';
        awardXP(10);
      } else {
        resultEl.textContent = '[-] Incorrect!';
      }
      index++;
      setTimeout(() => {
        resultEl.textContent = '';
        next();
      }, 1400);
    });
  }

  next();
}
