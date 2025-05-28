/**
 * ASCII Renderer Utility (Merged & Modular)
 * Renders consistent, terminal-style ASCII blocks for clues, options, and results.
 * Works with #sentenceClue, #sentenceBuilderArea, #resultSummary
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 20:35 | File: scripts/utils/asciiRenderer.js
 */

export function renderClue(text) {
  const clueEl = document.querySelector('#sentenceClue');
  const lines = text.trim().split('\n');
  clueEl.textContent = renderClueBlock('[ Clue ]', lines);
}

export function renderClueBlock(modeLabel, lines) {
  return box([
    `${modeLabel}`,
    ...lines
  ]);
}

export function renderMCQ(options, answer, callback) {
  const builderEl = document.querySelector('#sentenceBuilderArea');
  builderEl.innerHTML = '';

  options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'mcq-option';
    btn.textContent = `[${i + 1}] ${opt}`;
    btn.addEventListener('click', () => {
      const isCorrect = opt === answer;
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      builderEl.querySelectorAll('button').forEach(b => b.disabled = true);
      callback(isCorrect);
    });
    builderEl.appendChild(btn);
  });
}

export function renderResult(msg) {
  const resultEl = document.querySelector('#resultSummary');
  resultEl.textContent = [
    '══════════════════════════════════════════════════════',
    `[✓] Result: ${msg}`,
    '══════════════════════════════════════════════════════'
  ].join('\n');
}

export function renderFooterHUD(xp, streak, version) {
  return `XP: ${xp} pts  |  Streak: ${streak}  |  Version: ${version}`;
}

export function printAscii(...blocks) {
  const out = document.getElementById('asciiOutput');
  if (out) {
    out.hidden = false;
    out.textContent = blocks.join('\n\n');
  }
}

// Internal: boxed ASCII container
function box(lines) {
  const width = 54;
  const top = '╔' + '═'.repeat(width) + '╗';
  const bottom = '╚' + '═'.repeat(width) + '╝';
  const padded = lines.map(line =>
    '║ ' + line.padEnd(width - 2) + ' ║'
  );
  return [top, ...padded, bottom].join('\n');
}

