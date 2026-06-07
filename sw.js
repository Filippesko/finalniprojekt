const CACHE = 'smartcook-v1';
 
const SOUBORY = [
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/offline.html',
];
 
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(SOUBORY);
    })
  );
});
 

self.addEventListener('fetch', function(e) {
  const url = new URL(e.request.url);
 

  if (url.hostname === 'api.spoonacular.com') {
    e.respondWith(
      fetch(e.request).catch(function() {
        return new Response(
          JSON.stringify({ message: 'Jste offline.' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }
 
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
 
      return fetch(e.request).catch(function() {
        return caches.match('/offline.html');
      });
    })
  );
});