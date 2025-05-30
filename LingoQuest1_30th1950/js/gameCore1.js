
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// gameCore.js
// Purpose: Contains the core game logic for starting games, displaying questions,
// and handling user interactions like MCQ selections.
// Timestamp: 2025-05-29 08:52:00 PM BST

import { profileManager } from './profileManager.js';
import { loadQuestionPool } from './questionPool.js'; // Assuming this module exists for questions

// Get DOM elements (these will be passed from main.js or globally accessible via exports if preferred)
// For now, let's assume they are passed or globally accessible.
// A more robust pattern might be to pass them as arguments or initialize this module with them.
const gameModesSection = document.getElementById('gameModes');
const gameContainerSection = document.getElementById('gameContainer');
const sentenceClueEl = document.getElementById('sentenceClue');
const sentenceBuilderAreaEl = document.getElementById('sentenceBuilderArea');
const mcqOptionsEl = document.getElementById('mcqOptions');
const resultSummaryEl = document.getElementById('resultSummary');

// Internal game state variables
let currentLanguage = 'en'; // Primary language for the game content
let currentQuestion = null;
let currentMode = null;
let currentAnswerLanguage = 'en'; // Language for the answers (e.g., French clue, English answer options)

/**
 * Starts a selected game mode.
 * @param {string} mode - The game mode to start (e.g., 'solo', 'mixlingo').
 * @param {string} language - The primary language for the game content (e.g., 'fr' for French clues).
 */
export async function startGame(mode, language) {
    console.log(`[gameCore.js] Starting game mode: ${mode} in language: ${language}`);
    currentMode = mode;
    currentLanguage = language;
    // Get the preferred answer language from the user's profile
    currentAnswerLanguage = profileManager.getGameData().answerLanguage || 'en'; 

    // Hide game mode selection and show game container
    if (gameModesSection) gameModesSection.style.display = 'none';
    if (gameContainerSection) gameContainerSection.style.display = 'flex';

    // Load questions for the selected language/difficulty
    const difficulty = profileManager.getGameData().difficulty;
    const questions = await loadQuestionPool(currentLanguage, difficulty);
    if (questions && questions.length > 0) {
        console.log(`[gameCore.js] Loaded ${questions.length} questions for ${currentLanguage} (${difficulty} difficulty).`);
        // Pick a random question for now
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        displayQuestion(currentQuestion);
    } else {
        if (sentenceClueEl) sentenceClueEl.textContent = 'No questions available for this mode/language/difficulty.';
        if (mcqOptionsEl) mcqOptionsEl.innerHTML = '';
        console.warn('[gameCore.js] No questions loaded!');
    }
}

/**
 * Displays the current question on the UI elements.
 * @param {object} question - The question object to display.
 */
function displayQuestion(question) {
    if (!question || !sentenceClueEl || !mcqOptionsEl || !resultSummaryEl || !sentenceBuilderAreaEl) {
        console.error('[gameCore.js] Missing DOM elements for display or invalid question.');
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
 * Handles MCQ option selection, checks answer, updates profile, and displays result.
 * @param {HTMLButtonElement} selectedButton - The button element that was clicked.
 * @param {object} selectedOption - The selected option object.
 */
function handleMCQSelection(selectedButton, selectedOption) {
    if (!mcqOptionsEl || !resultSummaryEl || !currentQuestion) {
        console.error('[gameCore.js] Missing DOM elements or current question for MCQ selection.');
        return;
    }

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
        // Display correct answer in the currently selected answer language
        resultSummaryEl.textContent = `Incorrect. The correct answer was: ${currentQuestion.answer[currentAnswerLanguage] || currentQuestion.answer.en}`;
        profileManager.resetStreak(); // Reset streak for incorrect answer
    }

    resultSummaryEl.style.display = 'flex'; // Show result summary

    // Add a "Next Question" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Question';
    nextButton.addEventListener('click', () => {
        // Just reload a new random question for simplicity
        startGame(currentMode, currentLanguage); // Continue with the same mode and language
    });
    resultSummaryEl.appendChild(nextButton);
}
