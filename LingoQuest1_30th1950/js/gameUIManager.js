
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// gameUIManager.js
// Purpose: Manages the specific UI elements within the game container (question, options, results).
// Usage: Imported by gameCore.js.
// Timestamp: 2025-05-30 09:15:00 AM BST

import { logEvent } from './eventLogger.js';
import { uiManager } from './uiManager.js'; // For "Back to Main Menu" navigation
import { getNextQuestion, markQuestionAsAnswered } from './questionPool.js'; // For next question logic

// DOM elements specific to the game UI
const sentenceClueEl = document.getElementById('sentenceClue');
const sentenceBuilderAreaEl = document.getElementById('sentenceBuilderArea');
const mcqOptionsEl = document.getElementById('mcqOptions');
const resultSummaryEl = document.getElementById('resultSummary');

// Internal reference to the current question and game context passed from gameCore
let _currentQuestion = null;
let _currentDifficulty = null;
let _currentAnswerLanguage = null;
let _currentMode = null; // To pass back to startGame for restart

// Callback function to inform gameCore that a new session should start
let _onNewSessionRequestedCallback = null;

export const gameUIManager = {
    /**
     * Initializes the UI manager with necessary game context and callbacks.
     * @param {object} context - Object containing current game state (difficulty, answerLanguage, mode).
     * @param {function} onNewSessionRequested - Callback function to call when 'Start New Session' is clicked.
     */
    init(context, onNewSessionRequested) {
        _currentDifficulty = context.difficulty;
        _currentAnswerLanguage = context.answerLanguage;
        _currentMode = context.mode;
        _onNewSessionRequestedCallback = onNewSessionRequested;
        logEvent('[gameUIManager.js] Initialized with game context.', 'init', context);
    },

    /**
     * Sets the current question for the UI manager.
     * @param {object} question - The question object to manage.
     */
    setCurrentQuestion(question) {
        _currentQuestion = question;
        logEvent(`[gameUIManager.js] Current question set: ${_currentQuestion ? _currentQuestion.id : 'null'}`, 'debug');
    },

    /**
     * Displays the current question on the UI elements.
     * @param {object} question - The question object to display.
     */
    displayQuestion(question) {
        if (!question || !sentenceClueEl || !mcqOptionsEl || !resultSummaryEl || !sentenceBuilderAreaEl) {
            console.error('[gameUIManager.js] Missing DOM elements for display or invalid question.');
            logEvent('Missing DOM elements for display or invalid question object!', 'error', { questionObject: question });
            return;
        }

        this.setCurrentQuestion(question); // Update internal current question

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
                    this._handleMCQSelection(button, optionText); // Call internal handler
                });
                mcqOptionsEl.appendChild(button);
            });
        } else {
            mcqOptionsEl.innerHTML = 'No options for this question type.';
            mcqOptionsEl.style.display = 'none';
            logEvent('No options generated for current question.', 'game', { questionId: question.id });
        }

        this._addGameControlButtons(false); // Add general game control buttons
    },

    /**
     * Handles MCQ option selection. This is an internal function.
     * @param {HTMLButtonElement} selectedButton - The button element that was clicked.
     * @param {string} selectedOptionText - The text of the selected option.
     */
    _handleMCQSelection(selectedButton, selectedOptionText) {
        if (!mcqOptionsEl || !resultSummaryEl || !_currentQuestion) {
            console.error('[gameUIManager.js] Missing DOM elements or current question for MCQ selection handler.');
            logEvent('Critical elements missing for MCQ selection handling!', 'error');
            return;
        }

        const allOptions = Array.from(mcqOptionsEl.children);
        const correctAnswerText = _currentQuestion.correctAnswer;

        allOptions.forEach(btn => btn.disabled = true);

        if (selectedOptionText === correctAnswerText) {
            selectedButton.classList.add('correct');
            resultSummaryEl.textContent = 'Correct!';
            logEvent(`User answered correctly. Selected: "${selectedOptionText}", Correct: "${correctAnswerText}"`, 'game', { questionId: _currentQuestion.id, result: 'correct' });
        } else {
            selectedButton.classList.add('incorrect');
            resultSummaryEl.textContent = `Incorrect. The correct answer was: ${correctAnswerText}`;
            logEvent(`User answered incorrectly. Selected: "${selectedOptionText}", Correct: "${correctAnswerText}"`, 'game', { questionId: _currentQuestion.id, result: 'incorrect' });
        }

        markQuestionAsAnswered(_currentQuestion.id);
        resultSummaryEl.style.display = 'flex';

        this._addGameControlButtons(true); // Add next/restart/back buttons after answer
    },

    /**
     * Adds dynamic buttons to the game container, such as "Next Question", "Start New Session", and "Back to Main Menu".
     * @param {boolean} showNextButton - If true, show Next Question / Start New Session.
     */
    _addGameControlButtons(showNextButton) {
        let buttonContainer = document.getElementById('gameControlButtons');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.id = 'gameControlButtons';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.marginTop = '20px';
            // Append it to a logical parent like gameContainer, or resultSummaryEl for post-answer.
            // For general controls, appending to gameContainer is often better if it's always visible.
            document.getElementById('gameContainer').appendChild(buttonContainer);
        }
        buttonContainer.innerHTML = ''; // Clear previous buttons

        if (showNextButton) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next Question';
            nextButton.addEventListener('click', () => {
                logEvent('Next Question button clicked.', 'click');
                const nextQuestion = getNextQuestion(_currentDifficulty, _currentAnswerLanguage);
                if (nextQuestion) {
                    this.displayQuestion(nextQuestion); // Display next question
                } else {
                    logEvent('Session complete: No more questions.', 'game');
                    this._displaySessionComplete(); // Show session complete screen
                }
            });
            buttonContainer.appendChild(nextButton);
        }

        const backToMainMenuButton = document.createElement('button');
        backToMainMenuButton.textContent = 'Back to Main Menu';
        backToMainMenuButton.addEventListener('click', () => {
            logEvent('Back to Main Menu button clicked from game.', 'click');
            uiManager.showMainMenu(); // Use uiManager to navigate
            this._cleanupGameUI(); // Clean up the game UI elements when going back
        });
        buttonContainer.appendChild(backToMainMenuButton);
    },

    /**
     * Displays the session complete message and relevant buttons.
     */
    _displaySessionComplete() {
        if (!sentenceClueEl || !mcqOptionsEl || !resultSummaryEl) return;

        sentenceClueEl.textContent = 'Session complete! No more questions.';
        mcqOptionsEl.innerHTML = '';
        resultSummaryEl.innerHTML = ''; // Clear existing result text
        resultSummaryEl.style.display = 'flex';

        let buttonContainer = document.getElementById('gameControlButtons');
        if (!buttonContainer) { // Ensure button container exists for this case
            buttonContainer = document.createElement('div');
            buttonContainer.id = 'gameControlButtons';
            document.getElementById('gameContainer').appendChild(buttonContainer);
        }
        buttonContainer.innerHTML = ''; // Clear existing buttons

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Start New Session';
        restartButton.addEventListener('click', () => {
            logEvent('Start New Session button clicked.', 'click');
            if (_onNewSessionRequestedCallback) {
                _onNewSessionRequestedCallback(_currentMode, _currentAnswerLanguage); // Callback to gameCore
            } else {
                console.error('[gameUIManager.js] No callback for new session request.');
                uiManager.showMainMenu(); // Fallback to main menu
            }
        });
        buttonContainer.appendChild(restartButton);

        const backToModesButton = document.createElement('button');
        backToModesButton.textContent = 'Back to Modes';
        backToModesButton.addEventListener('click', () => {
            logEvent('Back to Modes button clicked (End Session).', 'click');
            uiManager.showMainMenu(); // Use uiManager to navigate
            this._cleanupGameUI(); // Clean up
        });
        buttonContainer.appendChild(backToModesButton);
    },

    /**
     * Cleans up the game UI elements when leaving the game.
     */
    _cleanupGameUI() {
        if (sentenceClueEl) sentenceClueEl.textContent = '';
        if (sentenceBuilderAreaEl) sentenceBuilderAreaEl.innerHTML = '';
        if (mcqOptionsEl) mcqOptionsEl.innerHTML = '';
        if (resultSummaryEl) resultSummaryEl.innerHTML = '';
        const buttonContainer = document.getElementById('gameControlButtons');
        if (buttonContainer) buttonContainer.innerHTML = '';
        logEvent('[gameUIManager.js] Game UI elements cleaned up.', 'ui');
    }
};
