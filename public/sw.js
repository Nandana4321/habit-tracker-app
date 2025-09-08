self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("habit-tracker-cache").then((cache) => {
      return cache.addAll(["/", "/index.html", "/src/main.jsx"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
