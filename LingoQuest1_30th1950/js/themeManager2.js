
// themeManager.js
// Purpose: Manages application themes, including dark mode, cultural festivals, and national days.
// Usage: Imported by main.js and app.js.
// Timestamp: 2025-05-29 06:35:46 PM BST
// License: MIT License (https://opensource.org/licenses/MIT)

// Import profileManager to access and update user settings
import { profileManager } from './profileManager.js';

// --- Theme Definitions ---
// Each theme object defines CSS custom properties that will override the :root defaults.
// This allows dynamic theming by simply adding a class to the <body>.

const themes = {
    // Default system themes (already present)
    'default': {}, // Represents the default :root styling (no specific class needed)
    'dark': {
        '--primary-color': '#66BB6A',
        '--secondary-color': '#90CAF9',
        '--background-color': '#2c2c2c',
        '--text-color': '#f4f4f4',
        '--border-color': '#555',
        '--card-background': '#3a3a3a',
        '--shadow-color': 'rgba(0, 0, 0, 0.3)',
        '--button-active-bg': 'brightness(1.1)',
    },

    // --- Festival Themes (Examples - you can expand this greatly!) ---
    'diwali': { // Festival of Lights (India) - Warm, vibrant colors
        '--primary-color': '#FF8C00', // Deep Orange
        '--secondary-color': '#FFD700', // Gold
        '--background-color': '#FFF8DC', // Cornsilk
        '--text-color': '#8B4513', // Saddle Brown
        '--card-background': '#FFFFFF',
        '--border-color': '#DAA520', // Goldenrod
        '--shadow-color': 'rgba(255, 140, 0, 0.2)',
    },
    'halloween': { // Spooky, dark, vibrant accents
        '--primary-color': '#FF4500', // OrangeRed
        '--secondary-color': '#8A2BE2', // BlueViolet
        '--background-color': '#1C1C1C', // Dark Grey
        '--text-color': '#F5F5DC', // Beige
        '--card-background': '#333333',
        '--border-color': '#663399', // RebeccaPurple
        '--shadow-color': 'rgba(0, 0, 0, 0.5)',
    },
    'christmas': { // Traditional Christmas colors
        '--primary-color': '#B22222', // FireBrick (Red)
        '--secondary-color': '#228B22', // ForestGreen
        '--background-color': '#F0F8FF', // AliceBlue
        '--text-color': '#2F4F4F', // DarkSlateGray
        '--card-background': '#FFFFFF',
        '--border-color': '#A9A9A9', // DarkGray
        '--shadow-color': 'rgba(0, 100, 0, 0.1)',
    },
    'hanukkah': { // Blue and white
        '--primary-color': '#00539B', // Deep Blue
        '--secondary-color': '#B0C4DE', // LightSteelBlue
        '--background-color': '#F0F8FF', // AliceBlue
        '--text-color': '#333333',
        '--card-background': '#FFFFFF',
        '--border-color': '#ADD8E6', // LightBlue
        '--shadow-color': 'rgba(0, 0, 128, 0.1)',
    },
    'eid': { // Often uses greens, golds, and creams
        '--primary-color': '#228B22', // ForestGreen
        '--secondary-color': '#DAA520', // Goldenrod
        '--background-color': '#FDF5E6', // OldLace
        '--text-color': '#36454F', // Charcoal
        '--card-background': '#FFFFFF',
        '--border-color': '#BDB76B', // DarkKhaki
        '--shadow-color': 'rgba(34, 139, 34, 0.1)',
    },

    // --- National Day Themes (Examples - pick a few diverse ones!) ---
    'usa-independenceday': { // Red, White, Blue
        '--primary-color': '#B22222', // FireBrick
        '--secondary-color': '#4682B4', // SteelBlue
        '--background-color': '#F0F8FF', // AliceBlue
        '--text-color': '#333333',
        '--card-background': '#FFFFFF',
        '--border-color': '#D3D3D3', // LightGray
        '--shadow-color': 'rgba(70, 130, 180, 0.1)',
    },
    'france-bastilleday': { // Blue, White, Red
        '--primary-color': '#00008B', // DarkBlue
        '--secondary-color': '#B22222', // FireBrick
        '--background-color': '#F0F8FF', // AliceBlue
        '--text-color': '#333333',
        '--card-background': '#FFFFFF',
        '--border-color': '#D3D3D3',
        '--shadow-color': 'rgba(0, 0, 139, 0.1)',
    },
    'india-republicday': { // Saffron, White, Green, Navy Blue
        '--primary-color': '#FF9933', // Saffron
        '--secondary-color': '#138808', // India Green
        '--background-color': '#F0F8FF', // AliceBlue
        '--text-color': '#333333',
        '--card-background': '#FFFFFF',
        '--border-color': '#000080', // Navy Blue (Ashoka Chakra)
        '--shadow-color': 'rgba(255, 153, 51, 0.1)',
    },
    'uk-bankholiday': { // More subtle, perhaps shades of blue/grey with a splash of red
        '--primary-color': '#1E90FF', // DodgerBlue
        '--secondary-color': '#DC143C', // Crimson
        '--background-color': '#F5F5F5', // WhiteSmoke
        '--text-color': '#333333',
        '--card-background': '#FFFFFF',
        '--border-color': '#A9A9A9',
        '--shadow-color': 'rgba(30, 144, 255, 0.1)',
    },

    // Add more themes here!
};

// --- Specific Date Themes (Month is 0-indexed: Jan=0, Dec=11) ---
const specificDateThemes = [
    { month: 9, day: 31, themeId: 'halloween' }, // October 31st
    { month: 11, day: 25, themeId: 'christmas' }, // December 25th
    { month: 6, day: 4, themeId: 'usa-independenceday' }, // July 4th
    { month: 6, day: 14, themeId: 'france-bastilleday' }, // July 14th
    { month: 0, day: 26, themeId: 'india-republicday' }, // January 26th
    // Example for Diwali (approximate, as it's lunar) - Nov 1 this year
    { month: 10, day: 1, themeId: 'diwali' }, // November 1st (example)
    // Example for Eid al-Fitr (approximate, as it's lunar) - April 10 this year
    { month: 3, day: 10, themeId: 'eid' }, // April 10th (example)
    { month: 11, day: 2, themeId: 'hanukkah' }, // Hanukkah example (Dec 2, 2024 start)
    // Add more specific date themes here
];

/**
 * Applies the specified theme by adding/removing classes and setting CSS variables.
 * @param {string} themeId - The ID of the theme to apply (e.g., 'dark', 'diwali', 'default').
 * @param {boolean} [isDarkMode=false] - Explicitly set dark mode state if applying a 'custom' theme.
 */
export function applyTheme(themeId, isDarkMode = false) {
    const body = document.body;
    
    // Remove all existing theme-specific classes (except senior-big/very-big, os-*, lang-*)
    // We need to keep non-color/font-size related classes like 'minimal-ui' and platform/language classes.
    const currentClasses = Array.from(body.classList);
    const classesToRemove = currentClasses.filter(cls => 
        Object.keys(themes).includes(cls) || cls === 'dark'
    );
    body.classList.remove(...classesToRemove);

    // Apply specific theme if not 'default'
    if (themeId && themeId !== 'default') {
        const selectedTheme = themes[themeId];
        if (selectedTheme) {
            // Apply theme class
            body.classList.add(themeId);
            // Apply CSS variables for the theme
            for (const [prop, value] of Object.entries(selectedTheme)) {
                document.documentElement.style.setProperty(prop, value);
            }
        } else {
            console.warn(`Theme '${themeId}' not found.`);
            // Fallback to default if theme not found
            applyTheme('default');
            profileManager.updateSetting('currentTheme', 'default'); // Update profile if theme invalid
        }
    } else {
        // Clear specific theme variables and revert to :root defaults (set in _variables.css)
        for (const prop in themes['dark']) { // Use dark theme properties as a template for all custom properties
            document.documentElement.style.removeProperty(prop);
        }
    }

    // Always apply dark mode class if needed, as it can overlay any theme
    // Or if the themeId itself implies dark mode (e.g. 'dark' themeId)
    // For simplicity, let's keep dark mode as a separate overlay handled by initThemeToggle.
    // If a custom theme is meant to be dark, define its colors directly.
    
    // If applyTheme is called with an explicit isDarkMode, ensure 'dark' class is handled
    if (isDarkMode && !body.classList.contains('dark')) {
        body.classList.add('dark');
    } else if (!isDarkMode && body.classList.contains('dark')) {
        body.classList.remove('dark');
    }
}

/**
 * Toggles the dark mode class on the body and saves preference.
 * This function also ensures that if a specific 'custom' theme is active,
 * it respects the dark mode preference.
 * @param {boolean} [enable=null] - If true, enables dark mode. If false, disables. If null, toggles.
 */
export function initThemeToggle(enable = null) {
    const body = document.body;
    let newDarkModeState;

    if (enable === null) {
        newDarkModeState = !body.classList.contains('dark');
    } else {
        newDarkModeState = enable;
    }

    if (newDarkModeState) {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }
    // No need to update profileManager here, as it's typically called by main.js
    // after a user interaction or by app.js on load, and profileManager.updateSetting
    // will handle saving.
}

/**
 * Determines if there's a specific festival/national day theme for the current date.
 * @returns {string|null} The theme ID if a specific date theme exists, otherwise null.
 */
export function getSpecificDateTheme() {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-indexed
    const currentDay = today.getDate(); // 1-indexed

    for (const event of specificDateThemes) {
        if (event.month === currentMonth && event.day === currentDay) {
            console.log(`[themeManager] Applying specific date theme: ${event.themeId}`);
            return event.themeId;
        }
    }
    return null;
}

/**
 * Returns a random festival theme ID.
 * @returns {string} A random festival theme ID.
 */
export function getRandomFestivalTheme() {
    const festivalThemes = Object.keys(themes).filter(id => 
        ['diwali', 'halloween', 'christmas', 'hanukkah', 'eid'].includes(id) // Explicitly list festival themes
    );
    if (festivalThemes.length === 0) return 'default';
    return festivalThemes[Math.floor(Math.random() * festivalThemes.length)];
}

/**
 * Returns a random national day theme ID.
 * @returns {string} A random national day theme ID.
 */
export function getRandomNationalDayTheme() {
    const nationalDayThemes = Object.keys(themes).filter(id => 
        ['usa-independenceday', 'france-bastilleday', 'india-republicday', 'uk-bankholiday'].includes(id) // Explicitly list national day themes
    );
    if (nationalDayThemes.length === 0) return 'default';
    return nationalDayThemes[Math.floor(Math.random() * nationalDayThemes.length)];
}

/**
 * Returns a list of all available custom theme IDs (excluding system themes).
 * @returns {Array<object>} An array of theme objects {id: string, name: string}.
 */
export function getAvailableCustomThemes() {
    return Object.keys(themes)
        .filter(id => !['default', 'dark'].includes(id)) // Exclude default system themes
        .map(id => ({
            id: id,
            name: id.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            // Basic capitalization for display name
        }));
}
