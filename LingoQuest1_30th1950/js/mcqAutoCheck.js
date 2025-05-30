
// mcqAutoCheck.js
// Purpose: Handles rendering and checking of Multiple Choice Question (MCQ) options.
// Usage: Imported by game mode scripts.
// Timestamp: 2025-05-28 10:28 PM
// License: MIT License (https://opensource.org/licenses/MIT)

/**
 * Renders Multiple Choice Question (MCQ) options.
 * @param {HTMLElement} container - The DOM element to render the options into.
 * @param {string[]} options - An array of MCQ option texts.
 * @param {string} correctAnswer - The correct answer text.
 * @param {function} selectionCallback - Callback function to handle option selection.
 */
export function renderMCQOptions(container, options, correctAnswer, selectionCallback) {
    options.forEach(optionText => {
        const optionEl = document.createElement('div');
        optionEl.classList.add('mcq-option');
        optionEl.textContent = optionText;

        optionEl.addEventListener('click', () => {
            const isCorrect = optionText === correctAnswer;
            optionEl.classList.add(isCorrect ? 'correct' : 'incorrect');
            selectionCallback(isCorrect, optionText); // Notify the game mode

            // Disable further clicks after selection
            Array.from(container.children).forEach(child => {
                child.style.pointerEvents = 'none';
            });
        });

        container.appendChild(optionEl);
    });
}

/**
 * Resets MCQ options by clearing the container.
 * @param {HTMLElement} container - The DOM element containing the options.
 */
export function resetMCQOptions(container) {
    container.innerHTML = '';
}
