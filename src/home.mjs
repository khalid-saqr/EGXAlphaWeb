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
import { displaySymbol, horizonLabel, signalLabel, signalTone } from './product-view.mjs';

const HOME_CSS = fs.readFileSync(new URL('../assets/home.css', import.meta.url), 'utf8');
const MULTI_HORIZON_CSS = fs.readFileSync(new URL('../assets/multi-horizon.css', import.meta.url), 'utf8');
const PRODUCT_HOME_CSS = fs.readFileSync(new URL('../assets/product-home.css', import.meta.url), 'utf8');
const RESEARCH_TERMINAL_CSS = fs.readFileSync(new URL('../assets/research-terminal.css', import.meta.url), 'utf8');

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
function movementText(move) {
  if (!move || move.value == null) return 'NO PRIOR RANK';
  if (move.value === 0) return 'UNCHANGED';
  const places = Math.abs(move.value);
  return `${move.value > 0 ? '↑' : '↓'} ${places} ${places === 1 ? 'PLACE' : 'PLACES'}`;
}
function horizonPurpose(horizon, primary) {
  if (String(horizon) === String(primary)) return 'PRIMARY RESEARCH VIEW';
  if (String(horizon) === '1') return 'NEXT TRADING DAY';
  if (String(horizon) === '3') return 'THREE TRADING DAYS';
  if (String(horizon) === '10') return 'TEN TRADING DAYS';
  return 'TRADING-DAY OUTLOOK';
}
function horizonControl(payload, { compact = false } = {}) {
  const horizons = availableHorizons(payload);
  const primary = primaryHorizon(payload);
  const windows = forecastWindows(payload);
  if (horizons.length < 2) {
    const h = horizons[0] || primary;
    return `<div class="alpha-horizon-control${compact ? ' compact' : ''} single"><div class="horizon-control-label"><span>FORECAST HORIZON</span><small>D = trading days</small></div><div class="horizon-buttons"><span class="single-horizon"><strong>${escapeHtml(horizonLabel(h))}</strong><small>${escapeHtml(horizonPurpose(h, primary))}</small></span></div></div>`;
  }
  return `<div class="alpha-horizon-control${compact ? ' compact' : ''}" role="group" aria-label="Forecast horizon"><div class="horizon-control-label"><span>FORECAST HORIZON</span><small>D = trading days</small></div><div class="horizon-buttons">${horizons.map(h => {
    const window = windows[h];
    const active = h === primary;
    return `<button type="button" class="${active ? 'active' : ''}" data-horizon-select="${escapeHtml(h)}" data-universe="${escapeHtml(window?.universe_count ?? '')}" aria-pressed="${active ? 'true' : 'false'}"><strong>${escapeHtml(horizonLabel(h))}</strong><small>${escapeHtml(horizonPurpose(h, primary))}</small></button>`;
  }).join('')}</div></div>`;
}
function controlDeckRow(row, previous, universe) {
  const rank = Number(row.rank_within_horizon);
  const move = movement(row, previous);
  const symbol = displaySymbol(row.stock_symbol);
  const bucket = row.direction_bucket || 'neutral_model_signal';
  const tone = signalTone(bucket);
  return `<a class="deck-rank-row" href="${rel(`/symbol/${encodeURIComponent(symbol)}/`)}" aria-label="${escapeHtml(symbol)}, relative rank ${escapeHtml(rank)} of ${escapeHtml(universe)}, model direction ${escapeHtml(signalLabel(bucket))}"><div class="deck-rank"><span>RELATIVE RANK</span><strong>#${escapeHtml(rank)} <small>/ ${escapeHtml(universe)}</small></strong></div><div class="deck-stock"><strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(row.company_name || row.stock_symbol || '')}</span></div><div class="deck-direction tone-${escapeHtml(tone)}"><span>MODEL DIRECTION</span><strong><i aria-hidden="true"></i>${escapeHtml(signalLabel(bucket))}</strong></div><div class="deck-move move-${escapeHtml(move.className)}"><span>RANK MOVE</span><strong>${escapeHtml(movementText(move))}</strong></div></a>`;
}
function controlDeckPanel(payload, previousPayload, h, isPrimary) {
  const rows = signalsFrom(payload, h).slice(0, 5);
  const previous = previousRanks(previousPayload, h);
  const universe = universeForHorizon(payload, h) || rows.length;
  const primary = primaryHorizon(payload);
  return `<div class="deck-horizon-panel" data-horizon-panel="${escapeHtml(h)}"${isPrimary ? '' : ' hidden'}><div class="deck-panel-caption"><strong>${escapeHtml(horizonLabel(h))}</strong><span>${escapeHtml(horizonPurpose(h, primary))}</span></div>${rows.map(row => controlDeckRow(row, previous, universe)).join('') || '<p class="terminal-empty">No published forecasts for this horizon.</p>'}</div>`;
}
function controlDeck(payload, previousPayload, canonicalPath) {
  const horizons = availableHorizons(payload);
  const primary = primaryHorizon(payload);
  const rows = signalsFrom(payload, primary);
  const universe = universeForHorizon(payload, primary) || rows.length;
  const archived = String(canonicalPath || '').startsWith('/archive/');
  const date = formatDate(payload.trading_date);
  const origin = payload?.record_origin === 'historical_backfill' ? 'HISTORICAL MODEL RECORD' : 'LIVE PUBLIC RECORD';
  const publishedHorizons = horizons.length ? horizons : [primary];
  return `<section class="alpha-control-deck" aria-labelledby="alpha-control-title"><div class="control-deck-copy"><p class="eyebrow">${archived ? 'PRESERVED /ALPHA RESEARCH VIEW' : 'EGX /ALPHA PUBLIC RESEARCH TERMINAL'}</p><h1 id="alpha-control-title">${archived ? 'The model view preserved from this session.' : 'Which EGX stocks deserve your attention tomorrow?'}</h1><p class="control-deck-lede">${archived ? 'This dated public record preserves the cross-sectional ranking that was available after the completed EGX session.' : 'Every EGX session leaves investors with the same problem: <strong>too many stocks, too much noise, and limited attention.</strong> EGX /Alpha turns the market into a daily order of priority, showing which stocks its model expects to perform better relative to the rest in the days ahead. <strong>The higher a stock appears, the stronger EGX /Alpha’s relative preference for it.</strong> Model Direction adds a separate Positive, Neutral or Negative view, helping you decide where your research should begin.'}</p><div class="control-runline"><span>${escapeHtml(date)}</span><strong><span data-active-universe>${escapeHtml(universe)}</span> STOCKS ANALYSED</strong><em>POST-CLOSE · CAIRO</em><b>${escapeHtml(origin)}</b></div><div class="control-principle"><strong>Relative Rank</strong><span>compares eligible EGX stocks with each other.</span><strong>Model Direction</strong><span>is a separate forward classification.</span></div><a class="primary-action" href="#ranking">EXPLORE ${archived ? 'THIS' : 'ALL'} ${escapeHtml(universe)} STOCKS ↓</a></div><article class="control-deck-board" aria-label="Highest-ranked EGX Alpha stocks"><header><div><span>WHAT /ALPHA RANKS HIGHEST</span><strong><span data-active-horizon>${escapeHtml(primary)}</span>D MODEL VIEW</strong></div><em>TOP 5 · SELECTED HORIZON</em></header>${horizonControl(payload)}<div class="deck-horizon-panels">${publishedHorizons.map(h => controlDeckPanel(payload, previousPayload, h, h === primary)).join('')}</div><p class="deck-note">The selected horizon controls the Control Deck, Market Pulse, full ranking and evidence below.</p></article></section>`;
}
function directionCounts(rows) {
  const counts = { positive: 0, neutral: 0, negative: 0 };
  for (const row of rows) counts[signalTone(row.direction_bucket)] += 1;
  return counts;
}
function movementLeaders(payload, previousPayload, h) {
  const previous = previousRanks(previousPayload, h);
  const rows = signalsFrom(payload, h).map(row => ({ row, move: movement(row, previous) })).filter(item => Number.isFinite(item.move.value) && item.move.value !== 0);
  return {
    up: rows.filter(item => item.move.value > 0).sort((a, b) => b.move.value - a.move.value || Number(a.row.rank_within_horizon) - Number(b.row.rank_within_horizon)).slice(0, 3),
    down: rows.filter(item => item.move.value < 0).sort((a, b) => a.move.value - b.move.value || Number(a.row.rank_within_horizon) - Number(b.row.rank_within_horizon)).slice(0, 3)
  };
}
function moverList(items, direction) {
  if (!items.length) return '<p class="pulse-empty">No comparable rank movement.</p>';
  return `<div class="mover-list">${items.map(({ row, move }) => {
    const symbol = displaySymbol(row.stock_symbol);
    const arrow = direction === 'up' ? '↑' : '↓';
    const places = Math.abs(move.value);
    return `<a href="${rel(`/symbol/${encodeURIComponent(symbol)}/`)}"><strong>${escapeHtml(symbol)}</strong><span class="move-${escapeHtml(move.className)}">${arrow} ${escapeHtml(places)} ${places === 1 ? 'place' : 'places'}</span><small>#${escapeHtml(row.rank_within_horizon)}</small></a>`;
  }).join('')}</div>`;
}
function marketPulsePanel(payload, previousPayload, h, isPrimary) {
  const rows = signalsFrom(payload, h);
  const total = universeForHorizon(payload, h) || rows.length || 1;
  const counts = directionCounts(rows);
  const movers = movementLeaders(payload, previousPayload, h);
  const pct = key => ((counts[key] / total) * 100).toFixed(2);
  return `<div class="pulse-horizon-panel" data-horizon-panel="${escapeHtml(h)}"${isPrimary ? '' : ' hidden'}><article class="pulse-card breadth-card"><header><span>MODEL DIRECTION</span><strong>${escapeHtml(horizonLabel(h))} BREADTH</strong></header><div class="breadth-counts"><div class="tone-positive"><strong>${escapeHtml(counts.positive)}</strong><span>POSITIVE</span></div><div class="tone-neutral"><strong>${escapeHtml(counts.neutral)}</strong><span>NEUTRAL</span></div><div class="tone-negative"><strong>${escapeHtml(counts.negative)}</strong><span>NEGATIVE</span></div></div><div class="breadth-bar" aria-label="${escapeHtml(counts.positive)} positive, ${escapeHtml(counts.neutral)} neutral, ${escapeHtml(counts.negative)} negative"><i class="positive" style="width:${pct('positive')}%"></i><i class="neutral" style="width:${pct('neutral')}%"></i><i class="negative" style="width:${pct('negative')}%"></i></div><p>Direction counts across the complete published ${escapeHtml(horizonLabel(h))} universe.</p></article><article class="pulse-card movers-card"><header><span>RANK MOVERS</span><strong>BIGGEST CHANGES · ${escapeHtml(horizonLabel(h))}</strong></header><div class="mover-columns"><div><span class="mover-heading">UP</span>${moverList(movers.up, 'up')}</div><div><span class="mover-heading">DOWN</span>${moverList(movers.down, 'down')}</div></div><p>Change versus the previous completed public ranking at the same horizon.</p></article></div>`;
}
function marketPulse(payload, previousPayload) {
  if (!isFullUniverse(payload)) return '';
  const horizons = availableHorizons(payload);
  const primary = primaryHorizon(payload);
  return `<section class="alpha-market-pulse" aria-labelledby="market-pulse-title"><header><div><p class="eyebrow">MARKET PULSE</p><h2 id="market-pulse-title">Context for the selected model horizon.</h2></div><span><strong data-active-horizon>${escapeHtml(primary)}</span>D VIEW</strong></header>${horizons.map(h => marketPulsePanel(payload, previousPayload, h, h === primary)).join('')}</section>`;
}
function rankingHorizonControl(payload) {
  return `<div class="terminal-ranking-control">${horizonControl(payload, { compact: true })}</div>`;
}
function modelRow(row, previous, universe) {
  const rank = Number(row.rank_within_horizon);
  const move = movement(row, previous);
  const bucket = row.direction_bucket || 'neutral_model_signal';
  const symbol = displaySymbol(row.stock_symbol);
  const symbolHref = rel(`/symbol/${encodeURIComponent(symbol)}/`);
  return `<div class="model-row product-model-row terminal-model-row" data-model-row data-direction="${escapeHtml(signalTone(bucket))}" data-search-text="${escapeHtml(`${symbol} ${row.stock_symbol || ''} ${row.company_name || ''}`.toLowerCase())}"><div class="rank-cell"><strong>#${escapeHtml(rank)}</strong><small>/ ${escapeHtml(universe)}</small></div><div class="move-cell move-${escapeHtml(move.className)}" title="Rank change versus previous completed session at the same horizon">${escapeHtml(movementText(move))}</div><a class="symbol-cell" href="${symbolHref}" aria-label="Open ${escapeHtml(symbol)} model history"><strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(row.company_name || row.stock_symbol || '')}</span></a><div class="view-cell tone-${escapeHtml(signalTone(bucket))}"><i aria-hidden="true"></i><span>${escapeHtml(signalLabel(bucket))}</span></div></div>`;
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
  return `<section class="model-output product-ranking terminal-ranking" id="ranking" aria-labelledby="model-output-title"><header class="output-head product-output-head"><div><p class="eyebrow">${archived ? 'PRESERVED MODEL RANKING' : '/ALPHA MARKET RANKING'}</p><h2 id="model-output-title">The complete eligible EGX universe.</h2><p>Relative Rank compares stocks with each other. Model Direction is separate, so a highly ranked stock can still carry a Neutral or Negative directional classification.</p></div><div class="output-count"><strong data-active-visible>${full ? rows.length : 1}</strong><span data-output-count-context>OF ${escapeHtml(count)} STOCKS</span></div></header>${rankingHorizonControl(payload)}${full ? `<div class="output-controls product-controls terminal-controls"><label class="model-search"><span>SEARCH STOCK</span><input type="search" data-model-search placeholder="Ticker" aria-label="Search Alpha ranking by ticker"></label><div class="filter-set product-filter-set" aria-label="Filter by model direction"><button class="active" type="button" data-model-filter="all" aria-pressed="true">ALL <span data-filter-count>${escapeHtml(rows.length)}</span></button><button type="button" data-model-filter="positive" aria-pressed="false">POSITIVE <span data-filter-count>0</span></button><button type="button" data-model-filter="neutral" aria-pressed="false">NEUTRAL <span data-filter-count>0</span></button><button type="button" data-model-filter="negative" aria-pressed="false">NEGATIVE <span data-filter-count>0</span></button></div></div>` : `<div class="compatibility-note" role="note"><strong>${archived ? 'LEGACY RECORD' : 'PUBLICATION NOTE'}</strong><p>This record uses the earlier single-row public format. Full-universe controls apply to V2 records.</p></div>`}<div class="model-table product-model-table terminal-model-table" role="table" aria-label="EGX Alpha market ranking"><div class="model-head product-model-head terminal-model-head" role="row"><span>RELATIVE RANK</span><span>RANK MOVE</span><span>STOCK</span><span>MODEL DIRECTION</span></div>${tableBody}</div><p class="output-empty small-note" data-model-empty hidden>No matching stocks.</p></section>`;
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
  return `<section class="model-evidence product-evidence" aria-labelledby="model-evidence-title"><header><div><p class="eyebrow">RESEARCH EVIDENCE</p><h2 id="model-evidence-title">Evidence behind the ranking system.</h2></div><p>${historicalOnly ? 'Historical held-out evidence is preserved for this model record. Live evidence was not reconstructed.' : 'Historical validation and live realised-outcome tracking are separated. Live ranking metrics remain maturity-gated.'}</p></header><div class="evidence-scale"><div><span>HISTORICAL SAMPLES</span><strong>${escapeHtml(formatInteger(scale.historical_model_samples))}</strong></div><div><span>TRAINING STOCKS</span><strong>${escapeHtml(formatInteger(scale.training_universe_count))}</strong></div><div><span>HELD-OUT TEST DATES</span><strong>${escapeHtml(formatInteger(scale.heldout_test_dates))}</strong></div><div><span>LIVE OUTCOMES</span><strong>${historicalOnly ? 'N/A' : escapeHtml(formatInteger(live?.total_matured_outcomes))}</strong></div></div><div class="evidence-window-label"><span>SELECTED HORIZON EVIDENCE</span><strong><span data-active-horizon>${escapeHtml(primary)}</span>D</strong></div>${horizons.map(h => evidenceHorizonPanel(payload, h, h === primary)).join('')}<div class="evidence-governance"><span>GOVERNANCE</span><p>${governance.outcomes_scored_after_horizon_maturity ? 'Forecasts are scored only after their horizon matures.' : ''} ${governance.automatic_promotion === false && governance.human_review_required === true ? 'Model promotion is not automatic; human review is required.' : ''}</p><strong class="${historicalOnly ? 'state-backfill' : 'state-research'}">${escapeHtml(historicalOnly ? 'HISTORICAL MODEL RECORD' : prettyState(live?.status || 'evidence_accumulating'))}</strong></div></section>`;
}
function howToRead() {
  return `<section class="how-to-read terminal-read"><header><p class="eyebrow">HOW TO READ /ALPHA</p><h2>Four concepts, one model view.</h2></header><div class="read-grid"><article><span>01</span><strong>Relative Rank</strong><p>#3 / 91 means the stock is third in the selected horizon's eligible comparison set.</p></article><article><span>02</span><strong>Model Direction</strong><p>Positive, Neutral or Negative is a separate forward classification, not the rank itself.</p></article><article><span>03</span><strong>Rank Move</strong><p>Shows how many ranking places changed versus the previous completed run at the same horizon.</p></article><article><span>04</span><strong>Forecast Horizon</strong><p>1D, 3D, 5D and 10D are separate published model views. 5D is the primary research view.</p></article></div><a href="${rel('/investor-guide/')}">READ THE INVESTOR GUIDE →</a></section>`;
}
function recentSessions(items, currentDate) {
  const rows = (Array.isArray(items) ? items : []).filter(item => item?.date && item.date !== currentDate).slice(0, 3);
  if (!rows.length) return '';
  return `<section class="recent-runs product-recent terminal-memory"><header><div><p class="eyebrow">PUBLIC MODEL MEMORY</p><h2>Recent completed analysis sessions.</h2></div><a href="${rel('/archive/')}">VIEW FULL HISTORY →</a></header>${rows.map(item => {
    const full = item.schema_version === 'egx_alpha_public_wire_v2';
    const count = Number(item.universe_count || item.published_count || 0);
    const horizon = item.multi_horizon ? '1D · 3D · 5D · 10D' : horizonLabel(item.horizon || 5);
    const state = full ? (item.record_origin === 'historical_backfill' ? 'Historical model record' : 'Live model record') : 'Legacy single-row record';
    return `<a href="${rel(item.url)}"><time>${escapeHtml(item.date)}</time><strong>${escapeHtml(count)} STOCKS</strong><span>${escapeHtml(horizon)}</span><em>${escapeHtml(state)}</em></a>`;
  }).join('')}</section>`;
}
export function homePage(payload, { canonicalPath = '/today/', recentItems = [], previousPayload = null } = {}) {
  const activeSection = String(canonicalPath || '').startsWith('/archive/') ? 'history' : 'latest';
  return `<style data-home-styles>${HOME_CSS.replaceAll('</style', '<\\/style')}${MULTI_HORIZON_CSS.replaceAll('</style', '<\\/style')}${PRODUCT_HOME_CSS.replaceAll('</style', '<\\/style')}${RESEARCH_TERMINAL_CSS.replaceAll('</style', '<\\/style')}</style><main class="site-shell page-home page-product" data-page="signal">${siteHeader('PUBLIC RESEARCH TERMINAL', activeSection)}${controlDeck(payload, previousPayload, canonicalPath)}${marketPulse(payload, previousPayload)}${rankingPanel(payload, previousPayload, canonicalPath)}${researchEvidencePanel(payload)}${howToRead()}${recentSessions(recentItems, payload.trading_date)}${siteFooter()}</main>`;
}
