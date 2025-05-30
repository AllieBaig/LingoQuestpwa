
// uiModeManager.js
// Purpose: Manages UI themes (light/dark mode) and UI styles (normal/ASCII).
// Usage: Imported by main.js.
// Timestamp: 2025-05-28 10:33 PM BST
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

const DARK_MODE_KEY = 'lingoQuestDarkMode';
const UI_MODE_KEY = 'lingoQuestUiMode';

/**
 * Manages the UI mode and dark mode settings.
 */
export const uiModeManager = {
    /**
     * Initializes the UI mode and dark mode based on saved preferences or system settings.
     */
    init() {
        this._applyDarkMode(this._getPreferredDarkMode());
        this._applyUiMode(this._getPreferredUiMode());
    },

    /**
     * Toggles dark mode on or off.
     */
    toggleDarkMode() {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem(DARK_MODE_KEY, isDark ? 'true' : 'false');
    },

    /**
     * Sets the UI mode (e.g., 'normal', 'ascii').
     * @param {string} mode - The UI mode to apply.
     */
    setUiMode(mode) {
        document.body.classList.remove('normal-ui', 'ascii-ui', 'minimal-ui'); // Remove all current UI mode classes
        document.body.classList.add(mode + '-ui'); // Add the selected mode class
        localStorage.setItem(UI_MODE_KEY, mode);

        // Enable/disable ASCII stylesheet based on mode
        const asciiStylesheet = document.querySelector('link[href="css/ascii.css"]');
        if (asciiStylesheet) {
            asciiStylesheet.disabled = (mode !== 'ascii');
        }

        // Re-apply 'minimal-ui' if it's the base style
        if (document.body.classList.contains('minimal-ui')) {
            // We need to re-add minimal-ui if it was removed by classList.remove above
            // But usually minimal-ui is applied directly via index.html body class
            // This is a safety check:
            if (!document.body.classList.contains('minimal-ui')) {
                 document.body.classList.add('minimal-ui');
            }
        }
    },

    /**
     * Gets the preferred dark mode setting from localStorage or system preference.
     * @returns {boolean} True if dark mode is preferred, false otherwise.
     */
    _getPreferredDarkMode() {
        const stored = localStorage.getItem(DARK_MODE_KEY);
        if (stored !== null) {
            return stored === 'true';
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    /**
     * Gets the preferred UI mode setting from localStorage.
     * Defaults to 'normal' if not set.
     * @returns {string} The preferred UI mode.
     */
    _getPreferredUiMode() {
        return localStorage.getItem(UI_MODE_KEY) || 'normal';
    },

    /**
     * Applies the dark mode class to the body.
     * @param {boolean} isDark - True to apply dark mode, false to remove.
     */
    _applyDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    },

    /**
     * Applies the UI mode class to the body.
     * @param {string} mode - The UI mode to apply.
     */
    _applyUiMode(mode) {
        // Ensure initial minimal-ui class is handled by HTML, then this manages dynamic changes
        document.body.classList.remove('normal-ui', 'ascii-ui'); // Remove existing UI mode classes
        if (mode === 'normal') {
            document.body.classList.add('normal-ui'); // Explicitly add for consistency if needed
        } else if (mode === 'ascii') {
            document.body.classList.add('ascii-ui');
        }

        // Manage ASCII stylesheet enablement
        const asciiStylesheet = document.querySelector('link[href="css/ascii.css"]');
        if (asciiStylesheet) {
            asciiStylesheet.disabled = (mode !== 'ascii');
        }

        const uiModeSelector = document.getElementById('uiModeSelector');
        if (uiModeSelector) {
            uiModeSelector.value = mode; // Sync the dropdown
        }
    }
};
