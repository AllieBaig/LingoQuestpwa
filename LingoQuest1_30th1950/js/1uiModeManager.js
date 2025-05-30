
// uiModeManager.js
// Purpose: Manages UI themes (light/dark mode) and UI styles (normal/ASCII) and text sizing.
// Usage: Imported by main.js.
// Timestamp: 2025-05-29 09:44:00 AM BST
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

const DARK_MODE_KEY = 'lingoQuestDarkMode';
const UI_MODE_KEY = 'lingoQuestUiMode';
const TEXT_SIZE_KEY = 'lingoQuestTextSize'; // New key for text size preference

export const uiModeManager = {
    /**
     * Initializes the UI mode, dark mode, and text size based on saved preferences or system settings.
     */
    init() {
        this._applyDarkMode(this._getPreferredDarkMode());
        this._applyUiMode(this._getPreferredUiMode());
        this._applyTextSize(this._getPreferredTextSize()); // Apply text size on init

        // Event listener for Text Size selector
        const textSizeSelector = document.getElementById('textSizeSelector');
        if (textSizeSelector) {
            textSizeSelector.addEventListener('change', (event) => {
                this.setTextSize(event.target.value);
            });
        }
    },

    /**
     * Toggles dark mode on or off.
     */
    toggleDarkMode() {
        const isDark = !document.body.classList.contains('dark'); // Determine new state
        document.body.classList.toggle('dark', isDark); // Apply/remove class
        localStorage.setItem(DARK_MODE_KEY, isDark ? 'true' : 'false');
        this._updateDarkModeIcon(isDark); // Update icon
    },

    /**
     * Sets the UI mode (e.g., 'normal', 'ascii').
     * @param {string} mode - The UI mode to apply.
     */
    setUiMode(mode) {
        document.body.classList.remove('normal-ui', 'ascii-ui'); // Remove all current UI mode classes
        if (mode === 'normal') {
            document.body.classList.add('normal-ui');
        } else if (mode === 'ascii') {
            document.body.classList.add('ascii-ui');
        }
        localStorage.setItem(UI_MODE_KEY, mode);

        // Enable/disable ASCII stylesheet based on mode
        const asciiStylesheet = document.querySelector('link[href="css/ascii.css"]');
        if (asciiStylesheet) {
            asciiStylesheet.disabled = (mode !== 'ascii');
        }

        const uiModeSelector = document.getElementById('uiModeSelector');
        if (uiModeSelector) {
            uiModeSelector.value = mode; // Sync the dropdown
        }
    },

    /**
     * Sets the text size theme (e.g., 'normal', 'senior-big', 'senior-very-big').
     * @param {string} sizeClass - The class to apply for text size.
     */
    setTextSize(sizeClass) {
        // Remove existing size classes to ensure only one is active
        document.body.classList.remove('senior-big', 'senior-very-big');

        if (sizeClass === 'senior-big') {
            document.body.classList.add('senior-big');
        } else if (sizeClass === 'senior-very-big') {
            document.body.classList.add('senior-very-big');
        }
        // If sizeClass is 'normal', no specific class is added, just remove others

        localStorage.setItem(TEXT_SIZE_KEY, sizeClass); // Save preference

        const textSizeSelector = document.getElementById('textSizeSelector');
        if (textSizeSelector) {
            textSizeSelector.value = sizeClass; // Sync the dropdown
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
     * Gets the preferred text size setting from localStorage.
     * Defaults to 'normal' if not set.
     * @returns {string} The preferred text size class.
     */
    _getPreferredTextSize() {
        return localStorage.getItem(TEXT_SIZE_KEY) || 'normal';
    },

    /**
     * Applies the dark mode class to the body and updates the icon.
     * @param {boolean} isDark - True to apply dark mode, false to remove.
     */
    _applyDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        this._updateDarkModeIcon(isDark); // Update icon on initial load
    },

    /**
     * Updates the dark mode icon based on the current dark mode state. (NEW PRIVATE METHOD)
     * @param {boolean} isDark - True if dark mode is active, false otherwise.
     */
    _updateDarkModeIcon(isDark) {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            if (isDark) {
                darkModeToggle.classList.remove('fa-moon');
                darkModeToggle.classList.add('fa-sun');
            } else {
                darkModeToggle.classList.remove('fa-sun');
                darkModeToggle.classList.add('fa-moon');
            }
        }
    },

    /**
     * Applies the UI mode class to the body.
     * @param {string} mode - The UI mode to apply.
     */
    _applyUiMode(mode) {
        document.body.classList.remove('normal-ui', 'ascii-ui');
        if (mode === 'normal') {
            document.body.classList.add('normal-ui');
        } else if (mode === 'ascii') {
            document.body.classList.add('ascii-ui');
        }

        const asciiStylesheet = document.querySelector('link[href="css/ascii.css"]');
        if (asciiStylesheet) {
            asciiStylesheet.disabled = (mode !== 'ascii');
        }

        const uiModeSelector = document.getElementById('uiModeSelector');
        if (uiModeSelector) {
            uiModeSelector.value = mode;
        }
    },

    /**
     * Applies the text size class to the body.
     * @param {string} sizeClass - The text size class to apply.
     */
    _applyTextSize(sizeClass) {
        // Ensure only one size class is active
        document.body.classList.remove('senior-big', 'senior-very-big');
        if (sizeClass === 'senior-big') {
            document.body.classList.add('senior-big');
        } else if (sizeClass === 'senior-very-big') {
            document.body.classList.add('senior-very-big');
        }

        const textSizeSelector = document.getElementById('textSizeSelector');
        if (textSizeSelector) {
            textSizeSelector.value = sizeClass;
        }
    }
};
