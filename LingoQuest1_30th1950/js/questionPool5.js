
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// questionPool.js
// Purpose: Manages loading vocabulary and tracking answered questions.
// Usage: Imported by gameCore.js.
// Timestamp: 2025-05-30 09:10:00 AM BST (Refactored to use questionGenerator.js)

import { logEvent } from './eventLogger.js';
import { formatQuestion } from './questionGenerator.js'; // NEW: Import formatQuestion

let questionPool = []; // Stores the raw vocabulary entries
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
        console.log(`[questionPool.js] Loaded ${questionPool.length} questions.`);
        logEvent(`[questionPool.js] Loaded ${questionPool.length} questions.`, 'info');
    } catch (error) {
        console.error('[questionPool.js] Error loading vocabulary:', error);
        logEvent(`[questionPool.js] Error loading vocabulary: ${error.message}`, 'error');
        throw error;
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
 * Filters out already answered questions, then formats the selected question.
 * @param {string} difficulty - The desired difficulty ('easy', 'medium', 'hard').
 * @param {string} targetAnswerLang - The language of the answer ('en', 'fr').
 * @returns {object|null} The next formatted question object, or null if no questions are available.
 */
export function getNextQuestion(difficulty, targetAnswerLang) {
    logEvent(`[questionPool.js] Attempting to get next question. Difficulty: ${difficulty}, Language: ${targetAnswerLang}`, 'debug');

    const availableVocabEntries = questionPool.filter(q =>
        q.difficulty === difficulty &&
        q.language === targetAnswerLang &&
        !answeredQuestionsIds.has(q.id)
    );

    if (availableVocabEntries.length === 0) {
        logEvent('[questionPool.js] No available questions matching criteria or all answered.', 'warn');
        return null; // No raw vocabulary entries found
    }

    const randomIndex = Math.floor(Math.random() * availableVocabEntries.length);
    const selectedVocabEntry = availableVocabEntries[randomIndex];

    // Use the new questionGenerator to format the question
    const formattedQuestion = formatQuestion(selectedVocabEntry, questionPool, targetAnswerLang);
    
    logEvent(`[questionPool.js] Selected and formatted question ID: ${formattedQuestion.id}`, 'debug');
    return formattedQuestion;
}

/**
 * Marks a question as answered.
 * @param {string} questionId - The ID of the question to mark as answered.
 */
export function markQuestionAsAnswered(questionId) {
    answeredQuestionsIds.add(questionId);
    logEvent(`[questionPool.js] Marked question as answered: ${questionId}`, 'game');
}
