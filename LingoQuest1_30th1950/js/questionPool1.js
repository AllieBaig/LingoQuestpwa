
// questionPool.js
// Purpose: Manages loading, shuffling, and providing questions for game modes.
// Usage: Imported by main.js and game mode scripts.
// Timestamp: 2025-05-28
// License: MIT License (https://opensource.org/licenses/MIT)

let currentQuestions = [];
let answeredQuestionIds = new Set(); // To track answered questions within a session/game run
let currentQuestionIndex = -1;

const QUESTION_DATA_PATHS = {
    'solo': {
        'fr': 'lang/solo-fr.json'
    },
    'mixlingo': {
        'en': 'lang/mixlingo-en.json'
        // Add other MixLingo languages as needed, e.g., 'es', 'de', 'it'
    },
    'wordrelic': {
        'default': 'lang/wordrelic.json'
    },
    'wordsafari': {
        'default': 'lang/wordsafari.json'
    }
};

/**
 * Shuffles an array in place (Fisher-Yates algorithm).
 * @param {Array} array - The array to shuffle.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Loads questions for a given mode and language.
 * @param {string} mode - The game mode (e.g., 'solo', 'mixlingo').
 * @param {string} [lang='default'] - The language code (e.g., 'fr', 'en').
 * @returns {Promise<void>}
 */
export async function loadQuestionPool(mode, lang = 'default') {
    const path = QUESTION_DATA_PATHS[mode]?.[lang] || QUESTION_DATA_PATHS[mode]?.['default'];

    if (!path) {
        throw new Error(`No question data path found for mode: ${mode} and language: ${lang}`);
    }

    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        currentQuestions = data.questions.filter(q => !answeredQuestionIds.has(q.id));
        shuffleArray(currentQuestions);
        currentQuestionIndex = -1; // Reset index for a new pool
        console.log(`Loaded ${currentQuestions.length} questions for ${mode} (${lang}).`);
    } catch (error) {
        console.error('Error loading question pool:', error);
        throw error;
    }
}

/**
 * Gets the next question from the pool.
 * @returns {object | null} The next question object, or null if no more questions.
 */
export function getNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        return currentQuestions[currentQuestionIndex];
    }
    return null; // No more questions
}

/**
 * Marks the current question as answered so it's not repeated in the current session.
 * @param {string} questionId - The ID of the question to mark as answered.
 */
export function markQuestionAsAnswered(questionId) {
    answeredQuestionIds.add(questionId);
}

/**
 * Gets the total number of questions currently loaded.
 * @returns {number}
 */
export function getTotalQuestionsCount() {
    return currentQuestions.length;
}

/**
 * Gets the number of questions remaining in the current pool.
 * @returns {number}
 */
export function getRemainingQuestionsCount() {
    return currentQuestions.length - (currentQuestionIndex + 1);
}

/**
 * Resets the answered questions tracker for a new game session.
 */
export function resetAnsweredQuestions() {
    answeredQuestionIds.clear();
    currentQuestionIndex = -1;
    // Re-shuffle if needed, or reload based on game logic
}
