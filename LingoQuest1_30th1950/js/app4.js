
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// app.js
// Purpose: Main application orchestrator. Initializes user profile, applies themes,
// and manages global application state.
// Timestamp: 2025-05-29 09:23:16 PM BST (Updated for optional chaining fix)

import { profileManager } from './profileManager.js';
import { applyTheme, initThemeToggle, getSpecificDateTheme, getRandomFestivalTheme, getRandomNationalDayTheme } from './themeManager.js';
import { initializeUserProfile, updateAndPersistNickname } from './profileInitializer.js';

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
    const nicknameDisplayElement = document.getElementById('nicknameDisplay');
    if (nicknameDisplayElement) { // Use a standard if check instead of optional chaining
        nicknameDisplayElement.textContent = window.nickname;
    }
    
    // Add event listener for nickname update (if an update button exists)
    const updateNicknameBtn = document.getElementById('updateNicknameBtn');
    if (updateNicknameBtn) {
        updateNicknameBtn.addEventListener('click', async () => {
            const newNickname = prompt('Enter new nickname:', window.nickname);
            await updateAndPersistNickname(newNickname);
        });
    }

    // 2. Apply Theme based on profile settings and current date
    const initialGameData = profileManager.getGameData();
    let themeToApply = initialGameData.currentTheme || 'default';

    const specificDayTheme = getSpecificDateTheme();
    if (specificDayTheme) {
        themeToApply = specificDayTheme;
        console.log(`[app.js] Overriding theme with specific date theme: ${themeToApply}`);
    } else {
        if (themeToApply === 'random-festival') {
            themeToApply = getRandomFestivalTheme();
            console.log(`[app.js] Applying random festival theme: ${themeToApply}`);
        } else if (themeToApply === 'random-national-day') {
            themeToApply = getRandomNationalDayTheme();
            console.log(`[app.js] Applying random national day theme: ${themeToApply}`);
        }
    }
    
    applyTheme(themeToApply, initialGameData.darkMode);
    initThemeToggle(initialGameData.darkMode); 

    console.log('[app.js] Application initialization complete. Profile data and theme ready.');
}

document.addEventListener('DOMContentLoaded', initializeApp);
