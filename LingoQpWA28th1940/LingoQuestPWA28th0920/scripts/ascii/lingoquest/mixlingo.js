
/**
 * ASCII MixLingo — Minimal UI fallback for multilingual word swap.
 * Replaces a blank in an English sentence with foreign MCQ options.
 * Uses: #sentenceClue, #sentenceBuilderArea, #resultSummary, #xpTracker
 * Depends on: questionPool.js, mcqAutoCheck.js, xpTracker.js
 * Related JSON: lang/mixlingo-*.json
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 14:18 | File: scripts/ascii/lingoquest/mixlingo.js
 */

import { loadQuestionsForMode } from '../../utils/questionPool.js';
import { setupMCQ } from '../../utils/mcqAutoCheck.js';
import { awardXP } from '../../utils/xpTracker.js';

export async function initAsciiMixLingo(lang = 'fr') {
  const clueEl = document.querySelector('#sentenceClue');
  const builderEl = document.querySelector('#sentenceBuilderArea');
  const resultEl = document.querySelector('#resultSummary');

  clueEl.textContent = '[🌍 ASCII MIXLINGO] Choose the correct word:';
  builderEl.innerHTML = '';
  resultEl.textContent = '';

  const questions = await loadQuestionsForMode('mixlingo', lang);
  let index = 0;

  function formatSentence(q) {
    return q.sentence.replace('____', '____');
  }

  function next() {
    if (index >= questions.length) {
      resultEl.textContent = '[✔] You’ve completed all MixLingo challenges!';
      return;
    }

    const q = questions[index];
    clueEl.textContent = `[ Sentence ${index + 1} ]  ${formatSentence(q)}`;
    builderEl.innerHTML = '';

    setupMCQ(q.options, q.answer, builderEl, (correct) => {
      if (correct) {
        resultEl.textContent = '[+] Bravo! You earned 10 XP!';
        awardXP(10);
      } else {
        resultEl.textContent = '[-] Oops! Wrong word.';
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
