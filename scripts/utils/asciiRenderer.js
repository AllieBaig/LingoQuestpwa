/**
 * ASCII Renderer Utility (Emoji Toggle Support)
 * Renders ASCII UI clues, MCQs, summaries with optional emoji-free mode
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 20:50 | File: scripts/utils/asciiRenderer.js
 */

export function renderClue(text) {
  const clueEl = document.querySelector('#sentenceClue');
  const lines = text.trim().split('\n');
  clueEl.textContent = renderClueBlock('[ Clue ]', lines);
}

export function renderClueBlock(modeLabel, lines) {
  return box([
    sanitize(modeLabel),
    ...lines.map(line => sanitize(line))
  ]);
}

export function renderMCQ(options, answer, callback) {
  const builderEl = document.querySelector('#sentenceBuilderArea');
  builderEl.innerHTML = '';

  options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'mcq-option';
    btn.textContent = `[${i + 1}] ${sanitize(opt)}`;
    btn.addEventListener('click', () => {
      const isCorrect = opt === answer;
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      builderEl.querySelectorAll('button').forEach(b => b.disabled = true);
      callback(isCorrect);
    });
    builderEl.appendChild(btn);
  });
}

export function renderResult(msg, emojiType = 'success') {
  const resultEl = document.querySelector('#resultSummary');

  const mark = {
    success: '✓',
    error: '✘',
    info: 'ℹ'
  }[emojiType] || '✓';

  resultEl.textContent = [
    '══════════════════════════════════════════════════════',
    `[${mark}] Result: ${sanitize(msg)}`,
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
    out.textContent = blocks.map(sanitize).join('\n\n');
  }
}

// Internal: box drawing
function box(lines) {
  const width = 54;
  const top = '╔' + '═'.repeat(width) + '╗';
  const bottom = '╚' + '═'.repeat(width) + '╝';
  const padded = lines.map(line =>
    '║ ' + line.padEnd(width - 2) + ' ║'
  );
  return [top, ...padded, bottom].join('\n');
}

// Internal: emoji sanitization if in pure mode
function sanitize(text) {
  const mode = localStorage.getItem('asciiEmojiMode') || 'emoji';
  if (mode === 'pure') {
    return text.replace(
      /[\u{1F300}-\u{1F6FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}]/gu,
      ''
    );
  }
  return text;
}
