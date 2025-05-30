
// app.js
// Purpose: Manages the core application lifecycle, user profile initialization,
// and interaction with the profileManager for data persistence.
// This is the main orchestrator for user sessions.
// Timestamp: 2025-05-29 06:07:02 PM BST
// License: MIT License (https://opensource.org/licenses/MIT)

import { profileManager } from './profileManager.js';

// Define global variables for the current profile's ID and nickname.
// These are exposed globally because other modules (like main.js)
// might need to access the current user's identity, especially for
// features that interact with a 'backend' or unique user state.
window.profileID = null;
window.nickname = 'Guest'; // Default nickname until set by user

const LOCAL_STORAGE_PROFILE_KEY = 'lingoQuestProfile';

/**
 * Represents the structure of a user's full profile,
 * which includes basic user info and their game-specific data.
 * This structure will be stored in Local Storage (and ideally, a backend).
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
    console.log(`[app.js] Simulating DB load for profile: ${profileId}`);
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
    console.log(`[app.js] Simulating DB save for profile ID: ${profile.profileId}, Nickname: ${profile.nickname}`);
    // In a real app, you'd send this data to a backend.
    // For now, we just log and return true.
    return true;
}

/**
 * Initializes the user's profile and game data.
 * This function is called once at application start.
 */
async function initializeUserProfile() {
    let userProfile = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY));

    if (userProfile && userProfile.profileId) {
        // Existing profile found in local storage
        window.profileID = userProfile.profileId;
        window.nickname = userProfile.nickname || 'Guest';
        console.log(`[app.js] Existing profile loaded: ID=${window.profileID}, Nickname=${window.nickname}`);

        // Simulate loading game data from 'DB' (optional, as local storage holds it for now)
        // const dbGameData = await simulateDbLoadGameData(window.profileID);
        // if (dbGameData) {
        //     userProfile.gameData = dbGameData; // Update with server data if available
        //     console.log('[app.js] Game data loaded from simulated DB.');
        // }

    } else {
        // No profile found or invalid, create a new one
        console.log('[app.js] No existing profile found. Creating new profile.');
        window.profileID = uuid.v4(); // Generate a new UUID
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
                answerLanguage: 'en'
            }
        };
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
        console.log(`[app.js] New profile created: ID=${window.profileID}, Nickname=${window.nickname}`);

        // Simulate saving the new profile to 'DB'
        await simulateDbSaveProfile(userProfile);
    }

    // Initialize profileManager with the loaded/created game data
    profileManager.initGameData(userProfile.gameData);

    // Update UI elements that display nickname (if any)
    document.getElementById('nicknameDisplay')?.textContent = window.nickname;
    
    // Add event listener for nickname update (e.g., from a settings modal)
    const updateNicknameBtn = document.getElementById('updateNicknameBtn'); // Assuming you'll add this button
    if (updateNicknameBtn) {
        updateNicknameBtn.addEventListener('click', async () => {
            const newNickname = prompt('Enter new nickname:', window.nickname);
            if (newNickname && newNickname.trim() !== '' && newNickname.trim() !== window.nickname) {
                window.nickname = newNickname.trim();
                document.getElementById('nicknameDisplay').textContent = window.nickname;
                
                // Update the profile in local storage
                userProfile.nickname = window.nickname;
                localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
                
                // Simulate saving to DB
                await simulateDbSaveProfile(userProfile);
                console.log(`[app.js] Nickname updated to: ${window.nickname}`);
            } else if (newNickname !== null && newNickname.trim() === '') {
                alert('Nickname cannot be empty.');
            }
        });
    }

    // Save profile to local storage and 'DB' periodically or on critical actions
    // This is a simplified auto-save; in a real app, you'd debounce or manage this more carefully.
    profileManager.onDataChange(() => {
        userProfile.gameData = profileManager.getGameData(); // Get latest game data
        userProfile.lastLogin = Date.now(); // Update last login on any change
        localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
        console.log('[app.js] Profile saved to Local Storage.');
        simulateDbSaveProfile(userProfile); // Simulate DB save
    });

    console.log('[app.js] Application initialization complete. Profile data ready.');
}

// Automatically initialize the user profile when app.js loads.
// Using DOMContentLoaded ensures the DOM is fully loaded before trying to access elements,
// though for this script's global setup nature, it's mostly about ensuring dependencies are met.
document.addEventListener('DOMContentLoaded', initializeUserProfile);

