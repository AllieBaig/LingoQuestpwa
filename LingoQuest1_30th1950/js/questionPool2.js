
// questionPool.js
// Purpose: Manages loading vocabulary and dynamically generating questions for game modes.
// Usage: Imported by main.js and game mode scripts.
// Timestamp: 2025-05-29 09:55:00 AM BST
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

let loadedVocabulary = []; // All vocabulary entries
let currentSessionVocabulary = []; // Vocabulary entries for the current session (unanswered)
let answeredVocabularyIds = new Set(); // To track answered vocabulary IDs within a session
let currentVocabularyIndex = -1;

// Define the number of choices for each difficulty level
const DIFFICULTY_CHOICES = {
    'easy': 2,
    'medium': 3,
    'hard': 4
};

// Define available target languages
const AVAILABLE_ANSWER_LANGS = ['en', 'fr', 'de'];

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
 * Loads vocabulary from the JSON file.
 * This is now the core data source for all generated questions.
 * @returns {Promise<void>}
 */
export async function loadVocabulary() {
    try {
        const response = await fetch('data/vocabulary.json'); // New path to generic vocabulary
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        loadedVocabulary = await response.json();
        if (!Array.isArray(loadedVocabulary) || loadedVocabulary.length === 0) {
            throw new Error("Loaded vocabulary is empty or not an array.");
        }
        resetSessionVocabulary(); // Initialize session vocabulary
        console.log(`Loaded ${loadedVocabulary.length} vocabulary entries.`);
    } catch (error) {
        console.error('Error loading vocabulary:', error);
        throw error;
    }
}

/**
 * Resets the pool of vocabulary entries for the current session, excluding previously answered ones.
 */
export function resetSessionVocabulary() {
    currentSessionVocabulary = loadedVocabulary.filter(vocab => !answeredVocabularyIds.has(vocab.id));
    shuffleArray(currentSessionVocabulary);
    currentVocabularyIndex = -1; // Reset index for a new session
    console.log(`Initialized session with ${currentSessionVocabulary.length} vocabulary entries.`);
}

/**
 * Gets the next question from the pool, dynamically generating MCQ options based on difficulty and target answer language.
 * The clue will always be in English.
 * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard').
 * @param {string} targetAnswerLang - The language for the MCQ options ('en', 'fr', 'de').
 * @returns {object | null} The next question object with generated options, or null if no more questions.
 */
export function getNextQuestion(difficulty, targetAnswerLang) {
    if (!AVAILABLE_ANSWER_LANGS.includes(targetAnswerLang)) {
        console.warn(`Invalid target answer language: ${targetAnswerLang}. Defaulting to 'en'.`);
        targetAnswerLang = 'en';
    }

    currentVocabularyIndex++;
    if (currentVocabularyIndex >= currentSessionVocabulary.length) {
        return null; // No more questions
    }

    const currentVocabEntry = currentSessionVocabulary[currentVocabularyIndex];
    const clue = `What is '${currentVocabEntry.english}' in ${getLanguageName(targetAnswerLang)}?`;
    const correctAnswerText = currentVocabEntry[targetAnswerLang];

    const numChoices = DIFFICULTY_CHOICES[difficulty] || DIFFICULTY_CHOICES['easy']; // Default to easy

    const distractors = [];
    const possibleDistractors = loadedVocabulary
        .filter(vocab => vocab.id !== currentVocabEntry.id && vocab[targetAnswerLang]) // Exclude correct answer's entry
        .map(vocab => vocab[targetAnswerLang]); // Get the translated word for distractors

    shuffleArray(possibleDistractors);

    // Add distractors up to numChoices - 1, ensuring no duplicates and that they are not the correct answer text
    let addedCount = 0;
    for (let i = 0; i < possibleDistractors.length && addedCount < (numChoices - 1); i++) {
        const distractor = possibleDistractors[i];
        if (distractor !== correctAnswerText && !distractors.includes(distractor)) {
            distractors.push(distractor);
            addedCount++;
        }
    }

    // Combine correct answer and distractors
    const allOptions = [correctAnswerText, ...distractors];
    shuffleArray(allOptions); // Shuffle the final options for display

    return {
        id: currentVocabEntry.id, // Use vocab ID for tracking
        clue: clue,
        options: allOptions,
        correctAnswer: correctAnswerText // The correct answer text in the target language
    };
}

/**
 * Helper function to get a human-readable language name.
 * @param {string} langCode - The language code (e.g., 'en', 'fr', 'de').
 * @returns {string} The full language name.
 */
function getLanguageName(langCode) {
    switch (langCode) {
        case 'en': return 'English';
        case 'fr': return 'French';
        case 'de': return 'German';
        default: return langCode;
    }
}

/**
 * Marks a vocabulary entry as answered so it's not repeated in the current session.
 * @param {string} vocabId - The ID of the vocabulary entry to mark as answered.
 */
export function markQuestionAsAnswered(vocabId) {
    answeredVocabularyIds.add(vocabId);
}

/**
 * Gets the total number of vocabulary entries currently loaded (for the current session).
 * @returns {number}
 */
export function getTotalQuestionsCount() {
    return currentSessionVocabulary.length;
}

/**
 * Gets the number of questions remaining in the current pool.
 * @returns {number}
 */
export function getRemainingQuestionsCount() {
    return currentSessionVocabulary.length - (currentVocabularyIndex + 1);
}

/**
 * Resets the answered questions tracker and session pool for a new game session.
 */
export function resetAnsweredQuestionsTracker() {
    answeredVocabularyIds.clear();
    resetSessionVocabulary(); // Regenerate session questions
}
