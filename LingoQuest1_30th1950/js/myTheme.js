/*
 * myTheme.js
 * Purpose: Provides static theme switching logic (no dependency on themeManager.js).
 * Supports ASCII, Christmas (Normal and ASCII), Windows XP, and Windows 98.
 * Timestamp: 2025-05-30 07:10 | File: js/myTheme.js
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

        // ✅ Disable all known theme stylesheets
        [
            'theme-christmas',
            'theme-ascii-pure',
            'theme-christmas-ui',
            'theme-windowsxp',
             'theme-windowsxp-senior',
            'theme-windows98'
        ].forEach(id => {
            document.getElementById(id)?.setAttribute('disabled', true);
        });

        // ✅ Remove all theme-related body classes
        document.body.classList.remove(
  'ascii-ui', 'christmas', 'pure',
  'christmas-ui',
  'windowsxp-theme', 'windowsxp-senior-theme',
  'windows98-theme'
);

        // ✅ Apply selected theme
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

case 'windowsxp-senior':
    document.getElementById('theme-windowsxp-senior')?.removeAttribute('disabled');
    document.body.classList.add('windowsxp-senior-theme');
    break;
            case 'windows98':
                document.getElementById('theme-windows98')?.removeAttribute('disabled');
                document.body.classList.add('windows98-theme');
                break;
            default:
                console.log(`[myTheme.js] No theme logic for: ${selected}`);
                break;
        }

        // ✅ Save selection
        localStorage.setItem('appTheme', selected);
        console.log(`[myTheme.js] Static theme applied: ${selected}`);
    });

    console.log('[myTheme.js] Static theme switcher initialized.');
}
