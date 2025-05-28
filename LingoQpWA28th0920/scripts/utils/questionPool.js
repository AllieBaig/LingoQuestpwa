
/**
 * Question Pool Loader for LingoQuestPWA
 * Loads per-mode questions from lang/*.json
 * Randomizes and returns usable question sets
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 16:30 | File: scripts/utils/questionPool.js
 */

const answeredKeyPrefix = 'lingoquest-answered-';

/**
 * Load and shuffle questions from lang/[mode]-[lang].json
 * @param {string} mode - Game mode (e.g., 'mixlingo', 'wordrelic')
 * @param {string} lang - Language code (e.g., 'fr', 'es')
 * @returns {Promise<Array>} - Array of question objects
 */
export async function loadQuestionsForMode(mode, lang = 'fr') {
  const path = `lang/${mode}-${lang}.json`;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const data = await res.json();
    return shuffleArray(data).filter(q => !isAnswered(q));
  } catch (err) {
    console.error(`Error loading question set: ${path}`, err);
    return [];
  }
}

/**
 * Record a question as answered (optional for future tracking)
 */
export function markQuestionAnswered(q) {
  if (!q || !q.answer) return;
  const key = answeredKeyPrefix + hash(q.answer + (q.clue || q.category || ''));
  localStorage.setItem(key, '1');
}

/**
 * Check if a question was already answered (optional filtering)
 */
function isAnswered(q) {
  if (!q || !q.answer) return false;
  const key = answeredKeyPrefix + hash(q.answer + (q.clue || q.category || ''));
  return !!localStorage.getItem(key);
}

/**
 * Fisher-Yates Shuffle
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Simple string hash (for tracking)
 */
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h.toString(36);
}
