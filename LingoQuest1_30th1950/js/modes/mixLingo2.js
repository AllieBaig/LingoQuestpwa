
// mixLingo.js
// Purpose: Implements the MixLingo game mode logic.
// Usage: Imported by main.js to start the game.
// Timestamp: 2025-05-29 08:22 AM BST
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

import { loadQuestionPool, getNextQuestion, markQuestionAsAnswered } from '../../js/questionPool.js';
import { renderMCQOptions, resetMCQOptions } from '../../js/mcqAutoCheck.js';
import { addXP, incrementStreak, resetStreak } from '../../js/xpTracker.js';

// UI Elements
const sentenceClueEl = document.getElementById('sentenceClue');
const mcqOptionsEl = document.getElementById('mcqOptions');
const resultSummaryEl = document.getElementById('resultSummary');

// Game state variables
let currentQuestion = null;
let currentLanguage = 'en';
let currentDifficulty = 'easy'; // Default difficulty

/**
 * Initializes the MixLingo game mode.
 * @param {string} lang - The language for the questions (e.g., 'en').
 * @param {string} difficulty - The chosen difficulty level ('easy', 'medium', 'hard').
 */
export async function init(lang, difficulty) {
    console.log(`Starting MixLingo in ${lang} with ${difficulty} difficulty.`);
    currentLanguage = lang;
    currentDifficulty = difficulty; // Store the chosen difficulty
    await loadQuestionPool('mixlingo', currentLanguage);
    resultSummaryEl.innerHTML = ''; // Clear previous results
    displayNextQuestion();
}

/**
 * Displays the next question in the game.
 */
function displayNextQuestion() {
    currentQuestion = getNextQuestion(currentDifficulty); // Pass difficulty to getNextQuestion
    if (currentQuestion) {
        sentenceClueEl.textContent = currentQuestion.clue;
        resetMCQOptions(mcqOptionsEl); // Clear previous options
        renderMCQOptions(
            mcqOptionsEl,
            currentQuestion.options,
            currentQuestion.correctAnswer,
            handleOptionSelection
        );
        resultSummaryEl.style.display = 'none'; // Hide result summary
        mcqOptionsEl.style.display = 'grid'; // Show MCQ options
    } else {
        endGame();
    }
}

/**
 * Handles the user's selection of an MCQ option.
 * @param {boolean} isCorrect - True if the selected option is correct.
 * @param {string} selectedAnswer - The text of the selected answer.
 */
function handleOptionSelection(isCorrect, selectedAnswer) {
    mcqOptionsEl.style.display = 'none'; // Hide options after selection
    resultSummaryEl.style.display = 'flex'; // Show result summary

    let feedbackMessage = '';
    if (isCorrect) {
        feedbackMessage = "Correct!";
        addXP(10); // Example XP gain
        incrementStreak();
        markQuestionAsAnswered(currentQuestion.id);
    } else {
        feedbackMessage = `Incorrect. The answer was: ${currentQuestion.correctAnswer}`;
        resetStreak();
    }
    resultSummaryEl.innerHTML = `
        <p>${feedbackMessage}</p>
        <button id="nextQuestionBtn">Next Question</button>
    `;

    document.getElementById('nextQuestionBtn').addEventListener('click', displayNextQuestion);
}

/**
 * Ends the game session when no more questions are available.
 */
function endGame() {
    sentenceClueEl.textContent = "No more questions!";
    resetMCQOptions(mcqOptionsEl);
    resultSummaryEl.innerHTML = `
        <p>You've completed all available questions for this mode!</p>
        <button id="restartGameBtn">Play Again</button>
        <button id="backToModesBtn">Back to Modes</button>
    `;
    document.getElementById('restartGameBtn').addEventListener('click', () => {
        // This will reload the questions for the current difficulty
        init(currentLanguage, currentDifficulty);
    });
    document.getElementById('backToModesBtn').addEventListener('click', () => {
        // Assuming main.js handles showing mode selection
        window.location.reload(); // Simple way to go back to modes for now
    });
}

/**
 * Resets the game mode state. Used when switching modes or restarting.
 */
export function reset() {
    sentenceClueEl.textContent = '';
    resetMCQOptions(mcqOptionsEl);
    resultSummaryEl.innerHTML = '';
    currentQuestion = null;
    currentQuestionIndex = -1; // Reset question index
    // No need to reset answeredQuestionIds here, questionPool does it via resetAnsweredQuestionsTracker
}
