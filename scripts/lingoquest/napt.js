
/**
 * NAPT Mode — Name, Animal, Place, or Thing
 * Presents MCQs asking the user to identify the correct item by category.
 * Uses: #sentenceClue, #sentenceBuilderArea, #resultSummary, #xpTracker
 * Depends on: questionPool.js, mcqAutoCheck.js, xpTracker.js
 * Related JSON: lang/napt-*.json (en, fr, de...)
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 22:05 | File: scripts/lingoquest/napt.js
 */

import { loadQuestionsForMode } from '../utils/questionPool.js';
import { setupMCQ } from '../utils/mcqAutoCheck.js';
import { awardXP } from '../utils/xpTracker.js';

export async function initNapt(lang = 'en') {
  const clueEl = document.querySelector('#sentenceClue');
  const builderEl = document.querySelector('#sentenceBuilderArea');
  const resultEl = document.querySelector('#resultSummary');

  clueEl.textContent = '[🔠 NAPT] Identify the correct category!';
  builderEl.innerHTML = '';
  resultEl.textContent = '';

  const questions = await loadQuestionsForMode('napt', lang);
  let index = 0;

  function next() {
    if (index >= questions.length) {
      resultEl.textContent = '[✔] All NAPT questions completed!';
      return;
    }

    const q = questions[index];
    const { prompt, options, answer, category } = q;

    clueEl.textContent = `Question ${index + 1}: Which one is a ${category}?`;
    builderEl.innerHTML = '';

    setupMCQ(options, answer, builderEl, (correct) => {
      if (correct) {
        resultEl.textContent = '[+] Correct! +10 XP';
        awardXP(10);
      } else {
        resultEl.textContent = '[-] Nope! That wasn’t it.';
      }
      index++;
      setTimeout(() => {
        resultEl.textContent = '';
        next();
      }, 1200);
    });
  }

  next();
}
