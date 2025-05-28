
/**
 * Word Relic Mode — Initializes emoji riddles with 4-part logic.
 * Each question has a clue and four MCQ options. Rewards XP on success.
 * Uses shared DOM: #sentenceClue, #sentenceBuilderArea, #resultSummary, #xpTracker
 * Depends on: questionPool.js, mcqAutoCheck.js, xpTracker.js
 * Related lang files: lang/wordrelic-fr.json, lang/wordrelic-es.json, etc.
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 13:42 | File: scripts/modes/wordRelic.js
 */

import { loadQuestionsForMode } from '../utils/questionPool.js';
import { setupMCQ } from '../utils/mcqAutoCheck.js';
import { awardXP } from '../utils/xpTracker.js';

export async function initWordRelic(lang = 'fr') {
  const clueEl = document.querySelector('#sentenceClue');
  const builderEl = document.querySelector('#sentenceBuilderArea');
  const resultEl = document.querySelector('#resultSummary');

  clueEl.textContent = '🗝️ Solve the riddle to unlock the relic!';
  builderEl.innerHTML = '';
  resultEl.textContent = '';

  const questions = await loadQuestionsForMode('wordrelic', lang);
  let currentIndex = 0;

  function showNextQuestion() {
    if (currentIndex >= questions.length) {
      resultEl.textContent = '🏆 You’ve completed all relics!';
      return;
    }

    const q = questions[currentIndex];
    clueEl.innerHTML = `<div class="emoji-clue">${q.clue}</div>`;
    builderEl.innerHTML = '';

    setupMCQ(q.options, q.answer, builderEl, (isCorrect) => {
      if (isCorrect) {
        resultEl.textContent = '✅ Correct! You unlocked a relic!';
        awardXP(10);
      } else {
        resultEl.textContent = '❌ Try again or skip.';
      }
      currentIndex++;
      setTimeout(() => {
        resultEl.textContent = '';
        showNextQuestion();
      }, 1600);
    });
  }

  showNextQuestion();
}
