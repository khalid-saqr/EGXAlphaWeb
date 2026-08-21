const VERSION = 'egx-alpha-pwa-v2';
const STATIC_CACHE = `${VERSION}-static`;
const CURRENT_CACHE = `${VERSION}-current`;
const ARCHIVE_CACHE = `${VERSION}-archive`;
const PAGE_CACHE = `${VERSION}-pages`;
const ACTIVE_CACHES = new Set([STATIC_CACHE, CURRENT_CACHE, ARCHIVE_CACHE, PAGE_CACHE]);
const LEGACY_CACHE_PREFIX = 'egxresearch-public-pwa-';

const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, '');
function scoped(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${scopePath}${path}`.replace(/\/+/g, '/') || '/';
}
function relativePath(pathname) {
  if (scopePath && pathname.startsWith(scopePath)) return pathname.slice(scopePath.length) || '/';
  return pathname || '/';
}

const PRECACHE = [
  '/', '/today/', '/ar/', '/ar/today/',
  '/data/latest.json', '/data/index.json',
  '/assets/app.js', '/assets/pwa.js', '/assets/access-gate.js', '/assets/pwa.css',
  '/manifest.webmanifest',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-maskable-512.png',
  '/assets/icons/apple-touch-icon.png'
].map(scoped);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => {
        if (ACTIVE_CACHES.has(key)) return null;
        if (key.startsWith(LEGACY_CACHE_PREFIX) || key.startsWith('egx-alpha-')) return caches.delete(key);
        return null;
      })))
      .then(() => self.clients.claim())
  );
});

async function put(cacheName, request, response) {
  if (!response || !response.ok) return response;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  return response;
}

async function offlineNavigationFallback(relative) {
  const localeHome = relative.startsWith('/ar/') ? scoped('/ar/') : scoped('/');
  return (await caches.match(localeHome)) || (await caches.match(scoped('/today/')));
}

async function networkFirst(request, cacheName, relative) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    await put(cacheName, request, response);
    return response;
  } catch (_) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const fallback = await offlineNavigationFallback(relative);
      if (fallback) return fallback;
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    await put(cacheName, request, response);
    return response;
  } catch (_) {
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then(response => put(STATIC_CACHE, request, response))
    .catch(() => null);
  return cached || network || new Response('Offline', { status: 503, statusText: 'Offline' });
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const relative = relativePath(url.pathname);
  const currentPaths = new Set(['/', '/today/', '/ar/', '/ar/today/', '/data/latest.json', '/data/index.json']);
  const isDatedArchivePage = /^\/(?:ar\/)?archive\/\d{4}-\d{2}-\d{2}\/?$/.test(relative);
  const isDatedArchiveData = /^\/data\/archive\/\d{4}-\d{2}-\d{2}\.json$/.test(relative);
  const isImmutableArchive = isDatedArchivePage || isDatedArchiveData;
  const isStatic = relative.startsWith('/assets/') || relative === '/manifest.webmanifest';

  if (currentPaths.has(relative)) {
    event.respondWith(networkFirst(request, CURRENT_CACHE, relative));
    return;
  }
  if (isImmutableArchive) {
    event.respondWith(cacheFirst(request, ARCHIVE_CACHE));
    return;
  }
  if (isStatic) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE, relative));
  }
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});