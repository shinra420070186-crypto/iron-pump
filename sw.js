const CACHE_NAME = 'ironpump-v18';
const ASSETS = [
    './',
    './index.html',
    './app.js',
    './icon-512.png',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request).then((fetchResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(() => {
            return caches.match('./index.html');
        })
    );
});
