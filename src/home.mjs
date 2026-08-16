import fs from 'node:fs';
import { escapeHtml, megaFooter, prettyState, rel, siteHeader } from './templates.mjs';
import {
  availableHorizons,
  forecastWindows,
  hasMultiHorizon,
  historicalEvidenceFor,
  liveEvidenceFor,
  primaryHorizon,
  topLevelSignals,
  universeForHorizon
} from './research-view.mjs';

const HOME_CSS = fs.readFileSync(new URL('../assets/home.css', import.meta.url), 'utf8');
const MULTI_HORIZON_CSS = fs.readFileSync(new URL('../assets/multi-horizon.css', import.meta.url), 'utf8');

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

export function signalsFrom(payload, selectedHorizon = primaryHorizon(payload)) {
  const windows = forecastWindows(payload);
  return windows[String(selectedHorizon)]?.signals || topLevelSignals(payload);
}

function isFullUniverse(payload) {
  return Array.isArray(payload?.signals);
}

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

function processRibbon() {
  return `<div class="process-ribbon" aria-label="EGX Alpha research process">
    <span><b>01</b> OBSERVE</span><i>→</i><span><b>02</b> VALIDATE</span><i>→</i><span><b>03</b> INFER</span><i>→</i><span><b>04</b> RANK</span><i>→</i><span><b>05</b> PUBLISH</span>
  </div>`;
}

function runHeader(payload, canonicalPath) {
  const primary = primaryHorizon(payload);
  const rows = signalsFrom(payload, primary);
  const full = isFullUniverse(payload);
  const count = universeForHorizon(payload, primary);
  const countLabel = count ?? '—';
  const universeNote = full
    ? `${rows.length} / ${count ?? rows.length} published`
    : count
      ? 'eligible comparison set'
      : 'universe unavailable';
  const date = formatDate(payload.trading_date);
  const archived = String(canonicalPath || '').startsWith('/archive/');
  const origin = payload.record_origin || (archived ? 'archive' : 'live');
  const multi = hasMultiHorizon(payload);
  const deck = multi
    ? `Systematic cross-sectional intelligence for the Egyptian Exchange. The default research view is ${primary} sessions; switch forecast windows to inspect the model across 1, 3, 5 and 10 sessions.`
    : `Systematic cross-sectional intelligence for the Egyptian Exchange. The primary public research horizon is ${primary} trading sessions.`;

  return `<section class="run-hero">
    <div class="run-title-block">
      <p class="eyebrow">${archived ? 'HISTORICAL MODEL RECORD' : 'LATEST COMPLETED MODEL RUN'}</p>
      <h1>EGX /ALPHA<br><span>DEEP-LEARNING MARKET RANKING</span></h1>
      <p class="run-deck">${escapeHtml(deck)}</p>
    </div>
    <div class="run-date"><span>ANALYSIS DATE</span><strong>${escapeHtml(date)}</strong><em>POST-CLOSE / CAIRO</em></div>
    <div class="run-metrics" aria-label="Run integrity">
      <div><span>UNIVERSE</span>${multi ? `<strong data-active-universe>${escapeHtml(countLabel)}</strong>` : `<strong>${escapeHtml(countLabel)}</strong>`}<em>${escapeHtml(universeNote)}</em></div>
      <div><span>FORECAST</span>${multi ? `<strong><span data-active-horizon>${escapeHtml(primary)}</span>S</strong>` : `<strong>${escapeHtml(primary)}S</strong>`}<em>${multi ? 'selected window' : 'primary horizon'}</em></div>
      <div><span>SOURCE</span><strong>VALIDATED</strong><em>${escapeHtml(prettyState(rows[0]?.source_freshness_status || 'live_observation_completed'))}</em></div>
      <div><span>PUBLICATION</span><strong>${full ? 'COMPLETE' : 'CURRENT'}</strong><em>${full ? prettyState(origin) : 'single-row public format'}</em></div>
    </div>
    ${processRibbon()}
  </section>`;
}

function horizonSwitcher(payload) {
  const horizons = availableHorizons(payload);
  if (horizons.length < 2) return '';
  const primary = primaryHorizon(payload);
  const windows = forecastWindows(payload);
  return `<div class="horizon-switcher" role="group" aria-label="Forecast window">
    <span>FORECAST WINDOW</span>
    <div>${horizons.map(h => {
      const window = windows[h];
      return `<button type="button" class="${h === primary ? 'active' : ''}" data-horizon-select="${escapeHtml(h)}" data-universe="${escapeHtml(window?.universe_count ?? '')}" data-published="${escapeHtml(window?.signals?.length ?? '')}" aria-pressed="${h === primary ? 'true' : 'false'}">${escapeHtml(h)}S</button>`;
    }).join('')}</div>
  </div>`;
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
    <div class="move-cell move-${move.className}" title="Rank change versus previous completed session at the same forecast horizon">${escapeHtml(move.label)}</div>
    <a class="symbol-cell" href="${symbolHref}" aria-label="Open ${escapeHtml(symbol)} model history"><strong>${escapeHtml(symbol)}</strong><span>${escapeHtml(row.company_name || row.stock_symbol || '')}</span></a>
    <div class="view-cell tone-${tone(bucket)}"><i aria-hidden="true"></i>${escapeHtml(label)}</div>
  </div>`;
}

function rankingWindow(payload, previousPayload, h, isPrimary) {
  const rows = signalsFrom(payload, h);
  const previous = previousRanks(previousPayload, h);
  return `<div class="horizon-panel" data-horizon-panel="${escapeHtml(h)}"${isPrimary ? '' : ' hidden'}>
    <div class="model-body" data-model-body>${rows.map(row => modelRow(row, previous)).join('') || '<p class="small-note">No published model output.</p>'}</div>
  </div>`;
}

function rankingPanel(payload, previousPayload) {
  const full = isFullUniverse(payload);
  const primary = primaryHorizon(payload);
  const horizons = availableHorizons(payload);
  const rows = signalsFrom(payload, primary);
  const count = universeForHorizon(payload, primary);
  const countContext = full
    ? `OF ${count ?? rows.length} SECURITIES`
    : count
      ? `PUBLIC ROW / ${count} UNIVERSE`
      : 'PUBLIC ROW / UNIVERSE UNAVAILABLE';

  const multi = horizons.length > 1;
  const outputCount = multi
    ? `<div class="output-count"><strong data-active-published>${full ? rows.length : 1}</strong><span data-output-count-context>${escapeHtml(countContext)}</span></div>`
    : `<div class="output-count"><strong>${full ? rows.length : 1}</strong><span>${escapeHtml(countContext)}</span></div>`;
  const tableBody = multi
    ? horizons.map(h => rankingWindow(payload, previousPayload, h, h === primary)).join('')
    : `<div class="model-body" data-model-body>${rows.map(row => modelRow(row, previousRanks(previousPayload, primary))).join('') || '<p class="small-note">No published model output.</p>'}</div>`;

  return `<section class="model-output" aria-labelledby="model-output-title">
    <header class="output-head">
      <div><p class="eyebrow">MODEL OUTPUT</p><h2 id="model-output-title">Cross-sectional ranking</h2></div>
      ${outputCount}
    </header>
    ${horizonSwitcher(payload)}
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
      ${tableBody}
    </div>
    <p class="output-empty small-note" data-model-empty hidden>No securities match this view.</p>
  </section>`;
}

function formatInteger(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '—';
}

function formatRankIc(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `${n >= 0 ? '+' : ''}${n.toFixed(4)}` : '—';
}

function formatSpread(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `${n >= 0 ? '+' : ''}${(n * 100).toFixed(2)} pp` : '—';
}

function evidenceHorizonPanel(payload, h, isPrimary) {
  const historical = historicalEvidenceFor(payload, h) || {};
  const live = liveEvidenceFor(payload, h) || {};
  const threshold = Number(payload?.research_evidence?.live_validation?.governance_threshold_days || 60);
  const ready = live.live_metrics_ready === true;
  return `<div class="evidence-horizon" data-horizon-panel="${escapeHtml(h)}"${isPrimary ? '' : ' hidden'}>
    <div class="evidence-stat"><span>HELD-OUT RANKIC</span><strong>${escapeHtml(formatRankIc(historical.heldout_mean_date_rank_ic))}</strong><em>${escapeHtml(h)}S historical validation</em></div>
    <div class="evidence-stat"><span>TOP–BOTTOM SPREAD</span><strong>${escapeHtml(formatSpread(historical.heldout_top_bottom_spread_return))}</strong><em>held-out test</em></div>
    <div class="evidence-stat"><span>MATURED OUTCOMES</span><strong>${escapeHtml(formatInteger(live.matured_outcomes))}</strong><em>live realised evidence</em></div>
    <div class="evidence-stat"><span>EVIDENCE DAYS</span><strong>${escapeHtml(formatInteger(live.matured_prediction_days))} / ${escapeHtml(formatInteger(threshold))}</strong><em>${ready ? 'live metrics mature' : 'evidence accumulating'}</em></div>
    ${ready ? `<div class="evidence-stat"><span>LIVE RANKIC</span><strong>${escapeHtml(formatRankIc(live.live_mean_rank_ic))}</strong><em>maturity-gated</em></div>
    <div class="evidence-stat"><span>LIVE SPREAD</span><strong>${escapeHtml(formatSpread(live.live_top_bottom_spread_return))}</strong><em>maturity-gated</em></div>` : ''}
  </div>`;
}

function researchEvidencePanel(payload) {
  const evidence = payload?.research_evidence;
  if (!evidence) return '';
  const scale = evidence.system_scale || {};
  const live = evidence.live_validation || {};
  const governance = evidence.governance || {};
  const primary = primaryHorizon(payload);
  const horizons = availableHorizons(payload);

  return `<section class="model-evidence" aria-labelledby="model-evidence-title">
    <header>
      <div><p class="eyebrow">MODEL EVIDENCE</p><h2 id="model-evidence-title">Research proof, accumulated over time.</h2></div>
      <p>Historical validation and live realised-outcome tracking are shown separately. Live ranking metrics remain withheld until the existing evidence-maturity threshold is reached.</p>
    </header>
    <div class="evidence-scale">
      <div><span>MODEL SAMPLES</span><strong>${escapeHtml(formatInteger(scale.historical_model_samples))}</strong></div>
      <div><span>TRAINING SECURITIES</span><strong>${escapeHtml(formatInteger(scale.training_universe_count))}</strong></div>
      <div><span>HELD-OUT TEST DATES</span><strong>${escapeHtml(formatInteger(scale.heldout_test_dates))}</strong></div>
      <div><span>LIVE OUTCOMES SCORED</span><strong>${escapeHtml(formatInteger(live.total_matured_outcomes))}</strong></div>
    </div>
    <div class="evidence-window-label"><span>SELECTED FORECAST EVIDENCE</span><strong><span data-active-horizon>${escapeHtml(primary)}</span>S</strong></div>
    ${horizons.map(h => evidenceHorizonPanel(payload, h, h === primary)).join('')}
    <div class="evidence-governance">
      <span>GOVERNANCE</span>
      <p>${governance.outcomes_scored_after_horizon_maturity ? 'Forecasts are scored only after their horizon matures.' : ''} ${governance.automatic_promotion === false && governance.human_review_required === true ? 'Model promotion is not automatic; human review is required.' : ''}</p>
      <strong>${escapeHtml(prettyState(live.status || 'evidence_accumulating'))}</strong>
    </div>
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
    const horizonLabel = item.multi_horizon ? '1S / 3S / 5S / 10S' : `${item.horizon || 5}S`;
    const state = full ? `${horizonLabel} · ${prettyState(item.record_origin || 'live')}` : 'Single-row record';
    return `<a href="${rel(item.url)}"><time>${escapeHtml(item.date)}</time><strong>${escapeHtml(publication)}</strong><span>${escapeHtml(state)}</span></a>`;
  }).join('')}</section>`;
}

export function homePage(payload, { canonicalPath = '/today/', recentItems = [], previousPayload = null } = {}) {
  return `<style data-home-styles>${HOME_CSS.replaceAll('</style', '<\\/style')}${MULTI_HORIZON_CSS.replaceAll('</style', '<\\/style')}</style>
  <main class="site-shell page-home" data-page="signal">
    ${siteHeader('QUANTITATIVE EQUITY INTELLIGENCE')}
    ${runHeader(payload, canonicalPath)}
    ${rankingPanel(payload, previousPayload)}
    ${researchEvidencePanel(payload)}
    ${researchStrip()}
    ${recentSessions(recentItems, payload.trading_date)}
    ${megaFooter()}
  </main>`;
}
