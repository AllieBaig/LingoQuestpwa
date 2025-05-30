
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// main.js
// Purpose: Entry point for the application. Initializes UI controls, XP tracker,
// and sets up event listeners for game mode selection.
// Timestamp: 2025-05-30 03:01:44 AM BST (Updated for Word Relic mode, no profile)

console.log('[main.js] FILE LOADED AND EXECUTING TOP LEVEL CODE.');

import { initUIControls } from './uiModeManager.js';
import { applyTheme, initThemeToggle, getAvailableCustomThemes } from './themeManager.js';
import { updateVersionInfo } from './version.js';
// COMMENT OUT XP TRACKER FOR NOW IF IT RELIES HEAVILY ON PROFILE
// import { initXPTracker } from './xpTracker.js';
// COMMENT OUT PROFILE MANAGER IMPORT
// import { profileManager } from './profileManager.js';
import { startGame } from './gameCore.js';
import { initMCQAutoCheck } from './mcqAutoCheck.js';
import { manualLogError } from './errorLogger.js';

// Get DOM elements
const soloModeBtn = document.getElementById('soloModeBtn');
const mixLingoBtn = document.getElementById('mixLingoBtn');
const wordRelicBtn = document.getElementById('wordRelicBtn'); // Ensure this is correctly retrieved
const wordSafariBtn = document.getElementById('wordSafariBtn');

// Add a check to see if buttons are found
console.log('soloModeBtn:', soloModeBtn);
console.log('mixLingoBtn:', mixLingoBtn);
console.log('wordRelicBtn:', wordRelicBtn);
console.log('wordSafariBtn:', wordSafariBtn);


// Language selector for answers
const answerLanguageSelector = document.getElementById('answerLanguageSelector');

// Theme selector
const themeSelector = document.getElementById('themeSelector');

// --- Event Listeners and Initializations ---

document.addEventListener('DOMContentLoaded', () => {
    console.log('[main.js] DOMContent loaded. Initializing UI and game listeners.');
    // COMMENT OUT PROFILE-RELATED DATA FETCH
    // const initialGameData = profileManager.getGameData();

    // Use default/fallback values since profile is disabled
    const initialGameData = {
        uiMode: 'normal',
        textSize: 'normal',
        darkMode: false,
        difficulty: 'easy',
        answerLanguage: 'en',
        currentTheme: 'default'
    };

    // Initialize UI mode (normal/ascii)
    initUIControls(initialGameData.uiMode);
    document.getElementById('uiModeSelector').value = initialGameData.uiMode;
    document.getElementById('uiModeSelector').addEventListener('change', (e) => {
        initUIControls(e.target.value);
        // profileManager.updateSetting('uiMode', e.target.value); // COMMENT OUT
    });

    // Initialize text size (normal, senior-big, senior-very-big)
    initUIControls(initialGameData.textSize);
    document.getElementById('textSizeSelector').value = initialGameData.textSize;
    document.getElementById('textSizeSelector').addEventListener('change', (e) => {
        initUIControls(e.target.value);
        // profileManager.updateSetting('textSize', e.target.value); // COMMENT OUT
    });

    // Initialize dark mode
    // initThemeToggle(initialGameData.darkMode); // Already handled in app.js for now
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        const newDarkModeState = !document.body.classList.contains('dark');
        initThemeToggle(newDarkModeState);
        // profileManager.updateSetting('darkMode', newDarkModeState); // COMMENT OUT
    });

    // Initialize difficulty selector
    document.getElementById('difficultySelector').value = initialGameData.difficulty;
    document.getElementById('difficultySelector').addEventListener('change', (e) => {
        // profileManager.updateSetting('difficulty', e.target.value); // COMMENT OUT
    });

    // Initialize answer language selector
    answerLanguageSelector.value = initialGameData.answerLanguage;
    answerLanguageSelector.addEventListener('change', (e) => {
        // profileManager.updateSetting('answerLanguage', e.target.value); // COMMENT OUT
    });

    // --- Theme Selector Initialization and Event Listener ---
    const availableThemes = getAvailableCustomThemes();
    themeSelector.innerHTML = ''; // Clear existing options from profile
    availableThemes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = theme.name;
        themeSelector.appendChild(option);
    });

    const savedThemePreference = initialGameData.currentTheme || 'default';
    themeSelector.value = savedThemePreference;

    themeSelector.addEventListener('change', (e) => {
        const selectedThemeId = e.target.value;
        // profileManager.updateSetting('currentTheme', selectedThemeId); // COMMENT OUT
        const currentDarkModeState = document.body.classList.contains('dark');
        applyTheme(selectedThemeId, currentDarkModeState);
        console.log(`[main.js] User selected theme: ${selectedThemeId}. Applied immediately.`);
    });
    // --- End Theme Selector ---

    // Initialize XP Tracker UI - COMMENT OUT IF IT RELIES ON PROFILE
    // initXPTracker(); // COMMENT OUT (it uses profileManager)
    // You might need to provide dummy elements if xpTracker is fully removed
    document.querySelector('.xp-text').textContent = 'XP: N/A';
    document.querySelector('.xp-fill').style.width = '0%'; // Reset XP bar visually
    document.querySelector('.streak-badge').textContent = 'Streak: N/A';


    // Update version info in footer
    updateVersionInfo();

    // Event listeners for game mode buttons
    console.log('[main.js] Attaching event listeners for game mode buttons.');
    if (soloModeBtn) soloModeBtn.addEventListener('click', () => {
        console.log('[main.js] Solo Mode button clicked.');
        startGame('solo', soloModeBtn.dataset.lang);
    });
    if (mixLingoBtn) mixLingoBtn.addEventListener('click', () => {
        console.log('[main.js] MixLingo button clicked.');
        startGame('mixlingo', mixLingoBtn.dataset.lang);
    });
    if (wordRelicBtn) wordRelicBtn.addEventListener('click', () => { // Modified for Relic
        console.log('[main.js] Word Relic button clicked. Attempting to start game.');
        startGame('wordrelic', 'en'); // Relic will use 'en' as default language for questions
    });
    if (wordSafariBtn) wordSafariBtn.addEventListener('click', () => {
        console.log('[main.js] Word Safari button clicked. Attempting to start game.');
        startGame('wordsafari', 'en');
    });

    // Initialize MCQ auto-check
    initMCQAutoCheck(); 

    console.log('[main.js] All UI and game modules initialized.');
});
