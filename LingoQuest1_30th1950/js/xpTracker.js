
// xpTracker.js
// Purpose: Manages XP gains and updates the XP bar and streak badge UI.
// Usage: Imported by main.js; receives XP updates from game modes.
// Timestamp: 2025-05-28 10:30 PM BST
// License: MIT License (https://opensource.org/licenses/MIT)

import { profileManager } from './profileManager.js';

let xpTextElement;
let xpFillElement;
let streakBadgeElement;

/**
 * Initializes the XP tracker UI elements.
 */
export function initXPTracker() {
    xpTextElement = document.querySelector('#xpTracker .xp-text');
    xpFillElement = document.querySelector('#xpTracker .xp-fill');
    streakBadgeElement = document.querySelector('#xpTracker .streak-badge');
    updateXPUI(); // Initial update
}

/**
 * Updates the XP bar and text based on the current profile XP.
 * @param {number} [xpGain=0] - Optional XP gain for animation/feedback.
 */
export function updateXPUI(xpGain = 0) {
    const profile = profileManager.getProfile();
    if (!profile) return;

    const currentXP = profile.xp;
    const currentStreak = profile.streak;

    // A simple leveling system: XP needed for next level increases
    // For demonstration, let's say 100 XP per 'level' for the bar visualization
    const XP_PER_BAR_CYCLE = 100;
    const progressInCycle = currentXP % XP_PER_BAR_CYCLE;
    const percentage = (progressInCycle / XP_PER_BAR_CYCLE) * 100;

    if (xpTextElement) {
        xpTextElement.textContent = `XP: ${currentXP}`;
    }
    if (xpFillElement) {
        xpFillElement.style.width = `${percentage}%`;
    }
    if (streakBadgeElement) {
        streakBadgeElement.textContent = `Streak: ${currentStreak}`;
    }

    if (xpGain > 0) {
        // Simple visual feedback for XP gain (e.g., flash the bar)
        xpFillElement.style.transition = 'none'; // Disable transition for immediate effect
        xpFillElement.style.backgroundColor = 'gold'; // Temporary color
        setTimeout(() => {
            xpFillElement.style.transition = 'width 0.5s ease-out, background-color 0.3s ease';
            xpFillElement.style.backgroundColor = ''; // Revert to original
        }, 100);
    }
}

/**
 * Adds XP to the user's profile and updates the UI.
 * @param {number} amount - The amount of XP to add.
 */
export function addXP(amount) {
    profileManager.addXP(amount);
    updateXPUI(amount);
}

/**
 * Increments the user's streak and updates the UI.
 */
export function incrementStreak() {
    profileManager.incrementStreak();
    updateXPUI();
}

/**
 * Resets the user's streak and updates the UI.
 */
export function resetStreak() {
    profileManager.resetStreak();
    updateXPUI();
}
