const DATA_CACHE = 'loto-data-v1';
const MUSIC_CACHE = 'loto-music-v1';

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    clients.claim();
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // Bắt và lưu Cache file Nhạc (MP3)
    if (url.pathname.endsWith('.mp3')) {
        e.respondWith(
            caches.match(e.request).then(response => {
                // Nếu đã có trong máy thì mở luôn, chưa có thì tải mạng rồi lưu vào máy
                return response || fetch(e.request).then(netRes => {
                    return caches.open(MUSIC_CACHE).then(cache => {
                        cache.put(e.request, netRes.clone());
                        return netRes;
                    });
                });
            })
        );
    }
    // Bắt và lưu Cache file Lời (CSV)
    else if (url.pathname.endsWith('.csv')) {
        e.respondWith(
            caches.match(e.request, { ignoreSearch: true }).then(response => {
                return response || fetch(e.request).then(netRes => {
                    return caches.open(DATA_CACHE).then(cache => {
                        // Lưu URL gốc không kèm tham số Date.now() để dùng offline
                        cache.put(e.request.url.split('?')[0], netRes.clone());
                        return netRes;
                    });
                });
            })
        );
    }
    // File HTML/CSS thì ưu tiên lấy mạng để cập nhật giao diện, mất mạng mới lấy cache
    else {
        e.respondWith(
            fetch(e.request).catch(() => caches.match(e.request))
        );
    }
});