
// service-worker.js
// Purpose: Implements caching strategies for offline support and faster loading.
// Usage: Registered in main.js.
// Timestamp: 2025-05-28
// License: MIT License (https://opensource.org/licenses/MIT)

const CACHE_NAME = 'lingoquest-cache-v1.0.0'; // Increment cache version on new deployments
const urlsToCache = [
    './',
    './index.html',
    './styles/style.css', // Updated path
    './styles/ascii.css', // Updated path
    './js/main.js',
    './js/profileManager.js',
    './js/uiModeManager.js',
    './js/version.js',
    './js/xpTracker.js',
    './js/questionPool.js',
    './js/mcqAutoCheck.js',
    './scripts/modes/soloMode.js', // Assuming this path for modes
    './scripts/modes/mixLingo.js', // Assuming this path for modes
    // './scripts/modes/wordRelic.js', // Placeholder
    // './scripts/modes/wordSafari.js', // Placeholder
    './lang/solo-fr.json',
    './lang/mixlingo-en.json',
    './manifest.json',
    './icons/icon-192x192.png', // Ensure these icon files exist
    './icons/icon-512x512.png', // Ensure these icon files exist
    './js/lib/uuid.min.js' // Include uuid.min.js if using directly from lib folder
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache during install:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request).then(
                    networkResponse => {
                        // Check if we received a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and can only be consumed once. We must clone it so that
                        // both the browser and the cache can consume it.
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                );
            }).catch(error => {
                console.error('Fetch failed; returning offline page:', error);
                // You could return a custom offline page here
                // For example: return caches.match('/offline.html');
                // For now, just throwing the error
                throw error;
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        console.log(`Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
