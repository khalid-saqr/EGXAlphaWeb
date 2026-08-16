import fs from 'node:fs';
import { SITE, escapeHtml, megaFooter, prettyState, rel, siteHeader } from './templates.mjs';

const HOME_CSS = fs.readFileSync(new URL('../assets/home.css', import.meta.url), 'utf8');

function displaySymbol(symbol) {
  const text = String(symbol || '').trim();
  return text.includes(':') ? text.split(':').pop() : text || 'EGX';
}

function formatDate(value) {
  if (!value) return 'Latest';
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
}

function tone(bucket) {
  if (bucket === 'positive_model_signal') return 'positive';
  if (bucket === 'negative_model_signal') return 'negative';
  return 'neutral';
}

export function signalsFrom(payload) {
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
    company_name: asset.company_name || null
  }];
}

function isFullUniverse(payload) {
  return Array.isArray(payload?.signals);
}

function universeCount(payload) {
  const value = Number(payload?.universe_count ?? payload?.ranking_context?.comparison_count);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function horizon(payload, rows) {
  return String(payload?.primary_horizon || rows[0]?.horizon || payload?.public_signal?.horizon || payload?.signal?.horizon || '5').replace(/\.0+$/, '');
}

function previousRanks(previousPayload) {
  const map = new Map();
  for (const row of signalsFrom(previousPayload || {})) {
    const rank = Number(row.rank_within_horizon);
    if (row.stock_symbol && Number.isFinite(rank)) map.set(row.stock_symbol, rank);
  }
  return map;
}

export function movement(row, previous) {
  const current = Number(row.rank_within_horizon);
  const prior = previous.get(row.stock_symbol);
  if (!Number.isFinite(current) || !Number.isFinite(prior)) return { value: null, label: '—', className: 'flat' };
  const delta = prior - current;
  if (!delta) return { value: 0, label: '—', className: 'flat' };
  return { value: delta, label: `${delta > 0 ? '+' : ''}${delta}`, className: delta > 0 ? 'up' : 'down' };
}

function processRibbon() {
  return `<div class="process-ribbon" aria-label="EGX Alpha research process">
    <span><b>01</b> OBSERVE</span><i>→</i><span><b>02</b> VALIDATE</span><i>→</i><span><b>03</b> INFER</span><i>→</i><span><b>04</b> RANK</span><i>→</i><span><b>05</b> PUBLISH</span>
  </div>`;
}

function runHeader(payload, rows, canonicalPath) {
  const full = isFullUniverse(payload);
  const count = universeCount(payload);
  const countLabel = count ?? '—';
  const universeNote = full
    ? `${rows.length} / ${count ?? rows.length} published`
    : count
      ? 'eligible comparison set'
      : 'universe unavailable';
  const date = formatDate(payload.trading_date);
  const h = horizon(payload, rows);
  const archived = String(canonicalPath || '').startsWith('/archive/');
  const origin = payload.record_origin || (archived ? 'archive' : 'live');
  return `<section class="run-hero">
    <div class="run-title-block">
      <p class="eyebrow">${archived ? 'HISTORICAL MODEL RECORD' : 'LATEST COMPLETED MODEL RUN'}</p>
      <h1>EGX /ALPHA<br><span>DEEP-LEARNING MARKET RANKING</span></h1>
      <p class="run-deck">Systematic cross-sectional intelligence for the Egyptian Exchange. The primary public research horizon is ${escapeHtml(h)} trading sessions.</p>
    </div>
    <div class="run-date"><span>ANALYSIS DATE</span><strong>${escapeHtml(date)}</strong><em>POST-CLOSE / CAIRO</em></div>
    <div class="run-metrics" aria-label="Run integrity">
      <div><span>UNIVERSE</span><strong>${escapeHtml(countLabel)}</strong><em>${escapeHtml(universeNote)}</em></div>
      <div><span>FORECAST</span><strong>${escapeHtml(h)}S</strong><em>primary horizon</em></div>
      <div><span>SOURCE</span><strong>VALIDATED</strong><em>${escapeHtml(prettyState(rows[0]?.source_freshness_status || 'live_observation_completed'))}</em></div>
      <div><span>PUBLICATION</span><strong>${full ? 'COMPLETE' : 'CURRENT'}</strong><em>${full ? prettyState(origin) : 'single-row public format'}</em></div>
    </div>
    ${processRibbon()}
  </section>`;
}

function modelRow(row, previous) {
  const rank = Number(row.rank_within_horizon);
  const move = movement(row, previous);
  const bucket = row.direction_bucket || 'neutral_model_signal';
  const label = prettyState(bucket);
  const symbol = displaySymbol(row.stock_symbol);
  const symbolHref = rel(`/symbol/${encodeURIComponent(symbol)}/`);
  return `<div class="model-row" data-model-row data-direction="${escapeHtml(tone(bucket))}" data-search-text="${escapeHtml(`${symbol} ${row.stock_symbol || ''} ${row.company_name || ''}`.toLowerCase())}">
    <div class="rank-cell"><span>#</span>${String(rank).padStart(3, '0')}</div>
    <div class="move-cell move-${move.className}" title="Rank change versus previous completed session">${escapeHtml(move.label)}</div>
    <a class="symbol-cell" href="${symbolHref}" aria-label="Open ${escapeHtml(symbol)} model history"><strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(row.company_name || row.stock_symbol || '')}</span></a>
    <div class="view-cell tone-${tone(bucket)}"><i aria-hidden="true"></i>${escapeHtml(label)}</div>
  </div>`;
}

function rankingPanel(payload, rows, previousPayload) {
  const full = isFullUniverse(payload);
  const previous = previousRanks(previousPayload);
  const count = universeCount(payload);
  const body = rows.map(row => modelRow(row, previous)).join('');
  const countContext = full
    ? `OF ${count ?? rows.length} SECURITIES`
    : count
      ? `PUBLIC ROW / ${count} UNIVERSE`
      : 'PUBLIC ROW / UNIVERSE UNAVAILABLE';
  return `<section class="model-output" aria-labelledby="model-output-title">
    <header class="output-head">
      <div><p class="eyebrow">MODEL OUTPUT</p><h2 id="model-output-title">Cross-sectional ranking</h2></div>
      <div class="output-count"><strong>${full ? rows.length : 1}</strong><span>${escapeHtml(countContext)}</span></div>
    </header>
    ${full ? `<div class="output-controls">
      <label class="model-search"><span>SEARCH</span><input type="search" data-model-search placeholder="Ticker" aria-label="Search model output by ticker"></label>
      <div class="filter-set" aria-label="Filter model output">
        <button class="active" type="button" data-model-filter="all">ALL</button>
        <button type="button" data-model-filter="positive">CONSTRUCTIVE</button>
        <button type="button" data-model-filter="neutral">NEUTRAL</button>
        <button type="button" data-model-filter="negative">CAUTION</button>
      </div>
    </div>` : `<div class="compatibility-note" role="note"><strong>PUBLICATION NOTE</strong><p>The current public feed contains one model observation for this session. Complete-universe publication will appear here when available.</p></div>`}
    <div class="model-table" role="table" aria-label="EGX Alpha model ranking">
      <div class="model-head" role="row"><span>RANK</span><span>Δ</span><span>SYMBOL</span><span>MODEL VIEW</span></div>
      <div class="model-body" data-model-body>${body || '<p class="small-note">No published model output.</p>'}</div>
    </div>
    <p class="output-empty small-note" data-model-empty hidden>No securities match this view.</p>
  </section>`;
}

function researchStrip() {
  return `<section class="research-strip" aria-label="Research system links">
    <a href="${rel('/archive/')}"><span>01 / HISTORY</span><strong>Inspect completed analysis sessions</strong><p>Every public model record remains date-addressable.</p></a>
    <a href="${rel('/methodology/')}"><span>02 / RESEARCH</span><strong>Review the forecasting discipline</strong><p>Understand the ranking objective, validation gates and publication boundary.</p></a>
    <a href="${rel('/institutional/')}"><span>03 / INSTITUTIONAL</span><strong>Research and technology enquiries</strong><p>Explore distribution, integration and strategic research applications.</p></a>
  </section>`;
}

function recentSessions(items, currentDate) {
  const rows = (Array.isArray(items) ? items : []).filter(item => item?.date && item.date !== currentDate).slice(0, 5);
  if (!rows.length) return '';
  return `<section class="recent-runs"><header><p class="eyebrow">RECENT RUNS</p><a href="${rel('/archive/')}">VIEW HISTORY →</a></header>${rows.map(item => {
    const full = item.schema_version === 'egx_alpha_public_wire_v2';
    const count = Number(item.universe_count || item.published_count || 0);
    const publication = full ? `${count} SECURITIES` : `${item.published_count || 1} PUBLIC ROW`;
    const state = full ? prettyState(item.record_origin || 'live') : 'Single-row record';
    return `<a href="${rel(item.url)}"><time>${escapeHtml(item.date)}</time><strong>${escapeHtml(publication)}</strong><span>${escapeHtml(state)}</span></a>`;
  }).join('')}</section>`;
}

export function homePage(payload, { canonicalPath = '/today/', recentItems = [], previousPayload = null } = {}) {
  const rows = signalsFrom(payload);
  return `<style data-home-styles>${HOME_CSS.replaceAll('</style', '<\\/style')}</style>
  <main class="site-shell page-home" data-page="signal">
    ${siteHeader('QUANTITATIVE EQUITY INTELLIGENCE')}
    ${runHeader(payload, rows, canonicalPath)}
    ${rankingPanel(payload, rows, previousPayload)}
    ${researchStrip()}
    ${recentSessions(recentItems, payload.trading_date)}
    ${megaFooter()}
  </main>`;
}
