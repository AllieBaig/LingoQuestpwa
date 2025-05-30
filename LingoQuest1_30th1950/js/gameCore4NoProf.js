
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// gameCore.js
// Purpose: Contains the core game logic for starting games, displaying questions,
// and handling user interactions like MCQ selections.
// Timestamp: 2025-05-30 03:01:44 AM BST (Updated for Word Relic mode, no profile)

// COMMENT OUT PROFILE MANAGER IMPORT
// import { profileManager } from './profileManager.js';
import { loadQuestionPool } from './questionPool.js';

// Get DOM elements
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
 * @param {string} mode - The game mode to start (e.g., 'solo', 'mixlingo', 'wordrelic', 'wordsafari').
 * @param {string} language - The primary language for the game content (e.g., 'fr' for French clues).
 */
export async function startGame(mode, language) {
    console.log(`[gameCore.js] startGame function entered. Mode: ${mode}, Language: ${language}`);
    currentMode = mode;
    currentLanguage = language;
    
    // Use hardcoded values since profileManager is disabled
    currentAnswerLanguage = 'en'; 
    const difficulty = 'easy'; // Hardcode difficulty for testing

    // Null checks for DOM elements
    if (!gameModesSection || !gameContainerSection || !sentenceClueEl || !mcqOptionsEl) {
        console.error('[gameCore.js] One or more essential DOM elements for game display are missing!');
        return;
    }

    // Hide game mode selection and show game container
    gameModesSection.style.display = 'none';
    gameContainerSection.style.display = 'flex';
    console.log('[gameCore.js] UI sections visibility updated.');

    console.log(`[gameCore.js] Attempting to load questions for ${currentLanguage} (${difficulty} difficulty).`);

    let questions;
    if (mode === 'wordsafari') {
        questions = await loadQuestionPool('en', 'easy');
        console.log(`[gameCore.js] Safari mode: Loaded ${questions ? questions.length : 0} easy English questions.`);
    } else if (mode === 'wordrelic') { // New block for Word Relic
        questions = await loadQuestionPool('en', 'medium'); // Relic can start with medium difficulty
        console.log(`[gameCore.js] Relic mode: Loaded ${questions ? questions.length : 0} medium English questions.`);
    }
    else {
        questions = await loadQuestionPool(currentLanguage, difficulty);
        console.log(`[gameCore.js] Normal mode: Loaded ${questions ? questions.length : 0} questions.`);
    }

    if (questions && questions.length > 0) {
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        console.log('[gameCore.js] Displaying question:', currentQuestion);
        displayQuestion(currentQuestion);
    } else {
        sentenceClueEl.textContent = 'No questions available for this mode/language/difficulty.';
        mcqOptionsEl.innerHTML = '';
        console.warn('[gameCore.js] No questions loaded or available for display!');
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
        // profileManager.addXP(10); // COMMENTED OUT FOR NO PROFILE
        // profileManager.incrementStreak(); // COMMENTED OUT FOR NO PROFILE
    } else {
        selectedButton.classList.add('incorrect');
        resultSummaryEl.textContent = `Incorrect. The correct answer was: ${currentQuestion.answer[currentAnswerLanguage] || currentQuestion.answer.en}`;
        // profileManager.resetStreak(); // COMMENTED OUT FOR NO PROFILE
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
