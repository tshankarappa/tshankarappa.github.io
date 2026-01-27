self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("static-v1").then((c) =>
      c.addAll(["./", "./index.html", "./app.js", "./manifest.json", "./icon.png"])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((resp) => resp || fetch(e.request)));
});
