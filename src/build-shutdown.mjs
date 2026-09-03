import fs from 'node:fs';
import path from 'node:path';

export const SHUTDOWN_DEADLINE_ISO = '2026-09-06T23:59:00Z';
export const SHUTDOWN_DEADLINE = Date.parse(SHUTDOWN_DEADLINE_ISO);

export function shutdownDue(now = Date.now()) {
  return now >= SHUTDOWN_DEADLINE;
}

export function buildShutdownSite({ root = process.cwd(), outDir = path.join(root, '_site') } = {}) {
  const sourceDir = path.join(root, 'shutdown');
  const notice = fs.readFileSync(path.join(sourceDir, 'index.html'), 'utf8');
  const worker = fs.readFileSync(path.join(sourceDir, 'sw.js'), 'utf8');

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), notice, 'utf8');
  fs.writeFileSync(path.join(outDir, '404.html'), notice, 'utf8');
  fs.writeFileSync(path.join(outDir, 'sw.js'), worker, 'utf8');
  fs.writeFileSync(path.join(outDir, '.nojekyll'), '', 'utf8');

  console.log(`Built EGX /Alpha shutdown site for ${SHUTDOWN_DEADLINE_ISO}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) buildShutdownSite();
