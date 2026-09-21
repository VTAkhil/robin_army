const CACHE_NAME = 'flutter-app-cache-v1.1';

// Flutter Web core files
const urlsToCache = [
  '/',
  '/index.html',
  '/main.dart.js',
  '/flutter_bootstrap.js',
  '/manifest.json',
  '/styles.css'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching core files');

        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Installation completed');

        return self.skipWaiting();
      })
      .catch((error) => {
        console.error(
          '[Service Worker] Installation failed:',
          error
        );

        throw error;
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log(
                '[Service Worker] Deleting old cache:',
                cacheName
              );

              return caches.delete(cacheName);
            }

            return Promise.resolve();
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation completed');

        return self.clients.claim();
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Handle GET requests only
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // Cache only successful basic or CORS responses
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              (
                networkResponse.type === 'basic' ||
                networkResponse.type === 'cors'
              )
            ) {
              const responseToCache = networkResponse.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(
                    event.request,
                    responseToCache
                  );
                })
                .catch((error) => {
                  console.warn(
                    '[Service Worker] Dynamic caching failed:',
                    error
                  );
                });
            }

            return networkResponse;
          })
          .catch(() => {
            // Optional offline fallback
            return caches.match('/index.html');
          });
      })
  );
});