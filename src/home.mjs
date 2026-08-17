import fs from 'node:fs';
import { escapeHtml, prettyState, rel, siteFooter, siteHeader } from './templates.mjs';
import {
  availableHorizons,
  forecastWindows,
  historicalEvidenceFor,
  liveEvidenceFor,
  primaryHorizon,
  topLevelSignals,
  universeForHorizon
} from './research-view.mjs';
import { displaySymbol, formatPercentile, horizonLabel, signalLabel, signalTone } from './product-view.mjs';

const HOME_CSS = fs.readFileSync(new URL('../assets/home.css', import.meta.url), 'utf8');
const MULTI_HORIZON_CSS = fs.readFileSync(new URL('../assets/multi-horizon.css', import.meta.url), 'utf8');
const PRODUCT_HOME_CSS = fs.readFileSync(new URL('../assets/product-home.css', import.meta.url), 'utf8');

function formatDate(value) {
  if (!value) return 'Latest';
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).toUpperCase();
}
function metricTone(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number === 0) return 'neutral';
  return number > 0 ? 'positive' : 'negative';
}
export function signalsFrom(payload, selectedHorizon = primaryHorizon(payload)) {
  const windows = forecastWindows(payload);
  return windows[String(selectedHorizon)]?.signals || topLevelSignals(payload);
}
function isFullUniverse(payload) { return Array.isArray(payload?.signals); }
function previousRanks(previousPayload, selectedHorizon) {
  const map = new Map();
  const rows = signalsFrom(previousPayload || {}, selectedHorizon);
  for (const row of rows) {
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

function hero(payload, previousPayload, canonicalPath) {
  const primary = primaryHorizon(payload);
  const rows = signalsFrom(payload, primary);
  const universe = universeForHorizon(payload, primary) || rows.length;
  const leader = rows[0] || {};
  const previous = previousRanks(previousPayload, primary);
  const move = movement(leader, previous);
  const symbol = displaySymbol(leader.stock_symbol);
  const archived = String(canonicalPath || '').startsWith('/archive/');
  const date = formatDate(payload.trading_date);
  const signal = signalLabel(leader.direction_bucket);
  const tone = signalTone(leader.direction_bucket);
  const percentile = formatPercentile(leader.rank_within_horizon, universe);
  return `<section class="product-hero">
    <div class="hero-copy">
      <p class="eyebrow">${archived ? 'HISTORICAL MODEL RECORD' : 'LATEST COMPLETED MODEL RUN'}</p>
      <h1>See how the model ranks the Egyptian market.</h1>
      <p class="hero-deck">EGX /Alpha applies a reviewed deep-learning ranking model to eligible EGX stocks across 1, 3, 5 and 10 trading-day outlooks. Rankings update after each completed market session.</p>
      <div class="hero-runline"><span>${escapeHtml(date)}</span><strong>${escapeHtml(universe)} STOCKS ANALYSED</strong><em>POST-CLOSE · CAIRO</em></div>
      <a class="primary-action" href="#ranking">EXPLORE ${archived ? 'THIS' : 'TODAY\'S'} RANKING →</a>
    </div>
    <article class="leader-card" aria-label="Selected outlook leader">
      <header><span>${archived ? 'MODEL LEADER' : "TODAY'S MODEL LEADER"}</span><strong>${escapeHtml(horizonLabel(primary))} OUTLOOK</strong></header>
      <div class="leader-topline"><a href="${rel(`/symbol/${encodeURIComponent(symbol)}/`)}">${escapeHtml(symbol)}</a><span class="tone-${tone}">${escapeHtml(signal)}</span></div>
      <div class="leader-metrics"><div><span>RANK</span><strong>#${escapeHtml(leader.rank_within_horizon ?? '—')} / ${escapeHtml(universe)}</strong></div><div><span>RANK PERCENTILE</span><strong>${escapeHtml(percentile)}</strong></div><div><span>Δ RANK</span><strong class="move-${move.className}">${escapeHtml(move.label)}</strong></div></div>
      <div class="rank-chart" data-hero-chart data-hero-symbol="${escapeHtml(symbol)}" data-hero-horizon="${escapeHtml(primary)}" data-hero-as-of="${escapeHtml(payload.trading_date || '')}"><p class="chart-empty">Loading historical rank percentile…</p></div>
      <p class="chart-note">Rank percentile shows relative position within the eligible EGX universe. It is not a probability or confidence score.</p>
    </article>
  </section>`;
}

function horizonSwitcher(payload) {
  const horizons = availableHorizons(payload);
  if (horizons.length < 2) return '';
  const primary = primaryHorizon(payload);
  const windows = forecastWindows(payload);
  return `<div class="horizon-switcher product-switcher" role="group" aria-label="Outlook"><span>OUTLOOK <small>D = trading days</small></span><div>${horizons.map(h => {
    const window = windows[h];
    return `<button type="button" class="${h === primary ? 'active' : ''}" data-horizon-select="${escapeHtml(h)}" data-universe="${escapeHtml(window?.universe_count ?? '')}" aria-pressed="${h === primary ? 'true' : 'false'}">${escapeHtml(horizonLabel(h))}</button>`;
  }).join('')}</div></div>`;
}
function modelRow(row, previous, universe) {
  const rank = Number(row.rank_within_horizon);
  const move = movement(row, previous);
  const bucket = row.direction_bucket || 'neutral_model_signal';
  const symbol = displaySymbol(row.stock_symbol);
  const symbolHref = rel(`/symbol/${encodeURIComponent(symbol)}/`);
  const percentile = formatPercentile(rank, universe);
  return `<div class="model-row product-model-row" data-model-row data-direction="${escapeHtml(signalTone(bucket))}" data-search-text="${escapeHtml(`${symbol} ${row.stock_symbol || ''} ${row.company_name || ''}`.toLowerCase())}"><div class="rank-cell"><span>#</span>${String(rank).padStart(3, '0')}<small>/ ${escapeHtml(universe)}</small></div><div class="percentile-cell"><strong>${escapeHtml(percentile)}</strong><span>PCTL</span></div><div class="move-cell move-${move.className}" title="Rank change versus previous completed session at the same outlook">${escapeHtml(move.label)}</div><a class="symbol-cell" href="${symbolHref}" aria-label="Open ${escapeHtml(symbol)} model history"><strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(row.company_name || row.stock_symbol || '')}</span></a><div class="view-cell tone-${signalTone(bucket)}"><i aria-hidden="true"></i>${escapeHtml(signalLabel(bucket))}</div></div>`;
}
function rankingWindow(payload, previousPayload, h, isPrimary) {
  const rows = signalsFrom(payload, h);
  const previous = previousRanks(previousPayload, h);
  const universe = universeForHorizon(payload, h) || rows.length;
  return `<div class="horizon-panel" data-horizon-panel="${escapeHtml(h)}"${isPrimary ? '' : ' hidden'}><div class="model-body" data-model-body>${rows.map(row => modelRow(row, previous, universe)).join('') || '<p class="small-note">No published model output.</p>'}</div></div>`;
}
function rankingPanel(payload, previousPayload, canonicalPath) {
  const full = isFullUniverse(payload);
  const primary = primaryHorizon(payload);
  const horizons = availableHorizons(payload);
  const rows = signalsFrom(payload, primary);
  const count = universeForHorizon(payload, primary) || rows.length;
  const archived = String(canonicalPath || '').startsWith('/archive/');
  const multi = horizons.length > 1;
  const tableBody = multi ? horizons.map(h => rankingWindow(payload, previousPayload, h, h === primary)).join('') : `<div class="model-body" data-model-body>${rows.map(row => modelRow(row, previousRanks(previousPayload, primary), count)).join('') || '<p class="small-note">No published model output.</p>'}</div>`;
  return `<section class="model-output product-ranking" id="ranking" aria-labelledby="model-output-title"><header class="output-head product-output-head"><div><p class="eyebrow">${archived ? 'MODEL RANKING' : "TODAY'S MARKET RANKING"}</p><h2 id="model-output-title">Compare the eligible EGX universe.</h2><p>Rank is relative position. Percentile normalises that position across the analysed universe. Signal is the model's separate directional classification.</p></div><div class="output-count"><strong data-active-visible>${full ? rows.length : 1}</strong><span data-output-count-context>OF ${escapeHtml(count)} STOCKS</span></div></header>${horizonSwitcher(payload)}${full ? `<div class="output-controls product-controls"><label class="model-search"><span>SEARCH</span><input type="search" data-model-search placeholder="Ticker" aria-label="Search model ranking by ticker"></label><div class="filter-set product-filter-set" aria-label="Filter by signal"><button class="active" type="button" data-model-filter="all" aria-pressed="true">ALL <span data-filter-count>${escapeHtml(rows.length)}</span></button><button type="button" data-model-filter="positive" aria-pressed="false">POSITIVE <span data-filter-count>0</span></button><button type="button" data-model-filter="neutral" aria-pressed="false">NEUTRAL <span data-filter-count>0</span></button><button type="button" data-model-filter="negative" aria-pressed="false">NEGATIVE <span data-filter-count>0</span></button></div></div>` : `<div class="compatibility-note" role="note"><strong>${archived ? 'LEGACY RECORD' : 'PUBLICATION NOTE'}</strong><p>This record uses the earlier single-row public format. Quantitative full-universe controls apply to V2 records.</p></div>`}<div class="model-table product-model-table" role="table" aria-label="EGX Alpha quantitative model ranking"><div class="model-head product-model-head" role="row"><span>RANK</span><span>PCTL</span><span>Δ</span><span>STOCK</span><span>SIGNAL</span></div>${tableBody}</div><p class="output-empty small-note" data-model-empty hidden>No matching stocks.</p></section>`;
}

function formatInteger(value) { const n = Number(value); return Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '—'; }
function formatRankIc(value) { const n = Number(value); return Number.isFinite(n) ? `${n >= 0 ? '+' : ''}${n.toFixed(4)}` : '—'; }
function formatSpread(value) { const n = Number(value); return Number.isFinite(n) ? `${n >= 0 ? '+' : ''}${(n * 100).toFixed(2)} pp` : '—'; }
function evidenceHorizonPanel(payload, h, isPrimary) {
  const historical = historicalEvidenceFor(payload, h) || {};
  const liveValidation = payload?.research_evidence?.live_validation;
  if (liveValidation === null) return `<div class="evidence-horizon" data-horizon-panel="${escapeHtml(h)}"${isPrimary ? '' : ' hidden'}><div class="evidence-stat"><span>HISTORICAL RANKIC</span><strong class="tone-${metricTone(historical.heldout_mean_date_rank_ic)}">${escapeHtml(formatRankIc(historical.heldout_mean_date_rank_ic))}</strong><em>${escapeHtml(horizonLabel(h))} held-out test</em></div><div class="evidence-stat"><span>TOP–BOTTOM SPREAD</span><strong class="tone-${metricTone(historical.heldout_top_bottom_spread_return)}">${escapeHtml(formatSpread(historical.heldout_top_bottom_spread_return))}</strong><em>held-out test</em></div><div class="evidence-stat"><span>LIVE EVIDENCE</span><strong>NOT RECONSTRUCTED</strong><em>historical provenance preserved</em></div><div class="evidence-stat"><span>AS-OF STATE</span><strong>UNAVAILABLE</strong><em>not retroactively inferred</em></div></div>`;
  const live = liveEvidenceFor(payload, h) || {};
  const threshold = Number(liveValidation?.governance_threshold_days || 60);
  const ready = live.live_metrics_ready === true;
  return `<div class="evidence-horizon" data-horizon-panel="${escapeHtml(h)}"${isPrimary ? '' : ' hidden'}><div class="evidence-stat"><span>HISTORICAL RANKIC</span><strong class="tone-${metricTone(historical.heldout_mean_date_rank_ic)}">${escapeHtml(formatRankIc(historical.heldout_mean_date_rank_ic))}</strong><em>${escapeHtml(horizonLabel(h))} held-out test</em></div><div class="evidence-stat"><span>TOP–BOTTOM SPREAD</span><strong class="tone-${metricTone(historical.heldout_top_bottom_spread_return)}">${escapeHtml(formatSpread(historical.heldout_top_bottom_spread_return))}</strong><em>held-out test</em></div><div class="evidence-stat"><span>MATURED OUTCOMES</span><strong>${escapeHtml(formatInteger(live.matured_outcomes))}</strong><em>live realised evidence</em></div><div class="evidence-stat"><span>EVIDENCE DAYS</span><strong>${escapeHtml(formatInteger(live.matured_prediction_days))} / ${escapeHtml(formatInteger(threshold))}</strong><em>${ready ? 'live metrics mature' : 'evidence accumulating'}</em></div>${ready ? `<div class="evidence-stat"><span>LIVE RANKIC</span><strong class="tone-${metricTone(live.live_mean_rank_ic)}">${escapeHtml(formatRankIc(live.live_mean_rank_ic))}</strong><em>maturity-gated</em></div><div class="evidence-stat"><span>LIVE SPREAD</span><strong class="tone-${metricTone(live.live_top_bottom_spread_return)}">${escapeHtml(formatSpread(live.live_top_bottom_spread_return))}</strong><em>maturity-gated</em></div>` : ''}</div>`;
}
function researchEvidencePanel(payload) {
  const evidence = payload?.research_evidence;
  if (!evidence) return '';
  const scale = evidence.system_scale || {};
  const live = evidence.live_validation;
  const historicalOnly = payload?.record_origin === 'historical_backfill' && live === null;
  const governance = evidence.governance || {};
  const primary = primaryHorizon(payload);
  const horizons = availableHorizons(payload);
  return `<section class="model-evidence product-evidence" aria-labelledby="model-evidence-title"><header><div><p class="eyebrow">MODEL EVIDENCE</p><h2 id="model-evidence-title">Evidence behind the ranking system.</h2></div><p>${historicalOnly ? 'Historical held-out evidence is preserved for this model record. Live evidence was not reconstructed.' : 'Historical validation and live realised-outcome tracking are separated. Live ranking metrics remain maturity-gated.'}</p></header><div class="evidence-scale"><div><span>HISTORICAL SAMPLES</span><strong>${escapeHtml(formatInteger(scale.historical_model_samples))}</strong></div><div><span>TRAINING STOCKS</span><strong>${escapeHtml(formatInteger(scale.training_universe_count))}</strong></div><div><span>HELD-OUT TEST DATES</span><strong>${escapeHtml(formatInteger(scale.heldout_test_dates))}</strong></div><div><span>LIVE OUTCOMES</span><strong>${historicalOnly ? 'N/A' : escapeHtml(formatInteger(live?.total_matured_outcomes))}</strong></div></div><div class="evidence-window-label"><span>SELECTED OUTLOOK EVIDENCE</span><strong><span data-active-horizon>${escapeHtml(primary)}</span>D</strong></div>${horizons.map(h => evidenceHorizonPanel(payload, h, h === primary)).join('')}<div class="evidence-governance"><span>GOVERNANCE</span><p>${governance.outcomes_scored_after_horizon_maturity ? 'Forecasts are scored only after their horizon matures.' : ''} ${governance.automatic_promotion === false && governance.human_review_required === true ? 'Model promotion is not automatic; human review is required.' : ''}</p><strong class="${historicalOnly ? 'state-backfill' : 'state-research'}">${escapeHtml(historicalOnly ? 'HISTORICAL MODEL RECORD' : prettyState(live?.status || 'evidence_accumulating'))}</strong></div></section>`;
}
function howToRead() {
  return `<section class="how-to-read"><header><p class="eyebrow">HOW TO READ /ALPHA</p><h2>Three numbers, one directional signal.</h2></header><div class="read-grid"><article><span>01</span><strong>Rank</strong><p>#3 / 88 means the stock is third in the selected outlook's eligible comparison set.</p></article><article><span>02</span><strong>Rank percentile</strong><p>Normalises rank to the size of the eligible universe. It is not model confidence.</p></article><article><span>03</span><strong>Δ Rank</strong><p>Shows movement versus the previous completed session at the same outlook.</p></article><article><span>04</span><strong>Signal</strong><p>Positive, Neutral or Negative is the model's separate directional classification.</p></article></div><a href="${rel('/methodology/')}">READ THE METHODOLOGY →</a></section>`;
}
function recentSessions(items, currentDate) {
  const rows = (Array.isArray(items) ? items : []).filter(item => item?.date && item.date !== currentDate).slice(0, 5);
  if (!rows.length) return '';
  return `<section class="recent-runs product-recent"><header><div><p class="eyebrow">RECENT MODEL HISTORY</p><h2>Completed analysis sessions.</h2></div><a href="${rel('/archive/')}">VIEW ALL →</a></header>${rows.map(item => {
    const full = item.schema_version === 'egx_alpha_public_wire_v2';
    const count = Number(item.universe_count || item.published_count || 0);
    const horizon = item.multi_horizon ? '1D · 3D · 5D · 10D' : horizonLabel(item.horizon || 5);
    const state = full ? (item.record_origin === 'historical_backfill' ? 'Historical model record' : 'Live model record') : 'Legacy single-row record';
    return `<a href="${rel(item.url)}"><time>${escapeHtml(item.date)}</time><strong>${escapeHtml(count)} STOCKS</strong><span>${escapeHtml(horizon)}</span><em>${escapeHtml(state)}</em></a>`;
  }).join('')}</section>`;
}
export function homePage(payload, { canonicalPath = '/today/', recentItems = [], previousPayload = null } = {}) {
  const activeSection = String(canonicalPath || '').startsWith('/archive/') ? 'history' : 'latest';
  return `<style data-home-styles>${HOME_CSS.replaceAll('</style', '<\\/style')}${MULTI_HORIZON_CSS.replaceAll('</style', '<\\/style')}${PRODUCT_HOME_CSS.replaceAll('</style', '<\\/style')}</style><main class="site-shell page-home page-product" data-page="signal">${siteHeader('QUANTITATIVE MARKET RANKING', activeSection)}${hero(payload, previousPayload, canonicalPath)}${rankingPanel(payload, previousPayload, canonicalPath)}${researchEvidencePanel(payload)}${howToRead()}${recentSessions(recentItems, payload.trading_date)}${siteFooter()}</main>`;
}
