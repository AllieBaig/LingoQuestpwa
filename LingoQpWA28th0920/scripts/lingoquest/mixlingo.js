
/**
 * MixLingo – Normal UI with MCQ (English Sentence + Foreign Word Options)
 * Replaces one English word in a sentence with MCQ foreign word choices
 * Matches ASCII logic but styled for Minimal UI with button interactions
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-27 23:59 | File: scripts/lingoquest/mixlingo.js
 */

import { generateMCQ } from '../utils/mcqEngine.js';

export function initMixLingoMode(level = 'easy', lang = 'fr') {
  const clueEl = document.getElementById('sentenceClue');
  const builderArea = document.getElementById('sentenceBuilderArea');
  const resultEl = document.getElementById('resultSummary');
  const submitBtn = document.getElementById('submitSentence');

  // Example sentence structure
  const sentenceData = {
    clue: "Complete the sentence with the correct foreign word:",
    sentence: ["I", "want", "to", "___", "an", "apple."],
    correct: "manger", // "to eat" in French
    level,
    lang,
    fact: "‘Manger’ is French for ‘to eat’."
  };

  // Render sentence with blank
  clueEl.textContent = sentenceData.clue;
  builderArea.innerHTML = '';

  const sentenceEl = document.createElement('p');
  sentenceEl.innerHTML = sentenceData.sentence
    .map(w => (w === "___" ? "<strong>[ ? ]</strong>" : w))
    .join(' ');
  builderArea.appendChild(sentenceEl);

  const options = generateMCQ(sentenceData.correct, level, lang);
  const optionGroup = document.createElement('div');
  optionGroup.className = 'mcq-wrapper';

  options.forEach(word => {
    const btn = document.createElement('button');
    btn.className = 'mcq-option';
    btn.textContent = word;
    btn.addEventListener('click', () => {
      optionGroup.querySelectorAll('.mcq-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    optionGroup.appendChild(btn);
  });

  builderArea.appendChild(optionGroup);
  resultEl.hidden = true;

  submitBtn.onclick = () => {
    const selected = builderArea.querySelector('.mcq-option.selected')?.textContent;
    resultEl.hidden = false;

    if (!selected) {
      resultEl.textContent = "Please select a foreign word.";
      return;
    }

    if (selected === sentenceData.correct) {
      resultEl.textContent = `Correct! ${sentenceData.fact} +10 XP`;
    } else {
      resultEl.textContent = `Incorrect. ${sentenceData.fact}`;
    }
  };
}
