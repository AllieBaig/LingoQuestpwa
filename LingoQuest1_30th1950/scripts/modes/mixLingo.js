
// mixLingo.js
// Purpose: Implements the MixLingo game mode (English sentence with foreign word blank, MCQ).
// Usage: Called by main.js to initialize the game mode.
// Timestamp: 2025-05-28
// License: MIT License (https://opensource.org/licenses/MIT)

import { getNextQuestion, markQuestionAsAnswered } from '../questionPool.js';
import { renderMCQOptions, resetMCQOptions } from '../mcqAutoCheck.js';
import { addXP, incrementStreak, resetStreak } from '../xpTracker.js';

let currentQuestion = null;
let sentenceClueEl;
let sentenceBuilderAreaEl; // Not strictly used for building, but can show the full sentence
let mcqOptionsEl;
let resultSummaryEl;

/**
 * Initializes the MixLingo game mode.
 * @param {HTMLElement} clueEl - The DOM element for displaying the sentence clue.
 * @param {HTMLElement} builderEl - The DOM element for displaying the full sentence with blank.
 * @param {HTMLElement} mcqEl - The DOM element for MCQ options.
 * @param {HTMLElement} summaryEl - The DOM element for result summary.
 * @param {string} lang - The language for the blank (e.g., 'fr', 'es', 'de, 'it').
 */
export function initMixLingo(clueEl, builderEl, mcqEl, summaryEl, lang) {
    sentenceClueEl = clueEl;
    sentenceBuilderAreaEl = builderEl;
    mcqOptionsEl = mcqEl;
    resultSummaryEl = summaryEl;

    console.log(`Starting MixLingo mode for blank in ${lang}.`);
    startGameRound();
}

/**
 * Starts a new game round.
 */
function startGameRound() {
    currentQuestion = getNextQuestion();

    if (!currentQuestion) {
        endGame();
        return;
    }

    resetMCQOptions(mcqOptionsEl); // Clear previous MCQ options
    sentenceBuilderAreaEl.innerHTML = ''; // Clear previous builder area
    resultSummaryEl.textContent = ''; // Clear previous summary

    // MixLingo clue will contain the sentence with a blank.
    // Example: "The cat sat on the ____ (French: chat)."
    sentenceClueEl.textContent = currentQuestion.clue;

    // Render MCQ options
    renderMCQOptions(mcqOptionsEl, currentQuestion.options, currentQuestion.correctAnswer, handleMCQSelection);
}

/**
 * Handles the selection of an MCQ option.
 * @param {boolean} isCorrect - True if the selected option is correct, false otherwise.
 * @param {string} selectedOption - The text of the selected option.
 */
function handleMCQSelection(isCorrect, selectedOption) {
    if (isCorrect) {
        resultSummaryEl.textContent = 'Correct! 🎉';
        addXP(15); // Award XP
        incrementStreak(); // Increment streak
        markQuestionAsAnswered(currentQuestion.id); // Mark as answered
    } else {
        resultSummaryEl.textContent = `Incorrect. The correct word was: "${currentQuestion.correctAnswer}"`;
        resetStreak(); // Reset streak on incorrect answer
    }

    // Add a "Next Question" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Question';
    nextButton.classList.add('next-question-btn');
    nextButton.addEventListener('click', startGameRound);
    resultSummaryEl.appendChild(nextButton);
}

/**
 * Ends the game, displaying a summary.
 */
function endGame() {
    sentenceClueEl.textContent = 'MixLingo Session Over!';
    sentenceBuilderAreaEl.innerHTML = '';
    resetMCQOptions(mcqOptionsEl);
    resultSummaryEl.textContent = 'You have completed all available MixLingo questions.';
    resetStreak(); // Reset streak at end of game session

    // Add a button to restart or go back to mode selection
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Play Again';
    restartButton.addEventListener('click', () => {
        window.location.reload(); // Simple reload to re-initialize
    });
    resultSummaryEl.appendChild(restartButton);
}
