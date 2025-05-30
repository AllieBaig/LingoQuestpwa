
// ... (imports) ...
import { logEvent } from './eventLogger.js'; // Ensure this is imported

// ... (other variables) ...

export async function startGame(mode, language) {
    logEvent(`Starting game mode: ${mode}, Language: ${language}`, 'game', { mode, language });
    currentMode = mode;
    currentLanguage = language;
    
    currentAnswerLanguage = document.getElementById('answerLanguageSelector').value || 'en'; 
    currentDifficulty = document.getElementById('difficultySelector').value || 'easy'; 

    // ADD THESE LOGS:
    console.log(`[gameCore.js] Game starting with Difficulty: ${currentDifficulty}, Answer Language: ${currentAnswerLanguage}`);
    logEvent(`[gameCore.js] Game starting with Difficulty: ${currentDifficulty}, Answer Language: ${currentAnswerLanguage}`, 'game-init');

    uiManager.showGameContainer(); 
    logEvent('UI sections visibility updated: Game mode hidden, Game container shown via uiManager.', 'ui');

    try {
        await loadQuestionPool();
        logEvent('Question pool (vocabulary) loaded.', 'game');
        
        resetAnsweredQuestionsTracker(); 
        logEvent('Answered questions tracker and session vocabulary reset.', 'game');

        currentQuestion = getNextQuestion(currentDifficulty, currentAnswerLanguage);

        // ADD THIS LOG:
        console.log(`[gameCore.js] getNextQuestion returned:`, currentQuestion);
        logEvent(`[gameCore.js] getNextQuestion returned: ${currentQuestion ? currentQuestion.id : 'null'}`, 'game-logic', { questionFound: !!currentQuestion });


        if (currentQuestion) {
            logEvent(`Displaying question: ${currentQuestion.clue}`, 'game', { questionId: currentQuestion.id });
            displayQuestion(currentQuestion);
        } else {
            sentenceClueEl.textContent = 'No questions available for this mode/language/difficulty.';
            mcqOptionsEl.innerHTML = '';
            console.warn('[gameCore.js] No questions loaded or available for display!');
            logEvent('No questions loaded or available for display!', 'game', { mode, language, difficulty: currentDifficulty, answerLanguage: currentAnswerLanguage });
            addBackToMainMenuButton(); 
        }
    } catch (error) {
        console.error('[gameCore.js] Error during game start or question loading:', error);
        logEvent(`Error during game start or question loading: ${error.message}`, 'error', { error: error.message });
        sentenceClueEl.textContent = 'Error loading game data. Please try again.';
        mcqOptionsEl.innerHTML = '';
        addBackToMainMenuButton();
    }
}
