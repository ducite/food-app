// Simple service worker for offline cache and PWA installability
const CACHE_NAME = 'food-finder-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let browser handle normal fetch
  return;
});
