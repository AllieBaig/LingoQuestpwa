
// version.js
// Purpose: Displays the current version of the application.
// Usage: Imported by main.js.
// Timestamp: 2025-05-28 10:36 PM BST
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

/**
 * Updates the version information displayed in the footer.
 */
export function updateVersionInfo() {
    const versionInfoEl = document.getElementById('versionInfo');
    if (versionInfoEl) {
        // You can update this version string manually for releases
        // Or pull it from a package.json if you set up a build process
        const appVersion = '1.0.0';
        versionInfoEl.textContent = `Version ${appVersion}`;
    }
}
