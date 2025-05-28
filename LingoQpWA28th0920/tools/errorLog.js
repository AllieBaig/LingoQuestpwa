
/**
 * Error Logging Utility for LingoQuestPWA
 * Displays errors in a collapsible panel in the UI + logs to console.
 * Depends on: #errorLogPanel, #errorLogOutput in index.html
 * Related styles: styles/main.css (.hidden, #errorLogPanel)
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-28 15:50 | File: tools/errorLog.js
 */

let errorCount = 0;

/**
 * Append an error message to the on-page log and console
 * @param {string | Error} err - Error message or object
 */
export function logError(err) {
  const msg = typeof err === 'string' ? err : (err.message || String(err));
  const timestamp = new Date().toLocaleTimeString();
  const output = `[${timestamp}] ${msg}`;

  console.error('[LingoQuest Error]', err);

  const panel = document.querySelector('#errorLogPanel');
  const logBox = document.querySelector('#errorLogOutput');

  if (panel && logBox) {
    panel.classList.remove('hidden');
    logBox.textContent += (errorCount === 0 ? '' : '\n') + output;
    errorCount++;
  }
}

/**
 * Optional: Clear the error log
 */
export function clearErrorLog() {
  const logBox = document.querySelector('#errorLogOutput');
  if (logBox) {
    logBox.textContent = 'No errors yet.';
  }
  errorCount = 0;
}

/**
 * Optional: Hook global errors
 */
export function attachGlobalErrorHandler() {
  window.addEventListener('error', (e) => {
    logError(e.error || e.message || 'Unknown window error');
  });

  window.addEventListener('unhandledrejection', (e) => {
    logError(e.reason || 'Unhandled promise rejection');
  });
}
