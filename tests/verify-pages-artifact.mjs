import assert from 'node:assert/strict';
import fs from 'node:fs';

const requiredFiles = [
  '_site/index.html',
  '_site/today/index.html',
  '_site/assets/app.js',
  '_site/sw.js',
  '_site/data/latest.json',
  '_site/data/index.json'
];

for (const file of requiredFiles) {
  assert.equal(fs.existsSync(file), true, `${file} should exist before deploying Pages`);
}

const index = fs.readFileSync('_site/index.html', 'utf8');
const appJs = fs.readFileSync('_site/assets/app.js', 'utf8');
const sw = fs.readFileSync('_site/sw.js', 'utf8');
const forbidden = ['/EGXResearch', '/EGXAlphaWeb'];

function assertContains(text, expected, message) {
  assert.ok(text.includes(expected), `${message}. Expected ${JSON.stringify(expected)} in _site/index.html. First stylesheet/script/config hints: ${artifactHints()}`);
}

function artifactHints() {
  return [
    ...index.matchAll(/<(?:link|script)[^>]+(?:href|src)="[^"]+"[^>]*>/g),
    ...index.matchAll(/<script id="site-config"[^>]*>[^<]*<\/script>/g)
  ].slice(0, 8).map(match => match[0]).join(' | ');
}

assertContains(index, '<style>', 'production index should inline CSS');
assert.equal(index.includes('href="/assets/app.css"'), false, 'production index should not depend on external CSS');
assert.equal(index.includes('href="/manifest.webmanifest"'), false, 'production index should not enable PWA manifest before visual stability');
assertContains(index, 'src="/assets/app.js"', 'production index should link root-scoped JS');
assertContains(index, '"basePath":""', 'production index should embed empty root basePath');
assert.ok(index.includes('Track one EGX signal after the close.'), 'production index should include the current investor hook');
assert.ok(index.includes('Get early access'), 'production index should include the current CTA');
assert.equal(appJs.includes('serviceWorker.register'), false, 'production app should not register a service worker before visual stability');
assert.ok(sw.includes('self.registration.unregister()'), 'production service worker artifact should unregister legacy workers');
assert.equal(sw.includes('caches.open'), false, 'production service worker cleanup should not precache assets');

for (const text of [index, appJs, sw]) {
  for (const value of forbidden) {
    assert.equal(text.includes(value), false, `production artifact should not include ${value}`);
  }
}

console.log('verify-pages-artifact passed');
