
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// main.js
// Purpose: Entry point for the application. Initializes UI controls, XP tracker,
// and sets up event listeners for game mode selection.
// Timestamp: 2025-05-30 05:40:00 AM BST (Fixed uiModeManager import and initialization)

console.log('[main.js] FILE LOADED AND EXECUTING TOP LEVEL CODE.');

// CHANGED: Import the uiModeManager object, not a standalone function.
import { uiModeManager } from './uiModeManager.js';
import { updateVersionInfo } from './version.js';
import { startGame } from './gameCore.js';
import { logEvent } from './eventLogger.js'; // Ensure eventLogger is still imported

// Get DOM elements (keeping these for initial checks and game mode listeners)
const soloModeBtn = document.getElementById('soloModeBtn');
const mixLingoBtn = document.getElementById('mixLingoBtn');
const wordRelicBtn = document.getElementById('wordRelicBtn');
const wordSafariBtn = document.getElementById('wordSafariBtn');

// The selectors for difficulty and answer language are distinct from uiModeManager's scope
const answerLanguageSelector = document.getElementById('answerLanguageSelector');
const difficultySelector = document.getElementById('difficultySelector');

// Add a check to see if buttons are found for debugging startup
console.log('[main.js] DOM element checks:');
console.log(`  soloModeBtn found: ${!!soloModeBtn}`);
console.log(`  mixLingoBtn found: ${!!mixLingoBtn}`);
console.log(`  wordRelicBtn found: ${!!wordRelicBtn}`);
console.log(`  wordSafariBtn found: ${!!wordSafariBtn}`);
console.log(`  answerLanguageSelector found: ${!!answerLanguageSelector}`);
console.log(`  difficultySelector found: ${!!difficultySelector}`);
console.log(`  uiModeSelector (handled by uiModeManager)`); // uiModeManager handles this element's setup
console.log(`  textSizeSelector (handled by uiModeManager)`); // uiModeManager handles this element's setup


// --- Event Listeners and Initializations ---

document.addEventListener('DOMContentLoaded', () => {
    logEvent('[main.js] DOMContent loaded. Initializing UI and game listeners.', 'info');

    // Initialize uiModeManager (this handles uiMode, text size, and their dropdowns)
    // It also sets up its own event listeners for 'change' events on its managed selectors.
    uiModeManager.init();
    logEvent('[main.js] uiModeManager initialized (UI Mode and Text Size applied).', 'ui');

    // Initial game data (fallback/defaults as profile is disabled)
    // Note: uiMode and textSize are now handled by uiModeManager directly reading localStorage.
    // We only need to manage other settings like difficulty and answerLanguage here.
    const initialSettings = {
        difficulty: 'easy',
        answerLanguage: 'en',
    };

    // Initialize difficulty selector and attach listener with log
    if (difficultySelector) {
        difficultySelector.value = initialSettings.difficulty;
        difficultySelector.addEventListener('change', (e) => {
            const selectedDifficulty = e.target.value;
            logEvent(`Difficulty changed to: ${selectedDifficulty}`, 'change', { difficulty: selectedDifficulty });
        });
    } else {
        console.warn('[main.js] Difficulty Selector not found.');
    }

    // Initialize answer language selector and attach listener with log
    if (answerLanguageSelector) {
        answerLanguageSelector.value = initialSettings.answerLanguage;
        answerLanguageSelector.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            logEvent(`Answer Language changed to: ${selectedLang}`, 'change', { answerLanguage: selectedLang });
        });
    } else {
        console.warn('[main.js] Answer Language Selector not found.');
    }

    logEvent('[main.js] Theme selector logic delegated to standalone themeManager.js, which self-initializes.', 'info');
    
    // Provide fallback visual states for XP/Streak if profile/XP system is disabled
    const xpTextEl = document.querySelector('.xp-text');
    const xpFillEl = document.querySelector('.xp-fill');
    const streakBadgeEl = document.querySelector('.streak-badge');

    if (xpTextEl) xpTextEl.textContent = 'XP: N/A';
    if (xpFillEl) xpFillEl.style.width = '0%';
    if (streakBadgeEl) streakBadgeEl.textContent = 'Streak: N/A';

    // Update version info in footer
    updateVersionInfo();

    // Event listeners for game mode buttons with logs
    logEvent('[main.js] Attaching event listeners for game mode buttons.', 'info');
    if (soloModeBtn) {
        soloModeBtn.addEventListener('click', () => {
            logEvent('Solo Mode button clicked. Starting game...', 'click', { mode: 'solo' });
            startGame('solo', soloModeBtn.dataset.lang);
        });
    } else {
        console.warn('[main.js] Solo Mode button not found.');
    }

    if (mixLingoBtn) {
        mixLingoBtn.addEventListener('click', () => {
            logEvent('MixLingo button clicked. Starting game...', 'click', { mode: 'mixlingo' });
            startGame('mixlingo', mixLingoBtn.dataset.lang);
        });
    } else {
        console.warn('[main.js] MixLingo button not found.');
    }

    if (wordRelicBtn) {
        wordRelicBtn.addEventListener('click', () => {
            logEvent('Word Relic button clicked. Starting game...', 'click', { mode: 'wordrelic' });
            startGame('wordrelic', 'en'); // Assuming 'en' as default for now
        });
    } else {
        console.warn('[main.js] Word Relic button not found.');
    }

    if (wordSafariBtn) {
        wordSafariBtn.addEventListener('click', () => {
            logEvent('Word Safari button clicked. Starting game...', 'click', { mode: 'wordsafari' });
            startGame('wordsafari', 'en'); // Assuming 'en' as default for now
        });
    } else {
        console.warn('[main.js] Word Safari button not found.');
    }

    logEvent('[main.js] All UI and game modules initialized.', 'info');
});
