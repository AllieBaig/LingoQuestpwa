
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// app.js
// Purpose: Main application orchestrator. Initializes user profile, applies themes,
// and manages global application state.
// Timestamp: 2025-05-30 11:06:24 PM BST (Updated for temporary profile disable)

// COMMENT OUT PROFILE-RELATED IMPORTS
// import { profileManager } from './profileManager.js';
// import { initializeUserProfile, updateAndPersistNickname } from './profileInitializer.js';

// Keep themeManager for now, as we want to see if themes work independently
import { applyTheme, initThemeToggle, getSpecificDateTheme, getRandomFestivalTheme, getRandomNationalDayTheme } from './themeManager.js';


// Global variables (set by profileInitializer.js via `window` object)
// window.profileID is set by profileInitializer.js
// window.nickname is set by profileInitializer.js

/**
 * Initializes the main application logic after DOM content is loaded.
 */
async function initializeApp() {
    console.log('[app.js] Starting application initialization...');

    // --- TEMPORARILY DISABLE PROFILE INITIALIZATION ---
    // console.log('[app.js] Profile initialization is temporarily disabled.');
    // You might want to set default values for window.profileID and window.nickname
    // if other parts of your code strictly rely on them existing, even if dummy.
    window.profileID = 'temp-disabled-id';
    window.nickname = 'Guest';

    // Update UI elements that display nickname (if any)
    const nicknameDisplayElement = document.getElementById('nicknameDisplay');
    if (nicknameDisplayElement) {
        nicknameDisplayElement.textContent = window.nickname;
    }

    // Add event listener for nickname update (if an update button exists)
    const updateNicknameBtn = document.getElementById('updateNicknameBtn');
    if (updateNicknameBtn) {
        // updateNicknameBtn.addEventListener('click', async () => {
        //     const newNickname = prompt('Enter new nickname:', window.nickname);
        //     await updateAndPersistNickname(newNickname);
        // });
        updateNicknameBtn.style.display = 'none'; // Hide if not functional
    }

    // --- CONTINUE WITH THEME APPLICATION (if you want to test themes without profile) ---
    // NOTE: This will apply the default theme or random themes, as profileManager.getGameData()
    // will not be available or will return default values if profileManager is entirely commented out.
    // For now, let's manually apply default theme.
    // const initialGameData = profileManager.getGameData(); // This will error if profileManager isn't there.
    let themeToApply = 'default'; // Force default theme for testing
    let darkModeState = false; // Force light mode for testing

    // The logic below relies on profileManager, so we'll simplify for now
    // const specificDayTheme = getSpecificDateTheme();
    // if (specificDayTheme) {
    //     themeToApply = specificDayTheme;
    //     console.log(`[app.js] Overriding theme with specific date theme: ${themeToApply}`);
    // } else {
    //     if (themeToApply === 'random-festival') {
    //         themeToApply = getRandomFestivalTheme();
    //         console.log(`[app.js] Applying random festival theme: ${themeToApply}`);
    //     } else if (themeToApply === 'random-national-day') {
    //         themeToApply = getRandomNationalDayTheme();
    //         console.log(`[app.js] Applying random national day theme: ${themeToApply}`);
    //     }
    // }
    
    // Explicitly apply default theme and light mode for testing
    applyTheme(themeToApply, darkModeState);
    initThemeToggle(darkModeState);

    console.log('[app.js] Application initialization complete. Profile system disabled for testing.');
}

document.addEventListener('DOMContentLoaded', initializeApp);
