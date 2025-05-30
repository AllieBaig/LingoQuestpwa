
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// app.js
// Purpose: Main application orchestrator. Initializes user profile, applies themes,
// and manages global application state.
// Timestamp: 2025-05-30 03:41:50 AM BST (Adjusted for standalone themeManager)

// COMMENT OUT PROFILE-RELATED IMPORTS (as decided earlier)
// import { profileManager } from './profileManager.js';
// import { initializeUserProfile, updateAndPersistNickname } from './profileInitializer.js';

// REMOVE THEME MANAGER IMPORTS, as it's now standalone and self-initializing
// import { applyTheme, initThemeToggle, getSpecificDateTheme, getRandomFestivalTheme, getRandomNationalDayTheme } from './themeManager.js';


// Global variables (set by profileInitializer.js via `window` object)
// window.profileID is set by profileInitializer.js
// window.nickname is set by profileInitializer.js

/**
 * Initializes the main application logic after DOM content is loaded.
 */
async function initializeApp() {
    console.log('[app.js] Starting application initialization...');

    // --- PROFILE INITIALIZATION (Temporarily disabled, will re-enable later) ---
    // console.log('[app.js] Profile initialization is temporarily disabled.');
    window.profileID = 'temp-disabled-id'; // Provide dummy values
    window.nickname = 'Guest';

    const nicknameDisplayElement = document.getElementById('nicknameDisplay');
    if (nicknameDisplayElement) {
        nicknameDisplayElement.textContent = window.nickname;
    }

    const updateNicknameBtn = document.getElementById('updateNicknameBtn');
    if (updateNicknameBtn) {
        updateNicknameBtn.style.display = 'none'; // Hide if not functional
    }
    // --- END PROFILE INITIALIZATION BLOCK ---

    // --- THEME APPLICATION LOGIC REMOVED (Handled by standalone themeManager.js) ---
    // This section is commented out as themeManager.js will now self-initialize.
    // The initThemeManager function in themeManager.js will read preferences and apply them.
    // console.log('[app.js] Theme application delegated to standalone themeManager.js.');
    // --- END THEME APPLICATION LOGIC ---

    console.log('[app.js] Application initialization complete. Core app logic running.');
}

document.addEventListener('DOMContentLoaded', initializeApp);
