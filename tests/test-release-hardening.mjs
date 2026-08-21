import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildSite } from '../src/build.mjs';
import { asPublicV2Fixture } from './helpers/v2-fixture.mjs';

const SITE = path.join(process.cwd(), '_site');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function internalTarget(raw) {
  if (!raw || raw.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('//')) return null;
  const clean = decodeURIComponent(raw.split('#')[0].split('?')[0] || '/');
  if (!clean.startsWith('/')) return null;
  const relative = clean.slice(1);
  if (!relative) return path.join(SITE, 'index.html');
  const direct = path.join(SITE, relative);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  return path.join(direct, 'index.html');
}

function extractPayload(html) {
  const match = html.match(/<script id="beacon-payload" type="application\/json">([\s\S]*?)<\/script>/);
  assert.ok(match, 'rendered page should expose its bounded public payload');
  return JSON.parse(match[1]);
}

assert.equal(fs.existsSync(SITE), true, 'production artifact must exist before release-hardening checks');
const htmlFiles = walk(SITE).filter(file => file.endsWith('.html'));
assert.ok(htmlFiles.length > 100, 'release build should include the complete English/Arabic archive and dossier surface');

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(SITE, file).replaceAll(path.sep, '/');

  assert.equal(/__(?:LANGUAGE|PWA)_[A-Z_]+__/.test(html), false, `${relative} must not leak build placeholders`);
  assert.ok(html.includes('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'), `${relative} must be viewport safe`);
  assert.ok(html.includes('<link rel="canonical" href="https://egxresearch.com'), `${relative} must have a production canonical`);
  assert.ok(html.includes('hreflang="en"'), `${relative} must expose English hreflang`);
  assert.ok(html.includes('hreflang="ar"'), `${relative} must expose Arabic hreflang`);
  assert.ok(html.includes('hreflang="x-default"'), `${relative} must expose x-default hreflang`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${relative} must not contain duplicate element ids`);

  for (const button of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    const attrs = button[1];
    const visibleText = button[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    assert.ok(/aria-label="[^"]+"/.test(attrs) || visibleText, `${relative} contains a button without an accessible name`);
  }

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const target = internalTarget(match[1]);
    if (target) assert.equal(fs.existsSync(target), true, `${relative} links to missing production target ${match[1]}`);
  }

  if (!relative.startsWith('ar/')) {
    const counterpart = relative === 'index.html' ? path.join(SITE, 'ar', 'index.html') : path.join(SITE, 'ar', relative);
    assert.equal(fs.existsSync(counterpart), true, `${relative} must have an Arabic artifact counterpart`);
  }
}

for (const cssFile of ['assets/shell.css', 'assets/product.css', 'assets/research-terminal.css', 'assets/i18n.css', 'assets/pwa.css']) {
  assert.equal(fs.existsSync(cssFile), true, `${cssFile} should exist`);
}
const pwaCss = fs.readFileSync('assets/pwa.css', 'utf8');
for (const selector of [
  '.nav-desktop a,',
  '.search-action,',
  '.language-action,',
  '.footer-theme-toggle,',
  '.product-switcher button,',
  '.horizon-buttons button,',
  '.terminal-ranking-control .horizon-buttons button,',
  '.mover-list a{min-height:44px!important}'
]) assert.ok(pwaCss.includes(selector), `release touch-target override should include ${selector}`);
assert.ok(pwaCss.includes('min-height:44px!important'), 'release stylesheet must enforce the 44px interaction floor');
assert.ok(pwaCss.includes('.search-action,.theme-toggle,.mobile-menu>summary{width:44px!important;height:44px!important}'), 'narrow-phone header controls must not shrink below 44px');

const pwa = fs.readFileSync('assets/pwa.js', 'utf8');
for (const required of ['currentHtmlHasDate', '__egx_record', 'DEPLOYING NEW PUBLIC RECORD', 'window.location.reload()']) {
  assert.ok(pwa.includes(required), `PWA release client should include ${required}`);
}
const sw = fs.readFileSync('assets/sw.js', 'utf8');
assert.ok(sw.includes("const VERSION = 'egx-alpha-pwa-v3'"), 'final release must roll the service-worker cache generation');
assert.ok(sw.includes("key.startsWith('egx-alpha-')"), 'service-worker activation must clear prior EGX /Alpha cache generations');

const workflow = fs.readFileSync('.github/workflows/deploy-pages.yaml', 'utf8');
assert.ok(workflow.includes('git checkout origin/main -- data/latest.json data/archive'), 'PR validation must always use the current main public payload');
assert.ok(workflow.includes('Verify final release and publication rollover'), 'Pages CI must include the final release gate');
assert.ok(workflow.includes('Verify production publication after Pages deploy'), 'main deployments must verify production convergence');
assert.ok(workflow.includes('EXPECTED_TRADING_DATE'), 'production verification must compare against the built trading date');
assert.ok(workflow.includes('service_worker_version: ${{ steps.release-meta.outputs.service_worker_version }}'), 'build must expose the service-worker version as release metadata');
assert.ok(workflow.includes("fs.readFileSync('_site/sw.js', 'utf8')"), 'release metadata must derive the service-worker version from the built artifact');
assert.ok(workflow.includes('service_worker_version=${version[1]}'), 'release metadata must publish the derived service-worker version');
assert.ok(workflow.includes('EXPECTED_SW_VERSION: ${{ needs.build.outputs.service_worker_version }}'), 'production verification must consume the derived service-worker version');
assert.ok(workflow.includes('[ "$live_sw_version" = "$EXPECTED_SW_VERSION" ]'), 'production verification must compare live and built service-worker versions exactly');
assert.equal(/egx-alpha-pwa-v\d+/.test(workflow), false, 'deployment workflow must never hard-code a service-worker cache generation');

const raw8 = JSON.parse(fs.readFileSync('tests/fixtures/universe-2026-07-08.json', 'utf8'));
const raw9 = JSON.parse(fs.readFileSync('tests/fixtures/universe-2026-07-09.json', 'utf8'));
const july8 = asPublicV2Fixture(raw8);
const july9 = asPublicV2Fixture(raw9, { recordOrigin: 'live' });
const july12 = structuredClone(july9);
july12.trading_date = '2026-07-12';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'egxalpha-release-rollover-'));
const dataDir = path.join(tmp, 'data');
const archiveDir = path.join(dataDir, 'archive');
const outDir = path.join(tmp, '_site');
fs.mkdirSync(archiveDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'latest.json'), JSON.stringify(july12, null, 2));
fs.writeFileSync(path.join(archiveDir, '2026-07-08.json'), JSON.stringify(july8, null, 2));
fs.writeFileSync(path.join(archiveDir, '2026-07-09.json'), JSON.stringify(july9, null, 2));
fs.writeFileSync(path.join(archiveDir, '2026-07-12.json'), JSON.stringify(july12, null, 2));

try {
  const result = buildSite({ root: process.cwd(), outDir, dataDir });
  assert.equal(result.latest.trading_date, '2026-07-12');
  assert.equal(result.sessions.length, 3, 'a publication-only data change must extend Public Model Memory');

  for (const file of [
    'index.html', 'today/index.html', 'ar/index.html', 'ar/today/index.html',
    'archive/2026-07-12/index.html', 'ar/archive/2026-07-12/index.html',
    'data/latest.json', 'data/archive/2026-07-12.json', 'data/index.json',
    'manifest.webmanifest', 'sw.js', 'assets/pwa.js'
  ]) assert.equal(fs.existsSync(path.join(outDir, file)), true, `publication rollover should emit ${file}`);

  for (const file of ['index.html', 'today/index.html', 'ar/index.html', 'ar/today/index.html']) {
    const payload = extractPayload(fs.readFileSync(path.join(outDir, file), 'utf8'));
    assert.equal(payload.trading_date, '2026-07-12', `${file} must adopt the new public record without UI edits`);
  }

  const builtLatest = JSON.parse(fs.readFileSync(path.join(outDir, 'data', 'latest.json'), 'utf8'));
  assert.deepEqual(builtLatest, july12, 'release build must publish the new public wire without mutation');
  const builtIndex = JSON.parse(fs.readFileSync(path.join(outDir, 'data', 'index.json'), 'utf8'));
  assert.ok(builtIndex.some(row => row.date === '2026-07-12'), 'search index must adopt the newly published session automatically');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log('test-release-hardening passed');
