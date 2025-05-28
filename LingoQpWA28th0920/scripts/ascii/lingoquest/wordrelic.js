
/**
 * ASCII Word Relic — Fallback mode for emoji riddles using plain text.
 * Presents riddle clues and MCQs in ASCII-friendly layout.
 * Uses: #sentenceClue, #sentenceBuilderArea, #resultSummary, #xpTracker
 * Depends on: questionPool.js, mcqAutoCheck.js, xpTracker.js
 * Related JSON: lang/wordrelic-*.json
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 14:05 | File: scripts/ascii/lingoquest/wordrelic.js
 */

import { loadQuestionsForMode } from '../../utils/questionPool.js';
import { setupMCQ } from '../../utils/mcqAutoCheck.js';
import { awardXP } from '../../utils/xpTracker.js';

export async function initAsciiWordRelic(lang = 'fr') {
  const clueEl = document.querySelector('#sentenceClue');
  const builderEl = document.querySelector('#sentenceBuilderArea');
  const resultEl = document.querySelector('#resultSummary');

  clueEl.textContent = '[🗝️ ASCII RELIC CHALLENGE] Solve each emoji riddle:';
  builderEl.innerHTML = '';
  resultEl.textContent = '';

  const questions = await loadQuestionsForMode('wordrelic', lang);
  let index = 0;

  function renderAsciiClue(emoji) {
    return `[ Clue #${index + 1} ]  ${emoji.split('').join(' ')}`;
  }

  function next() {
    if (index >= questions.length) {
      resultEl.textContent = '[✔] All relics unlocked!';
      return;
    }

    const q = questions[index];
    clueEl.textContent = renderAsciiClue(q.clue);
    builderEl.innerHTML = '';

    setupMCQ(q.options, q.answer, builderEl, (correct) => {
      if (correct) {
        resultEl.textContent = '[+] Correct! You earned 10 XP!';
        awardXP(10);
      } else {
        resultEl.textContent = '[-] Incorrect! Try the next.';
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

