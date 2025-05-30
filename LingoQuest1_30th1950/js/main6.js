
// main.js
// Purpose: Main application entry point. Handles UI interactions, game mode switching, and core initializations.
// Usage: Loaded by index.html as a module.
// Timestamp: 2025-05-29 10:14:33 AM BST
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

import { profileManager } from './profileManager.js';
import { uiModeManager } from './uiModeManager.js';
import { updateVersionInfo } from './version.js';
import { initXPTracker } from './xpTracker.js';
import { loadVocabulary, resetAnsweredQuestionsTracker } from './questionPool.js';
import { themeManager } from './themeManager.js'; // NEW: Import themeManager

// Game Modes Imports
import * as mixLingo from './modes/mixLingo.js';
// import * as soloMode from './modes/soloMode.js'; // Corrected path - Uncomment when ready

// UI Elements
const gameModesSection = document.getElementById('gameModes');
const gameContainerSection = document.getElementById('gameContainer');
const backToModesBtn = document.getElementById('backToModesBtn');
const uiModeSelector = document.getElementById('uiModeSelector');
const textSizeSelector = document.getElementById('textSizeSelector');
const darkModeToggle = document.getElementById('darkModeToggle');
const difficultySelector = document.getElementById('difficultySelector');
const answerLanguageSelector = document.getElementById('answerLanguageSelector');

// Game state
let currentGameMode = null;
const DIFFICULT_LEVEL_KEY = 'lingoQuestDifficulty';
const SELECTED_LANGUAGE_KEY = 'lingoQuestSelectedLanguage';
const SELECTED_ANSWER_LANGUAGE_KEY = 'lingoQuestSelectedAnswerLanguage';

/**
 * Detects the operating system and adds a corresponding class to the body.
 */
function detectOSAndApplyClass() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const body = document.body;

    if (/android/i.test(userAgent)) {
        body.classList.add('os-android');
        console.log("OS Detected: Android");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        body.classList.add('os-ios');
        console.log("OS Detected: iOS");
    } else {
        body.classList.add('os-desktop'); // Fallback for desktop browsers
        console.log("OS Detected: Desktop/Other");
    }
}


/**
 * Applies a language class to the body based on the selected game mode language.
 * This primarily affects potential overall UI language adjustments, not answer language.
 * @param {string} langCode - The language code (e.g., 'en', 'fr', 'de').
 */
function applyLanguageClass(langCode) {
    const body = document.body;
    // Remove any existing lang- classes
    body.classList.forEach(cls => {
        if (cls.startsWith('lang-')) {
            body.classList.remove(cls);
        }
    });
    // Add the new lang- class
    body.classList.add(`lang-${langCode}`);
    localStorage.setItem(SELECTED_LANGUAGE_KEY, langCode); // Save selected mode language
    console.log(`Game mode language class applied: lang-${langCode}`);
}


/**
 * Initializes the application: loads profile, sets up UI, and attaches event listeners.
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM Content Loaded. Initializing app...");

    detectOSAndApplyClass(); // Detect OS first

    // Initialize core managers
    await profileManager.init(); // Load or create user profile
    await themeManager.init(); // NEW: Initialize theme manager FIRST
    uiModeManager.init(); // Apply saved UI and dark mode settings, and text size (which might override theme variables)
    initXPTracker(); // Initialize XP bar and streak display
    updateVersionInfo(); // Display app version

    // Apply last selected game mode language class (e.g., for clue language in general UI)
    applyLanguageClass(localStorage.getItem(SELECTED_LANGUAGE_KEY) || 'en');

    // Load ALL vocabulary for dynamic question generation
    await loadVocabulary();


    // Set initial selector states based on loaded preferences
    uiModeSelector.value = localStorage.getItem('lingoQuestUiMode') || 'normal';
    textSizeSelector.value = localStorage.getItem('lingoQuestTextSize') || 'normal';
    difficultySelector.value = localStorage.getItem(DIFFICULT_LEVEL_KEY) || 'easy'; // Set default difficulty

    // Initialize Answer Language Selector
    answerLanguageSelector.value = localStorage.getItem(SELECTED_ANSWER_LANGUAGE_KEY) || 'en'; // Default to English answers

    // Event Listeners for UI controls
    darkModeToggle.addEventListener('click', uiModeManager.toggleDarkMode);

    // Event listener for UI Mode selector
    uiModeSelector.addEventListener('change', (event) => {
        uiModeManager.setUiMode(event.target.value);
    });

    // Event listener for Text Size selector (handled by uiModeManager now, but for sync)
    textSizeSelector.addEventListener('change', (event) => {
        uiModeManager.setTextSize(event.target.value);
    });

    // Event listener for Difficulty Selector
    difficultySelector.addEventListener('change', (event) => {
        localStorage.setItem(DIFFICULT_LEVEL_KEY, event.target.value);
        console.log(`Difficulty set to: ${event.target.value}. Game will apply next round.`);
    });

    // Event listener for Answer Language Selector
    answerLanguageSelector.addEventListener('change', (event) => {
        localStorage.setItem(SELECTED_ANSWER_LANGUAGE_KEY, event.target.value);
        console.log(`Answer language set to: ${event.target.value}. Game will apply next round.`);
        if (currentGameMode && typeof currentGameMode.reset === 'function') {
            currentGameMode.reset();
            startGameMode(currentGameMode.modeName, 'en', difficultySelector.value, event.target.value);
        }
    });


    // Game Mode Selection
    document.querySelectorAll('.mode-buttons button').forEach(button => {
        button.addEventListener('click', (event) => {
            const mode = event.target.dataset.mode;
            const lang = event.target.dataset.lang || 'en';
            const difficulty = localStorage.getItem(DIFFICULT_LEVEL_KEY) || 'easy';
            const answerLang = localStorage.getItem(SELECTED_ANSWER_LANGUAGE_KEY) || 'en';

            applyLanguageClass(lang);
            startGameMode(mode, lang, difficulty, answerLang);
        });
    });

    // Back to Modes button listener (if implemented in HTML)
    if (backToModesBtn) {
        backToModesBtn.addEventListener('click', showModeSelection);
    }

    // Initial view: show game mode selection
    showModeSelection();
});

/**
 * Hides game mode selection and shows the game container.
 */
function showGameContainer() {
    gameModesSection.style.display = 'none';
    gameContainerSection.style.display = 'flex'; // Use flex for game container layout
}

/**
 * Hides game container and shows game mode selection.
 */
function showModeSelection() {
    gameModesSection.style.display = 'block';
    gameContainerSection.style.display = 'none';
    // Clear any game-specific UI elements when going back
    document.getElementById('sentenceClue').textContent = '';
    document.getElementById('sentenceBuilderArea').innerHTML = '';
    document.getElementById('mcqOptions').innerHTML = '';
    document.getElementById('resultSummary').innerHTML = '';

    if (currentGameMode && typeof currentGameMode.reset === 'function') {
        currentGameMode.reset();
    }
    currentGameMode = null;

    // When going back to mode selection, reset language class to default or last remembered
    applyLanguageClass(localStorage.getItem(SELECTED_LANGUAGE_KEY) || 'en');
}

/**
 * Starts a selected game mode.
 * @param {string} mode - The identifier for the game mode (e.g., 'mixlingo').
 * @param {string} questionLang - The language for the question clues (for this feature, always 'en').
 * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard').
 * @param {string} answerLang - The language for the answer options (e.g., 'en', 'fr', 'de').
 */
async function startGameMode(mode, questionLang, difficulty, answerLang) {
    showGameContainer();
    resetAnsweredQuestionsTracker();

    let modeModule;
    switch (mode) {
        case 'mixlingo':
            modeModule = mixLingo;
            currentGameMode = { ...mixLingo, modeName: mode };
            break;
        // case 'solo':
        //     modeModule = soloMode;
        //     currentGameMode = { ...soloMode, modeName: mode };
        //     break;
        default:
            console.error('Unknown game mode:', mode);
            showModeSelection();
            return;
    }

    if (modeModule && typeof modeModule.init === 'function') {
        await modeModule.init(questionLang, difficulty, answerLang);
    } else {
        console.error(`Game mode module for ${mode} not found or init function missing.`);
        showModeSelection();
    }
}
