
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// questionPool.js
// Purpose: Manages loading vocabulary, providing questions, and tracking answered questions.
// Usage: Imported by gameCore.js.
// Timestamp: 2025-05-30 08:50:00 AM BST (Removed duplicate getNextQuestion declaration)

import { logEvent } from './eventLogger.js';

let questionPool = [];
let answeredQuestionsIds = new Set(); // Tracks answered questions for the current session

/**
 * Loads the vocabulary data from a JSON file.
 * @returns {Promise<void>} A promise that resolves when the vocabulary is loaded.
 */
export async function loadQuestionPool() {
    try {
        const response = await fetch('data/vocabulary.json');
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }
        questionPool = await response.json();
        console.log(`[questionPool.js] Loaded ${questionPool.length} questions.`); // Added log
        logEvent(`[questionPool.js] Loaded ${questionPool.length} questions.`, 'info');
    } catch (error) {
        console.error('[questionPool.js] Error loading vocabulary:', error);
        logEvent(`[questionPool.js] Error loading vocabulary: ${error.message}`, 'error');
        throw error; // Re-throw to propagate the error to gameCore.js
    }
}

/**
 * Resets the tracker for answered questions.
 */
export function resetAnsweredQuestionsTracker() {
    answeredQuestionsIds.clear();
    logEvent('[questionPool.js] Answered questions tracker reset.', 'game');
}

/**
 * Gets the next available question based on difficulty and language.
 * Filters out already answered questions.
 * @param {string} difficulty - The desired difficulty ('easy', 'medium', 'hard').
 * @param {string} answerLanguage - The language of the answer ('en', 'fr').
 * @returns {object|null} The next question object, or null if no questions are available.
 */
// THIS IS THE *CORRECT* getNextQuestion. Ensure there are no other instances of this function.
export function getNextQuestion(difficulty, answerLanguage) {
    logEvent(`[questionPool.js] Attempting to get next question. Difficulty: ${difficulty}, Language: ${answerLanguage}`, 'debug');

    // Filter for questions that match criteria AND haven't been answered yet
    const availableQuestions = questionPool.filter(q =>
        q.difficulty === difficulty &&
        q.language === answerLanguage &&
        !answeredQuestionsIds.has(q.id)
    );

    if (availableQuestions.length === 0) {
        logEvent('[questionPool.js] No available questions matching criteria or all answered.', 'warn');
        return null; // No questions found
    }

    // Return a random question from the available ones
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    logEvent(`[questionPool.js] Selected question ID: ${question.id}`, 'debug');
    return question;
}

/**
 * Marks a question as answered.
 * @param {string} questionId - The ID of the question to mark as answered.
 */
export function markQuestionAsAnswered(questionId) {
    answeredQuestionsIds.add(questionId);
    logEvent(`[questionPool.js] Marked question as answered: ${questionId}`, 'game');
}

// Ensure no other 'export function getNextQuestion' or 'function getNextQuestion' exists below this line
// or anywhere else in this file.
