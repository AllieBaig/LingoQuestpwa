
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// main.js
// Purpose: Entry point for the application. Initializes UI controls, XP tracker,
// and sets up event listeners for game mode selection.
// Timestamp: 2025-05-30 05:25:00 AM BST (Logging events to eventLogger.js)

// CHANGED: Import logEvent from eventLogger.js
import { logEvent } from './eventLogger.js';
import { initUIControls } from './uiModeManager.js';
import { updateVersionInfo } from './version.js';
import { startGame } from './gameCore.js';

// Get DOM elements
const soloModeBtn = document.getElementById('soloModeBtn');
const mixLingoBtn = document.getElementById('mixLingoBtn');
const wordRelicBtn = document.getElementById('wordRelicBtn');
const wordSafariBtn = document.getElementById('wordSafariBtn');
const answerLanguageSelector = document.getElementById('answerLanguageSelector');
const difficultySelector = document.getElementById('difficultySelector');
const uiModeSelector = document.getElementById('uiModeSelector');
const textSizeSelector = document.getElementById('textSizeSelector');


// Add a check to see if buttons are found for debugging startup
// These can remain as console.log for initial application load diagnostics
console.log('[main.js] DOM element checks:');
console.log(`  soloModeBtn found: ${!!soloModeBtn}`);
console.log(`  mixLingoBtn found: ${!!mixLingoBtn}`);
console.log(`  wordRelicBtn found: ${!!wordRelicBtn}`);
console.log(`  wordSafariBtn found: ${!!wordSafariBtn}`);
console.log(`  answerLanguageSelector found: ${!!answerLanguageSelector}`);
console.log(`  difficultySelector found: ${!!difficultySelector}`);
console.log(`  uiModeSelector found: ${!!uiModeSelector}`);
console.log(`  textSizeSelector found: ${!!textSizeSelector}`);


// --- Event Listeners and Initializations ---

document.addEventListener('DOMContentLoaded', () => {
    logEvent('[main.js] DOMContent loaded. Initializing UI and game listeners.', 'info'); // Event log

    const initialGameData = {
        uiMode: 'normal',
        textSize: 'normal',
        difficulty: 'easy',
        answerLanguage: 'en',
    };

    // Initialize UI mode (normal/ascii) and attach listener with log
    initUIControls(initialGameData.uiMode);
    if (uiModeSelector) {
        uiModeSelector.value = initialGameData.uiMode;
        uiModeSelector.addEventListener('change', (e) => {
            const selectedMode = e.target.value;
            logEvent(`UI Mode changed to: ${selectedMode}`, 'change', { uiMode: selectedMode }); // Event log
            initUIControls(selectedMode);
        });
    } else {
        console.warn('[main.js] UI Mode Selector not found.');
    }

    // Initialize text size and attach listener with log
    initUIControls(initialGameData.textSize);
    if (textSizeSelector) {
        textSizeSelector.value = initialGameData.textSize;
        textSizeSelector.addEventListener('change', (e) => {
            const selectedSize = e.target.value;
            logEvent(`Text Size changed to: ${selectedSize}`, 'change', { textSize: selectedSize }); // Event log
            initUIControls(selectedSize);
        });
    } else {
        console.warn('[main.js] Text Size Selector not found.');
    }

    // Initialize difficulty selector and attach listener with log
    if (difficultySelector) {
        difficultySelector.value = initialGameData.difficulty;
        difficultySelector.addEventListener('change', (e) => {
            const selectedDifficulty = e.target.value;
            logEvent(`Difficulty changed to: ${selectedDifficulty}`, 'change', { difficulty: selectedDifficulty }); // Event log
        });
    } else {
        console.warn('[main.js] Difficulty Selector not found.');
    }

    // Initialize answer language selector and attach listener with log
    if (answerLanguageSelector) {
        answerLanguageSelector.value = initialGameData.answerLanguage;
        answerLanguageSelector.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            logEvent(`Answer Language changed to: ${selectedLang}`, 'change', { answerLanguage: selectedLang }); // Event log
        });
    } else {
        console.warn('[main.js] Answer Language Selector not found.');
    }

    logEvent('[main.js] Theme selector logic delegated to standalone themeManager.js.', 'info'); // Event log
    
    const xpTextEl = document.querySelector('.xp-text');
    const xpFillEl = document.querySelector('.xp-fill');
    const streakBadgeEl = document.querySelector('.streak-badge');

    if (xpTextEl) xpTextEl.textContent = 'XP: N/A';
    if (xpFillEl) xpFillEl.style.width = '0%';
    if (streakBadgeEl) streakBadgeEl.textContent = 'Streak: N/A';

    updateVersionInfo();

    // Event listeners for game mode buttons with logs
    logEvent('[main.js] Attaching event listeners for game mode buttons.', 'info'); // Event log
    if (soloModeBtn) {
        soloModeBtn.addEventListener('click', () => {
            logEvent('Solo Mode button clicked. Starting game...', 'click', { mode: 'solo' }); // Event log
            startGame('solo', soloModeBtn.dataset.lang);
        });
    } else {
        console.warn('[main.js] Solo Mode button not found.');
    }

    if (mixLingoBtn) {
        mixLingoBtn.addEventListener('click', () => {
            logEvent('MixLingo button clicked. Starting game...', 'click', { mode: 'mixlingo' }); // Event log
            startGame('mixlingo', mixLingoBtn.dataset.lang);
        });
    } else {
        console.warn('[main.js] MixLingo button not found.');
    }

    if (wordRelicBtn) {
        wordRelicBtn.addEventListener('click', () => {
            logEvent('Word Relic button clicked. Starting game...', 'click', { mode: 'wordrelic' }); // Event log
            startGame('wordrelic', 'en');
        });
    } else {
        console.warn('[main.js] Word Relic button not found.');
    }

    if (wordSafariBtn) {
        wordSafariBtn.addEventListener('click', () => {
            logEvent('Word Safari button clicked. Starting game...', 'click', { mode: 'wordsafari' }); // Event log
            startGame('wordsafari', 'en');
        });
    } else {
        console.warn('[main.js] Word Safari button not found.');
    }

    logEvent('[main.js] All UI and game modules initialized.', 'info'); // Event log
});
