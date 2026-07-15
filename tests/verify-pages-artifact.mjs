import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const requiredFiles = [
  '_site/index.html',
  '_site/today/index.html',
  '_site/archive/index.html',
  '_site/search/index.html',
  '_site/methodology/index.html',
  '_site/assets/app.js',
  '_site/sw.js',
  '_site/data/latest.json',
  '_site/data/index.json',
  '_site/.nojekyll'
];

for (const file of requiredFiles) {
  assert.equal(fs.existsSync(file), true, `${file} should exist before deployment`);
}

assert.equal(fs.existsSync('_site/assets/app.css'), false, 'CSS should be inlined');
assert.equal(fs.existsSync('_site/manifest.webmanifest'), false, 'PWA manifest should not be deployed');

const latest = JSON.parse(fs.readFileSync('_site/data/latest.json', 'utf8'));
const date = latest.trading_date;
assert.ok(date, 'latest payload must have a trading date');
assert.equal(fs.existsSync(path.join('_site', 'archive', date, 'index.html')), true, 'latest archive page should exist');
assert.equal(fs.existsSync(path.join('_site', 'data', 'archive', `${date}.json`)), true, 'latest archive payload should exist');

const index = fs.readFileSync('_site/index.html', 'utf8');
const appJs = fs.readFileSync('_site/assets/app.js', 'utf8');
const sw = fs.readFileSync('_site/sw.js', 'utf8');

assert.ok(index.includes('<style>'));
assert.ok(index.includes('src="/assets/app.js"'));
assert.ok(index.includes('"basePath":"/"'));
assert.ok(index.includes('https://egxresearch.com/'));
assert.ok(index.includes('See what the ranking surfaced after the EGX close.'));
assert.ok(index.includes('class="signal-share-card'));
assert.ok(index.includes('data-screenshot-card'));
assert.ok(index.includes('class="conversion-rail"'));
assert.ok(index.includes('Request the complete ranked view'));
assert.ok(index.includes('theme-bulb'));
assert.equal(index.includes('data-theme-label'), false);
assert.equal(index.includes('class="investor-signal-card"'), false);
assert.equal(index.includes('Track one EGX signal after the close.'), false);
assert.equal(index.includes('manifest.webmanifest'), false);
assert.equal(appJs.includes('serviceWorker.register'), false);
assert.ok(sw.includes('self.registration.unregister()'));
assert.equal(sw.includes('caches.open'), false);
assert.equal(sw.includes("addEventListener('fetch'"), false);

for (const text of [index, appJs, sw]) {
  for (const forbidden of ['/EGXResearch', '/EGXAlphaWeb']) {
    assert.equal(text.includes(forbidden), false, `artifact should not include ${forbidden}`);
  }
}

console.log('verify-pages-artifact passed');
