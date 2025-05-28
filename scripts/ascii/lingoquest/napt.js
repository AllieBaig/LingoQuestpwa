
/**
 * NAPT Mode (ASCII) — Name, Animal, Place, Thing
 * Choose correct word via MCQ based on Easy, Medium, or Hard level.
 * ASCII-only version using renderClueBlock, renderMCQOptions, printAscii.
 * Uses: #asciiOutput
 * Depends on: asciiRenderer.js, mcqAutoCheck.js, xpTracker.js
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 23:40 | File: scripts/ascii/lingoquest/napt.js
 */

import { renderHeader, renderClueBlock, renderMCQOptions, renderResult, renderFooterHUD, printAscii } from '../../shared/asciiRenderer.js';
import { loadQuestionsForMode } from '../../utils/questionPool.js';
import { awardXP } from '../../utils/xpTracker.js';

export async function initAsciiNapt(lang = 'en') {
  const output = document.getElementById('asciiOutput');
  if (!output) return;

  const difficulty = localStorage.getItem('naptDifficulty') || 'easy'; // easy: 2, medium: 3, hard: 4
  const optionCount = { easy: 2, medium: 3, hard: 4 }[difficulty] || 2;

  const questions = await loadQuestionsForMode('napt', lang);
  let index = 0;

  const xp = parseInt(localStorage.getItem('xpTotal') || '0', 10);
  const version = localStorage.getItem('buildVersion') || 'v0.0';
  const streak = localStorage.getItem('streakDays') || '0';

  function next() {
    if (index >= questions.length) {
      printAscii(
        renderHeader('NAPT Complete'),
        renderResult('🎉 You finished all NAPT questions!'),
        renderFooterHUD(xp, streak, version)
      );
      return;
    }

    const q = questions[index];
    const choices = q.options.slice(0, optionCount);

    const clue = renderClueBlock(`[❓ ${q.category.toUpperCase()}]`, [q.prompt]);
    const optionsBlock = renderMCQOptions(choices);
    const footer = renderFooterHUD(xp, streak, version);

    printAscii(
      renderHeader('NAPT Mode'),
      clue,
      optionsBlock,
      renderResult('Tap the number of your answer'),
      footer
    );

    const selected = prompt(`Choose 1–${choices.length}`);
    const selectedIndex = parseInt(selected, 10) - 1;

    if (selectedIndex >= 0 && selectedIndex < choices.length) {
      if (choices[selectedIndex] === q.answer) {
        awardXP(10);
        printAscii(
          renderHeader('NAPT Mode'),
          renderResult('[+] Correct! +10 XP'),
          footer
        );
      } else {
        printAscii(
          renderHeader('NAPT Mode'),
          renderResult(`[-] Incorrect. Correct was: ${q.answer}`),
          footer
        );
      }
    } else {
      printAscii(
        renderHeader('NAPT Mode'),
        renderResult('❌ Invalid choice. Try again.'),
        footer
      );
      return setTimeout(next, 1400);
    }

    index++;
    setTimeout(next, 1600);
  }

  next();
}
