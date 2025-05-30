
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// main.js
// Purpose: Entry point for the application. Initializes all modules and sets up event listeners.
// Timestamp: 2025-05-29 07:31:00 PM BST (Updated for new profile system and app.js integration)

import { initUIControls } from './uiModeManager.js';
import { applyTheme, initThemeToggle, getAvailableCustomThemes } from './themeManager.js'; // Import applyTheme and getAvailableCustomThemes
import { updateVersionInfo } from './version.js';
import { initXPTracker } from './xpTracker.js';
import { profileManager } from './profileManager.js';
import { loadQuestionPool } from './questionPool.js';
import { initMCQAutoCheck } from './mcqAutoCheck.js';

// Get DOM elements for game modes
const gameModesSection = document.getElementById('gameModes');
const gameContainerSection = document.getElementById('gameContainer');
const soloModeBtn = document.getElementById('soloModeBtn');
const mixLingoBtn = document.getElementById('mixLingoBtn');
const wordRelicBtn = document.getElementById('wordRelicBtn');
const wordSafariBtn = document.getElementById('wordSafariBtn');
const sentenceClueEl = document.getElementById('sentenceClue');
const sentenceBuilderAreaEl = document.getElementById('sentenceBuilderArea');
const mcqOptionsEl = document.getElementById('mcqOptions');
const resultSummaryEl = document.getElementById('resultSummary');

// Language selector for answers
const answerLanguageSelector = document.getElementById('answerLanguageSelector');

// Theme selector
const themeSelector = document.getElementById('themeSelector');

// Game state variables
let currentLanguage = 'en'; // Default language, might be overridden by profile
let currentQuestion = null;
let currentMode = null;
let currentAnswerLanguage = 'en'; // Language for the answers

// --- Game Logic Functions (Simplified for main.js) ---

/**
 * Starts a selected game mode.
 * @param {string} mode - The game mode to start (e.g., 'solo', 'mixlingo').
 * @param {string} language - The primary language for the game content.
 */
async function startGame(mode, language) {
    console.log(`Starting game mode: ${mode} in language: ${language}`);
    currentMode = mode;
    currentLanguage = language;
    currentAnswerLanguage = profileManager.getGameData().answerLanguage || 'en'; // Use profile's preferred answer language

    gameModesSection.style.display = 'none';
    gameContainerSection.style.display = 'flex'; // Show game container

    // Load questions for the selected language/difficulty
    const difficulty = profileManager.getGameData().difficulty;
    const questions = await loadQuestionPool(currentLanguage, difficulty);
    if (questions && questions.length > 0) {
        console.log(`Loaded ${questions.length} questions for ${currentLanguage} (${difficulty} difficulty).`);
        // For demonstration, let's just pick a random question
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        displayQuestion(currentQuestion);
    } else {
        sentenceClueEl.textContent = 'No questions available for this mode/language/difficulty.';
        mcqOptionsEl.innerHTML = '';
        console.warn('No questions loaded!');
    }
}

/**
 * Displays the current question on the UI.
 * @param {object} question - The question object to display.
 */
function displayQuestion(question) {
    if (!question) {
        sentenceClueEl.textContent = 'Error: No question to display.';
        mcqOptionsEl.innerHTML = '';
        return;
    }

    // Clear previous results and areas
    resultSummaryEl.innerHTML = '';
    resultSummaryEl.style.display = 'none';
    sentenceBuilderAreaEl.innerHTML = ''; // For sentence building games
    sentenceBuilderAreaEl.style.display = 'none'; // Hide if not a sentence builder game

    sentenceClueEl.textContent = question.clue;
    sentenceClueEl.style.display = 'block';

    // Handle MCQ options
    if (question.options && question.options.length > 0) {
        mcqOptionsEl.innerHTML = '';
        mcqOptionsEl.style.display = 'grid'; // Show MCQ options
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'mcq-option';
            button.textContent = option[currentAnswerLanguage]; // Display option in preferred answer language
            button.dataset.value = option.en; // Store English value for checking
            button.addEventListener('click', () => handleMCQSelection(button, option));
            mcqOptionsEl.appendChild(button);
        });
    } else {
        mcqOptionsEl.innerHTML = 'No options for this question type.';
        mcqOptionsEl.style.display = 'none';
    }
}

/**
 * Handles MCQ option selection.
 * @param {HTMLButtonElement} selectedButton - The button element that was clicked.
 * @param {object} selectedOption - The selected option object.
 */
function handleMCQSelection(selectedButton, selectedOption) {
    const allOptions = Array.from(mcqOptionsEl.children);
    const correctAnswer = currentQuestion.answer.en; // Assuming English is the canonical answer

    // Disable all options to prevent multiple selections
    allOptions.forEach(btn => btn.disabled = true);

    if (selectedOption.en === correctAnswer) {
        selectedButton.classList.add('correct');
        resultSummaryEl.textContent = 'Correct!';
        profileManager.addXP(10); // Add XP for correct answer
        profileManager.incrementStreak(); // Increment streak
    } else {
        selectedButton.classList.add('incorrect');
        resultSummaryEl.textContent = `Incorrect. The correct answer was: ${currentQuestion.answer[currentAnswerLanguage] || currentQuestion.answer.en}`;
        profileManager.resetStreak(); // Reset streak for incorrect answer
    }

    resultSummaryEl.style.display = 'flex'; // Show result summary

    // Add a "Next Question" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Question';
    nextButton.addEventListener('click', () => {
        // Just reload a new random question for simplicity
        startGame(currentMode, currentLanguage);
    });
    resultSummaryEl.appendChild(nextButton);
}

// --- Event Listeners and Initializations ---

document.addEventListener('DOMContentLoaded', () => {
    // These initializations rely on app.js having set up window.profileID and profileManager.
    // They are called after DOMContentLoded to ensure all HTML elements are available.

    const initialGameData = profileManager.getGameData();

    // Initialize UI mode (normal/ascii)
    initUIControls(initialGameData.uiMode);
    document.getElementById('uiModeSelector').value = initialGameData.uiMode;
    document.getElementById('uiModeSelector').addEventListener('change', (e) => {
        initUIControls(e.target.value);
        profileManager.updateSetting('uiMode', e.target.value);
    });

    // Initialize text size (normal, senior-big, senior-very-big)
    initUIControls(initialGameData.textSize); // Re-use initUIControls for text size classes
    document.getElementById('textSizeSelector').value = initialGameData.textSize;
    document.getElementById('textSizeSelector').addEventListener('change', (e) => {
        initUIControls(e.target.value);
        profileManager.updateSetting('textSize', e.target.value);
    });

    // Initialize dark mode
    initThemeToggle(initialGameData.darkMode); // Pass initial dark mode state
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
        currentAnswerLanguage = e.target.value;
        profileManager.updateSetting('answerLanguage', e.target.value);
    });

    // --- Theme Selector Initialization and Event Listener ---
    // Populate the theme selector dropdown
    const availableThemes = getAvailableCustomThemes();
    availableThemes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = theme.name;
        themeSelector.appendChild(option);
    });

    // Set the initial value of the theme selector based on profile data
    // Note: app.js already applied the theme (including specific-day/random overrides)
    // Here we just set the dropdown to reflect what's active in the profile.
    // If a specific day theme is active, the dropdown might not match,
    // which is fine, as specific day themes are overriding.
    const savedThemePreference = initialGameData.currentTheme || 'default';
    themeSelector.value = savedThemePreference;

    // Add event listener for theme selection change
    themeSelector.addEventListener('change', (e) => {
        const selectedThemeId = e.target.value;
        profileManager.updateSetting('currentTheme', selectedThemeId); // Save user's preference
        // app.js handles the actual application of the theme on load.
        // For immediate visual update here, we also call applyTheme.
        // app.js will still re-evaluate on next load, applying specific day theme if applicable.
        const currentDarkModeState = document.body.classList.contains('dark'); // Keep current dark mode state
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
    wordRelicBtn.addEventListener('click', () => alert('Word Relic mode not yet implemented!')); // Placeholder
    wordSafariBtn.addEventListener('click', () => alert('Word Safari mode not yet implemented!')); // Placeholder

    // Initialize MCQ auto-check (if it needs initial setup, otherwise it handles events internally)
    initMCQAutoCheck(); // This function likely just attaches its own event listeners

    console.log('[main.js] All UI and game modules initialized.');
});
