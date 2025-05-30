// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// gameCore.js
// Purpose: Manages the core game state and flow (start, next question orchestration).
// Usage: Imported by main.js. Delegates UI to gameUIManager.js.
// Timestamp: 2025-05-30 09:15:00 AM BST (Refactored, using gameUIManager.js)

import { logEvent } from './eventLogger.js';
import { loadQuestionPool, getNextQuestion, resetAnsweredQuestionsTracker } from './questionPool.js';
import { uiManager } from './uiManager.js'; // For overall view switching
import { gameUIManager } from './gameUIManager.js'; // NEW: Import gameUIManager

// Internal game state variables
let currentLanguage = 'en'; // Primary language for game content, if applicable
let currentMode = null;
let currentAnswerLanguage = 'en'; // Language for answers (e.g., in MCQ options)
let currentDifficulty = 'easy';

/**
 * Initializes the game state and starts a selected game mode.
 * @param {string} mode - The game mode to start.
 * @param {string} language - The primary language for the game content.
 */
export async function startGame(mode, language) {
    logEvent(`Attempting to start game mode: ${mode}, Primary Language: ${language}`, 'game', { mode, language });
    currentMode = mode;
    currentLanguage = language;
    
    // Get current settings from selectors before starting
    currentAnswerLanguage = document.getElementById('answerLanguageSelector').value || 'en'; 
    currentDifficulty = document.getElementById('difficultySelector').value || 'easy'; 

    console.log(`[gameCore.js] Game starting with Difficulty: ${currentDifficulty}, Answer Language: ${currentAnswerLanguage}`);
    logEvent(`[gameCore.js] Game starting with Difficulty: ${currentDifficulty}, Answer Language: ${currentAnswerLanguage}`, 'game-init');

    // Show the game container and hide main menu using uiManager
    uiManager.showGameContainer(); 
    logEvent('UI sections visibility updated: Game mode hidden, Game container shown via uiManager.', 'ui');

    try {
        await loadQuestionPool(); // Load vocabulary first
        logEvent('Question pool (vocabulary) loaded.', 'game');
        
        resetAnsweredQuestionsTracker(); // Clear previously answered questions for new session
        logEvent('Answered questions tracker reset for new session.', 'game');

        // Initialize gameUIManager with context and a callback for starting new sessions
        gameUIManager.init({
            difficulty: currentDifficulty,
            answerLanguage: currentAnswerLanguage,
            mode: currentMode
        }, startGame); // Pass startGame itself as the callback for 'Start New Session' button

        const firstQuestion = getNextQuestion(currentDifficulty, currentAnswerLanguage);

        console.log(`[gameCore.js] getNextQuestion returned:`, firstQuestion);
        logEvent(`[gameCore.js] getNextQuestion returned: ${firstQuestion ? firstQuestion.id : 'null'}`, 'game-logic', { questionFound: !!firstQuestion });

        if (firstQuestion) {
            gameUIManager.displayQuestion(firstQuestion); // Delegate display to gameUIManager
            logEvent(`Displaying first question: ${firstQuestion.clue}`, 'game', { questionId: firstQuestion.id });
        } else {
            // Handle case where no questions are available for selected criteria
            const sentenceClueEl = document.getElementById('sentenceClue');
            const mcqOptionsEl = document.getElementById('mcqOptions');
            const resultSummaryEl = document.getElementById('resultSummary');

            if (sentenceClueEl) sentenceClueEl.textContent = 'No questions available for this mode/language/difficulty.';
            if (mcqOptionsEl) mcqOptionsEl.innerHTML = '';
            if (resultSummaryEl) resultSummaryEl.innerHTML = ''; // Clear results if any
            logEvent('No questions available for selected game mode/language/difficulty.', 'warn', { mode, language, difficulty: currentDifficulty, answerLanguage: currentAnswerLanguage });
            
            // Still provide back to main menu option
            gameUIManager._addGameControlButtons(false); // Only show back button, no next/restart
        }
    } catch (error) {
        console.error('[gameCore.js] Error during game start or question loading:', error);
        logEvent(`Error during game start or question loading: ${error.message}`, 'error', { error: error.message });
        
        const sentenceClueEl = document.getElementById('sentenceClue');
        const mcqOptionsEl = document.getElementById('mcqOptions');
        if (sentenceClueEl) sentenceClueEl.textContent = 'Error loading game data. Please try again.';
        if (mcqOptionsEl) mcqOptionsEl.innerHTML = '';
        
        // Still provide back to main menu option on error
        gameUIManager._addGameControlButtons(false); // Only show back button, no next/restart
    }
}
