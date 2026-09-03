import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildShutdownSite, shutdownDue, SHUTDOWN_DEADLINE_ISO } from '../src/build-shutdown.mjs';

const notice = fs.readFileSync('shutdown/index.html', 'utf8');
const worker = fs.readFileSync('shutdown/sw.js', 'utf8');
const workflow = fs.readFileSync('.github/workflows/deploy-pages.yaml', 'utf8');

for (const required of [
  'PUBLIC SERVICE ENDED',
  'EGX /Alpha has been acquired. At the direction of the new owner, the public EGX Research service has ceased, and access to the EGX /Alpha research environment and its public daily outputs is no longer available.',
  'تم الاستحواذ على <bdi dir="ltr">EGX /Alpha</bdi>، وبقرار من المالك الجديد، توقفت خدمة <bdi dir="ltr">EGX Research</bdi> العامة، ولم يعد الوصول إلى بيئة <bdi dir="ltr">EGX /Alpha</bdi> البحثية أو مخرجاتها اليومية العامة متاحاً.',
  'Effective 23:59 GMT · 6 September 2026',
  '--bg:#000',
  '--emerald:#20e394',
  'noindex,nofollow,noarchive'
]) assert.ok(notice.includes(required), `shutdown notice should include ${required}`);

for (const required of [
  "const VERSION = 'egx-alpha-shutdown-v1'",
  'keys.map(key => caches.delete(key))',
  'self.clients.claim()',
  "fetch('/', { cache: 'no-store' })"
]) assert.ok(worker.includes(required), `shutdown service worker should include ${required}`);

assert.equal(SHUTDOWN_DEADLINE_ISO, '2026-09-06T23:59:00Z');
assert.equal(shutdownDue(Date.parse('2026-09-06T23:58:59Z')), false);
assert.equal(shutdownDue(Date.parse('2026-09-06T23:59:00Z')), true);

for (const required of [
  "cron: '59 23 6 9 *'",
  'publication_mode: ${{ steps.publication-mode.outputs.mode }}',
  'Apply scheduled public-service shutdown',
  'node src/build-shutdown.mjs',
  'mode="$(node -p',
  "needs.build.outputs.publication_mode"
]) assert.ok(workflow.includes(required), `deployment workflow should include ${required}`);

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'egx-shutdown-'));
fs.mkdirSync(path.join(tempRoot, 'shutdown'), { recursive: true });
fs.copyFileSync('shutdown/index.html', path.join(tempRoot, 'shutdown', 'index.html'));
fs.copyFileSync('shutdown/sw.js', path.join(tempRoot, 'shutdown', 'sw.js'));
const outDir = path.join(tempRoot, '_site');
buildShutdownSite({ root: tempRoot, outDir });
for (const file of ['index.html', '404.html', 'sw.js', '.nojekyll']) assert.equal(fs.existsSync(path.join(outDir, file)), true);
assert.equal(fs.readFileSync(path.join(outDir, 'index.html'), 'utf8'), notice);
assert.equal(fs.readFileSync(path.join(outDir, '404.html'), 'utf8'), notice);
assert.equal(fs.existsSync(path.join(outDir, 'data', 'latest.json')), false, 'shutdown artifact must not expose research data');
fs.rmSync(tempRoot, { recursive: true, force: true });

console.log('test-shutdown passed');
