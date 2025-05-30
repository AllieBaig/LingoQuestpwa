
// js/modes/mixLingo.js
// Purpose: Implements the MixLingo game mode logic, displaying questions and handling user input.
// Usage: Imported by main.js.
// Timestamp: 2025-05-29 10:11:00 AM BST
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

import { getNextQuestion, getTotalQuestionsCount, getRemainingQuestionsCount, markQuestionAsAnswered } from '../questionPool.js';
import { updateXP, updateStreak } from '../xpTracker.js';
import { checkAnswerMCQ } from '../lib/mcqAutoCheck.js'; // Assuming this is in js/lib

const sentenceClueElement = document.getElementById('sentenceClue');
const mcqOptionsElement = document.getElementById('mcqOptions');
const resultSummaryElement = document.getElementById('resultSummary');

let currentQuestion = null;
let currentDifficulty = 'easy'; // Default difficulty, will be set by init
let currentAnswerLanguage = 'en'; // NEW: Default answer language, will be set by init

export const init = async (questionLang, difficulty, answerLang) => {
    console.log(`MixLingo Init: Question Language: ${questionLang}, Difficulty: ${difficulty}, Answer Language: ${answerLang}`);
    currentDifficulty = difficulty;
    currentAnswerLanguage = answerLang; // Store the selected answer language

    // Clear previous game state
    reset();
    displayNextQuestion();
};

export const reset = () => {
    sentenceClueElement.textContent = '';
    mcqOptionsElement.innerHTML = '';
    resultSummaryElement.innerHTML = '';
    currentQuestion = null;
};

const displayNextQuestion = () => {
    mcqOptionsElement.innerHTML = ''; // Clear previous options
    resultSummaryElement.innerHTML = ''; // Clear previous result summary

    // Get the next question, passing the current difficulty and the selected answer language
    currentQuestion = getNextQuestion(currentDifficulty, currentAnswerLanguage);

    if (currentQuestion) {
        sentenceClueElement.textContent = currentQuestion.clue;
        currentQuestion.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('mcq-option');
            button.addEventListener('click', () => handleAnswer(option));
            mcqOptionsElement.appendChild(button);
        });
        console.log(`Question: ${currentQuestion.clue}`);
        console.log(`Correct Answer (in ${currentAnswerLanguage}): ${currentQuestion.correctAnswer}`);
    } else {
        sentenceClueElement.textContent = 'No more questions! Game Over.';
        mcqOptionsElement.innerHTML = '';
        displayEndGameSummary();
    }
};

const handleAnswer = (selectedAnswer) => {
    if (!currentQuestion) return;

    const isCorrect = checkAnswerMCQ(selectedAnswer, currentQuestion.correctAnswer);
    markQuestionAsAnswered(currentQuestion.id); // Mark the vocabulary ID as answered

    if (isCorrect) {
        updateXP(10); // Award XP for correct answer
        updateStreak(true); // Increase streak
        resultSummaryElement.textContent = `Correct! Well done! 🎉`;
        resultSummaryElement.style.color = 'var(--primary-color)';
    } else {
        updateXP(-5); // Deduct XP for incorrect answer
        updateStreak(false); // Reset streak
        resultSummaryElement.textContent = `Incorrect. The correct answer was "${currentQuestion.correctAnswer}". 🙁`;
        resultSummaryElement.style.color = 'red';
    }

    // Disable all options after an answer is selected
    Array.from(mcqOptionsElement.children).forEach(button => {
        button.disabled = true;
        if (button.textContent === currentQuestion.correctAnswer) {
            button.classList.add('correct');
        } else if (button.textContent === selectedAnswer) {
            button.classList.add('incorrect');
        }
    });

    setTimeout(() => {
        displayNextQuestion(); // Move to the next question after a brief delay
    }, 1500); // 1.5 seconds delay
};

const displayEndGameSummary = () => {
    // You can add more detailed end-game summary here
    resultSummaryElement.innerHTML = `
        <h3>Game Over!</h3>
        <p>You've completed all available questions!</p>
        <button id="playAgainBtn">Play Again</button>
    `;
    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            // This will trigger a full reset and restart of the game mode
            window.location.reload(); // Simple reload for full reset for now
            // Or, more elegantly: profileManager.saveProfile(); resetAnsweredQuestionsTracker(); init(currentDifficulty, currentAnswerLanguage);
        });
    }
};
