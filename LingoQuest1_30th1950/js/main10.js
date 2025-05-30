
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// main.js
// Purpose: Entry point for the application. Initializes UI controls, XP tracker,
// and sets up event listeners for game mode selection.
// Timestamp: 2025-05-29 08:58:30 PM BST

import { initUIControls } from './uiModeManager.js';
import { applyTheme, initThemeToggle, getAvailableCustomThemes } from './themeManager.js';
import { updateVersionInfo } from './version.js';
import { initXPTracker } from './xpTracker.js';
import { profileManager } from './profileManager.js';
import { startGame } from './gameCore.js';
import { initMCQAutoCheck } from './mcqAutoCheck.js';
import { manualLogError } from './errorLogger.js'; // Import for manual logging (optional, but good practice)

// Get DOM elements
const soloModeBtn = document.getElementById('soloModeBtn');
const mixLingoBtn = document.getElementById('mixLingoBtn');
const wordRelicBtn = document.getElementById('wordRelicBtn');
const wordSafariBtn = document.getElementById('wordSafariBtn');

// Language selector for answers
const answerLanguageSelector = document.getElementById('answerLanguageSelector');

// Theme selector
const themeSelector = document.getElementById('themeSelector');

// --- Event Listeners and Initializations ---

document.addEventListener('DOMContentLoaded', () => {
    const initialGameData = profileManager.getGameData();

    // Initialize UI mode (normal/ascii)
    initUIControls(initialGameData.uiMode);
    document.getElementById('uiModeSelector').value = initialGameData.uiMode;
    document.getElementById('uiModeSelector').addEventListener('change', (e) => {
        initUIControls(e.target.value);
        profileManager.updateSetting('uiMode', e.target.value);
    });

    // Initialize text size (normal, senior-big, senior-very-big)
    initUIControls(initialGameData.textSize);
    document.getElementById('textSizeSelector').value = initialGameData.textSize;
    document.getElementById('textSizeSelector').addEventListener('change', (e) => {
        initUIControls(e.target.value);
        profileManager.updateSetting('textSize', e.target.value);
    });

    // Initialize dark mode
    initThemeToggle(initialGameData.darkMode);
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        const newDarkModeState = !document.body.classList.contains('dark');
        initThemeToggle(newDarkModeState);
        profileManager.updateSetting('darkMode', newDarkModeState);
    });

    // Initialize difficulty selector
    document.getElementById('difficultySelector').value = initialGameData.difficulty;
    document.getElementById('difficultySelector').addEventListener('change', (e) => {
        profileManager.updateSetting('difficulty', e.target.value);
    });

    // Initialize answer language selector
    answerLanguageSelector.value = initialGameData.answerLanguage;
    answerLanguageSelector.addEventListener('change', (e) => {
        profileManager.updateSetting('answerLanguage', e.target.value);
    });

    // --- Theme Selector Initialization and Event Listener ---
    const availableThemes = getAvailableCustomThemes();
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
        profileManager.updateSetting('currentTheme', selectedThemeId);
        const currentDarkModeState = document.body.classList.contains('dark');
        applyTheme(selectedThemeId, currentDarkModeState);
        console.log(`[main.js] User selected theme: ${selectedThemeId}. Applied immediately.`);
    });
    // --- End Theme Selector ---

    // Initialize XP Tracker UI
    initXPTracker();

    // Update version info in footer
    updateVersionInfo();

    // Event listeners for game mode buttons
    soloModeBtn.addEventListener('click', () => startGame('solo', soloModeBtn.dataset.lang));
    mixLingoBtn.addEventListener('click', () => startGame('mixlingo', mixLingoBtn.dataset.lang));
    wordRelicBtn.addEventListener('click', () => {
        alert('Word Relic mode not yet implemented!');
        // Example of manually logging an error/warning:
        manualLogError('Attempted to access unimplemented Word Relic mode.', null, 'info');
    });
    wordSafariBtn.addEventListener('click', () => {
        alert('Word Safari mode not yet implemented!');
        // Another example:
        manualLogError('Attempted to access unimplemented Word Safari mode.', null, 'info');
    });

    // Initialize MCQ auto-check
    initMCQAutoCheck(); 

    console.log('[main.js] All UI and game modules initialized.');
});
