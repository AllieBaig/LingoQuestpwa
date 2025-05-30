
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// gameCore.js
// Purpose: Contains the core game logic for starting games, displaying questions,
// and handling user interactions like MCQ selections.
// Timestamp: 2025-05-30 05:25:00 AM BST (Logging events to eventLogger.js)

// CHANGED: Import logEvent from eventLogger.js
import { logEvent } from './eventLogger.js';
import { loadQuestionPool, getNextQuestion, markQuestionAsAnswered, resetAnsweredQuestionsTracker } from './questionPool.js';

// Get DOM elements
const gameModesSection = document.getElementById('gameModes');
const gameContainerSection = document.getElementById('gameContainer');
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
    logEvent(`Starting game mode: ${mode}, Language: ${language}`, 'game', { mode, language }); // Event log
    currentMode = mode;
    currentLanguage = language;
    
    currentAnswerLanguage = document.getElementById('answerLanguageSelector').value || 'en'; 
    currentDifficulty = document.getElementById('difficultySelector').value || 'easy'; 

    if (!gameModesSection || !gameContainerSection || !sentenceClueEl || !mcqOptionsEl) {
        console.error('[gameCore.js] One or more essential DOM elements for game display are missing!');
        logEvent('Essential DOM elements missing for game display!', 'error', { elementsChecked: ['gameModesSection', 'gameContainerSection', 'sentenceClueEl', 'mcqOptionsEl'] }); // Event log for error
        return;
    }

    gameModesSection.style.display = 'none';
    gameContainerSection.style.display = 'flex';
    logEvent('UI sections visibility updated: Game mode hidden, Game container shown.', 'ui'); // Event log

    try {
        await loadQuestionPool();
        logEvent('Question pool (vocabulary) loaded.', 'game'); // Event log
        
        resetAnsweredQuestionsTracker(); 
        logEvent('Answered questions tracker and session vocabulary reset.', 'game'); // Event log

        currentQuestion = getNextQuestion(currentDifficulty, currentAnswerLanguage);

        if (currentQuestion) {
            logEvent(`Displaying question: ${currentQuestion.clue}`, 'game', { questionId: currentQuestion.id }); // Event log
            displayQuestion(currentQuestion);
        } else {
            sentenceClueEl.textContent = 'No questions available for this mode/language/difficulty.';
            mcqOptionsEl.innerHTML = '';
            console.warn('[gameCore.js] No questions loaded or available for display!');
            logEvent('No questions loaded or available for display!', 'game', { mode, language, difficulty: currentDifficulty, answerLanguage: currentAnswerLanguage }); // Event log
        }
    } catch (error) {
        console.error('[gameCore.js] Error during game start or question loading:', error);
        logEvent(`Error during game start or question loading: ${error.message}`, 'error', { error: error.message }); // Event log for error
        sentenceClueEl.textContent = 'Error loading game data. Please try again.';
        mcqOptionsEl.innerHTML = '';
    }
}

/**
 * Displays the current question on the UI elements.
 * @param {object} question - The question object to display.
 */
function displayQuestion(question) {
    if (!question || !sentenceClueEl || !mcqOptionsEl || !resultSummaryEl || !sentenceBuilderAreaEl) {
        console.error('[gameCore.js] Missing DOM elements for display or invalid question.');
        logEvent('Missing DOM elements for display or invalid question object!', 'error', { questionObject: question }); // Event log for error
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
                logEvent(`MCQ option "${optionText}" clicked.`, 'click', { questionId: question.id, selectedOption: optionText }); // Event log
                handleMCQSelection(button, optionText);
            });
            mcqOptionsEl.appendChild(button);
        });
    } else {
        mcqOptionsEl.innerHTML = 'No options for this question type.';
        mcqOptionsEl.style.display = 'none';
        logEvent('No options generated for current question.', 'game', { questionId: question.id }); // Event log
    }
}

/**
 * Handles MCQ option selection.
 * @param {HTMLButtonElement} selectedButton - The button element that was clicked.
 * @param {string} selectedOptionText - The text of the selected option.
 */
function handleMCQSelection(selectedButton, selectedOptionText) {
    if (!mcqOptionsEl || !resultSummaryEl || !currentQuestion) {
        console.error('[gameCore.js] Missing DOM elements or current question for MCQ selection handler.');
        logEvent('Critical elements missing for MCQ selection handling!', 'error'); // Event log for error
        return;
    }

    const allOptions = Array.from(mcqOptionsEl.children);
    const correctAnswerText = currentQuestion.correctAnswer;

    allOptions.forEach(btn => btn.disabled = true);

    if (selectedOptionText === correctAnswerText) {
        selectedButton.classList.add('correct');
        resultSummaryEl.textContent = 'Correct!';
        logEvent(`User answered correctly. Selected: "${selectedOptionText}", Correct: "${correctAnswerText}"`, 'game', { questionId: currentQuestion.id, result: 'correct' }); // Event log
    } else {
        selectedButton.classList.add('incorrect');
        resultSummaryEl.textContent = `Incorrect. The correct answer was: ${correctAnswerText}`;
        logEvent(`User answered incorrectly. Selected: "${selectedOptionText}", Correct: "${correctAnswerText}"`, 'game', { questionId: currentQuestion.id, result: 'incorrect' }); // Event log
    }

    markQuestionAsAnswered(currentQuestion.id);
    resultSummaryEl.style.display = 'flex';

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Question';
    nextButton.addEventListener('click', () => {
        logEvent('Next Question button clicked.', 'click'); // Event log
        const nextQuestion = getNextQuestion(currentDifficulty, currentAnswerLanguage);
        if (nextQuestion) {
            currentQuestion = nextQuestion;
            displayQuestion(currentQuestion);
        } else {
            logEvent('Session complete: No more questions.', 'game'); // Event log
            sentenceClueEl.textContent = 'Session complete! No more questions.';
            mcqOptionsEl.innerHTML = '';
            resultSummaryEl.innerHTML = '';

            const restartButton = document.createElement('button');
            restartButton.textContent = 'Start New Session';
            restartButton.addEventListener('click', () => {
                logEvent('Start New Session button clicked.', 'click'); // Event log
                startGame(currentMode, currentLanguage);
            });
            resultSummaryEl.appendChild(restartButton);

            const backButton = document.createElement('button');
            backButton.textContent = 'Back to Modes';
            backButton.addEventListener('click', () => {
                logEvent('Back to Modes button clicked.', 'click'); // Event log
                gameContainerSection.style.display = 'none';
                gameModesSection.style.display = 'flex';
            });
            resultSummaryEl.appendChild(backButton);
        }
    });
    resultSummaryEl.appendChild(nextButton);
}
