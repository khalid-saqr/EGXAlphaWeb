import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { FORBIDDEN_KEYS } from '../src/validate.mjs';

if (!fs.existsSync('_site')) execSync('node src/build.mjs', { stdio: 'inherit' });
const scanDirs = ['_site', 'data'];
const extensions = new Set(['.html', '.json', '.js', '.css', '.webmanifest', '.md', '.mjs', '.yml']);
function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) files.push(...walk(p));
    else if (extensions.has(path.extname(p)) || p.endsWith('.nojekyll')) files.push(p);
  }
  return files;
}
for (const file of scanDirs.flatMap(walk)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const key of FORBIDDEN_KEYS) {
    assert.equal(text.includes(`"${key}"`), false, `${key} leaked into ${file}`);
  }
}
console.log('test-no-leakage passed');
