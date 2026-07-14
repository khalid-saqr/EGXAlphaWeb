import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

execSync('node src/build.mjs', { stdio: 'inherit' });

for (const file of [
  '_site/index.html',
  '_site/today/index.html',
  '_site/archive/index.html',
  '_site/search/index.html',
  '_site/methodology/index.html',
  '_site/data/latest.json',
  '_site/data/index.json',
  '_site/assets/app.css',
  '_site/assets/app.js',
  '_site/manifest.webmanifest',
  '_site/sw.js'
]) {
  assert.equal(fs.existsSync(file), true, `${file} should exist`);
}

const latest = JSON.parse(fs.readFileSync('_site/data/latest.json', 'utf8'));
const date = latest.trading_date;
const symbol = latest.asset?.symbol || latest.public_signal?.stock_symbol || latest.signal?.stock_symbol;
const display = latest.asset?.display_symbol || String(symbol || '').split(':').pop();

assert.ok(date, 'latest payload must include trading_date');
assert.ok(symbol, 'latest payload must include a stock symbol');

const daily = fs.readFileSync('_site/today/index.html', 'utf8');
const home = fs.readFileSync('_site/index.html', 'utf8');
const methodology = fs.readFileSync('_site/methodology/index.html', 'utf8');
const css = fs.readFileSync('_site/assets/app.css', 'utf8');

const appJs = fs.readFileSync('_site/assets/app.js', 'utf8');
const sw = fs.readFileSync('_site/sw.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync('_site/manifest.webmanifest', 'utf8'));
const htmlPages = [
  '_site/index.html',
  '_site/today/index.html',
  '_site/archive/index.html',
  '_site/search/index.html',
  '_site/methodology/index.html'
];
const productionBasePath = '';
const forbiddenBasePaths = ['/EGXResearch', '/EGXAlphaWeb'];

for (const page of htmlPages) {
  const html = fs.readFileSync(page, 'utf8');
  assert.ok(html.includes('href="/assets/app.css"'), `${page} should link the root-scoped stylesheet`);
  assert.ok(html.includes('src="/assets/app.js"'), `${page} should link the root-scoped app script`);
  assert.ok(html.includes('href="/manifest.webmanifest"'), `${page} should link the root-scoped manifest`);
  assert.ok(html.includes(`"basePath":"${productionBasePath}"`), `${page} should embed the production root base path`);
  for (const forbiddenBasePath of forbiddenBasePaths) {
    assert.equal(html.includes(forbiddenBasePath), false, `${page} should not reference ${forbiddenBasePath} in production output`);
  }
}

for (const forbiddenBasePath of forbiddenBasePaths) {
  assert.equal(appJs.includes(forbiddenBasePath), false, `client app should not retain ${forbiddenBasePath}`);
  assert.equal(sw.includes(forbiddenBasePath), false, `service worker should not reference ${forbiddenBasePath}`);
}
assert.ok(appJs.includes("basePath: ''"), 'client app should retain the root production fallback base path');
assert.equal(manifest.start_url, '/', 'manifest start_url should use the custom-domain root');
assert.equal(manifest.scope, '/', 'manifest scope should use the custom-domain root');
assert.ok(sw.includes('const BASE = "";'), 'service worker should use the custom-domain root base path');
assert.ok(sw.includes('egxresearch-public-pwa-v3-root'), 'service worker cache should be bumped for root-scoped assets');
for (const asset of ['/assets/app.css', '/assets/app.js', '/data/latest.json', '/data/index.json', '/manifest.webmanifest']) {
  assert.ok(sw.includes(`url('${asset}')`), `service worker should precache ${asset}`);
}

assert.match(daily, /og:title/);
assert.match(daily, /EGX \/Alpha signal/);
assert.match(daily, /EGX \/Alpha Mind/);
assert.ok(daily.includes(symbol) || daily.includes(display), `daily page should include current symbol ${symbol}`);
assert.ok(daily.includes(date), `daily page should include current trading date ${date}`);
assert.ok(daily.includes('Research only. No buy/sell instruction.'), 'daily page should include the compact research boundary');
assert.ok(daily.includes('Close') || daily.includes('Traded value') || daily.includes('Volume'), 'signal hero should include market context when available');
assert.ok(daily.includes('Next 5 EGX trading sessions') || daily.includes('Next 5 EGX sessions'), 'horizon should be explained in investor language');
assert.ok(daily.includes('mailto:access@egxresearch.com'), 'daily page should include the early-access mailto CTA');
assert.ok(daily.includes('Track one EGX signal after the close.'), 'daily page should include the retail investor hook');
assert.ok(daily.includes('Get early access'), 'daily page should include concise conversion CTA');

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
  'Secret sauce stays out of the public repo.',
  'Share',
  'Print',
  '© EGX Research LLP. All rights reserved.',
  'KNOWDYN LTD (UK)'
]) {
  assert.ok(methodology.includes(required), `methodology page should include: ${required}`);
}

for (const requiredClass of ['paper-document', 'paper-cover', 'paper-abstract', 'whitepaper-toc', 'methodology-flow', 'paper-boundary']) {
  assert.ok(css.includes(requiredClass), `white paper CSS should include: ${requiredClass}`);
}

for (const rejected of [
  'Fresh data',
  'Signal read',
  'Model read',
  'Investor read',
  'Share today’s card',
  'Daily ranking layer',
  'Public-safe',
  'public-safe',
  'One public signal from the EGX ranking engine.',
  'A compact daily view for following one bounded public EGX /Alpha signal after market close.',
  'The free signal is only a ' + 'teaser',
  'Creator' + ':',
  'internal ' + 'state',
  'Full system ' + 'diagnostics',
  'market_structure_sector'
]) {
  assert.equal(home.includes(rejected), false, `Rejected homepage copy found: ${rejected}`);
  assert.equal(daily.includes(rejected), false, `Rejected daily copy found: ${rejected}`);
}

for (const privatePhrase of [
  'ranking_score',
  'direction_logit',
  'raw_observation_rows',
  'feature_audit',
  'latest_predictions',
  'source_status_path',
  'daily_bars_path'
]) {
  assert.equal(methodology.includes(privatePhrase), false, `Private implementation term found on methodology page: ${privatePhrase}`);
}



execSync('EGX_BASE_PATH=/EGXResearch EGX_SITE_URL=https://example.test/EGXResearch node src/build.mjs', { stdio: 'inherit' });
const preview = fs.readFileSync('_site/index.html', 'utf8');
const previewManifest = JSON.parse(fs.readFileSync('_site/manifest.webmanifest', 'utf8'));
const previewSw = fs.readFileSync('_site/sw.js', 'utf8');
assert.ok(preview.includes('href="/EGXResearch/assets/app.css"'), 'preview build should support an explicit prefixed stylesheet path');
assert.ok(preview.includes('"basePath":"/EGXResearch"'), 'preview build should embed the explicit prefixed base path');
assert.equal(previewManifest.start_url, '/EGXResearch/', 'preview manifest should use the explicit prefixed start_url');
assert.equal(previewManifest.scope, '/EGXResearch/', 'preview manifest should use the explicit prefixed scope');
assert.ok(previewSw.includes('const BASE = "/EGXResearch";'), 'preview service worker should use the explicit prefixed base path');

execSync('node src/build.mjs', { stdio: 'inherit' });

console.log('test-build-output passed');
