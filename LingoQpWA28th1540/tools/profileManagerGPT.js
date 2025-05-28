
/**
 * Profile Manager for LingoQuestPWA
 * Generates and persists a user profile with UUID, nickname, XP
 * Supports fallback device ID + random nickname combo
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 16:05 | File: tools/profileManager.js
 */

const PROFILE_KEY = 'lingoquest-profile';

/**
 * Load or initialize the user profile
 * @returns {Object} profile
 */
export function loadUserProfile() {
  let profile = getProfile();

  if (!profile.id) {
    profile.id = generateUUID();
  }

  if (!profile.nickname) {
    profile.nickname = generateNickname();
  }

  if (typeof profile.xp !== 'number') {
    profile.xp = 0;
  }

  saveProfile(profile);
  return profile;
}

/**
 * Get profile from localStorage (or empty)
 */
export function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save updated profile back to localStorage
 */
export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Profile save error', err);
  }
}

/**
 * Generate a pseudo-random nickname like "SwiftFox"
 */
function generateNickname() {
  const adjectives = ['Swift', 'Bright', 'Clever', 'Quiet', 'Bold', 'Lucky'];
  const animals = ['Fox', 'Owl', 'Wolf', 'Cat', 'Bee', 'Crab'];
  const a = adjectives[Math.floor(Math.random() * adjectives.length)];
  const b = animals[Math.floor(Math.random() * animals.length)];
  return `${a}${b}`;
}

/**
 * Generate a UUID (v4-style, RFC4122 compliant)
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
