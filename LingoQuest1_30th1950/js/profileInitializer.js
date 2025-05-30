// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// profileInitializer.js
// Purpose: Handles the core logic for loading, creating, and persisting user profiles.
// This module encapsulates the direct interaction with local storage and simulated DB.
// Timestamp: 2025-05-29 09:39:15 PM BST (Updated for optional chaining fix)

import { profileManager } from './profileManager.js';

const LOCAL_STORAGE_PROFILE_KEY = 'lingoQuestProfile';

// ... (typedefs and other functions) ...

/**
 * Handles updating the user's nickname and persisting it.
 * @param {string} newNickname - The new nickname to set.
 * @returns {Promise<void>}
 */
export async function updateAndPersistNickname(newNickname) {
    if (newNickname && newNickname.trim() !== '' && newNickname.trim() !== window.nickname) {
        window.nickname = newNickname.trim();
        // Replace optional chaining with explicit check:
        const nicknameDisplayElement = document.getElementById('nicknameDisplay');
        if (nicknameDisplayElement) {
            nicknameDisplayElement.textContent = window.nickname;
        }

        // Get the current profile from local storage to update its nickname
        let userProfile = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY));
        if (userProfile) {
            userProfile.nickname = window.nickname;
            localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
            await simulateDbSaveProfile(userProfile);
            console.log(`[profileInitializer.js] Nickname updated and persisted to: ${window.nickname}`);
        }
    } else if (newNickname !== null && newNickname.trim() === '') {
        alert('Nickname cannot be empty.');
    }
}
