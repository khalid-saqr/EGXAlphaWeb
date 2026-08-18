import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const banned = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.zip', '.wasm', '.woff', '.woff2', '.ttf', '.otf', '.eot']);
const allowedBinary = new Set([
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/icons/apple-touch-icon.png'
]);
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (['node_modules', '.git', '_site'].includes(name)) continue;
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p);
    else if (banned.has(path.extname(p).toLowerCase())) {
      const relative = p.replaceAll('\\', '/').replace(/^\.\//, '');
      assert.equal(allowedBinary.has(relative), true, `Unexpected binary/image file found: ${relative}`);
    }
  }
}
walk('.');
assert.equal(allowedBinary.size, 4, 'binary allowlist should remain narrow');
for (const file of allowedBinary) assert.equal(fs.existsSync(file), true, `approved PWA icon should exist: ${file}`);
console.log('test-no-binaries passed');
