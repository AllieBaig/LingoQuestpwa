
/**
 * Trail of Letters — Daily Creative Challenge
 * Prompts the user with Name, Place, Animal, Thing based on a letter and theme.
 * Ends with a Word Relic reveal.
 * Uses: #sentenceClue, #sentenceBuilderArea, #resultSummary
 * Depends on: questionPool.js, xpTracker.js
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 23:00 | File: scripts/lingoquest/trail.js
 */

import { awardXP } from '../utils/xpTracker.js';

export async function initTrail(lang = 'en') {
  const clueEl = document.getElementById('sentenceClue');
  const builderEl = document.getElementById('sentenceBuilderArea');
  const resultEl = document.getElementById('resultSummary');

  clueEl.textContent = '[📜 Trail of Letters] Loading theme...';
  builderEl.innerHTML = '';
  resultEl.textContent = '';

  try {
    const res = await fetch(`./lang/trail-${lang}.json`);
    const data = await res.json();
    const today = new Date().getDate() % data.length;
    const trail = data[today]; // rotate daily using day of month

    const steps = ['name', 'place', 'animal', 'thing'];
    let currentStep = 0;
    const userAnswers = {};

    function nextStep() {
      if (currentStep >= steps.length) {
        showRelic();
        return;
      }

      const type = steps[currentStep];
      const prompt = trail.prompts[type];
      clueEl.innerHTML = `🌟 Theme: <b>${trail.theme}</b><br>🔤 Letter: <b>${trail.letter}</b><br><br>${prompt}`;
      builderEl.innerHTML = '';

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Your ${type} starting with "${trail.letter}"...`;
      input.style.fontSize = '1rem';
      input.style.padding = '0.5rem';
      input.style.width = '90%';
      input.style.maxWidth = '300px';
      input.style.borderRadius = '6px';

      const button = document.createElement('button');
      button.textContent = 'Next';
      button.style.marginTop = '1rem';
      button.style.padding = '0.5rem 1rem';
      button.onclick = () => {
        const val = input.value.trim();
        if (!val || val[0].toUpperCase() !== trail.letter.toUpperCase()) {
          resultEl.textContent = `❌ Please enter a word starting with "${trail.letter}"`;
          return;
        }
        userAnswers[type] = val;
        resultEl.textContent = '';
        currentStep++;
        nextStep();
      };

      builderEl.appendChild(input);
      builderEl.appendChild(button);
    }

    function showRelic() {
      clueEl.innerHTML = `✅ Trail Complete for <b>${trail.theme}</b>`;
      builderEl.innerHTML = `
        <div style="font-size: 1.1rem; line-height: 1.5;">
          <b>Your Trail:</b><br>
          Name: ${userAnswers.name}<br>
          Place: ${userAnswers.place}<br>
          Animal: ${userAnswers.animal}<br>
          Thing: ${userAnswers.thing}
        </div>
        <hr style="margin: 1rem 0;">
        <div style="font-size: 1.2rem; color: #c05;"><b>🎁 Word Relic Unlocked:</b><br>
          <b>${trail.relic.name}</b><br>
          <em>${trail.relic.description}</em>
        </div>
      `;
      awardXP(20);
      resultEl.textContent = '[+20 XP] Thanks for completing today’s trail!';
    }

    // Show intro
    clueEl.innerHTML = `🌟 Theme: <b>${trail.theme}</b><br>🔤 Letter: <b>${trail.letter}</b><br><br>${trail.intro}`;
    builderEl.innerHTML = `
      <button style="margin-top:1rem; font-size:1rem; padding:0.5rem 1.5rem;">Begin Trail</button>
    `;
    builderEl.querySelector('button').onclick = nextStep;

  } catch (err) {
    clueEl.textContent = '⚠️ Failed to load trail.';
    console.error('Trail load error:', err);
  }
}
