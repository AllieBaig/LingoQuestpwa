
// gameCore.js
// ... (imports) ...

// Get DOM elements (ensure these are correctly acquired)
const gameModesSection = document.getElementById('gameModes');
const gameContainerSection = document.getElementById('gameContainer');
const sentenceClueEl = document.getElementById('sentenceClue');
const sentenceBuilderAreaEl = document.getElementById('sentenceBuilderArea');
const mcqOptionsEl = document.getElementById('mcqOptions');
const resultSummaryEl = document.getElementById('resultSummary');

// ... (internal state) ...

export async function startGame(mode, language) {
    console.log(`[gameCore.js] startGame function entered. Mode: ${mode}, Language: ${language}`); // <-- IMPORTANT: Check if this logs

    // Null checks for DOM elements (good practice)
    if (!gameModesSection || !gameContainerSection || !sentenceClueEl || !mcqOptionsEl) {
        console.error('[gameCore.js] One or more essential DOM elements for game display are missing!');
        manualLogError(`Missing game UI elements for startGame.`, null, 'critical');
        return; // Stop execution if elements are missing
    }

    currentMode = mode;
    currentLanguage = language;
    currentAnswerLanguage = profileManager.getGameData().answerLanguage || 'en';

    gameModesSection.style.display = 'none';
    gameContainerSection.style.display = 'flex';
    console.log('[gameCore.js] UI sections visibility updated.'); // Check if this logs

    const difficulty = profileManager.getGameData().difficulty;
    console.log(`[gameCore.js] Attempting to load questions for ${currentLanguage} (${difficulty} difficulty).`);
    const questions = await loadQuestionPool(currentLanguage, difficulty);
    console.log(`[gameCore.js] Questions loaded: ${questions ? questions.length : 'null/undefined'}`); // Check question count

    if (questions && questions.length > 0) {
        currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        console.log('[gameCore.js] Displaying question:', currentQuestion);
        displayQuestion(currentQuestion);
    } else {
        sentenceClueEl.textContent = 'No questions available for this mode/language/difficulty.';
        mcqOptionsEl.innerHTML = '';
        console.warn('[gameCore.js] No questions loaded or available for display!');
        manualLogError(`No questions loaded for mode: ${mode}, lang: ${language}, difficulty: ${difficulty}`, null, 'warning');
    }
}

// ... (rest of gameCore.js) ...
