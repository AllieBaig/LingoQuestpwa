/**
 * ASCII MixLingo — Multilingual MCQ with one word missing
 * Uses shared asciiRenderer for text-mode rendering
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 19:45 | File: scripts/ascii/lingoquest/mixlingo.js
 */

import { loadQuestionsForMode } from '../../utils/questionPool.js';
import { renderClue, renderMCQ, renderSummary } from '../../utils/asciiRenderer.js';
import { awardXP } from '../../utils/xpTracker.js';

export async function initAsciiMixLingo(lang = 'fr') {
  const questions = await loadQuestionsForMode('mixlingo', lang);
  let current = 0;

  function next() {
    if (current >= questions.length) {
      renderSummary('[🏁] MixLingo complete!');
      return;
    }

    const q = questions[current];
    const sentence = q.sentence.replace(q.blank, '____');
    renderClue(sentence);

    renderMCQ(q.options, q.answer, (correct) => {
      renderSummary(correct ? '[+] Correct! +10 XP' : '[-] Incorrect.');
      if (correct) awardXP(10);
      current++;
      setTimeout(() => {
        renderSummary('');
        next();
      }, 1600);
    });
  }

  next();
}
