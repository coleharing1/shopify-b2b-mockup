// Stub service worker to prevent 404 errors
// In production, this would handle offline functionality and caching

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // For now, just pass through all requests
  // In production, add caching strategies here
  event.respondWith(fetch(event.request));
});