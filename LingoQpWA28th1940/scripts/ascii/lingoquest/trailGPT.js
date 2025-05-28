
/**
 * Trail of Letters (ASCII Mode)
 * Daily letter challenge using Name, Place, Animal, Thing prompts.
 * Displays text-based input and ends with a Word Relic reveal.
 * Uses: #asciiOutput only
 * Depends on: asciiRenderer.js, xpTracker.js
 * Related JSON: lang/trail-*.json
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 23:25 | File: scripts/ascii/lingoquest/trail.js
 */

import { renderHeader, renderClueBlock, renderResult, renderFooterHUD, printAscii } from '../../shared/asciiRenderer.js';
import { awardXP } from '../../utils/xpTracker.js';

export async function initAsciiTrail(lang = 'en') {
  const outEl = document.getElementById('asciiOutput');
  if (!outEl) return;

  try {
    const res = await fetch(`./lang/trail-${lang}.json`);
    const data = await res.json();
    const today = new Date().getDate() % data.length;
    const trail = data[today];

    const answers = {};
    const steps = ['name', 'place', 'animal', 'thing'];
    let currentStep = 0;

    const xp = parseInt(localStorage.getItem('xpTotal') || '0', 10) || 0;
    const version = localStorage.getItem('buildVersion') || 'v0.0';
    const streak = localStorage.getItem('streakDays') || '0';

    function askNext() {
      if (currentStep >= steps.length) {
        return showSummary();
      }

      const type = steps[currentStep];
      const promptText = trail.prompts[type];
      const clueBlock = renderClueBlock(`[✏️  ${type.toUpperCase()}]`, [promptText]);
      const footer = renderFooterHUD(xp, streak, version);

      printAscii(
        renderHeader('Trail of Letters'),
        clueBlock,
        'Type your answer below (must start with "' + trail.letter + '"):\n',
        renderResult('Tap below and enter'),
        footer
      );

      const answer = prompt(`${type.toUpperCase()}: ${promptText}`);
      if (!answer || answer.trim()[0].toUpperCase() !== trail.letter.toUpperCase()) {
        alert(`❌ Please enter a word starting with "${trail.letter}"`);
        return askNext();
      }
      answers[type] = answer.trim();
      currentStep++;
      askNext();
    }

    function showSummary() {
      const lines = [
        `✅ Trail Complete: ${trail.theme}`,
        '',
        `🔤 Letter: ${trail.letter}`,
        `Name:   ${answers.name}`,
        `Place:  ${answers.place}`,
        `Animal: ${answers.animal}`,
        `Thing:  ${answers.thing}`,
        '',
        `🎁 Word Relic: ${trail.relic.name}`,
        `${trail.relic.description}`
      ];
      printAscii(
        renderHeader('Trail Complete'),
        renderClueBlock('🎉 Your Trail', lines),
        renderResult('+20 XP earned'),
        renderFooterHUD(xp + 20, streak, version)
      );
      awardXP(20);
    }

    // Begin journey
    printAscii(
      renderHeader('Trail of Letters'),
      renderClueBlock(`📜 Theme: ${trail.theme}`, [
        `Letter of the day: ${trail.letter}`,
        '',
        trail.intro
      ]),
      renderResult('Tap to begin'),
      renderFooterHUD(xp, streak, version)
    );

    setTimeout(() => {
      askNext();
    }, 1200);
  } catch (err) {
    console.error('Trail load error:', err);
    printAscii(
      renderHeader('Trail of Letters'),
      renderResult('⚠️ Could not load trail data.')
    );
  }
}
