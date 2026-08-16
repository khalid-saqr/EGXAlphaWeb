import assert from 'node:assert/strict';
import fs from 'node:fs';

for (const file of [
  '_site/index.html',
  '_site/today/index.html',
  '_site/archive/index.html',
  '_site/search/index.html',
  '_site/methodology/index.html',
  '_site/institutional/index.html',
  '_site/data/latest.json',
  '_site/data/index.json',
  '_site/assets/app.js',
  '_site/sw.js',
  '_site/.nojekyll'
]) assert.equal(fs.existsSync(file), true, `${file} should exist`);

const latest = JSON.parse(fs.readFileSync('_site/data/latest.json', 'utf8'));
const source = JSON.parse(fs.readFileSync('data/latest.json', 'utf8'));
assert.deepEqual(latest, source, 'UI polish must not mutate the production public wire');

const pages = [
  '_site/index.html',
  '_site/today/index.html',
  '_site/archive/index.html',
  '_site/search/index.html',
  '_site/methodology/index.html',
  '_site/institutional/index.html'
];
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  assert.ok(html.includes('<style>'));
  assert.ok(html.includes('src="/assets/app.js"'));
  assert.ok(html.includes('https://egxresearch.com'));
  assert.equal(html.includes('/EGXAlphaWeb'), false);
}

const institutional = fs.readFileSync('_site/institutional/index.html', 'utf8');
for (const required of ['INSTITUTIONAL RESEARCH & TECHNOLOGY', 'Research distribution', 'Technology integration', 'Strategic research applications', 'access@egxresearch.com']) assert.ok(institutional.includes(required));

const home = fs.readFileSync('_site/index.html', 'utf8');
const mainStart = home.indexOf('<main');
const mainEnd = home.lastIndexOf('</main>');
const visibleHome = mainStart >= 0 && mainEnd >= 0 ? home.slice(mainStart, mainEnd + 7) : home;
for (const removed of ['Today’s free EGX signal', 'One stock is free', 'Get the full daily ranking']) assert.equal(visibleHome.includes(removed), false);

const archive = fs.readFileSync('_site/archive/index.html', 'utf8');
assert.ok(archive.includes('1 public row / universe unavailable'), 'legacy V1 sessions without comparison_count must say the universe is unavailable');
assert.equal(archive.includes('1 public row / 1 universe'), false, 'published-row count must never be substituted for unknown universe size');

const legacyJuly9 = fs.readFileSync('_site/archive/2026-07-09/index.html', 'utf8');
assert.ok(legacyJuly9.includes('<strong>—</strong><em>universe unavailable</em>'), 'July 9 V1 record must render unknown universe honestly');
assert.ok(legacyJuly9.includes('PUBLIC ROW / UNIVERSE UNAVAILABLE'), 'legacy ranking header must not infer a one-security universe');

const appJs = fs.readFileSync('_site/assets/app.js', 'utf8');
assert.ok(appJs.includes('dataModelFilter') || appJs.includes('dataset.modelFilter'));
assert.equal(appJs.includes('serviceWorker.register'), false);
assert.ok(appJs.includes('unregister()'));

const sw = fs.readFileSync('_site/sw.js', 'utf8');
assert.ok(sw.includes('self.registration.unregister()'));
assert.equal(sw.includes("addEventListener('fetch'"), false);

console.log('test-build-output passed');
