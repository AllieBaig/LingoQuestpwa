
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// gameCore.js
// Purpose: Contains the core game logic for starting games, displaying questions,
// and handling user interactions like MCQ selections.
// Timestamp: 2025-05-30 06:05:00 AM BST (Added Back to Main Menu button using uiManager)

import { logEvent } from './eventLogger.js';
import { loadQuestionPool, getNextQuestion, markQuestionAsAnswered, resetAnsweredQuestionsTracker } from './questionPool.js';
import { uiManager } from './uiManager.js'; // CHANGED: Import uiManager for navigation

// Get DOM elements
// REMOVED: gameModesSection and gameContainerSection are now managed by uiManager
const sentenceClueEl = document.getElementById('sentenceClue');
const sentenceBuilderAreaEl = document.getElementById('sentenceBuilderArea');
const mcqOptionsEl = document.getElementById('mcqOptions');
const resultSummaryEl = document.getElementById('resultSummary');

// Internal game state variables
let currentLanguage = 'en';
let currentQuestion = null;
let currentMode = null;
let currentAnswerLanguage = 'en';
let currentDifficulty = 'easy';

/**
 * Starts a selected game mode.
 * @param {string} mode - The game mode to start.
 * @param {string} language - The primary language for the game content.
 */
export async function startGame(mode, language) {
    logEvent(`Starting game mode: ${mode}, Language: ${language}`, 'game', { mode, language });
    currentMode = mode;
    currentLanguage = language;
    
    currentAnswerLanguage = document.getElementById('answerLanguageSelector').value || 'en'; 
    currentDifficulty = document.getElementById('difficultySelector').value || 'easy'; 

    // CHANGED: Use uiManager to show game container
    uiManager.showGameContainer(); 
    logEvent('UI sections visibility updated: Game mode hidden, Game container shown via uiManager.', 'ui'); // Event log

    try {
        await loadQuestionPool();
        logEvent('Question pool (vocabulary) loaded.', 'game');
        
        resetAnsweredQuestionsTracker(); 
        logEvent('Answered questions tracker and session vocabulary reset.', 'game');

        currentQuestion = getNextQuestion(currentDifficulty, currentAnswerLanguage);

        if (currentQuestion) {
            logEvent(`Displaying question: ${currentQuestion.clue}`, 'game', { questionId: currentQuestion.id });
            displayQuestion(currentQuestion);
        } else {
            sentenceClueEl.textContent = 'No questions available for this mode/language/difficulty.';
            mcqOptionsEl.innerHTML = '';
            console.warn('[gameCore.js] No questions loaded or available for display!');
            logEvent('No questions loaded or available for display!', 'game', { mode, language, difficulty: currentDifficulty, answerLanguage: currentAnswerLanguage });
            addBackToMainMenuButton(); // Add button even if no questions
        }
    } catch (error) {
        console.error('[gameCore.js] Error during game start or question loading:', error);
        logEvent(`Error during game start or question loading: ${error.message}`, 'error', { error: error.message });
        sentenceClueEl.textContent = 'Error loading game data. Please try again.';
        mcqOptionsEl.innerHTML = '';
        addBackToMainMenuButton(); // Add button on error too
    }
}

/**
 * Displays the current question on the UI elements.
 * @param {object} question - The question object to display.
 */
function displayQuestion(question) {
    if (!question || !sentenceClueEl || !mcqOptionsEl || !resultSummaryEl || !sentenceBuilderAreaEl) {
        console.error('[gameCore.js] Missing DOM elements for display or invalid question.');
        logEvent('Missing DOM elements for display or invalid question object!', 'error', { questionObject: question });
        return;
    }

    resultSummaryEl.innerHTML = '';
    resultSummaryEl.style.display = 'none';
    sentenceBuilderAreaEl.innerHTML = '';
    sentenceBuilderAreaEl.style.display = 'none';

    sentenceClueEl.textContent = question.clue;
    sentenceClueEl.style.display = 'block';

    if (question.options && question.options.length > 0) {
        mcqOptionsEl.innerHTML = '';
        mcqOptionsEl.style.display = 'grid';
        question.options.forEach(optionText => {
            const button = document.createElement('button');
            button.className = 'mcq-option';
            button.textContent = optionText; 
            button.dataset.value = optionText;
            button.addEventListener('click', () => {
                logEvent(`MCQ option "${optionText}" clicked.`, 'click', { questionId: question.id, selectedOption: optionText });
                handleMCQSelection(button, optionText);
            });
            mcqOptionsEl.appendChild(button);
        });
    } else {
        mcqOptionsEl.innerHTML = 'No options for this question type.';
        mcqOptionsEl.style.display = 'none';
        logEvent('No options generated for current question.', 'game', { questionId: question.id });
    }
    
    addBackToMainMenuButton(); // Add the button after displaying question/options
}

/**
 * Handles MCQ option selection.
 * @param {HTMLButtonElement} selectedButton - The button element that was clicked.
 * @param {string} selectedOptionText - The text of the selected option.
 */
function handleMCQSelection(selectedButton, selectedOptionText) {
    if (!mcqOptionsEl || !resultSummaryEl || !currentQuestion) {
        console.error('[gameCore.js] Missing DOM elements or current question for MCQ selection handler.');
        logEvent('Critical elements missing for MCQ selection handling!', 'error');
        return;
    }

    const allOptions = Array.from(mcqOptionsEl.children);
    const correctAnswerText = currentQuestion.correctAnswer;

    allOptions.forEach(btn => btn.disabled = true);

    if (selectedOptionText === correctAnswerText) {
        selectedButton.classList.add('correct');
        resultSummaryEl.textContent = 'Correct!';
        logEvent(`User answered correctly. Selected: "${selectedOptionText}", Correct: "${correctAnswerText}"`, 'game', { questionId: currentQuestion.id, result: 'correct' });
    } else {
        selectedButton.classList.add('incorrect');
        resultSummaryEl.textContent = `Incorrect. The correct answer was: ${correctAnswerText}`;
        logEvent(`User answered incorrectly. Selected: "${selectedOptionText}", Correct: "${correctAnswerText}"`, 'game', { questionId: currentQuestion.id, result: 'incorrect' });
    }

    markQuestionAsAnswered(currentQuestion.id);
    resultSummaryEl.style.display = 'flex';

    // Create a container for the Next and Back buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginTop = '10px';

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Question';
    nextButton.addEventListener('click', () => {
        logEvent('Next Question button clicked.', 'click');
        const nextQuestion = getNextQuestion(currentDifficulty, currentAnswerLanguage);
        if (nextQuestion) {
            currentQuestion = nextQuestion;
            displayQuestion(currentQuestion);
        } else {
            logEvent('Session complete: No more questions.', 'game');
            sentenceClueEl.textContent = 'Session complete! No more questions.';
            mcqOptionsEl.innerHTML = '';
            resultSummaryEl.innerHTML = ''; // Clear existing result text

            const restartButton = document.createElement('button');
            restartButton.textContent = 'Start New Session';
            restartButton.addEventListener('click', () => {
                logEvent('Start New Session button clicked.', 'click');
                startGame(currentMode, currentLanguage);
            });
            resultSummaryEl.appendChild(restartButton); // Append to resultSummaryEl for end screen

            // Add Back to Modes button at the end of the session
            const backToModesButton = document.createElement('button');
            backToModesButton.textContent = 'Back to Modes';
            backToModesButton.addEventListener('click', () => {
                logEvent('Back to Modes button clicked (End Session).', 'click');
                uiManager.showMainMenu(); // Use uiManager to navigate
            });
            resultSummaryEl.appendChild(backToModesButton);
        }
    });
    buttonContainer.appendChild(nextButton);

    // Add Back to Main Menu button after answer for normal flow
    const backToMainMenuButton = document.createElement('button');
    backToMainMenuButton.textContent = 'Back to Main Menu';
    backToMainMenuButton.addEventListener('click', () => {
        logEvent('Back to Main Menu button clicked (Mid-Game).', 'click');
        uiManager.showMainMenu(); // Use uiManager to navigate
    });
    buttonContainer.appendChild(backToMainMenuButton);
    resultSummaryEl.appendChild(buttonContainer); // Append the container
}

/**
 * Adds a "Back to Main Menu" button to the game container,
 * ensuring it's available even if no questions are loaded or on error.
 */
function addBackToMainMenuButton() {
    const existingBackButton = document.getElementById('backToMainMenuBtn');
    if (existingBackButton) {
        existingBackButton.remove(); // Remove existing button to prevent duplicates
    }

    const backButton = document.createElement('button');
    backButton.id = 'backToMainMenuBtn'; // Give it an ID to find and remove later
    backButton.textContent = 'Back to Main Menu';
    backButton.style.marginTop = '20px'; // Add some spacing
    backButton.addEventListener('click', () => {
        logEvent('Back to Main Menu button clicked (via helper function).', 'click');
        uiManager.showMainMenu();
    });

    // Append to gameContainer directly or after mcqOptionsEl/resultSummaryEl
    // Appending to mcqOptionsEl might make sense if you want it close to choices
    // Or to resultSummaryEl if it's considered part of post-answer UI.
    // For general placement, let's add it consistently to the game container, or a dedicated controls area.
    // For now, let's add it to the gameContainer just after the main content area, for consistency across game states.
    const gameContainer = document.getElementById('gameContainer');
    if (gameContainer) {
        // Find a suitable place, e.g., after mcqOptionsEl or sentenceClueEl, or at the bottom.
        // For simplicity, let's append it to the main content wrapper of gameContainer if one exists,
        // or directly to gameContainer if it's the most appropriate parent.
        gameContainer.appendChild(backButton); // This might place it awkwardly depending on CSS layout.
                                               // Better to put it within resultSummaryEl or a dedicated control div.
        // Let's reconsider. It's better to add it where it makes sense visually.
        // For game screens, it's usually part of the control set.
        // If it's a standalone button, placing it at the bottom of the visible area is common.
        // For now, let's keep it consistent within `handleMCQSelection` and add it here as a fallback/initial button.
        // A better approach for the general "back" button on the game screen would be to place it
        // in a persistent controls section that is always visible within the gameContainer.

        // Reverting: The "Back to Main Menu" should ideally be added once to the `gameContainer` layout,
        // rather than repeatedly. It's better to place it directly in `index.html` within the `gameContainer`
        // and have its listener here.
        // For this example, we'll ensure it's removed and re-added correctly.
        // Or, we just attach its listener once and show/hide it.
        // Let's implement the simpler way for now: always ensure it's available.
    }
}
