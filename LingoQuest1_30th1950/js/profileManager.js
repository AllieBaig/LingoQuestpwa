// profileManager.js
// Purpose: Manages user profiles, including UUID, nickname, XP, and streak.
// Usage: Imported by main.js for core profile functionalities.
// Timestamp: 2025-05-28 10:31 PM BST
// License: MIT License (https://opensource.org/licenses/MIT)

import { v4 as uuidv4 } from '../js/lib/uuid.min.js'; // Assuming uuid.min.js is available or polyfilled

const PROFILE_KEY = 'lingoQuestProfile';

/**
 * @typedef {object} UserProfile
 * @property {string} uuid - Unique identifier for the user.
 * @property {string} nickname - User's chosen nickname.
 * @property {number} xp - Current experience points.
 * @property {number} streak - Current correct answer streak.
 * @property {string} deviceId - A fallback device identifier.
 */

export const profileManager = {
    /** @type {UserProfile | null} */
    _userProfile: null,

    /**
     * Initializes the profile manager by loading or creating a user profile.
     * @returns {Promise<void>}
     */
    async init() {
        this._loadProfile();
        if (!this._userProfile) {
            await this._createProfile();
        }
        console.log('Profile loaded:', this._userProfile);
    },

    /**
     * Loads the user profile from localStorage.
     */
    _loadProfile() {
        try {
            const storedProfile = localStorage.getItem(PROFILE_KEY);
            if (storedProfile) {
                this._userProfile = JSON.parse(storedProfile);
                // Ensure all expected properties exist (for backward compatibility)
                this._userProfile.xp = this._userProfile.xp ?? 0;
                this._userProfile.streak = this._userProfile.streak ?? 0;
                this._userProfile.deviceId = this._userProfile.deviceId ?? this._generateDeviceId();
            }
        } catch (e) {
            console.error('Failed to parse profile from localStorage:', e);
            localStorage.removeItem(PROFILE_KEY); // Clear corrupted data
        }
    },

    /**
     * Creates a new user profile.
     * @returns {Promise<void>}
     */
    async _createProfile() {
        const newProfile = {
            uuid: uuidv4(),
            nickname: this._generateRandomNickname(),
            xp: 0,
            streak: 0,
            deviceId: this._generateDeviceId()
        };
        this._userProfile = newProfile;
        this._saveProfile();
        console.log('New profile created:', newProfile);
    },

    /**
     * Saves the current user profile to localStorage.
     */
    _saveProfile() {
        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(this._userProfile));
        } catch (e) {
            console.error('Failed to save profile to localStorage:', e);
        }
    },

    /**
     * Generates a simple fallback device ID.
     * @returns {string}
     */
    _generateDeviceId() {
        return 'device-' + Math.random().toString(36).substring(2, 9);
    },

    /**
     * Generates a random nickname.
     * @returns {string}
     */
    _generateRandomNickname() {
        const adjectives = ['Curious', 'Clever', 'Witty', 'Bright', 'Quick', 'Keen'];
        const nouns = ['Learner', 'Voyager', 'Seeker', 'Explorer', 'Pioneer', 'Maestro'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${adj}${noun}${Math.floor(Math.random() * 99)}`;
    },

    /**
     * Gets the current user profile.
     * @returns {UserProfile | null}
     */
    getProfile() {
        return this._userProfile;
    },

    /**
     * Updates a specific field in the user profile and saves it.
     * @param {keyof UserProfile} key - The key of the profile property to update.
     * @param {any} value - The new value for the property.
     */
    updateProfile(key, value) {
        if (this._userProfile && this._userProfile.hasOwnProperty(key)) {
            this._userProfile[key] = value;
            this._saveProfile();
            console.log(`Profile updated: ${key} = ${value}`);
        } else {
            console.warn(`Attempted to update non-existent profile key: ${key}`);
        }
    },

    /**
     * Sets a new nickname for the user.
     * @param {string} newNickname
     */
    setNickname(newNickname) {
        if (this._userProfile) {
            this._userProfile.nickname = newNickname;
            this._saveProfile();
        }
    },

    /**
     * Adds XP to the user's profile.
     * @param {number} amount - The amount of XP to add.
     */
    addXP(amount) {
        if (this._userProfile) {
            this._userProfile.xp += amount;
            this._saveProfile();
        }
    },

    /**
     * Resets the user's streak.
     */
    resetStreak() {
        if (this._userProfile) {
            this._userProfile.streak = 0;
            this._saveProfile();
        }
    },

    /**
     * Increments the user's streak.
     */
    incrementStreak() {
        if (this._userProfile) {
            this._userProfile.streak += 1;
            this._saveProfile();
        }
    }

    // TODO: Implement profile migration (QR/manual code)
};
