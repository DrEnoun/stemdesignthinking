/* Service worker: simpan slaid & permainan untuk kegunaan luar talian. */
var CACHE = 'design-thinking-v1';
var PRECACHE = [
  "./",
  "./index.html",
  "./Design Thinking Deck.dc.html",
  "./Design Thinking Dokumen.dc.html",
  "./Design Thinking Games.dc.html",
  "./Design Thinking Pilihan.dc.html",
  "./support.js",
  "./deck-stage.js",
  "./doc-page.js",
  "./sfx.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./assets/s01.png",
  "./assets/s02.png",
  "./assets/s03.png",
  "./assets/s04.png",
  "./assets/s05.png",
  "./assets/s06.png",
  "./assets/s07.png",
  "./assets/s08.png",
  "./assets/s09.png",
  "./assets/s10.png",
  "./assets/s11.png"
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(PRECACHE.map(function (u) {
        return c.add(new Request(u, { cache: 'reload' })).catch(function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy).catch(function () {}); });
        }
        return res;
      }).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
