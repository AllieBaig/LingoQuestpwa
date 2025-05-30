
// License: MIT License (https://opensource.org/licenses/MIT)
// Copyright (c) 2025 AllieBaig (https://opensource.org/licenses/MIT)

// eventLogger.js
// Purpose: Provides a utility to log application events to a dedicated BroadcastChannel,
// allowing a separate 'eventLog.html' window to display them.
// Timestamp: 2025-05-30 05:25:00 AM BST

const eventChannelName = 'lingoquest-events';
let eventBroadcastChannel;

// Check if BroadcastChannel is supported
if ('BroadcastChannel' in window) {
    eventBroadcastChannel = new BroadcastChannel(eventChannelName);
    console.info('[eventLogger.js] BroadcastChannel initialized for event logging.');
} else {
    console.warn('[eventLogger.js] BroadcastChannel not supported. Event logging to separate window will not work.');
}

/**
 * Logs an application event with a timestamp and type.
 * This event will be sent to the BroadcastChannel for display in eventLog.html.
 * @param {string} message - The event message.
 * @param {string} [type='info'] - The type of event (e.g., 'click', 'change', 'game', 'ui').
 * @param {object} [data={}] - Optional additional data related to the event.
 */
export function logEvent(message, type = 'info', data = {}) {
    const timestamp = new Date().toISOString();
    const event = {
        timestamp,
        type,
        message,
        data
    };

    if (eventBroadcastChannel) {
        try {
            eventBroadcastChannel.postMessage(event);
            // console.log(`[eventLogger.js] Sent event: ${message}`); // Keep for dev console verification
        } catch (error) {
            console.error('[eventLogger.js] Failed to post event message to BroadcastChannel:', error);
        }
    } else {
        // Fallback for browsers without BroadcastChannel or for local debug
        console.log(`[Event - ${type}] ${message}`, data);
    }
}
