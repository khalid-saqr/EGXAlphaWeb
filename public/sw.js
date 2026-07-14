const CACHE = 'egxresearch-public-pwa-v3-root';
const BASE = '';
const url = path => BASE + path;
const ASSETS = [
  url('/'),
  url('/today/'),
  url('/archive/'),
  url('/search/'),
  url('/assets/app.css'),
  url('/assets/app.js'),
  url('/data/latest.json'),
  url('/data/index.json'),
  url('/manifest.webmanifest')
];

self.addEventListener('install', event => {
  self.skipWaiting();
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
    }).catch(() => caches.match(url('/'))))
  );
});
