
// main.js
// ... (imports) ...

// Get DOM elements
const soloModeBtn = document.getElementById('soloModeBtn');
const mixLingoBtn = document.getElementById('mixLingoBtn'); // Make sure this line exists
const wordRelicBtn = document.getElementById('wordRelicBtn');
const wordSafariBtn = document.getElementById('wordSafariBtn');

// ... (other setup) ...

document.addEventListener('DOMContentLoaded', () => {
    console.log('[main.js] DOMContent loaded. Initializing UI and game listeners.');
    const initialGameData = profileManager.getGameData();

    // ... (UI initializations) ...

    // Event listeners for game mode buttons
    // Add a console.log right before the event listener attachment
    console.log('[main.js] Attaching event listeners for game mode buttons.');
    if (soloModeBtn) soloModeBtn.addEventListener('click', () => {
        console.log('[main.js] Solo Mode button clicked.');
        startGame('solo', soloModeBtn.dataset.lang);
    });
    if (mixLingoBtn) mixLingoBtn.addEventListener('click', () => { // Add check for null
        console.log('[main.js] MixLingo button clicked.'); // <-- IMPORTANT: Check if this logs
        startGame('mixlingo', mixLingoBtn.dataset.lang);
    });
    if (wordRelicBtn) wordRelicBtn.addEventListener('click', () => {
        console.log('[main.js] Word Relic button clicked.');
        alert('Word Relic mode not yet implemented!');
        manualLogError('Attempted to access unimplemented Word Relic mode.', null, 'info');
    });
    if (wordSafariBtn) wordSafariBtn.addEventListener('click', () => {
        console.log('[main.js] Word Safari button clicked.');
        alert('Word Safari mode not yet implemented!');
        manualLogError('Attempted to access unimplemented Word Safari mode.', null, 'info');
    });
    // ... (rest of main.js) ...
});
