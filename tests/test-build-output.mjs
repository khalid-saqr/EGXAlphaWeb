import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

execSync('node src/build.mjs', { stdio: 'inherit' });
for (const file of [
  '_site/index.html',
  '_site/today/index.html',
  '_site/archive/index.html',
  '_site/archive/2026-07-09/index.html',
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
const daily = fs.readFileSync('_site/archive/2026-07-09/index.html', 'utf8');
assert.match(daily, /og:title/);
assert.match(daily, /EGX \/Alpha signal/);
assert.match(daily, /EGX:DEMO/);
console.log('test-build-output passed');
