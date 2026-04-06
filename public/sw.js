const CACHE_NAME = 'english-learn-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Don't cache HTML - always fetch fresh
  if (event.request.mode === 'navigate' || url.pathname === '/') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/')));
    return;
  }

  // Cache assets (JS/CSS with hashes in filename)
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Other requests: network first
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
