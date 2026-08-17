import fs from 'node:fs';
import path from 'node:path';

process.env.EGX_BASE_PATH ??= '/';
process.env.EGX_SITE_URL ??= 'https://egxresearch.com';

const { loadAndValidate } = await import('./validate.mjs');
const { SITE } = await import('./templates.mjs');
const { investorGuidePage } = await import('./investor-guide.mjs');
const { forecastWindows, primaryHorizon, topLevelSignals, universeForHorizon } = await import('./research-view.mjs');
const { renderArchivePage, renderInstitutionalPage, renderMethodologyPage, renderSearchPage, renderSignalPage, renderSymbolDossierPage } = await import('./render.mjs');

const DEFAULT_ROOT = process.cwd();
const PUBLIC_LOCALES = ['en', 'ar'];

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function write(p, c) { ensureDir(path.dirname(p)); fs.writeFileSync(p, c, 'utf8'); }
function copy(s, d) { ensureDir(path.dirname(d)); fs.copyFileSync(s, d); }
function rmrf(p) { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); }
function localeRoot(outDir, locale) { return locale === 'ar' ? path.join(outDir, 'ar') : outDir; }

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

export function signalsFor(payload, horizon = primaryHorizon(payload)) {
  const windows = forecastWindows(payload);
  const window = windows[String(horizon)];
  if (window) return [...window.signals];
  return topLevelSignals(payload);
}

export function indexItems(payload) {
  const windows = forecastWindows(payload);
  const asset = payload.asset || {};
  const rows = [];

  for (const [horizon, window] of Object.entries(windows)) {
    const universeCount = universeForHorizon(payload, horizon);
    const signals = window.signals || [];
    for (const row of signals) {
      const symbol = row.stock_symbol;
      const display = displaySymbol(symbol);
      rows.push({
        date: payload.trading_date,
        symbol,
        display_symbol: display,
        company_name: row.company_name || (signals.length === 1 ? asset.company_name || null : null),
        sector: row.sector || (signals.length === 1 ? asset.sector || null : null),
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
      });
    }
  }
  return rows;
}

export function sessionItem(payload) {
  const windows = forecastWindows(payload);
  const primary = primaryHorizon(payload);
  const rows = windows[primary]?.signals || topLevelSignals(payload);
  return {
    date: payload.trading_date,
    universe_count: universeForHorizon(payload, primary),
    published_count: rows.length,
    horizon: primary,
    horizons: Object.keys(windows),
    multi_horizon: Object.keys(windows).length > 1,
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
    if (!item.display_symbol || !item.date || !item.horizon) continue;
    const key = `${item.display_symbol}::${item.horizon}`;
    const list = grouped.get(key) || [];
    list.push(item);
    grouped.set(key, list);
  }

  const histories = new Map();
  for (const [key, list] of grouped.entries()) {
    const [symbol, horizon] = key.split('::');
    const chronological = [...list].sort((a, b) => a.date.localeCompare(b.date));
    let previousRank = null;
    const decorated = chronological.map(item => {
      const rank = Number(item.rank_within_horizon);
      const movement = Number.isFinite(previousRank) && Number.isFinite(rank) ? previousRank - rank : null;
      previousRank = rank;
      return {
        date: item.date,
        horizon,
        rank,
        direction_bucket: item.direction_bucket,
        movement,
        universe_count: item.universe_count,
        record_origin: item.record_origin,
        schema_version: item.schema_version
      };
    }).reverse();

    const existing = histories.get(symbol) || [];
    histories.set(symbol, [...existing, ...decorated]);
  }

  for (const [symbol, history] of histories.entries()) {
    histories.set(symbol, [...history].sort((a, b) => b.date.localeCompare(a.date) || Number(a.horizon) - Number(b.horizon)));
  }
  return histories;
}

function writeLocalePages({ locale, outDir, latest, records, sessions, histories }) {
  const root = localeRoot(outDir, locale);
  globalThis.__EGX_RENDER_LOCALE = locale;
  for (const { payload } of records) {
    const date = payload.trading_date;
    const previousPayload = previousPayloadFor(records, date);
    write(path.join(root, 'archive', date, 'index.html'), renderSignalPage(payload, `/archive/${date}/`, sessions, previousPayload, locale));
  }

  const latestPrevious = previousPayloadFor(records, latest.trading_date);
  write(path.join(root, 'index.html'), renderSignalPage(latest, '/', sessions, latestPrevious, locale));
  write(path.join(root, 'today', 'index.html'), renderSignalPage(latest, '/today/', sessions, latestPrevious, locale));
  write(path.join(root, 'archive', 'index.html'), renderArchivePage(sessions, locale));
  write(path.join(root, 'search', 'index.html'), renderSearchPage(locale));
  write(path.join(root, 'methodology', 'index.html'), renderMethodologyPage(locale));
  write(path.join(root, 'investor-guide', 'index.html'), investorGuidePage(locale));
  write(path.join(root, 'institutional', 'index.html'), renderInstitutionalPage(locale));

  for (const [symbol, history] of histories.entries()) {
    write(path.join(root, 'symbol', symbol, 'index.html'), renderSymbolDossierPage(symbol, history, locale));
  }
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
    .sort((a, b) => b.date.localeCompare(a.date) || Number(a.horizon) - Number(b.horizon) || a.rank_within_horizon - b.rank_within_horizon);
  const histories = buildSymbolHistories(searchItems);

  for (const locale of PUBLIC_LOCALES) writeLocalePages({ locale, outDir, latest, records, sessions, histories });
  delete globalThis.__EGX_RENDER_LOCALE;

  for (const { payload } of records) {
    const date = payload.trading_date;
    write(path.join(outDir, 'data', 'archive', `${date}.json`), JSON.stringify(payload, null, 2) + '\n');
  }
  write(path.join(outDir, 'data', 'latest.json'), JSON.stringify(latest, null, 2) + '\n');
  write(path.join(outDir, 'data', 'index.json'), JSON.stringify(searchItems, null, 2) + '\n');
  copy(path.join(root, 'assets', 'app.js'), path.join(outDir, 'assets', 'app.js'));
  write(path.join(outDir, 'sw.js'), renderLegacyServiceWorkerCleanup());
  write(path.join(outDir, '.nojekyll'), '');

  console.log(`Built EGXResearch public site in ${PUBLIC_LOCALES.length} locale(s) with ${sessions.length} archived session(s), ${searchItems.length} searchable model row(s), and ${histories.size} symbol dossier(s) for ${SITE.siteUrl || 'the configured host'}.`);
  return { latest, records, sessions, searchItems, histories };
}

if (import.meta.url === `file://${process.argv[1]}`) buildSite();
