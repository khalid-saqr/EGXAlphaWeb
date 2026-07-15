import assert from 'node:assert/strict';
import fs from 'node:fs';

const requiredFiles = [
  '_site/index.html',
  '_site/today/index.html',
  '_site/archive/index.html',
  '_site/search/index.html',
  '_site/methodology/index.html',
  '_site/data/latest.json',
  '_site/data/index.json',
  '_site/assets/app.js',
  '_site/sw.js',
  '_site/.nojekyll'
];

for (const file of requiredFiles) {
  assert.equal(fs.existsSync(file), true, `${file} should exist`);
}

for (const forbiddenFile of ['_site/assets/app.css', '_site/manifest.webmanifest']) {
  assert.equal(fs.existsSync(forbiddenFile), false, `${forbiddenFile} should not be emitted`);
}

const sourceLatest = JSON.parse(fs.readFileSync('data/latest.json', 'utf8'));
const latest = JSON.parse(fs.readFileSync('_site/data/latest.json', 'utf8'));
assert.deepEqual(latest, sourceLatest, 'built latest.json must exactly match the current repository payload');

const date = latest.trading_date;
const symbol = latest.asset?.symbol || latest.public_signal?.stock_symbol || latest.signal?.stock_symbol;
const display = latest.asset?.display_symbol || String(symbol || '').split(':').pop();
const rank = latest.public_signal?.rank_within_horizon ?? latest.signal?.rank_within_horizon;
const wireHash = latest.integrity?.public_wire_hash;

assert.ok(date, 'latest payload must include trading_date');
assert.ok(symbol, 'latest payload must include a stock symbol');
assert.ok(wireHash, 'latest payload must include public_wire_hash');
assert.equal(fs.existsSync(`_site/archive/${date}/index.html`), true, 'latest dated archive page should exist');
assert.equal(fs.existsSync(`_site/data/archive/${date}.json`), true, 'latest dated archive JSON should exist');

const htmlPages = [
  '_site/index.html',
  '_site/today/index.html',
  '_site/archive/index.html',
  '_site/search/index.html',
  '_site/methodology/index.html',
  `_site/archive/${date}/index.html`
];
const forbiddenBasePaths = ['/EGXResearch', '/EGXAlphaWeb'];

for (const page of htmlPages) {
  const html = fs.readFileSync(page, 'utf8');
  assert.ok(html.includes('<style>'), `${page} should inline the stylesheet`);
  assert.equal(html.includes('href="/assets/app.css"'), false, `${page} should not depend on external CSS`);
  assert.equal(html.includes('manifest.webmanifest'), false, `${page} should not enable PWA installability`);
  assert.ok(html.includes('src="/assets/app.js"'), `${page} should use the custom-domain root script path`);
  assert.ok(html.includes('"basePath":"/"'), `${page} should embed the explicit production root`);
  assert.ok(html.includes('https://egxresearch.com'), `${page} should use the production canonical host`);
  for (const forbidden of forbiddenBasePaths) {
    assert.equal(html.includes(forbidden), false, `${page} should not reference ${forbidden}`);
  }
}

const home = fs.readFileSync('_site/index.html', 'utf8');
const daily = fs.readFileSync('_site/today/index.html', 'utf8');
const methodology = fs.readFileSync('_site/methodology/index.html', 'utf8');
const css = fs.readFileSync('assets/app.css', 'utf8');
const appJs = fs.readFileSync('_site/assets/app.js', 'utf8');
const sw = fs.readFileSync('_site/sw.js', 'utf8');

function visibleMain(html) {
  const start = html.indexOf('<main');
  const end = html.lastIndexOf('</main>');
  return start >= 0 && end >= 0 ? html.slice(start, end + 7) : html;
}

function embeddedPayload(html) {
  const match = html.match(/<script id="beacon-payload" type="application\/json">([\s\S]*?)<\/script>/);
  assert.ok(match, 'signal page must embed the Beacon payload');
  return JSON.parse(match[1]);
}

for (const [label, html] of [['homepage', home], ['today page', daily]]) {
  const embedded = embeddedPayload(html);
  const embeddedSymbol = embedded.asset?.symbol || embedded.public_signal?.stock_symbol || embedded.signal?.stock_symbol;
  assert.equal(embedded.trading_date, date, `${label} must use the current trading date`);
  assert.equal(embeddedSymbol, symbol, `${label} must use the current stock symbol`);
  assert.equal(embedded.integrity?.public_wire_hash, wireHash, `${label} must use the current public-wire hash`);
}

const visibleHome = visibleMain(home);
const visibleDaily = visibleMain(daily);

assert.ok(daily.includes(symbol) || daily.includes(display), `daily page should include ${symbol}`);
assert.ok(daily.includes(date), `daily page should include ${date}`);
assert.ok(visibleDaily.includes('Copyright © EGX Research. All rights reserved.'));
assert.ok(visibleDaily.includes('5 EGX sessions') || visibleDaily.includes('Next 5 EGX sessions'));
assert.ok(daily.includes('mailto:access@egxresearch.com'));
assert.ok(visibleHome.includes(`See the stock ranked #${rank} after today’s close.`));
assert.ok(visibleHome.includes('Today’s free EGX signal'));
assert.ok(visibleHome.includes('What should you do?'));
assert.ok(visibleHome.includes('Get the full daily ranking'));
assert.ok(visibleHome.includes('data-screenshot-card'));
assert.ok(visibleHome.includes('theme-bulb'));

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
  assert.equal(visibleHome.includes(rejected), false, `technical or removed homepage copy found: ${rejected}`);
  assert.equal(visibleDaily.includes(rejected), false, `technical or removed daily copy found: ${rejected}`);
}

for (const required of [
  'Public methodology white paper',
  'EGX /Alpha Methodology',
  'Abstract',
  'deep-learning and real-time monitoring',
  'Real-time monitoring layer',
  'Deep-learning ranking layer',
  'Public-wire publication layer',
  'Matured-outcome follow-up',
  'What remains private',
  'Share',
  'Print',
  '© EGX Research LLP. All rights reserved.',
  'KNOWDYN LTD (UK)'
]) {
  assert.ok(methodology.includes(required), `methodology should include: ${required}`);
}

for (const requiredClass of ['paper-document', 'paper-cover', 'paper-abstract', 'whitepaper-toc', 'methodology-flow', 'paper-boundary']) {
  assert.ok(css.includes(requiredClass), `CSS should include ${requiredClass}`);
}

assert.ok(appJs.includes("basePath: ''"), 'client fallback should be the custom-domain root');
assert.equal(appJs.includes('/EGXResearch'), false);
assert.equal(appJs.includes('/EGXAlphaWeb'), false);
assert.equal(appJs.includes('serviceWorker.register'), false, 'client must not register a service worker');
assert.ok(appJs.includes('registration.unregister()'), 'client should clean up legacy service workers');
assert.ok(appJs.includes('theme-icon-button'), 'client should install the compact bulb theme control');

assert.ok(sw.includes("LEGACY_CACHE_PREFIX = 'egxresearch-public-pwa-'"));
assert.ok(sw.includes('self.registration.unregister()'));
assert.equal(sw.includes("addEventListener('fetch'"), false, 'cleanup worker must not intercept requests');
assert.equal(sw.includes('caches.open'), false, 'cleanup worker must not cache assets');

console.log('test-build-output passed');
