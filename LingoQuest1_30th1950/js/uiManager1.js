
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// uiManager.js
// Purpose: Manages UI themes (light/dark mode), UI styles (normal/ASCII), text sizing,
// and overall view switching between main menu and game container.
// Usage: Imported by main.js and gameCore.js.
// Timestamp: 2025-05-30 06:05:00 AM BST (Added view switching, renamed from uiModeManager)

import { logEvent } from './eventLogger.js'; // Import logEvent for logging UI actions

const DARK_MODE_KEY = 'lingoQuestDarkMode';
const UI_MODE_KEY = 'lingoQuestUiMode';
const TEXT_SIZE_KEY = 'lingoQuestTextSize'; // New key for text size preference

const gameModesSection = document.getElementById('gameModes');
const gameContainerSection = document.getElementById('gameContainer');

export const uiManager = { // Renamed from uiModeManager to uiManager
    /**
     * Initializes the UI mode, dark mode, text size, and initial view based on saved preferences or system settings.
     */
    init() {
        logEvent('[uiManager.js] Initializing UI Manager.', 'info');
        this._applyDarkMode(this._getPreferredDarkMode());
        this._applyUiMode(this._getPreferredUiMode());
        this._applyTextSize(this._getPreferredTextSize()); // Apply text size on init

        // Ensure game container is hidden on initial load
        if (gameModesSection && gameContainerSection) {
            gameModesSection.style.display = 'flex';
            gameContainerSection.style.display = 'none';
            logEvent('[uiManager.js] Initial view set: Main Menu visible, Game Container hidden.', 'ui');
        } else {
            console.warn('[uiManager.js] Could not find gameModesSection or gameContainerSection on init.');
        }

        // Event listener for Text Size selector
        const textSizeSelector = document.getElementById('textSizeSelector');
        if (textSizeSelector) {
            textSizeSelector.addEventListener('change', (event) => {
                const selectedSize = event.target.value;
                logEvent(`Text Size changed to: ${selectedSize} via UI Manager.`, 'change', { textSize: selectedSize });
                this.setTextSize(selectedSize);
            });
        }

        // Event listener for UI Mode selector (moved from main.js)
        const uiModeSelector = document.getElementById('uiModeSelector');
        if (uiModeSelector) {
            uiModeSelector.addEventListener('change', (event) => {
                const selectedMode = event.target.value;
                logEvent(`UI Mode changed to: ${selectedMode} via UI Manager.`, 'change', { uiMode: selectedMode });
                this.setUiMode(selectedMode);
            });
        }

        // Event listener for Dark Mode Toggle (moved from themeManager.js logic into uiManager, if themeManager is separate)
        // If themeManager is truly standalone and manages its own toggle, this can be removed or adapted.
        // Assuming themeManager handles its own toggle:
        // const darkModeToggle = document.getElementById('darkModeToggle');
        // if (darkModeToggle) {
        //     darkModeToggle.addEventListener('click', () => {
        //         this.toggleDarkMode();
        //     });
        // }
        // NOTE: The dark mode toggle logic is primarily in themeManager.js, which self-initializes.
        // We will *not* add it here to avoid duplication or conflict.
    },

    /**
     * Toggles dark mode on or off.
     */
    toggleDarkMode() { // This method is now likely called by themeManager.js via its own event listener.
        const isDark = !document.body.classList.contains('dark'); // Determine new state
        document.body.classList.toggle('dark', isDark); // Apply/remove class
        localStorage.setItem(DARK_MODE_KEY, isDark ? 'true' : 'false');
        this._updateDarkModeIcon(isDark); // Update icon
        logEvent(`Dark mode toggled to: ${isDark}`, 'ui', { isDark: isDark });
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
        logEvent(`UI Mode set to: ${mode}`, 'ui', { mode: mode });
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
        logEvent(`Text Size set to: ${sizeClass}`, 'ui', { size: sizeClass });
    },

    /**
     * Displays the main game mode selection menu and hides the game container.
     */
    showMainMenu() {
        if (gameModesSection && gameContainerSection) {
            gameModesSection.style.display = 'flex';
            gameContainerSection.style.display = 'none';
            logEvent('[uiManager.js] Switched to Main Menu view.', 'ui');
        } else {
            console.error('[uiManager.js] Cannot switch to main menu: gameModesSection or gameContainerSection not found.');
            logEvent('Error switching to Main Menu view: essential elements missing.', 'error');
        }
    },

    /**
     * Displays the game container and hides the main game mode selection menu.
     */
    showGameContainer() {
        if (gameModesSection && gameContainerSection) {
            gameModesSection.style.display = 'none';
            gameContainerSection.style.display = 'flex';
            logEvent('[uiManager.js] Switched to Game Container view.', 'ui');
        } else {
            console.error('[uiManager.js] Cannot switch to game container: gameModesSection or gameContainerSection not found.');
            logEvent('Error switching to Game Container view: essential elements missing.', 'error');
        }
    },

    // --- Private Helper Methods ---

    _getPreferredDarkMode() {
        const stored = localStorage.getItem(DARK_MODE_KEY);
        if (stored !== null) {
            return stored === 'true';
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    _getPreferredUiMode() {
        return localStorage.getItem(UI_MODE_KEY) || 'normal';
    },

    _getPreferredTextSize() {
        return localStorage.getItem(TEXT_SIZE_KEY) || 'normal';
    },

    _applyDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        this._updateDarkModeIcon(isDark); // Update icon on initial load
    },

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

    _applyTextSize(sizeClass) {
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

// No need for a DOMContentLoaded listener here if main.js calls uiManager.init() explicitly.
// But if this module is expected to be truly standalone or used elsewhere without explicit init,
// you might keep a minimal DOMContentLoaded listener that only calls uiManager.init().
// For now, main.js will explicitly call uiManager.init().
