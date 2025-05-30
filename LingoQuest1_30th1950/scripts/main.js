
// main.js
// Purpose: Orchestrates PWA initialization, core module loading, and routing.
// Usage: Loaded as a module in index.html.
// Timestamp: 2025-05-28
// License: MIT License (https://opensource.org/licenses/MIT)

import { profileManager } from './profileManager.js';
import { uiModeManager } from './uiModeManager.js';
import { updateVersionInfo } from './version.js';
import { initXPTracker } from './xpTracker.js';
import { loadQuestionPool } from './questionPool.js'; // Assuming this exists or will be created
import { initSoloMode } from './modes/soloMode.js';
import { initMixLingo } from './modes/mixLingo.js';
// import { initWordRelic } from './modes/wordRelic.js'; // Placeholder
// import { initWordSafari } from './modes/wordSafari.js'; // Placeholder

/**
 * Initializes the application, sets up event listeners,
 * and handles initial routing based on URL parameters.
 */
async function initializeApp() {
    // Initialize core utilities
    await profileManager.init();
    uiModeManager.init();
    updateVersionInfo();
    initXPTracker();

    // Event listeners for UI controls
    document.getElementById('darkModeToggle').addEventListener('click', uiModeManager.toggleDarkMode);
    document.getElementById('uiModeSelector').addEventListener('change', (event) => {
        uiModeManager.setUiMode(event.target.value);
    });

    // Event listeners for game mode buttons
    document.getElementById('soloModeBtn').addEventListener('click', (event) => loadGameMode(event.target.dataset));
    document.getElementById('mixLingoBtn').addEventListener('click', (event) => loadGameMode(event.target.dataset));
    document.getElementById('wordRelicBtn').addEventListener('click', (event) => loadGameMode(event.target.dataset));
    document.getElementById('wordSafariBtn').addEventListener('click', (event) => loadGameMode(event.target.dataset));

    // Handle initial routing from URL parameters
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const lang = params.get('lang');
    const ui = params.get('ui');

    if (ui) {
        uiModeManager.setUiMode(ui);
        document.getElementById('uiModeSelector').value = ui; // Sync dropdown
    }

    if (mode) {
        // Automatically load game mode if specified in URL
        loadGameMode({ mode, lang });
    }
}

/**
 * Loads the specified game mode and displays the game container.
 * @param {object} options - An object containing mode and optional language.
 * @param {string} options.mode - The name of the game mode to load (e.g., 'solo', 'mixlingo').
 * @param {string} [options.lang] - The language for the game mode (e.g., 'fr', 'en').
 */
async function loadGameMode({ mode, lang }) {
    const gameModesSection = document.getElementById('gameModes');
    const gameContainer = document.getElementById('gameContainer');
    const sentenceClue = document.getElementById('sentenceClue');
    const sentenceBuilderArea = document.getElementById('sentenceBuilderArea');
    const mcqOptions = document.getElementById('mcqOptions');
    const resultSummary = document.getElementById('resultSummary');

    // Clear previous game content
    sentenceClue.innerHTML = '';
    sentenceBuilderArea.innerHTML = '';
    mcqOptions.innerHTML = '';
    resultSummary.innerHTML = '';

    // Show game container and hide mode selection
    gameModesSection.style.display = 'none';
    gameContainer.style.display = 'flex';

    try {
        await loadQuestionPool(mode, lang); // Load questions relevant to the mode/lang

        // Dynamically import and initialize the specific game mode
        switch (mode) {
            case 'solo':
                await initSoloMode(sentenceClue, sentenceBuilderArea, mcqOptions, resultSummary, lang);
                break;
            case 'mixlingo':
                await initMixLingo(sentenceClue, sentenceBuilderArea, mcqOptions, resultSummary, lang);
                break;
            case 'wordrelic':
                // await initWordRelic(sentenceClue, sentenceBuilderArea, mcqOptions, resultSummary, lang);
                console.warn('Word Relic mode not yet implemented.');
                resultSummary.textContent = 'Word Relic mode is coming soon!';
                break;
            case 'wordsafari':
                // await initWordSafari(sentenceClue, sentenceBuilderArea, mcqOptions, resultSummary, lang);
                console.warn('Word Safari mode not yet implemented.');
                resultSummary.textContent = 'Word Safari mode is coming soon!';
                break;
            default:
                console.error(`Unknown game mode: ${mode}`);
                resultSummary.textContent = 'Select a valid game mode.';
                gameModesSection.style.display = 'block';
                gameContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading game mode:', error);
        resultSummary.textContent = `Error loading game: ${error.message}. Please try again.`;
        gameModesSection.style.display = 'block';
        gameContainer.style.display = 'none';
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
