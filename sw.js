const CACHE_NAME = 'immortal-archive-v2';
const ASSETS = [
  '/',
  '/semantic.html',
  '/semantic.css',
  '/semantic.js',
  '/icons/library_books.svg'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k === CACHE_NAME ? Promise.resolve() : caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evt) => {
  const url = new URL(evt.request.url);
  if (url.origin !== location.origin) return;

  const dest = evt.request.destination;

  // Network-first for navigation and critical assets (HTML/CSS/JS)
  if (dest === 'document' || dest === 'script' || dest === 'style') {
    evt.respondWith(
      fetch(evt.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(evt.request, copy));
        return res;
      }).catch(() => caches.match(evt.request))
    );
    return;
  }

  // Cache-first for other static assets
  evt.respondWith(
    caches.match(evt.request).then(cached => cached || fetch(evt.request).then(res => {
      caches.open(CACHE_NAME).then(cache => cache.put(evt.request, res.clone()));
      return res;
    }).catch(() => cached))
  );
});
