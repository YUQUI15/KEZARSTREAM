/* KEZARSTREAM service worker
 * Solo cachea recursos estáticos propios y ofrece una página sin conexión.
 * NO intercepta /api, reproductores (iframes) ni ningún dominio externo,
 * para no afectar la reproducción de video. */
const VERSION = 'kezar-v2';
const STATIC_CACHE = `${VERSION}-static`;
const OFFLINE_URL = '/offline.html';
const PRECACHE = [OFFLINE_URL, '/icon-192.png', '/icon-512.png', '/placeholder-poster.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // nunca tocar dominios externos
  if (url.pathname.startsWith('/api/')) return; // nunca cachear APIs

  // Navegación: red primero, página sin conexión si falla
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Estáticos inmutables de Next e íconos: cache primero
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    /\.(?:png|jpg|jpeg|svg|webp|ico|woff2?)$/i.test(url.pathname);
  if (isStatic) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
      )
    );
  }
});
