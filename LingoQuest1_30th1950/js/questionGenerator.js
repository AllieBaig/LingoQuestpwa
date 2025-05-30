
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// questionGenerator.js
// Purpose: Generates and formats question objects, including handling options and distractors.
// Usage: Imported by questionPool.js.
// Timestamp: 2025-05-30 09:10:00 AM BST

/**
 * Helper function to shuffle an array in place.
 * @param {Array} array - The array to shuffle.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Takes a raw vocabulary entry and transforms it into a formatted question object
 * suitable for the game, generating options if not already present.
 *
 * @param {object} vocabEntry - The raw entry from vocabulary.json.
 * @param {Array<object>} allVocabEntries - The entire question pool for generating distractors.
 * @param {string} targetAnswerLang - The language for generating relevant distractors.
 * @returns {object} A formatted question object.
 */
export function formatQuestion(vocabEntry, allVocabEntries, targetAnswerLang) {
    const clue = vocabEntry.clue;
    const correctAnswerText = vocabEntry.correctAnswer;
    let allOptions;

    // Use existing options if provided in the vocabulary entry
    if (vocabEntry.options && Array.isArray(vocabEntry.options) && vocabEntry.options.length > 0) {
        allOptions = [...vocabEntry.options];
        shuffleArray(allOptions);
    } else {
        // Generate distractors if options are not pre-defined
        console.warn(`[questionGenerator.js] Question ID ${vocabEntry.id} has no pre-defined options. Generating distractors.`);
        
        const distractors = allVocabEntries
            .filter(q => q.id !== vocabEntry.id && q.language === targetAnswerLang && q.correctAnswer !== correctAnswerText)
            .map(q => q.correctAnswer);

        // Ensure we get unique distractors and limit their count
        const uniqueDistractors = [...new Set(distractors)];
        const selectedDistractors = uniqueDistractors.sort(() => 0.5 - Math.random()).slice(0, 3); // Get up to 3 random unique distractors

        allOptions = [correctAnswerText, ...selectedDistractors];
        shuffleArray(allOptions);

        // Ensure there are at least 2 options (correct answer + at least one other)
        if (allOptions.length < 2) {
            console.warn(`[questionGenerator.js] Only one option (correct answer) generated for ID ${vocabEntry.id}. Adding a dummy option.`);
            allOptions.push("Other"); // Fallback for very few distractors
            shuffleArray(allOptions);
        }
    }

    return {
        id: vocabEntry.id,
        clue: clue,
        options: allOptions,
        correctAnswer: correctAnswerText
    };
}
