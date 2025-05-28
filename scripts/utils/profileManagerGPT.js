
/**
 * Profile Manager
 * Creates and loads user profiles using UUID + nickname combo.
 * Stores XP, streak, and settings in localStorage.
 * Related: xpTracker.js, uiModeManager.js, trail.js, all game modes
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 22:05 | File: tools/profileManager.js
 */

export function loadUserProfile() {
  let profile = JSON.parse(localStorage.getItem('userProfile'));

  if (!profile || !profile.uuid || !profile.nickname) {
    profile = createNewProfile();
    saveUserProfile(profile);
  }

  // Set XP & streak defaults if missing
  if (localStorage.getItem('xpTotal') === null) {
    localStorage.setItem('xpTotal', '0');
  }

  if (localStorage.getItem('streakDays') === null) {
    localStorage.setItem('streakDays', '0');
  }

  return profile;
}

export function saveUserProfile(profile) {
  localStorage.setItem('userProfile', JSON.stringify(profile));
}

export function createNewProfile() {
  const uuid = crypto.randomUUID();
  const nickname = generateNickname();
  return { uuid, nickname };
}

function generateNickname() {
  const words1 = ['Brave', 'Swift', 'Bright', 'Clever', 'Kind'];
  const words2 = ['Falcon', 'Otter', 'Maple', 'Echo', 'Nimbus'];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return pick(words1) + pick(words2);
}

// Optional: show nickname in UI
export function displayNickname() {
  const profile = loadUserProfile();
  const nameEl = document.getElementById('nicknameDisplay');
  if (nameEl) nameEl.textContent = profile.nickname;
}

