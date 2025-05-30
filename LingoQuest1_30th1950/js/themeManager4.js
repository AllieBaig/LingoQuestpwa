
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// themeManager.js
// Purpose: Manages application themes (including dark mode) and provides
// functionality to apply themes based on user preference, specific dates, or OS styles.
// Designed to be a standalone module.
// Timestamp: 2025-05-30 03:52:43 AM BST

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
    themeKey: 'appTheme',         // Key for selected theme
    darkModeKey: 'appDarkMode',   // Key for dark mode state
    defaultThemeId: 'default',
    defaultDarkMode: false,
    themeSelectorId: 'themeSelector', // ID of the <select> element
    darkModeToggleId: 'darkModeToggle' // ID of the button/input
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
 * IMPORTANT: Order might matter if you want certain themes to appear before others in a dropdown.
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
    { id: 'random-festival', name: 'Random Festival', classes: [] }, // Classes will be dynamic
    { id: 'random-national-day', name: 'Random National Day', classes: [] } // Classes will be dynamic
];

/**
 * Festival themes. These are specific CSS classes that will be applied.
 * You'll need to define these in your CSS.
 * @type {string[]}
 */
const festivalThemes = [
    'christmas-theme', 'halloween-theme', 'easter-theme', 'diwali-theme'
];

/**
 * National day themes. These are specific CSS classes that will be applied.
 * You'll need to define these in your CSS.
 * @type {string[]}
 */
const nationalDayThemes = [
    'usa-national-day-theme', 'canada-national-day-theme', 'uk-national-day-theme'
];

/**
 * Date-specific themes, ordered by priority (later dates/more specific should be higher).
 * If a date matches, it will override the user's saved preference for that day.
 * @type {object[]}
 */
const dateSpecificThemes = [
    { month: 12, day: 25, themeId: 'christmas-theme' }, // December 25th
    { month: 10, day: 31, themeId: 'halloween-theme' }, // October 31st
    { month: 4, day: 1, themeId: 'easter-theme' },     // April 1st (Example, Easter moves, this is just a placeholder date)
    { month: 11, day: 1, themeId: 'diwali-theme' },     // November 1st (Example, Diwali moves, this is just a placeholder date)
    { month: 7, day: 4, themeId: 'usa-national-day-theme' }, // July 4th (USA)
    { month: 7, day: 1, themeId: 'canada-national-day-theme' }, // July 1st (Canada)
    { month: 4, day: 23, themeId: 'uk-national-day-theme' }  // April 23rd (St. George's Day, UK)
];

/**
 * Applies the specified theme to the document body.
 * Removes all existing custom theme classes and adds the new ones.
 * @param {string} themeId - The ID of the theme to apply.
 * @param {boolean} isDarkMode - Whether dark mode should be enabled.
 */
export function applyTheme(themeId, isDarkMode) {
    const body = document.body;

    // Remove all previous custom theme classes (from customThemes array)
    customThemes.forEach(theme => {
        theme.classes.forEach(cls => body.classList.remove(cls));
        if (theme.dataAttribute) {
            body.removeAttribute(theme.dataAttribute);
        }
    });
    // Remove dynamic festival/national day classes (in case a hardcoded theme is chosen after random)
    festivalThemes.forEach(cls => body.classList.remove(cls));
    nationalDayThemes.forEach(cls => body.classList.remove(cls));

    // Apply the selected theme's classes and data attributes
    const selectedTheme = customThemes.find(t => t.id === themeId);
    if (selectedTheme) {
        selectedTheme.classes.forEach(cls => body.classList.add(cls));
        if (selectedTheme.dataAttribute && selectedTheme.dataValue) {
            body.setAttribute(selectedTheme.dataAttribute, selectedTheme.dataValue);
        }
    } else {
        // This 'else' block handles cases where themeId might be a direct class name
        // (e.g., 'christmas-theme' from dateSpecificThemes)
        body.classList.add(themeId); 
    }

    // Apply dark mode or light mode
    if (isDarkMode) {
        body.classList.add('dark');
        body.classList.remove('light');
    } else {
        body.classList.add('light');
        body.classList.remove('dark');
    }
    console.log(`[themeManager.js] Applied theme: ${themeId}, Dark Mode: ${isDarkMode}`);
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
        // Set visual state of the toggle
        if (darkModeToggle.tagName === 'BUTTON') {
            darkModeToggle.textContent = enableDarkMode ? 'Light Mode' : 'Dark Mode';
        } else if (darkModeToggle.type === 'checkbox' || darkModeToggle.type === 'switch') {
            darkModeToggle.checked = enableDarkMode;
        }
    }

    if (savePreference) {
        localStorage.setItem(themeManagerConfig.darkModeKey, enableDarkMode.toString());
        console.log(`[themeManager.js] Dark mode preference saved: ${enableDarkMode}`);
    }
}

/**
 * Returns an array of available custom themes for display in a dropdown.
 * This includes all defined custom themes, random options, and date-specific themes
 * that are currently active (if any).
 * @returns {CustomTheme[]}
 */
export function getAvailableCustomThemes() {
    // We display all static custom themes in the dropdown.
    // Random/date-specific themes are applied by logic, not selected directly.
    return customThemes.filter(theme => 
        theme.id !== 'random-festival' && 
        theme.id !== 'random-national-day'
    );
}

/**
 * Gets a specific date-based theme if the current date matches.
 * @returns {string|null} The theme ID (which is also the CSS class name) if a match is found, otherwise null.
 */
export function getSpecificDateTheme() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
    const currentDay = today.getDate();

    // Find the first matching date-specific theme (priority by order in array)
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
 * This function should be called once the DOM is ready.
 * It reads preferences from localStorage and sets up event listeners.
 * @param {ThemeManagerConfig} [configOverrides] - Optional overrides for default config.
 */
export function initThemeManager(configOverrides = {}) {
    Object.assign(themeManagerConfig, configOverrides);
    console.log('[themeManager.js] Initializing theme manager with config:', themeManagerConfig);

    // Load preferences from localStorage
    let savedThemeId = localStorage.getItem(themeManagerConfig.themeKey) || themeManagerConfig.defaultThemeId;
    let savedDarkMode = localStorage.getItem(themeManagerConfig.darkModeKey) === 'true' || themeManagerConfig.defaultDarkMode;

    // Check for specific date theme overrides (highest priority)
    const specificDayTheme = getSpecificDateTheme();
    if (specificDayTheme) {
        savedThemeId = specificDayTheme;
        console.log(`[themeManager.js] Overriding theme with specific date theme: ${savedThemeId}`);
    } else {
        // Handle random themes only if no specific day theme is active
        // and if the saved preference was one of the random theme IDs
        if (savedThemeId === 'random-festival') {
            savedThemeId = getRandomFestivalTheme();
            console.log(`[themeManager.js] Applying random festival theme: ${savedThemeId}`);
            // Also save the *actual* random theme applied so it persists for the session/day
            localStorage.setItem(themeManagerConfig.themeKey, savedThemeId); 
        } else if (savedThemeId === 'random-national-day') {
            savedThemeId = getRandomNationalDayTheme();
            console.log(`[themeManager.js] Applying random national day theme: ${savedThemeId}`);
            // Also save the *actual* random theme applied
            localStorage.setItem(themeManagerConfig.themeKey, savedThemeId);
        }
    }

    // Apply initial theme and dark mode
    applyTheme(savedThemeId, savedDarkMode);
    initThemeToggle(savedDarkMode, false); // Don't re-save on initial set

    // Setup event listener for theme selector
    const themeSelector = document.getElementById(themeManagerConfig.themeSelectorId);
    if (themeSelector) {
        // Populate options first
        const themesForDropdown = getAvailableCustomThemes(); // This returns only fixed themes
        themeSelector.innerHTML = ''; // Clear existing options
        themesForDropdown.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.id;
            option.textContent = theme.name;
            themeSelector.appendChild(option);
        });
        // Add random themes explicitly to the dropdown if you want them selectable
        const randomFestivalOption = document.createElement('option');
        randomFestivalOption.value = 'random-festival';
        randomFestivalOption.textContent = 'Random Festival';
        themeSelector.appendChild(randomFestivalOption);

        const randomNationalDayOption = document.createElement('option');
        randomNationalDayOption.value = 'random-national-day';
        randomNationalDayOption.textContent = 'Random National Day';
        themeSelector.appendChild(randomNationalDayOption);

        // Set selected value
        // If a random/date-specific theme was applied, the dropdown should show that specific theme
        // if it's a fixed one, or default to the saved preference if the random/date one is temporary.
        // For simplicity, we'll try to set it to the savedThemeId, which might be a dynamic one.
        themeSelector.value = localStorage.getItem(themeManagerConfig.themeKey) || themeManagerConfig.defaultThemeId;
        
        // If the value applied was dynamic (like christmas-theme) and not in dropdown,
        // the dropdown will default to the first option or stay unselected.
        // You might want to add a specific option like "Current Special Theme" for this.
        
        themeSelector.addEventListener('change', (e) => {
            const selectedThemeId = e.target.value;
            // Save preference *before* applying, so random themes are handled correctly
            localStorage.setItem(themeManagerConfig.themeKey, selectedThemeId);
            const currentDarkModeState = document.body.classList.contains('dark'); // Read current dark mode from body class
            
            let actualThemeToApply = selectedThemeId;
            if (selectedThemeId === 'random-festival') {
                actualThemeToApply = getRandomFestivalTheme();
            } else if (selectedThemeId === 'random-national-day') {
                actualThemeToApply = getRandomNationalDayTheme();
            }

            applyTheme(actualThemeToApply, currentDarkModeState);
            console.log(`[themeManager.js] User selected theme: ${selectedThemeId}. Applied: ${actualThemeToApply}. Saved.`);
        });
    }

    // Setup event listener for dark mode toggle
    const darkModeToggle = document.getElementById(themeManagerConfig.darkModeToggleId);
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const newDarkModeState = !document.body.classList.contains('dark');
            initThemeToggle(newDarkModeState); // This also saves preference
            
            // Re-apply the currently selected non-random theme to ensure dark mode class is toggled correctly
            const currentThemeId = localStorage.getItem(themeManagerConfig.themeKey) || themeManagerConfig.defaultThemeId;
            let actualThemeToApply = currentThemeId;
            if (currentThemeId === 'random-festival') { // If last saved was random, re-randomize for consistency
                actualThemeToApply = getRandomFestivalTheme();
            } else if (currentThemeId === 'random-national-day') {
                actualThemeToApply = getRandomNationalDayTheme();
            }
            applyTheme(actualThemeToApply, newDarkModeState);
            console.log(`[themeManager.js] Dark mode toggled to: ${newDarkModeState}. Applied: ${actualThemeToApply}. Saved.`);
        });
    }
}

// Automatically initialize the theme manager when the DOM is ready.
// This allows the script to be dropped into any HTML without explicit calls.
document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
});
