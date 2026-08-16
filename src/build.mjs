import fs from 'node:fs';
import path from 'node:path';

process.env.EGX_BASE_PATH ??= '/';
process.env.EGX_SITE_URL ??= 'https://egxresearch.com';

const { loadAndValidate } = await import('./validate.mjs');
const { SITE } = await import('./templates.mjs');
const { renderArchivePage, renderInstitutionalPage, renderMethodologyPage, renderSearchPage, renderSignalPage, renderSymbolDossierPage } = await import('./render.mjs');

const DEFAULT_ROOT = process.cwd();

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function write(p, c) { ensureDir(path.dirname(p)); fs.writeFileSync(p, c, 'utf8'); }
function copy(s, d) { ensureDir(path.dirname(d)); fs.copyFileSync(s, d); }
function rmrf(p) { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); }

function displaySymbol(symbol) {
  const text = String(symbol || '').trim();
  return text.includes(':') ? text.split(':').pop() : text;
}

function renderLegacyServiceWorkerCleanup() {
  return `const LEGACY_CACHE_PREFIX = 'egxresearch-public-pwa-';\nself.addEventListener('install',()=>self.skipWaiting());\nself.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(LEGACY_CACHE_PREFIX)).map(key=>caches.delete(key)))),self.registration.unregister()]).then(()=>self.clients.claim()));});\n`;
}

function archiveJsonFiles(dataDir) {
  const dir = path.join(dataDir, 'archive');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort();
}

export function signalsFor(payload) {
  if (Array.isArray(payload?.signals)) {
    return [...payload.signals].sort((a, b) => Number(a.rank_within_horizon) - Number(b.rank_within_horizon));
  }
  const signal = payload?.public_signal || payload?.signal || {};
  if (!signal.stock_symbol) return [];
  const asset = payload.asset || {};
  return [{
    stock_symbol: signal.stock_symbol,
    rank_within_horizon: signal.rank_within_horizon,
    horizon: signal.horizon,
    direction_bucket: signal.direction_bucket,
    source_freshness_status: signal.source_freshness_status,
    company_name: asset.company_name || null,
    sector: asset.sector || null,
    latest_close: payload.market_snapshot?.latest_close ?? null,
    daily_change_pct: payload.market_snapshot?.daily_change_pct ?? null,
    plain_direction: signal.plain_direction || null,
    rank_label: signal.rank_label || null,
    horizon_label: signal.horizon_label || null
  }];
}

function payloadUniverseCount(payload) {
  const value = Number(payload?.universe_count ?? payload?.ranking_context?.comparison_count);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function payloadHorizon(payload, rows) {
  return String(payload?.primary_horizon || rows[0]?.horizon || payload?.public_signal?.horizon || payload?.signal?.horizon || '5').replace(/\.0+$/, '');
}

export function indexItems(payload) {
  const rows = signalsFor(payload);
  const universeCount = payloadUniverseCount(payload);
  const horizon = payloadHorizon(payload, rows);
  const asset = payload.asset || {};
  return rows.map(row => {
    const symbol = row.stock_symbol;
    const display = displaySymbol(symbol);
    return {
      date: payload.trading_date,
      symbol,
      display_symbol: display,
      company_name: row.company_name || (rows.length === 1 ? asset.company_name || null : null),
      sector: row.sector || (rows.length === 1 ? asset.sector || null : null),
      horizon,
      horizon_label: row.horizon_label || null,
      rank_within_horizon: Number(row.rank_within_horizon),
      rank_label: row.rank_label || null,
      direction_bucket: row.direction_bucket,
      plain_direction: row.plain_direction || null,
      source_freshness_status: row.source_freshness_status,
      latest_close: row.latest_close ?? null,
      daily_change_pct: row.daily_change_pct ?? null,
      universe_count: universeCount,
      record_origin: payload.record_origin || (payload.schema_version === 'egx_alpha_public_wire_v2' ? 'live' : 'v1_compatibility'),
      schema_version: payload.schema_version,
      url: `/archive/${payload.trading_date}/`,
      symbol_url: `/symbol/${encodeURIComponent(display)}/`
    };
  });
}

export function sessionItem(payload) {
  const rows = signalsFor(payload);
  return {
    date: payload.trading_date,
    universe_count: payloadUniverseCount(payload),
    published_count: rows.length,
    horizon: payloadHorizon(payload, rows),
    record_origin: payload.record_origin || (payload.schema_version === 'egx_alpha_public_wire_v2' ? 'live' : 'v1_compatibility'),
    schema_version: payload.schema_version,
    url: `/archive/${payload.trading_date}/`
  };
}

export function previousPayloadFor(records, tradingDate) {
  return records.find(record => record.payload?.trading_date && record.payload.trading_date < tradingDate)?.payload || null;
}

export function buildSymbolHistories(items) {
  const grouped = new Map();
  for (const item of items) {
    if (!item.display_symbol || !item.date) continue;
    const list = grouped.get(item.display_symbol) || [];
    list.push(item);
    grouped.set(item.display_symbol, list);
  }

  const histories = new Map();
  for (const [symbol, list] of grouped.entries()) {
    const chronological = [...list].sort((a, b) => a.date.localeCompare(b.date));
    let previousRank = null;
    const decorated = chronological.map(item => {
      const rank = Number(item.rank_within_horizon);
      const movement = Number.isFinite(previousRank) && Number.isFinite(rank) ? previousRank - rank : null;
      previousRank = rank;
      return {
        date: item.date,
        rank,
        direction_bucket: item.direction_bucket,
        movement,
        universe_count: item.universe_count,
        record_origin: item.record_origin,
        schema_version: item.schema_version
      };
    }).reverse();
    histories.set(symbol, decorated);
  }
  return histories;
}

export function buildSite({ root = DEFAULT_ROOT, outDir = path.join(root, '_site'), dataDir = path.join(root, 'data') } = {}) {
  rmrf(outDir);
  ensureDir(outDir);

  const latest = loadAndValidate(path.join(dataDir, 'latest.json'));
  const records = archiveJsonFiles(dataDir)
    .map(name => ({ payload: loadAndValidate(path.join(dataDir, 'archive', name)) }))
    .sort((a, b) => b.payload.trading_date.localeCompare(a.payload.trading_date));

  const sessions = records.map(record => sessionItem(record.payload));
  const searchItems = records
    .flatMap(record => indexItems(record.payload))
    .sort((a, b) => b.date.localeCompare(a.date) || a.rank_within_horizon - b.rank_within_horizon);

  for (const { payload } of records) {
    const date = payload.trading_date;
    const previousPayload = previousPayloadFor(records, date);
    write(path.join(outDir, 'archive', date, 'index.html'), renderSignalPage(payload, `/archive/${date}/`, sessions, previousPayload));
    write(path.join(outDir, 'data', 'archive', `${date}.json`), JSON.stringify(payload, null, 2) + '\n');
  }

  const latestPrevious = previousPayloadFor(records, latest.trading_date);
  write(path.join(outDir, 'index.html'), renderSignalPage(latest, '/', sessions, latestPrevious));
  write(path.join(outDir, 'today', 'index.html'), renderSignalPage(latest, '/today/', sessions, latestPrevious));
  write(path.join(outDir, 'archive', 'index.html'), renderArchivePage(sessions));
  write(path.join(outDir, 'search', 'index.html'), renderSearchPage());
  write(path.join(outDir, 'methodology', 'index.html'), renderMethodologyPage());
  write(path.join(outDir, 'institutional', 'index.html'), renderInstitutionalPage());

  const histories = buildSymbolHistories(searchItems);
  for (const [symbol, history] of histories.entries()) {
    write(path.join(outDir, 'symbol', symbol, 'index.html'), renderSymbolDossierPage(symbol, history));
  }

  write(path.join(outDir, 'data', 'latest.json'), JSON.stringify(latest, null, 2) + '\n');
  write(path.join(outDir, 'data', 'index.json'), JSON.stringify(searchItems, null, 2) + '\n');
  copy(path.join(root, 'assets', 'app.js'), path.join(outDir, 'assets', 'app.js'));
  write(path.join(outDir, 'sw.js'), renderLegacyServiceWorkerCleanup());
  write(path.join(outDir, '.nojekyll'), '');

  console.log(`Built EGXResearch public site with ${sessions.length} archived session(s), ${searchItems.length} searchable model row(s), and ${histories.size} symbol dossier(s) for ${SITE.siteUrl || 'the configured host'}.`);
  return { latest, records, sessions, searchItems, histories };
}

if (import.meta.url === `file://${process.argv[1]}`) buildSite();
