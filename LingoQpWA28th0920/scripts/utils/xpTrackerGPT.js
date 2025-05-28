
/**
 * XP Tracker — Manages XP gains and updates UI level/XP bar
 * Depends on: #xpBar, #levelBadge, #xpLabel
 * Reads and updates profile via profileManager.js
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 16:00 | File: scripts/utils/xpTracker.js
 */

import { getProfile, saveProfile } from '../../tools/profileManager.js';

let xpBarEl, levelBadgeEl, xpLabelEl;
let profile;

export function updateXPDisplay(currentXP = 0) {
  if (!xpBarEl) {
    xpBarEl = document.querySelector('#xpBar');
    levelBadgeEl = document.querySelector('#levelBadge');
    xpLabelEl = document.querySelector('#xpLabel');
  }

  profile = getProfile();
  const xp = currentXP ?? profile.xp ?? 0;
  const level = calculateLevel(xp);
  const nextLevelXP = getNextLevelXP(level);

  xpBarEl.value = xp % nextLevelXP;
  xpBarEl.max = nextLevelXP;
  levelBadgeEl.textContent = `Lv ${level}`;
  xpLabelEl.textContent = `XP: ${xp}`;
}

/**
 * Award XP and auto-update profile + UI
 * @param {number} amount - How much XP to add
 */
export function awardXP(amount = 10) {
  profile = getProfile();
  profile.xp = (profile.xp || 0) + amount;
  saveProfile(profile);
  updateXPDisplay(profile.xp);
}

/**
 * Calculate level based on XP
 * Uses flat progression: every 100 XP = 1 level
 */
function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

/**
 * Get how much XP is needed for the current level
 */
function getNextLevelXP(level) {
  return 100; // static level size for now; can expand later
}


