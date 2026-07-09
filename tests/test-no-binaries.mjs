import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const banned = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.zip', '.wasm', '.woff', '.woff2', '.ttf', '.otf', '.eot']);
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (['node_modules', '.git', '_site'].includes(name)) continue;
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p);
    else assert.equal(banned.has(path.extname(p).toLowerCase()), false, `Banned binary/image file found: ${p}`);
  }
}
walk('.');
console.log('test-no-binaries passed');
