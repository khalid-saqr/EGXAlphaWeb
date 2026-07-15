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
const rank = latest.public_signal?.rank_within_horizon ?? latest.signal?.rank_within_horizon;
assert.ok(date, 'latest payload must have a trading date');
assert.equal(fs.existsSync(path.join('_site', 'archive', date, 'index.html')), true, 'latest archive page should exist');
assert.equal(fs.existsSync(path.join('_site', 'data', 'archive', `${date}.json`)), true, 'latest archive payload should exist');

const index = fs.readFileSync('_site/index.html', 'utf8');
const appJs = fs.readFileSync('_site/assets/app.js', 'utf8');
const sw = fs.readFileSync('_site/sw.js', 'utf8');
const mainStart = index.indexOf('<main');
const mainEnd = index.lastIndexOf('</main>');
const visible = mainStart >= 0 && mainEnd >= 0 ? index.slice(mainStart, mainEnd + 7) : index;

assert.ok(index.includes('<style>'));
assert.ok(index.includes('src="/assets/app.js"'));
assert.ok(index.includes('"basePath":"/"'));
assert.ok(index.includes('https://egxresearch.com/'));
assert.ok(visible.includes(`See the stock ranked #${rank} after today’s close.`));
assert.ok(visible.includes('Today’s free EGX signal'));
assert.ok(visible.includes('class="signal-share-card'));
assert.ok(visible.includes('data-screenshot-card'));
assert.ok(visible.includes('class="conversion-rail"'));
assert.ok(visible.includes('What should you do?'));
assert.ok(visible.includes('Get the full daily ranking'));
assert.ok(visible.includes('Copyright © EGX Research. All rights reserved.'));
assert.ok(visible.includes('theme-bulb'));
assert.equal(visible.includes('data-theme-label'), false);
assert.equal(visible.includes('class="investor-signal-card"'), false);
assert.equal(visible.includes('manifest.webmanifest'), false);
assert.equal(appJs.includes('serviceWorker.register'), false);
assert.ok(sw.includes('self.registration.unregister()'));
assert.equal(sw.includes('caches.open'), false);
assert.equal(sw.includes("addEventListener('fetch'"), false);

for (const rejected of [
  'One free signal from today’s complete EGX ranking',
  'See the share EGX /Alpha ranked',
  'eligible Egyptian shares',
  'defined model horizon',
  'relative rank',
  'Direction signal',
  'Rank in today’s model',
  'Model horizon',
  'Market context',
  'not a suggested holding period',
  'How to use this signal',
  'Request access to the complete daily ranking',
  'Screenshot-ready public card',
  'Rank and direction are separate model outputs.',
  'EGXRESEARCH.COM',
  'Clear model context',
  'Trackable history'
]) {
  assert.equal(visible.includes(rejected), false, `technical or removed homepage copy found: ${rejected}`);
}

for (const text of [index, appJs, sw]) {
  for (const forbidden of ['/EGXResearch', '/EGXAlphaWeb']) {
    assert.equal(text.includes(forbidden), false, `artifact should not include ${forbidden}`);
  }
}

console.log('verify-pages-artifact passed');
