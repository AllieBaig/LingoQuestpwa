
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// app.js
// Purpose: Main application orchestrator. Initializes user profile, applies themes,
// and manages global application state.
// Timestamp: 2025-05-29 08:44:36 PM BST

import { profileManager } from './profileManager.js';
import { applyTheme, initThemeToggle, getSpecificDateTheme, getRandomFestivalTheme, getRandomNationalDayTheme } from './themeManager.js';
import { initializeUserProfile, updateAndPersistNickname } from './profileInitializer.js'; // Import new module

// Global variables (set by profileInitializer.js via `window` object)
// window.profileID is set by profileInitializer.js
// window.nickname is set by profileInitializer.js

/**
 * Initializes the main application logic after DOM content is loaded.
 */
async function initializeApp() {
    console.log('[app.js] Starting application initialization...');

    // 1. Initialize User Profile (handled by profileInitializer.js)
    const userProfile = await initializeUserProfile();
    
    // Update UI elements that display nickname (if any)
    document.getElementById('nicknameDisplay')?.textContent = window.nickname;
    
    // Add event listener for nickname update (if an update button exists)
    const updateNicknameBtn = document.getElementById('updateNicknameBtn');
    if (updateNicknameBtn) {
        updateNicknameBtn.addEventListener('click', async () => {
            const newNickname = prompt('Enter new nickname:', window.nickname);
            await updateAndPersistNickname(newNickname); // Call the extracted function
        });
    }

    // 2. Apply Theme based on profile settings and current date
    const initialGameData = profileManager.getGameData(); // Get the latest game data from profileManager
    let themeToApply = initialGameData.currentTheme || 'default';

    const specificDayTheme = getSpecificDateTheme(); // Check for specific date theme
    if (specificDayTheme) {
        themeToApply = specificDayTheme;
        console.log(`[app.js] Overriding theme with specific date theme: ${themeToApply}`);
    } else {
        // If no specific day theme, check user's preference
        if (themeToApply === 'random-festival') {
            themeToApply = getRandomFestivalTheme();
            console.log(`[app.js] Applying random festival theme: ${themeToApply}`);
        } else if (themeToApply === 'random-national-day') {
            themeToApply = getRandomNationalDayTheme();
            console.log(`[app.js] Applying random national day theme: ${themeToApply}`);
        }
    }
    
    // Apply the determined theme and initial dark mode setting
    applyTheme(themeToApply, initialGameData.darkMode);
    // initThemeToggle is likely called by main.js now for user interaction,
    // but ensuring initial state for dark mode is set is important here too.
    initThemeToggle(initialGameData.darkMode); 

    console.log('[app.js] Application initialization complete. Profile data and theme ready.');
}

// Automatically initialize the application when DOM content is loaded.
document.addEventListener('DOMContentLoaded', initializeApp);
