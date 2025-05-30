
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://alliebaig.github.io/LingoQuest1/)

// errorLogger.js
// Purpose: Captures and logs application errors to local storage for later review.
// Provides functions to retrieve and clear the error log.
// Timestamp: 2025-05-29 08:55:17 PM BST

const LOCAL_STORAGE_ERROR_KEY = 'lingoQuestErrorLog';
const MAX_LOG_ENTRIES = 50; // Keep the log manageable, e.g., last 50 errors

/**
 * @typedef {object} LoggedError
 * @property {string} message - The error message.
 * @property {string} url - The URL where the error occurred.
 * @property {number} line - The line number where the error occurred.
 * @property {number} col - The column number where the error occurred.
 * @property {object} errorObject - The original Error object (may contain stack trace).
 * @property {string} type - The type of error (e.g., 'uncaught', 'promise rejection').
 * @property {number} timestamp - Unix timestamp of when the error occurred.
 */

/**
 * Loads the current error log from local storage.
 * @returns {Array<LoggedError>} An array of logged errors.
 */
function loadErrorLog() {
    try {
        const log = localStorage.getItem(LOCAL_STORAGE_ERROR_KEY);
        return log ? JSON.parse(log) : [];
    } catch (e) {
        console.error('Failed to load error log from local storage:', e);
        return [];
    }
}

/**
 * Saves the given error log to local storage, truncating if necessary.
 * @param {Array<LoggedError>} log - The array of errors to save.
 */
function saveErrorLog(log) {
    try {
        // Ensure we don't exceed max log entries
        const truncatedLog = log.slice(0, MAX_LOG_ENTRIES);
        localStorage.setItem(LOCAL_STORAGE_ERROR_KEY, JSON.stringify(truncatedLog));
    } catch (e) {
        console.error('Failed to save error log to local storage:', e);
    }
}

/**
 * Logs an error to local storage.
 * @param {string} message - The error message.
 * @param {string} url - The URL where the error occurred.
 * @param {number} line - The line number.
 * @param {number} col - The column number.
 * @param {Error|null} errorObject - The Error object if available.
 * @param {string} type - The type of error (e.g., 'uncaught', 'promise rejection', 'manual').
 */
function logError(message, url, line, col, errorObject, type = 'uncaught') {
    const errorLog = loadErrorLog();
    
    const newError = {
        timestamp: Date.now(),
        message: message,
        file: url,
        line: line,
        col: col,
        type: type,
        stack: errorObject ? errorObject.stack : 'No stack trace available.'
    };

    // Add new error to the beginning (most recent first)
    errorLog.unshift(newError);
    saveErrorLog(errorLog);
    console.error(`[errorLogger.js] Logged error: ${message}`);
}

/**
 * Initializes the global error handlers.
 */
function initErrorLogger() {
    // Capture uncaught errors
    window.onerror = (message, source, lineno, colno, error) => {
        logError(message, source, lineno, colno, error, 'uncaught');
        // Return false to allow default error handling (e.g., console output)
        return false; 
    };

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason;
        const message = reason instanceof Error ? reason.message : String(reason);
        const stack = reason instanceof Error ? reason.stack : 'No stack trace available.';
        const file = reason.fileName || 'N/A';
        const line = reason.lineNumber || 'N/A';
        const col = reason.columnNumber || 'N/A';

        logError(`Unhandled Promise Rejection: ${message}`, file, line, col, reason, 'promise rejection');
        // Prevent default handler (which might log to console) if you want full control
        // event.preventDefault(); 
    });

    console.log('[errorLogger.js] Error logging initialized.');
}

// Initialize error handlers when the module loads
initErrorLogger();

// --- Exported functions for errorLog.html and other modules ---

/**
 * Returns all currently logged errors.
 * @returns {Array<LoggedError>}
 */
export function getErrors() {
    return loadErrorLog();
}

/**
 * Clears all logged errors from local storage.
 */
export function clearErrors() {
    localStorage.removeItem(LOCAL_STORAGE_ERROR_KEY);
    console.log('[errorLogger.js] Error log cleared.');
}

/**
 * Manually log an error. Useful for catching specific errors you want to track.
 * @param {string} message - The error message.
 * @param {Error|null} [errorObject=null] - The original Error object if available.
 * @param {string} [type='manual'] - The type of error (e.g., 'manual', 'warning').
 */
export function manualLogError(message, errorObject = null, type = 'manual') {
    // Provide dummy values for file/line/col if not available for manual logs
    const url = window.location.href;
    const line = 0;
    const col = 0;
    logError(message, url, line, col, errorObject, type);
}
