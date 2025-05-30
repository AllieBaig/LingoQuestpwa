

// js/themeManager.js
// Purpose: Manages loading and applying visual themes (default, dark, festival, national day, custom).
// Usage: Imported by main.js and profileManager.js.
// Timestamp: 2025-05-29 10:14:33 AM BST
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

let allThemes = [];
const THEME_PREFERENCE_KEY = 'lingoQuestCustomThemeId'; // For user's chosen theme
const LAST_APPLIED_DATE_KEY = 'lingoQuestLastAppliedThemeDate'; // To prevent re-applying daily theme unnecessarily

export const themeManager = {
    /**
     * Initializes the theme manager, loads themes, and applies the appropriate theme.
     */
    async init() {
        await this.loadThemes();
        this.applyInitialTheme();
    },

    /**
     * Loads themes from the themes.json file.
     * @returns {Promise<void>}
     */
    async loadThemes() {
        try {
            const response = await fetch('data/themes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allThemes = await response.json();
            console.log(`Loaded ${allThemes.length} themes.`);
        } catch (error) {
            console.error('Error loading themes:', error);
            allThemes = []; // Ensure allThemes is empty on error
        }
    },

    /**
     * Applies the appropriate theme based on specific day, user preference, or default.
     */
    applyInitialTheme() {
        const today = new Date();
        const currentMonth = today.getMonth(); // 0-indexed month
        const currentDay = today.getDate();
        const currentYear = today.getFullYear();
        const lastAppliedDate = localStorage.getItem(LAST_APPLIED_DATE_KEY);

        let themeToApply = this.getThemeById('default'); // Start with default

        // 1. Check for specific day themes (national/festival)
        // Only re-evaluate daily theme once per day to prevent constant theme changes
        if (lastAppliedDate !== `${currentDay}-${currentMonth}-${currentYear}`) {
            const dailyTheme = allThemes.find(theme => {
                if (theme.appliesOn) {
                    const monthMatches = theme.appliesOn.month === currentMonth; // Month is 0-indexed in JS Date
                    if (theme.appliesOn.day) {
                        return monthMatches && theme.appliesOn.day === currentDay;
                    }
                    if (theme.appliesOn.dayRange) {
                        return monthMatches && currentDay >= theme.appliesOn.dayRange[0] && currentDay <= theme.appliesOn.dayRange[1];
                    }
                }
                return false;
            });

            if (dailyTheme) {
                themeToApply = dailyTheme;
                console.log(`Applying special day theme: ${dailyTheme.name}`);
                localStorage.setItem(LAST_APPLIED_DATE_KEY, `${currentDay}-${currentMonth}-${currentYear}`);
            } else {
                localStorage.removeItem(LAST_APPLIED_DATE_KEY); // Clear if no daily theme today
            }
        }

        // 2. Override with user's custom selection if set and not a special day theme
        const preferredThemeId = localStorage.getItem(THEME_PREFERENCE_KEY);
        if (preferredThemeId && themeToApply.id === 'default') { // Only apply custom if no daily theme was set
            const customTheme = this.getThemeById(preferredThemeId);
            if (customTheme) {
                themeToApply = customTheme;
                console.log(`Applying custom user theme: ${customTheme.name}`);
            }
        }

        this.applyTheme(themeToApply.id);
        // Ensure dark mode is applied on top if active
        // This is handled by uiModeManager, which will read the body class.
        // The default styles are applied first, then dark mode CSS overrides specific variables.
    },

    /**
     * Applies a theme by its ID.
     * This function injects CSS variables into the document's root.
     * @param {string} themeId - The ID of the theme to apply.
     */
    applyTheme(themeId) {
        const theme = this.getThemeById(themeId);
        if (!theme) {
            console.warn(`Theme with ID "${themeId}" not found. Applying default theme.`);
            themeId = 'default';
            theme = this.getThemeById('default');
        }

        const root = document.documentElement;
        // Clear previous theme-specific styles (except for core UI classes)
        for (const key in root.style) {
            if (key.startsWith('--')) {
                // Heuristic to remove dynamic theme variables without touching base UI variables
                // This might need refinement if you have many -- prefixed variables
                if (key.includes('color') || key.includes('background') || key.includes('shadow') || key.includes('border') || key.includes('radius')) {
                     root.style.removeProperty(key);
                }
            }
        }
        document.body.classList.remove('theme-diwali', 'theme-halloween', 'theme-bastille_day', 'theme-independence_us'); // Remove specific theme classes

        // Apply new theme's styles
        for (const [key, value] of Object.entries(theme.styles)) {
            root.style.setProperty(key, value);
        }

        // Add a class for specific theme styling (e.g., background images, unique elements)
        if (theme.type !== 'base' && theme.type !== 'mode') {
            document.body.classList.add(`theme-${theme.id}`);
        }

        console.log(`Theme "${theme.name}" applied.`);
        // Note: Dark mode application is handled by uiModeManager which adds/removes 'dark' class.
        // Dark mode styles in style.css will override variables set by the base theme.
    },

    /**
     * Gets a theme object by its ID.
     * @param {string} themeId - The ID of the theme to retrieve.
     * @returns {object | undefined} The theme object or undefined if not found.
     */
    getThemeById(themeId) {
        return allThemes.find(theme => theme.id === themeId);
    },

    /**
     * Gets all themes of a specific type (e.g., 'festival', 'national_day').
     * @param {string} type - The type of themes to retrieve.
     * @returns {Array<object>} An array of theme objects.
     */
    getThemesByType(type) {
        return allThemes.filter(theme => theme.type === type);
    },

    /**
     * Sets the user's preferred custom theme.
     * @param {string} themeId - The ID of the theme to set as preferred.
     */
    setCustomTheme(themeId) {
        localStorage.setItem(THEME_PREFERENCE_KEY, themeId);
        this.applyTheme(themeId);
        console.log(`Custom theme preference set to: ${themeId}`);
    },

    /**
     * Gets the user's preferred custom theme ID.
     * @returns {string | null} The ID of the custom theme, or null if not set.
     */
    getCustomThemePreference() {
        return localStorage.getItem(THEME_PREFERENCE_KEY);
    },

    /**
     * Clears the user's preferred custom theme.
     */
    clearCustomTheme() {
        localStorage.removeItem(THEME_PREFERENCE_KEY);
        console.log('Custom theme preference cleared.');
        this.applyInitialTheme(); // Revert to daily theme or default
    },

    /**
     * Returns a random theme of a specific type.
     * @param {string} type - The type of theme to get (e.g., 'festival', 'national_day').
     * @returns {object | null} A random theme object or null if none found.
     */
    getRandomThemeByType(type) {
        const themesOfType = this.getThemesByType(type);
        if (themesOfType.length > 0) {
            const randomIndex = Math.floor(Math.random() * themesOfType.length);
            return themesOfType[randomIndex];
        }
        return null;
    }
};
