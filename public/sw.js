const CACHE = 'egxresearch-public-pwa-v1';
const BASE = '/EGXResearch';
const ASSETS = [
  `${BASE}/`,
  `${BASE}/today/`,
  `${BASE}/archive/`,
  `${BASE}/search/`,
  `${BASE}/assets/app.css`,
  `${BASE}/assets/app.js`,
  `${BASE}/data/latest.json`,
  `${BASE}/data/index.json`,
  `${BASE}/manifest.webmanifest`
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(req, copy));
      return res;
    }).catch(() => caches.match(`${BASE}/`)))
  );
});
