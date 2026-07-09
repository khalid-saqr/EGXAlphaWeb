import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

execSync('node src/build.mjs', { stdio: 'inherit' });

for (const file of [
  '_site/index.html',
  '_site/today/index.html',
  '_site/archive/index.html',
  '_site/search/index.html',
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
const symbol = latest.signal?.stock_symbol;

assert.ok(date, 'latest payload must include trading_date');
assert.ok(symbol, 'latest payload must include signal.stock_symbol');

const archivePath = `_site/archive/${date}/index.html`;
assert.equal(fs.existsSync(archivePath), true, `${archivePath} should exist`);

const daily = fs.readFileSync(archivePath, 'utf8');

assert.match(daily, /og:title/);
assert.match(daily, /EGX \/Alpha signal/);
assert.ok(daily.includes(symbol), `daily page should include current symbol ${symbol}`);
assert.ok(daily.includes(date), `daily page should include current trading date ${date}`);
assert.ok(daily.includes('Research-only public signal'), 'daily page should include research-only boundary');

console.log('test-build-output passed');
