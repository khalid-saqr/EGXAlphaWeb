import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';

for (const file of [
  '_site/manifest.webmanifest', '_site/sw.js', '_site/assets/pwa.js', '_site/assets/pwa.css', '_site/assets/fine-tune.css',
  '_site/assets/icons/icon-192.png', '_site/assets/icons/icon-512.png',
  '_site/assets/icons/icon-maskable-512.png', '_site/assets/icons/apple-touch-icon.png'
]) assert.equal(fs.existsSync(file), true, `${file} should exist in the Pages artifact`);

const manifest = JSON.parse(fs.readFileSync('_site/manifest.webmanifest', 'utf8'));
assert.equal(manifest.name, 'EGX /Alpha — EGX Research');
assert.equal(manifest.short_name, 'EGX /Alpha');
assert.equal(manifest.start_url, '/');
assert.equal(manifest.scope, '/');
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.background_color, '#010201');
assert.equal(manifest.theme_color, '#010201');
assert.ok(manifest.icons.some(icon => icon.src === '/assets/icons/icon-192.png' && icon.sizes === '192x192'));
assert.ok(manifest.icons.some(icon => icon.src === '/assets/icons/icon-512.png' && icon.sizes === '512x512'));
assert.ok(manifest.icons.some(icon => icon.src === '/assets/icons/icon-maskable-512.png' && icon.purpose === 'maskable'));
assert.equal(manifest.shortcuts.find(item => item.url === '/ar/')?.short_name, 'Ar');

function validatePng(file, expectedSize) {
  const data = fs.readFileSync(file);
  assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${file} should be PNG`);
  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  assert.deepEqual([width, height], expectedSize, `${file} should have the expected dimensions`);
  assert.equal(data[24], 8, `${file} should use 8-bit channels`);
  assert.equal(data[25], 2, `${file} should use RGB color`);

  const idat = [];
  let offset = 8;
  let sawIend = false;
  while (offset + 12 <= data.length) {
    const length = data.readUInt32BE(offset);
    const type = data.subarray(offset + 4, offset + 8).toString('ascii');
    const start = offset + 8;
    const end = start + length;
    assert.ok(end + 4 <= data.length, `${file} should contain complete ${type} chunk data`);
    if (type === 'IDAT') idat.push(data.subarray(start, end));
    if (type === 'IEND') { sawIend = true; break; }
    offset = end + 4;
  }
  assert.equal(sawIend, true, `${file} should contain IEND`);
  assert.ok(idat.length > 0, `${file} should contain IDAT image data`);
  const decoded = zlib.inflateSync(Buffer.concat(idat));
  assert.equal(decoded.length, height * (1 + width * 3), `${file} should fully decode as non-interlaced RGB PNG`);
}
validatePng('_site/assets/icons/icon-192.png', [192, 192]);
validatePng('_site/assets/icons/icon-512.png', [512, 512]);
validatePng('_site/assets/icons/icon-maskable-512.png', [512, 512]);
validatePng('_site/assets/icons/apple-touch-icon.png', [180, 180]);

const en = fs.readFileSync('_site/index.html', 'utf8');
const ar = fs.readFileSync('_site/ar/index.html', 'utf8');
for (const html of [en, ar]) {
  assert.ok(html.includes('rel="manifest" href="/manifest.webmanifest"'));
  assert.ok(html.includes('rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png"'));
  assert.ok(html.includes('src="/assets/pwa.js"'));
  assert.ok(html.includes('href="/assets/pwa.css"'));
  assert.ok(html.includes('href="/assets/fine-tune.css"'));
  assert.ok(html.includes('data-pwa-install'));
  assert.ok(html.includes('data-pwa-status'));
  assert.ok(html.includes('data-pwa-offline'));
  assert.ok(html.includes('<meta name="theme-color" content="#010201">'));
}
assert.ok(en.includes('INSTALL EGX /ALPHA'));
assert.ok(ar.includes('تثبيت EGX /ALPHA'));
assert.ok(ar.includes('>التطبيق<'));
assert.equal(ar.includes('>APP<'), false);

const app = fs.readFileSync('_site/assets/app.js', 'utf8');
assert.equal(app.includes('unregister()'), false, 'production app must stop unregistering the service worker');

const pwa = fs.readFileSync('_site/assets/pwa.js', 'utf8');
for (const required of [
  'beforeinstallprompt', 'appinstalled', 'serviceWorker.register', '/data/latest.json', "cache: 'no-store'",
  'visibilitychange', 'pageshow', "addEventListener('focus'", 'trading_date', 'window.location.reload()',
  "new Set(['/', '/today/', '/ar/', '/ar/today/'])", 'navigator.onLine', 'Add to Home Screen',
  'Install EGX /Alpha', "querySelectorAll('[data-pwa-install]')", 'dataset.pwaInstallVariant', 'helpForButton'
]) assert.ok(pwa.includes(required), `PWA client should include ${required}`);
for (const forbidden of ['PushManager', 'Notification.requestPermission', 'periodicSync', '.sync.register']) assert.equal(pwa.includes(forbidden), false, `PWA client must not include ${forbidden}`);

const sw = fs.readFileSync('_site/sw.js', 'utf8');
for (const required of [
  "addEventListener('install'", "addEventListener('activate'", "addEventListener('fetch'",
  'networkFirst', 'cacheFirst', 'staleWhileRevalidate', '/data/latest.json', '/data/index.json',
  'isDatedArchivePage', 'isDatedArchiveData', 'isImmutableArchive',
  'LEGACY_CACHE_PREFIX', 'self.clients.claim()'
]) assert.ok(sw.includes(required), `service worker should include ${required}`);
assert.equal(sw.includes("relative.startsWith('/archive/')"), false, 'mutable History index must not be cache-first');
assert.equal(sw.includes("relative.startsWith('/ar/archive/')"), false, 'mutable Arabic History index must not be cache-first');
for (const forbidden of ["addEventListener('push'", "addEventListener('sync'", 'periodicSync', 'showNotification']) assert.equal(sw.includes(forbidden), false, `service worker must not include ${forbidden}`);

const pwaCss = fs.readFileSync('_site/assets/pwa.css', 'utf8');
for (const required of ['@media(display-mode:standalone)', 'env(safe-area-inset-top)', '.offline-notice', '@media(max-width:620px)', '.alpha-control-deck .primary-action{color:#000}', '.pwa-hero-install']) assert.ok(pwaCss.includes(required));
const fineTuneCss = fs.readFileSync('_site/assets/fine-tune.css', 'utf8');
for (const required of ['--bg:#010201','--brand:#00D084','--bg:#FFFFFF','--brand:#007A4B','.footer-app .pwa-install-button']) assert.ok(fineTuneCss.includes(required));

console.log('test-pwa passed');
