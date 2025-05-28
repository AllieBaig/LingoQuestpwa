
/**
 * ASCII Solo Mode — Sentence builder with single blank
 * Uses shared asciiRenderer for text-mode rendering
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 19:45 | File: scripts/ascii/lingoquest/solo.js
 */

import { loadQuestionsForMode } from '../../utils/questionPool.js';
import { renderClue, renderMCQ, renderSummary } from '../../utils/asciiRenderer.js';
import { awardXP } from '../../utils/xpTracker.js';

export async function initAsciiSoloMode(lang = 'fr') {
  const questions = await loadQuestionsForMode('solo', lang);
  let i = 0;

  function next() {
    if (i >= questions.length) {
      renderSummary('[🏁] Solo Mode complete!');
      return;
    }

    const q = questions[i];
    renderClue(q.clue);

    renderMCQ(q.options, q.answer, (correct) => {
      renderSummary(correct ? '[+] Correct! +10 XP' : '[-] Incorrect.');
      if (correct) awardXP(10);
      i++;
      setTimeout(() => {
        renderSummary('');
        next();
      }, 1600);
    });
  }

  next();
}
