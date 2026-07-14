import fs from 'node:fs';
import path from 'node:path';
import { loadAndValidate } from './validate.mjs';
import { SITE } from './templates.mjs';
import { renderArchivePage, renderMethodologyPage, renderSearchPage, renderSignalPage } from './render.mjs';

const ROOT = process.cwd();
const OUT = path.join(ROOT, '_site');
const DATA_DIR = path.join(ROOT, 'data');

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function write(p, content) { ensureDir(path.dirname(p)); fs.writeFileSync(p, content, 'utf8'); }
function copy(src, dest) { ensureDir(path.dirname(dest)); fs.copyFileSync(src, dest); }
function rmrf(p) { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); }

function basePath() {
  const base = String(SITE.basePath ?? '').replace(/\/$/, '');
  return base || '';
}

function renderServiceWorkerCleanup() {
  return `self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll())
      .then(clients => clients.forEach(client => client.navigate(client.url)))
  );
});
`;
}

function archiveJsonFiles() {
  const dir = path.join(DATA_DIR, 'archive');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort();
}

function indexItem(payload) {
  const signal = payload.public_signal || payload.signal || {};
  const legacy = payload.signal || {};
  const asset = payload.asset || {};
  const market = payload.market_snapshot || {};
  const symbol = asset.symbol || signal.stock_symbol || legacy.stock_symbol;
  const display = asset.display_symbol || (String(symbol || '').includes(':') ? String(symbol).split(':').pop() : symbol);
  return {
    date: payload.trading_date,
    symbol,
    display_symbol: display,
    company_name: asset.company_name || null,
    sector: asset.sector || market.market_structure_sector || null,
    horizon: signal.horizon || legacy.horizon,
    horizon_label: signal.horizon_label || null,
    rank_label: signal.rank_label || legacy.rank_label,
    direction_bucket: signal.direction_bucket || legacy.direction_bucket,
    plain_direction: signal.plain_direction || null,
    latest_close: market.latest_close ?? null,
    daily_change_pct: market.daily_change_pct ?? null,
    url: `/archive/${payload.trading_date}/`
  };
}

function main() {
  rmrf(OUT);
  ensureDir(OUT);
  const latest = loadAndValidate(path.join(DATA_DIR, 'latest.json'));
  const items = [];

  for (const name of archiveJsonFiles()) {
    const payload = loadAndValidate(path.join(DATA_DIR, 'archive', name));
    const date = payload.trading_date;
    items.push(indexItem(payload));
    write(path.join(OUT, 'archive', date, 'index.html'), renderSignalPage(payload, `/archive/${date}/`));
    write(path.join(OUT, 'data', 'archive', `${date}.json`), JSON.stringify(payload, null, 2) + '\n');
  }

  items.sort((a, b) => b.date.localeCompare(a.date));
  write(path.join(OUT, 'index.html'), renderSignalPage(latest, '/'));
  write(path.join(OUT, 'today', 'index.html'), renderSignalPage(latest, '/today/'));
  write(path.join(OUT, 'archive', 'index.html'), renderArchivePage(items));
  write(path.join(OUT, 'search', 'index.html'), renderSearchPage());
  write(path.join(OUT, 'methodology', 'index.html'), renderMethodologyPage());
  write(path.join(OUT, 'data', 'latest.json'), JSON.stringify(latest, null, 2) + '\n');
  write(path.join(OUT, 'data', 'index.json'), JSON.stringify(items, null, 2) + '\n');

  copy(path.join(ROOT, 'assets', 'app.js'), path.join(OUT, 'assets', 'app.js'));
  write(path.join(OUT, 'sw.js'), renderServiceWorkerCleanup());
  write(path.join(OUT, '.nojekyll'), '');
  console.log(`Built EGXResearch public site with ${items.length} archived signal(s).`);
}

main();
