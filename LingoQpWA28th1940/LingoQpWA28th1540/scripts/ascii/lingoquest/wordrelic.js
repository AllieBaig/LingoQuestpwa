/**
 * ASCII Word Relic — Emoji riddles as MCQs (text-only)
 * Uses asciiRenderer for all display elements in ASCII mode
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 19:50 | File: scripts/ascii/lingoquest/wordrelic.js
 */

import { loadQuestionsForMode } from '../../utils/questionPool.js';
import { renderClue, renderMCQ, renderSummary } from '../../utils/asciiRenderer.js';
import { awardXP } from '../../utils/xpTracker.js';

export async function initAsciiWordRelic(lang = 'fr') {
  const questions = await loadQuestionsForMode('wordrelic', lang);
  let index = 0;

  function next() {
    if (index >= questions.length) {
      renderSummary('[🏁] All relics recovered!');
      return;
    }

    const q = questions[index];
    renderClue(`🧩 Riddle: ${q.clue}`);

    renderMCQ(q.options, q.answer, (correct) => {
      renderSummary(correct ? '[🗝️] You found the relic! +10 XP' : '[❌] Incorrect relic.');
      if (correct) awardXP(10);
      index++;
      setTimeout(() => {
        renderSummary('');
        next();
      }, 1600);
    });
  }

  next();
}
