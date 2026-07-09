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

assert.match(daily, /og:title/);
assert.match(daily, /EGX \/Alpha signal/);
assert.match(daily, /EGX \/Alpha Mind/);
assert.ok(daily.includes(symbol) || daily.includes(display), `daily page should include current symbol ${symbol}`);
assert.ok(daily.includes(date), `daily page should include current trading date ${date}`);
assert.ok(daily.includes('Research-only. Not personalised investment advice. No buy/sell/hold instruction.'), 'daily page should include the compact research boundary');
assert.ok(daily.includes('Close') || daily.includes('Traded value') || daily.includes('Volume'), 'signal hero should include market context when available');
assert.ok(daily.includes('Next 5 EGX trading sessions') || daily.includes('Next 5 EGX sessions'), 'horizon should be explained in investor language');
assert.ok(daily.includes('mailto:access@egxresearch.com'), 'daily page should include the early-access mailto CTA');
assert.ok(methodology.includes('EGX /Alpha Methodology'), 'methodology page should render white paper title');
assert.ok(methodology.includes('Share'), 'methodology page should include a share control');
assert.ok(methodology.includes('Print'), 'methodology page should include a print control');
assert.ok(methodology.includes('© EGX Research LLP. All rights reserved.'), 'methodology page should include EGX Research LLP copyright');
assert.ok(methodology.includes('KNOWDYN LTD (UK)'), 'methodology page should include KNOWDYN LTD (UK) IP management language');

for (const rejected of [
  'Fresh data',
  'Signal read',
  'Model read',
  'Investor read',
  'Share today’s card',
  'Daily ranking layer',
  'Public-safe',
  'public-safe',
  'The free signal is only a ' + 'teaser',
  'Creator' + ':',
  'internal ' + 'state',
  'Full system ' + 'diagnostics',
  'market_structure_sector'
]) {
  assert.equal(home.includes(rejected), false, `Rejected homepage copy found: ${rejected}`);
  assert.equal(daily.includes(rejected), false, `Rejected daily copy found: ${rejected}`);
}

console.log('test-build-output passed');
