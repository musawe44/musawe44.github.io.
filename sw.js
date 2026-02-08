const CACHE_NAME = "musawi-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bg.mp4.mp4",
  "./audio.mp3.mp3",
  "./audio1.mp3.mp3",
  "./avatar.jpg"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res =>
      res || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      })
    ).catch(() => caches.match("./index.html"))
  );
});
