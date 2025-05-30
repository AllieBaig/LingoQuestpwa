
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// profileInitializer.js
// Purpose: Handles the core logic for loading, creating, and persisting user profiles.
// This module encapsulates the direct interaction with local storage and simulated DB.
// Timestamp: 2025-05-29 08:44:36 PM BST

import { profileManager } from './profileManager.js';

const LOCAL_STORAGE_PROFILE_KEY = 'lingoQuestProfile';

/**
 * @typedef {object} UserProfile
 * @property {string} profileId - Unique identifier for the user.
 * @property {string} nickname - The user's chosen display name.
 * @property {number} lastLogin - Timestamp of the last login.
 * @property {object} gameData - Contains all game-specific progress (XP, streak, settings).
 * @property {number} gameData.xp - User's experience points.
 * @property {number} gameData.streak - User's current correct answer streak.
 * @property {string} gameData.uiMode - Current UI mode (e.g., 'normal', 'ascii').
 * @property {string} gameData.textSize - Current text size setting (e.g., 'normal', 'senior-big').
 * @property {string} gameData.difficulty - Current difficulty setting (e.g., 'easy', 'medium', 'hard').
 * @property {boolean} gameData.darkMode - Dark mode preference.
 * @property {string} gameData.answerLanguage - Preferred language for answers.
 * @property {string} gameData.currentTheme - User's chosen theme ('default', 'dark', 'diwali', etc. or 'random-festival', 'random-national-day').
 */

/**
 * Prompts the user for a nickname and ensures it's not empty.
 * @returns {string} The validated nickname.
 */
function promptForNickname() {
    let newNickname = '';
    while (newNickname.trim() === '') {
        newNickname = prompt('Welcome to LingoQuest! Please enter a nickname:');
        if (newNickname === null) { // User cancelled
            newNickname = 'Guest';
            break;
        }
        newNickname = newNickname.trim();
        if (newNickname === '') {
            alert('Nickname cannot be empty. Please enter a valid nickname.');
        }
    }
    return newNickname;
}

/**
 * Simulates loading game data from a 'database' based on profileId.
 * In a real application, this would be an AJAX call to your server.
 * @param {string} profileId - The ID of the profile to load.
 * @returns {Promise<object|null>} A promise that resolves with the game data or null if not found.
 */
async function simulateDbLoadGameData(profileId) {
    console.log(`[profileInitializer.js] Simulating DB load for profile: ${profileId}`);
    // For this simulation, we'll just return null to indicate no data found,
    // which will trigger the creation of a new profile.
    // In a real app, you'd fetch from a backend here.
    return null;
}

/**
 * Simulates saving the entire user profile to a 'database'.
 * In a real application, this would be an AJAX call to your server.
 * @param {UserProfile} profile - The user profile object to save.
 * @returns {Promise<boolean>} A promise that resolves to true if save was successful.
 */
async function simulateDbSaveProfile(profile) {
    console.log(`[profileInitializer.js] Simulating DB save for profile ID: ${profile.profileId}, Nickname: ${profile.nickname}`);
    // In a real app, you'd send this data to a backend.
    // For now, we just log and return true.
    return true;
}

/**
 * Initializes the user's profile, loading from local storage or creating a new one.
 * It also sets up global profile ID and nickname, and initializes profileManager.
 * @returns {Promise<UserProfile>} The loaded or newly created user profile.
 */
export async function initializeUserProfile() {
    let userProfile = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY));

    if (userProfile && userProfile.profileId) {
        // Existing profile found in local storage
        window.profileID = userProfile.profileId;
        window.nickname = userProfile.nickname || 'Guest';
        console.log(`[profileInitializer.js] Existing profile loaded: ID=${window.profileID}, Nickname=${window.nickname}`);

        // Optionally, fetch from backend to get latest data if 'db' is primary
        // const dbGameData = await simulateDbLoadGameData(window.profileID);
        // if (dbGameData) {
        //     userProfile.gameData = dbGameData;
        //     console.log('[profileInitializer.js] Game data loaded from simulated DB.');
        // }

    } else {
        // No profile found or invalid, create a new one
        console.log('[profileInitializer.js] No existing profile found. Creating new profile.');
        window.profileID = uuid.v4(); // Generate a new UUID (assuming uuid.min.js is loaded globally)
        window.nickname = promptForNickname(); // Prompt for nickname

        userProfile = {
            profileId: window.profileID,
            nickname: window.nickname,
            lastLogin: Date.now(),
            gameData: { // Initial game data
                xp: 0,
                streak: 0,
                uiMode: 'normal',
                textSize: 'normal',
                difficulty: 'easy',
                darkMode: false,
                answerLanguage: 'en',
                currentTheme: 'default'
            }
        };
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
        console.log(`[profileInitializer.js] New profile created: ID=${window.profileID}, Nickname=${window.nickname}`);

        await simulateDbSaveProfile(userProfile); // Simulate saving the new profile to 'DB'
    }

    // Initialize profileManager with the loaded/created game data
    profileManager.initGameData(userProfile.gameData);

    // Set up auto-save whenever profileManager data changes
    profileManager.onDataChange(() => {
        userProfile.gameData = profileManager.getGameData();
        userProfile.lastLogin = Date.now();
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
        console.log('[profileInitializer.js] Profile saved to Local Storage via data change.');
        simulateDbSaveProfile(userProfile); // Simulate DB save
    });

    return userProfile; // Return the full user profile
}

/**
 * Handles updating the user's nickname and persisting it.
 * @param {string} newNickname - The new nickname to set.
 * @returns {Promise<void>}
 */
export async function updateAndPersistNickname(newNickname) {
    if (newNickname && newNickname.trim() !== '' && newNickname.trim() !== window.nickname) {
        window.nickname = newNickname.trim();
        document.getElementById('nicknameDisplay')?.textContent = window.nickname; // Update UI if element exists

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
