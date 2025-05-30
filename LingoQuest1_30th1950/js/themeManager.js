// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// themeManager.js
// Purpose: Manages application themes (including dark mode) and provides
// functionality to apply themes based on user preference, specific dates, or OS styles.
// Designed to be a standalone module.
// Timestamp: 2025-05-30 05:25:00 AM BST (Logging events to eventLogger.js)

// CHANGED: Import logEvent from eventLogger.js
import { logEvent } from './eventLogger.js';

/**
 * Configuration for the Theme Manager.
 * @typedef {object} ThemeManagerConfig
 * @property {string} themeKey - The localStorage key to store the user's theme preference.
 * @property {string} darkModeKey - The localStorage key to store the user's dark mode preference.
 * @property {string} defaultThemeId - The ID of the default theme to apply if no preference is found.
 * @property {boolean} defaultDarkMode - The default dark mode state if no preference is found.
 * @property {string} themeSelectorId - The ID of the HTML select element for theme selection.
 * @property {string} darkModeToggleId - The ID of the HTML button/input for dark mode toggle.
 */

/** @type {ThemeManagerConfig} */
const themeManagerConfig = {
    themeKey: 'appTheme',
    darkModeKey: 'appDarkMode',
    defaultThemeId: 'default',
    defaultDarkMode: false,
    themeSelectorId: 'themeSelector',
    darkModeToggleId: 'darkModeToggle'
};

/**
 * Defines a custom theme.
 * @typedef {object} CustomTheme
 * @property {string} id - Unique identifier for the theme.
 * @property {string} name - Display name for the theme.
 * @property {string[]} classes - CSS classes to apply to the <body> element.
 * @property {string} [dataAttribute] - Optional data attribute for special themes (e.g., 'data-ascii-mode').
 * @property {string} [dataValue] - Optional value for the data attribute.
 */

/**
 * Array of custom theme definitions.
 * @type {CustomTheme[]}
 */
const customThemes = [
    { id: 'default', name: 'Default', classes: ['default-theme'] },
    { id: 'oceanic', name: 'Oceanic', classes: ['oceanic-theme'] },
    { id: 'forest', name: 'Forest', classes: ['forest-theme'] },
    { id: 'sunset', name: 'Sunset', classes: ['sunset-theme'] },
    { id: 'candy', name: 'Candy', classes: ['candy-theme'] },
    { id: 'midnight', name: 'Midnight', classes: ['midnight-theme'] },
    { id: 'cyberpunk', name: 'Cyberpunk', classes: ['cyberpunk-theme'] },
    { id: 'retro', name: 'Retro', classes: ['retro-theme'] },
    { id: 'ascii', name: 'ASCII Terminal', classes: ['ascii-theme'], dataAttribute: 'data-ui-mode', dataValue: 'ascii' },
    
    // --- NEW OS-BASED THEMES ---
    { id: 'android', name: 'Android OS', classes: ['android-theme'] },
    { id: 'ios', name: 'iOS', classes: ['ios-theme'] },
    { id: 'windows98', name: 'Windows 98', classes: ['windows98-theme'] },
    { id: 'windowsxp', name: 'Windows XP', classes: ['windowsxp-theme'] },
    { id: 'ubuntu', name: 'Ubuntu', classes: ['ubuntu-theme'] },
    { id: 'redhat', name: 'Red Hat', classes: ['redhat-theme'] },

    // --- RANDOM THEMES (keep at the end for dropdown behavior) ---
    { id: 'random-festival', name: 'Random Festival', classes: [] },
    { id: 'random-national-day', name: 'Random National Day', classes: [] }
];

/**
 * Festival themes.
 * @type {string[]}
 */
const festivalThemes = [
    'christmas-theme', 'halloween-theme', 'easter-theme', 'diwali-theme'
];

/**
 * National day themes.
 * @type {string[]}
 */
const nationalDayThemes = [
    'usa-national-day-theme', 'canada-national-day-theme', 'uk-national-day-theme'
];

/**
 * Date-specific themes.
 * @type {object[]}
 */
const dateSpecificThemes = [
    { month: 12, day: 25, themeId: 'christmas-theme' },
    { month: 10, day: 31, themeId: 'halloween-theme' },
    { month: 4, day: 1, themeId: 'easter-theme' },
    { month: 11, day: 1, themeId: 'diwali-theme' },
    { month: 7, day: 4, themeId: 'usa-national-day-theme' },
    { month: 7, day: 1, themeId: 'canada-national-day-theme' },
    { month: 4, day: 23, themeId: 'uk-national-day-theme' }
];

/**
 * Applies the specified theme to the document body.
 * @param {string} themeId - The ID of the theme to apply.
 * @param {boolean} isDarkMode - Whether dark mode should be enabled.
 */
export function applyTheme(themeId, isDarkMode) {
    const body = document.body;

    customThemes.forEach(theme => {
        theme.classes.forEach(cls => body.classList.remove(cls));
        if (theme.dataAttribute) {
            body.removeAttribute(theme.dataAttribute);
        }
    });
    festivalThemes.forEach(cls => body.classList.remove(cls));
    nationalDayThemes.forEach(cls => body.classList.remove(cls));

    const selectedTheme = customThemes.find(t => t.id === themeId);
    if (selectedTheme) {
        selectedTheme.classes.forEach(cls => body.classList.add(cls));
        if (selectedTheme.dataAttribute && selectedTheme.dataValue) {
            body.setAttribute(selectedTheme.dataAttribute, selectedTheme.dataValue);
        }
    } else {
        body.classList.add(themeId); 
    }

    if (isDarkMode) {
        body.classList.add('dark');
        body.classList.remove('light');
    } else {
        body.classList.add('light');
        body.classList.remove('dark');
    }
    logEvent(`Applied theme: "${themeId}", Dark Mode: ${isDarkMode}`, 'ui', { theme: themeId, darkMode: isDarkMode }); // Event log
}

/**
 * Initializes and toggles the dark mode state.
 * @param {boolean} enableDarkMode - True to enable dark mode, false to disable.
 * @param {boolean} [savePreference=true] - Whether to save the preference to localStorage.
 */
export function initThemeToggle(enableDarkMode, savePreference = true) {
    const body = document.body;
    if (enableDarkMode) {
        body.classList.add('dark');
        body.classList.remove('light');
    } else {
        body.classList.add('light');
        body.classList.remove('dark');
    }

    const darkModeToggle = document.getElementById(themeManagerConfig.darkModeToggleId);
    if (darkModeToggle) {
        if (darkModeToggle.tagName === 'BUTTON') {
            darkModeToggle.textContent = enableDarkMode ? 'Light Mode' : 'Dark Mode';
        } else if (darkModeToggle.type === 'checkbox' || darkModeToggle.type === 'switch') {
            darkModeToggle.checked = enableDarkMode;
        }
    }

    if (savePreference) {
        localStorage.setItem(themeManagerConfig.darkModeKey, enableDarkMode.toString());
        logEvent(`Dark mode preference saved: ${enableDarkMode}`, 'ui', { darkModeSaved: enableDarkMode }); // Event log
    }
}

/**
 * Returns an array of available custom themes for display in a dropdown.
 * @returns {CustomTheme[]}
 */
export function getAvailableCustomThemes() {
    return customThemes.filter(theme => 
        theme.id !== 'random-festival' && 
        theme.id !== 'random-national-day'
    );
}

/**
 * Gets a specific date-based theme if the current date matches.
 * @returns {string|null} The theme ID if a match is found, otherwise null.
 */
export function getSpecificDateTheme() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const matchedTheme = dateSpecificThemes.find(
        theme => theme.month === currentMonth && theme.day === currentDay
    );

    return matchedTheme ? matchedTheme.themeId : null;
}

/**
 * Gets a random festival theme.
 * @returns {string} The ID of a random festival theme class.
 */
export function getRandomFestivalTheme() {
    const randomIndex = Math.floor(Math.random() * festivalThemes.length);
    return festivalThemes[randomIndex];
}

/**
 * Gets a random national day theme.
 * @returns {string} The ID of a random national day theme class.
 */
export function getRandomNationalDayTheme() {
    const randomIndex = Math.floor(Math.random() * nationalDayThemes.length);
    return nationalDayThemes[randomIndex];
}

/**
 * Initializes the theme manager.
 * @param {ThemeManagerConfig} [configOverrides] - Optional overrides for default config.
 */
export function initThemeManager(configOverrides = {}) {
    Object.assign(themeManagerConfig, configOverrides);
    logEvent('[themeManager.js] Initializing theme manager.', 'info', { config: themeManagerConfig }); // Event log

    let savedThemeId = localStorage.getItem(themeManagerConfig.themeKey) || themeManagerConfig.defaultThemeId;
    let savedDarkMode = localStorage.getItem(themeManagerConfig.darkModeKey) === 'true' || themeManagerConfig.defaultDarkMode;

    const specificDayTheme = getSpecificDateTheme();
    if (specificDayTheme) {
        savedThemeId = specificDayTheme;
        logEvent(`Overriding theme with specific date theme: ${savedThemeId}`, 'info'); // Event log
    } else {
        if (savedThemeId === 'random-festival') {
            const actualRandomTheme = getRandomFestivalTheme();
            logEvent(`Applying random festival theme: ${actualRandomTheme}`, 'ui'); // Event log
            savedThemeId = actualRandomTheme;
            localStorage.setItem(themeManagerConfig.themeKey, savedThemeId); 
        } else if (savedThemeId === 'random-national-day') {
            const actualRandomTheme = getRandomNationalDayTheme();
            logEvent(`Applying random national day theme: ${actualRandomTheme}`, 'ui'); // Event log
            savedThemeId = actualRandomTheme;
            localStorage.setItem(themeManagerConfig.themeKey, savedThemeId);
        }
    }

    applyTheme(savedThemeId, savedDarkMode);
    initThemeToggle(savedDarkMode, false);

    const themeSelector = document.getElementById(themeManagerConfig.themeSelectorId);
    if (themeSelector) {
        const themesForDropdown = getAvailableCustomThemes();
        themeSelector.innerHTML = '';
        themesForDropdown.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.id;
            option.textContent = theme.name;
            themeSelector.appendChild(option);
        });
        const randomFestivalOption = document.createElement('option');
        randomFestivalOption.value = 'random-festival';
        randomFestivalOption.textContent = 'Random Festival';
        themeSelector.appendChild(randomFestivalOption);

        const randomNationalDayOption = document.createElement('option');
        randomNationalDayOption.value = 'random-national-day';
        randomNationalDayOption.textContent = 'Random National Day';
        themeSelector.appendChild(randomNationalDayOption);

        themeSelector.value = localStorage.getItem(themeManagerConfig.themeKey) || themeManagerConfig.defaultThemeId;
        
        themeSelector.addEventListener('change', (e) => {
            const selectedThemeId = e.target.value;
            logEvent(`User selected theme from dropdown: "${selectedThemeId}"`, 'change', { selectedTheme: selectedThemeId }); // Event log
            localStorage.setItem(themeManagerConfig.themeKey, selectedThemeId);
            const currentDarkModeState = document.body.classList.contains('dark');
            
            let actualThemeToApply = selectedThemeId;
            if (selectedThemeId === 'random-festival') {
                actualThemeToApply = getRandomFestivalTheme();
            } else if (selectedThemeId === 'random-national-day') {
                actualThemeToApply = getRandomNationalDayTheme();
            }
            logEvent(`Applying actual theme after selection: "${actualThemeToApply}" with Dark Mode: ${currentDarkModeState}`, 'ui'); // Event log
            applyTheme(actualThemeToApply, currentDarkModeState);
        });
    } else {
        console.warn('[themeManager.js] Theme Selector not found.');
    }

    const darkModeToggle = document.getElementById(themeManagerConfig.darkModeToggleId);
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const newDarkModeState = !document.body.classList.contains('dark');
            logEvent(`Dark Mode toggle clicked. New state: ${newDarkModeState}`, 'click', { newDarkMode: newDarkModeState }); // Event log
            initThemeToggle(newDarkModeState);
            
            const currentThemeId = localStorage.getItem(themeManagerConfig.themeKey) || themeManagerConfig.defaultThemeId;
            let actualThemeToApply = currentThemeId;
            if (currentThemeId === 'random-festival') {
                actualThemeToApply = getRandomFestivalTheme();
            } else if (currentThemeId === 'random-national-day') {
                actualThemeToApply = getRandomNationalDayTheme();
            }
            logEvent(`Re-applying theme: "${actualThemeToApply}" with new Dark Mode: ${newDarkModeState}`, 'ui'); // Event log
            applyTheme(actualThemeToApply, newDarkModeState);
        });
    } else {
        console.warn('[themeManager.js] Dark Mode Toggle button not found.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
});
