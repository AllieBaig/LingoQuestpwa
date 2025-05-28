/**
 * ASCII Word Safari — Category-based MCQ animal hunt (text mode)
 * Uses asciiRenderer for all clue/MCQ/summary rendering
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 19:55 | File: scripts/ascii/lingoquest/wordsafari.js
 */

import { loadQuestionsForMode } from '../../utils/questionPool.js';
import { renderClue, renderMCQ, renderResult } from '../../utils/asciiRenderer.js';
import { awardXP } from '../../utils/xpTracker.js';

export async function initAsciiWordSafari(lang = 'fr') {
  const questions = await loadQuestionsForMode('wordsafari', lang);
  let index = 0;

  function next() {
    if (index >= questions.length) {
      renderResult('[🏁] Safari terminé !', 'info');
      return;
    }

    const q = questions[index];
    renderClue(`🌿 Catégorie: ${q.category}`);

    renderMCQ(q.options, q.answer, (correct) => {
      renderResult(correct ? '[🦁] Bien joué ! +10 XP' : '[❌] Mauvaise réponse.', correct ? 'success' : 'error');
      if (correct) awardXP(10);
      index++;
      setTimeout(() => {
        renderResult('');
        next();
      }, 1600);
    });
  }

  next();
}
