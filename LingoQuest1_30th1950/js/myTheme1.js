
/*
 * myTheme.js
 * Purpose: Provides static theme switching logic (no dependency on themeManager.js).
 * Supports ASCII, Christmas (Normal and ASCII), and Windows XP emoji-based themes.
 * Timestamp: 2025-05-30 07:10 | File: scripts/utils/myTheme.js
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 */

export function initStaticThemeSwitcher() {
    const themeSelector = document.getElementById('themeSelector');
    if (!themeSelector) {
        console.warn('[myTheme.js] Theme selector not found.');
        return;
    }

    themeSelector.addEventListener('change', (e) => {
        const selected = e.target.value;

        // Disable all custom theme stylesheets
        ['theme-christmas', 'theme-ascii-pure', 'theme-christmas-ui', 'theme-windowsxp'].forEach(id => {
            document.getElementById(id)?.setAttribute('disabled', true);
        });

        // Remove all custom theme classes
        document.body.classList.remove(
            'ascii-ui', 'christmas', 'pure', 'christmas-ui', 'windowsxp-theme'
        );

        // Apply the selected theme
        switch (selected) {
            case 'christmas-theme':
                document.getElementById('theme-christmas')?.removeAttribute('disabled');
                document.body.classList.add('ascii-ui', 'christmas');
                break;
            case 'ascii-pure':
                document.getElementById('theme-ascii-pure')?.removeAttribute('disabled');
                document.body.classList.add('ascii-ui', 'pure');
                break;
            case 'christmas-ui':
                document.getElementById('theme-christmas-ui')?.removeAttribute('disabled');
                document.body.classList.add('christmas-ui');
                break;
            case 'windowsxp':
                document.getElementById('theme-windowsxp')?.removeAttribute('disabled');
                document.body.classList.add('windowsxp-theme');
                break;
            default:
                console.log(`[myTheme.js] No theme logic for: ${selected}`);
                break;
        }

        // Save user's preference
        localStorage.setItem('appTheme', selected);
        console.log(`[myTheme.js] Static theme applied: ${selected}`);
    });

    console.log('[myTheme.js] Static theme switcher initialized.');
}
