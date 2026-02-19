self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('loto-v1').then((cache) => cache.addAll(['index.html', 'songs.csv'])));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});