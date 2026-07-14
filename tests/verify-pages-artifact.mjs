import assert from 'node:assert/strict';
import fs from 'node:fs';

const requiredFiles = [
  '_site/index.html',
  '_site/today/index.html',
  '_site/assets/app.css',
  '_site/assets/app.js',
  '_site/manifest.webmanifest',
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
const manifest = JSON.parse(fs.readFileSync('_site/manifest.webmanifest', 'utf8'));
const forbidden = ['/EGXResearch', '/EGXAlphaWeb'];

assert.ok(index.includes('href="/assets/app.css"'), 'production index should link root-scoped CSS');
assert.ok(index.includes('src="/assets/app.js"'), 'production index should link root-scoped JS');
assert.ok(index.includes('href="/manifest.webmanifest"'), 'production index should link root-scoped manifest');
assert.ok(index.includes('"basePath":""'), 'production index should embed empty root basePath');
assert.ok(index.includes('Track one EGX signal after the close.'), 'production index should include the current investor hook');
assert.ok(index.includes('Get early access'), 'production index should include the current CTA');
assert.equal(manifest.start_url, '/', 'production manifest should start at the custom-domain root');
assert.equal(manifest.scope, '/', 'production manifest should scope to the custom-domain root');
assert.ok(sw.includes('const BASE = "";'), 'production service worker should use the custom-domain root');
assert.ok(sw.includes('egxresearch-public-pwa-v3-root'), 'production service worker should use the root cache version');

for (const text of [index, appJs, sw, JSON.stringify(manifest)]) {
  for (const value of forbidden) {
    assert.equal(text.includes(value), false, `production artifact should not include ${value}`);
  }
}

console.log('verify-pages-artifact passed');
