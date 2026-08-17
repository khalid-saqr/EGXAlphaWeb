import { escapeHtml, htmlShell, rel, siteFooter, siteHeader, SITE } from './templates.mjs';
import { homePage } from './home.mjs';
import { methodologyPage } from './methodology.mjs';
import { PUBLIC_HORIZONS } from './research-view.mjs';
import { formatPercentile, horizonLabel, signalLabel, signalTone } from './product-view.mjs';

function signalParts(payload) {
  const signal = payload.public_signal || payload.signal || payload.signals?.[0] || {};
  const asset = payload.asset || {};
  const symbol = asset.symbol || signal.stock_symbol || 'EGX /Alpha';
  const display = asset.display_symbol || String(symbol).split(':').pop();
  return { symbol, display };
}
function horizonDisplay(item) {
  if (item?.multi_horizon) return '1D · 3D · 5D · 10D';
  return horizonLabel(item.horizon || '5');
}
function archiveState(item) {
  if (item.schema_version !== 'egx_alpha_public_wire_v2') return { label: 'Legacy single-row record', className: 'state-legacy' };
  if (item.record_origin === 'historical_backfill') return { label: 'Historical model record', className: 'state-backfill' };
  return { label: 'Live model record', className: 'state-live' };
}
function orderedHorizons(history) {
  const set = new Set((history || []).map(row => String(row.horizon || '')).filter(Boolean));
  return PUBLIC_HORIZONS.filter(h => set.has(h)).concat([...set].filter(h => !PUBLIC_HORIZONS.includes(h)));
}
function movementPresentation(value) {
  if (value == null) return { label: 'NO PRIOR RANK', className: 'move-flat' };
  const move = Number(value);
  if (!Number.isFinite(move)) return { label: 'NO PRIOR RANK', className: 'move-flat' };
  if (move === 0) return { label: 'UNCHANGED', className: 'move-flat' };
  const places = Math.abs(move);
  return { label: `${move > 0 ? '↑' : '↓'} ${places} ${places === 1 ? 'PLACE' : 'PLACES'}`, className: move > 0 ? 'move-positive' : 'move-negative' };
}
function shortHash(value) {
  const text = String(value || '');
  if (!text) return 'Unavailable';
  const separator = text.indexOf(':');
  const prefix = separator >= 0 ? text.slice(0, separator) : '';
  const digest = separator >= 0 ? text.slice(separator + 1) : text;
  const compact = digest.length > 14 ? `${digest.slice(0, 14)}…` : digest;
  return prefix ? `${prefix}:${compact}` : compact;
}
function verifyPublicRecord(payload, canonicalPath) {
  if (payload?.schema_version !== 'egx_alpha_public_wire_v2') return '';
  const horizons = PUBLIC_HORIZONS.filter(h => payload?.forecast_windows?.[h]).map(horizonLabel);
  const state = archiveState({ schema_version: payload.schema_version, record_origin: payload.record_origin });
  const archived = String(canonicalPath || '').startsWith('/archive/');
  const jsonHref = archived ? rel(`/data/archive/${encodeURIComponent(payload.trading_date)}.json`) : rel('/data/latest.json');
  const contentHash = payload?.integrity?.public_content_hash;
  const wireHash = payload?.integrity?.public_wire_hash;
  return `<section class="record-verification" aria-label="Public record verification"><details><summary><span>VERIFY PUBLIC RECORD</span><strong>${escapeHtml(payload.trading_date || '—')}</strong><em>${escapeHtml(shortHash(contentHash || wireHash))}</em></summary><div class="verification-grid"><div><span>ANALYSIS DATE</span><strong>${escapeHtml(payload.trading_date || '—')}</strong></div><div><span>RECORD ORIGIN</span><strong class="${state.className}">${escapeHtml(state.label)}</strong></div><div><span>UNIVERSE</span><strong>${escapeHtml(payload.universe_count ?? '—')} STOCKS</strong></div><div><span>PUBLISHED HORIZONS</span><strong>${escapeHtml(horizons.join(' · ') || horizonLabel(payload.primary_horizon || '5'))}</strong></div><div><span>CONTENT HASH</span><code>${escapeHtml(shortHash(contentHash))}</code></div><div><span>WIRE HASH</span><code>${escapeHtml(shortHash(wireHash))}</code></div></div><div class="verification-actions"><p>This disclosure verifies the public artifact only. It does not expose proprietary model internals.</p><a href="${jsonHref}">VIEW PUBLIC JSON →</a></div></details></section>`;
}

export function renderSignalPage(payload, canonicalPath = '/today/', recentItems = [], previousPayload = null, locale = 'en') {
  const { display } = signalParts(payload);
  const isV2 = payload.schema_version === 'egx_alpha_public_wire_v2';
  const titleSuffix = isV2 ? `${payload.universe_count} stocks` : display;
  const terminal = homePage(payload, { canonicalPath, recentItems, previousPayload });
  const verification = verifyPublicRecord(payload, canonicalPath);
  const footerMarker = '<footer class="site-footer research-footer"';
  const body = verification && terminal.includes(footerMarker) ? terminal.replace(footerMarker, `${verification}${footerMarker}`) : terminal;
  return htmlShell({ title: `EGX /Alpha — ${payload.trading_date} — ${titleSuffix}`, description: `EGX /Alpha quantitative market ranking for the Egyptian Exchange, analysis date ${payload.trading_date}.`, canonicalPath, payload, pageClass: 'page-signal', body, locale });
}

export function renderArchivePage(items, locale = 'en') {
  const rows = items.map(item => {
    const isV2 = item.schema_version === 'egx_alpha_public_wire_v2';
    const count = Number(item.universe_count || item.published_count || 0);
    const state = archiveState(item);
    const summary = isV2 ? `${count} stocks analysed` : `${item.published_count || 1} public row`;
    return `<a class="archive-row product-archive-row memory-session" href="${rel(item.url)}"><div class="memory-date"><span>ANALYSIS DATE</span><strong>${escapeHtml(item.date)}</strong></div><div class="memory-universe"><span>PUBLIC UNIVERSE</span><strong>${escapeHtml(summary)}</strong></div><div class="memory-horizons"><span>MODEL HORIZONS</span><em>${escapeHtml(horizonDisplay(item))}</em></div><small class="archive-state ${state.className}">${escapeHtml(state.label)}</small><b>OPEN SESSION →</b></a>`;
  }).join('');
  const liveCount = items.filter(item => item.schema_version === 'egx_alpha_public_wire_v2' && item.record_origin !== 'historical_backfill').length;
  const historicalCount = items.filter(item => item.record_origin === 'historical_backfill').length;
  return htmlShell({ title: 'EGX /Alpha model history — EGXResearch', description: 'Explore dated EGX /Alpha quantitative model rankings.', canonicalPath: '/archive/', locale, body: `<main class="site-shell page-archive page-memory">${siteHeader('HISTORY', 'history')}<section class="page-hero memory-hero"><p class="eyebrow">PUBLIC MODEL MEMORY</p><h1>Every completed public ranking, preserved.</h1><p class="lede">Open any dated EGX /Alpha record exactly as published across its available model horizons. Provenance distinguishes live publications from historical model records without rewriting the underlying output.</p><div class="memory-summary"><div><span>PUBLIC SESSIONS</span><strong>${escapeHtml(items.length)}</strong></div><div><span>LIVE RECORDS</span><strong>${escapeHtml(liveCount)}</strong></div><div><span>HISTORICAL RECORDS</span><strong>${escapeHtml(historicalCount)}</strong></div><div><span>NATIVE HORIZONS</span><strong>1D · 3D · 5D · 10D</strong></div></div><a class="primary-action" href="${rel('/search/')}">SEARCH MODEL MEMORY →</a></section><section class="card archive-list memory-list" aria-label="Public model sessions">${rows || '<p class="small-note">No public records yet.</p>'}</section>${siteFooter()}</main>` });
}

export function renderSearchPage(locale = 'en') {
  return htmlShell({ title: 'Search EGX /Alpha model history — EGXResearch', description: 'Search public EGX /Alpha rankings by date, stock, outlook or signal.', canonicalPath: '/search/', locale, body: `<main class="site-shell page-search page-memory-search">${siteHeader('SEARCH', 'search')}<section class="page-hero search-research-hero"><p class="eyebrow">SEARCH PUBLIC MODEL MEMORY</p><h1>Find a stock, session or model horizon.</h1><p class="lede">Search the public archive by ticker, analysis date, 1D / 3D / 5D / 10D horizon, or Positive / Neutral / Negative Model Direction.</p><div class="search-guide"><span>TRY</span><code>MICH</code><code>2026-08-17</code><code>5D</code><code>Positive</code></div></section><section class="card search-panel research-search-panel"><label class="research-search-field"><span>SEARCH /ALPHA MEMORY</span><input class="search-input" data-search-input type="search" placeholder="Ticker, YYYY-MM-DD, 5D, Positive…" aria-label="Search model records"></label><div class="search-meta"><span>TICKER · DATE · HORIZON · MODEL DIRECTION</span><strong data-search-count>READY</strong></div><div class="search-results" data-search-results aria-live="polite"></div></section>${siteFooter()}</main>` });
}
export function renderMethodologyPage(locale = 'en') { return htmlShell({ title: 'How EGX /Alpha works — EGXResearch', description: 'Public methodology and interpretation guide for EGX /Alpha.', canonicalPath: '/methodology/', pageClass: 'page-methodology', body: methodologyPage(), locale }); }
export function renderInstitutionalPage(locale = 'en') {
  const href = `mailto:${SITE.accessEmail}?subject=${encodeURIComponent('EGX Alpha institutional enquiry')}`;
  return htmlShell({ title: 'Institutional — EGX /Alpha', description: 'Institutional research and technology enquiries for EGX /Alpha.', canonicalPath: '/institutional/', locale, body: `<main class="site-shell page-institutional">${siteHeader('INSTITUTIONAL', 'institutional')}<section class="page-hero"><p class="eyebrow">INSTITUTIONAL</p><h1>Quantitative Egyptian-equity intelligence, built for disciplined research.</h1><p class="lede">EGXResearch operates EGX /Alpha as a production ranking system with a bounded public disclosure layer and a reproducible daily research record.</p></section><section class="institutional-grid"><article class="card"><p class="section-kicker">CAPABILITIES</p><h2>Research distribution without exposing the model core.</h2><div class="capability-list"><div><span>01</span><section><strong>Structured model outputs</strong><p>Daily public rankings and longitudinal model history across four trading-day outlooks.</p></section></div><div><span>02</span><section><strong>Bounded technology integration</strong><p>A publication architecture that separates public research output from proprietary model internals.</p></section></div><div><span>03</span><section><strong>Strategic research applications</strong><p>Institutional conversations around Egyptian-equity intelligence and systematic research workflows.</p></section></div></div></article><article class="card institutional-contact"><p class="section-kicker">ENQUIRIES</p><h2>Institutional contact.</h2><p class="lede">For research partnerships, technology integration, signal distribution or strategic enquiries:</p><a href="${href}">${escapeHtml(SITE.accessEmail)}</a><p class="small-note" style="margin-top:28px">Research and information only. No execution service is offered by this public website.</p></article></section>${siteFooter()}</main>` });
}

function latestForHorizon(rows, horizon) {
  return [...rows].filter(row => String(row.horizon) === String(horizon)).sort((a, b) => b.date.localeCompare(a.date))[0] || {};
}
function dossierHorizonCard(rows, horizon, primary, multi) {
  const latest = latestForHorizon(rows, horizon);
  const move = movementPresentation(latest.movement);
  const tone = signalTone(latest.direction_bucket);
  const active = String(horizon) === String(primary);
  const tag = active ? '<small>PRIMARY RESEARCH VIEW</small>' : `<small>${escapeHtml(horizonLabel(horizon))} MODEL VIEW</small>`;
  const content = `<span class="dossier-horizon-label"><strong>${escapeHtml(horizonLabel(horizon))}</strong>${tag}</span><span class="dossier-card-rank">#${escapeHtml(latest.rank ?? '—')} <em>/ ${escapeHtml(latest.universe_count ?? '—')}</em></span><span class="dossier-card-direction tone-${tone}"><i aria-hidden="true"></i>${escapeHtml(signalLabel(latest.direction_bucket))}</span><span class="dossier-card-move ${move.className}">${escapeHtml(move.label)}</span><time>${escapeHtml(latest.date || '—')}</time>`;
  if (!multi) return `<article class="dossier-horizon-card active">${content}</article>`;
  return `<button type="button" class="dossier-horizon-card${active ? ' active' : ''}" data-horizon-select="${escapeHtml(horizon)}" aria-pressed="${active ? 'true' : 'false'}">${content}</button>`;
}
function dossierWindow(symbol, rows, horizon, isPrimary) {
  const ordered = [...rows].sort((a, b) => b.date.localeCompare(a.date));
  const latest = ordered[0] || {};
  const percentile = formatPercentile(latest.rank, latest.universe_count);
  const move = movementPresentation(latest.movement);
  const table = ordered.map(row => {
    const rowMove = movementPresentation(row.movement);
    return `<div class="dossier-row research-dossier-row"><span class="dossier-date">${escapeHtml(row.date)}</span><strong class="dossier-rank">#${escapeHtml(row.rank)} / ${escapeHtml(row.universe_count ?? '—')}</strong><span class="dossier-percentile">${escapeHtml(formatPercentile(row.rank, row.universe_count))} PCTL</span><span class="dossier-view tone-${signalTone(row.direction_bucket)}"><i aria-hidden="true"></i>${escapeHtml(signalLabel(row.direction_bucket))}</span><small class="dossier-move ${rowMove.className}">${escapeHtml(rowMove.label)}</small></div>`;
  }).join('');
  return `<section class="symbol-horizon-panel research-horizon-panel" data-horizon-panel="${escapeHtml(horizon)}"${isPrimary ? '' : ' hidden'}><header class="dossier-selected-head"><div><p class="eyebrow">SELECTED HORIZON DETAIL</p><h2>${escapeHtml(horizonLabel(horizon))} model history.</h2></div><span>${escapeHtml(ordered.length)} PUBLIC OBSERVATION${ordered.length === 1 ? '' : 'S'}</span></header><div class="symbol-summary research-symbol-summary"><div><span>RELATIVE RANK</span><strong>#${escapeHtml(latest.rank ?? '—')} / ${escapeHtml(latest.universe_count ?? '—')}</strong></div><div><span>MODEL DIRECTION</span><strong class="tone-${signalTone(latest.direction_bucket)}">${escapeHtml(signalLabel(latest.direction_bucket))}</strong></div><div><span>RANK MOVE</span><strong class="${move.className}">${escapeHtml(move.label)}</strong></div><div><span>RANK PERCENTILE</span><strong>${escapeHtml(percentile)}</strong><small>secondary normalization</small></div></div><section class="card dossier-chart-card research-chart-card"><header><div><p class="eyebrow">RELATIVE RANK HISTORY</p><strong>${escapeHtml(horizonLabel(horizon))}</strong></div><span>LAST 30 PUBLIC SESSIONS</span></header><div class="rank-chart dossier-rank-chart" data-rank-chart data-rank-chart-symbol="${escapeHtml(symbol)}" data-rank-chart-horizon="${escapeHtml(horizon)}"><p class="chart-empty">Loading relative rank history…</p></div><p>The chart uses rank percentile to normalize changing eligible-universe size. It is not model confidence, a price chart or an expected-return series.</p></section><section class="card archive-list dossier-table research-dossier-table"><header><div><p class="eyebrow">PUBLIC MODEL HISTORY</p><h3>${escapeHtml(horizonLabel(horizon))} session record.</h3></div></header><div class="dossier-head research-dossier-head"><span>DATE</span><span>RELATIVE RANK</span><span>RANK PERCENTILE</span><span>MODEL DIRECTION</span><span>RANK MOVE</span></div>${table || `<p class="small-note">No ${escapeHtml(horizonLabel(horizon))} public history.</p>`}</section></section>`;
}
export function renderSymbolDossierPage(symbol, history, locale = 'en') {
  const rows = [...(history || [])].map(row => ({ ...row, horizon: String(row.horizon || '5') }));
  const horizons = orderedHorizons(rows);
  const primary = horizons.includes('5') ? '5' : horizons[0] || '5';
  const multi = horizons.length > 1;
  const latestPrimary = latestForHorizon(rows, primary);
  const horizonCards = horizons.map(h => dossierHorizonCard(rows, h, primary, multi)).join('');
  return htmlShell({ title: `${symbol} — EGX /Alpha model history`, description: `Public quantitative EGX /Alpha ranking history for ${symbol}.`, canonicalPath: `/symbol/${symbol}/`, locale, body: `<main class="site-shell page-symbol page-dossier">${siteHeader('STOCK RESEARCH', 'history')}<section class="page-hero dossier-hero"><p class="eyebrow">EGX /ALPHA STOCK RESEARCH</p><h1>${escapeHtml(symbol)}</h1><p class="lede">See how /Alpha currently ranks this stock across its published horizons, then inspect the selected horizon's public history. Relative Rank and Model Direction remain separate throughout.</p><div class="dossier-primary-line"><span>${escapeHtml(horizonLabel(primary))} PRIMARY VIEW</span><strong>#${escapeHtml(latestPrimary.rank ?? '—')} / ${escapeHtml(latestPrimary.universe_count ?? '—')}</strong><em class="tone-${signalTone(latestPrimary.direction_bucket)}">${escapeHtml(signalLabel(latestPrimary.direction_bucket))}</em><time>${escapeHtml(latestPrimary.date || '—')}</time></div></section>${horizonCards ? `<section class="dossier-horizon-overview" aria-label="Current Alpha view across horizons"><header><div><p class="eyebrow">TODAY ACROSS HORIZONS</p><h2>One stock. Four forward model views.</h2></div><p>Select a horizon to inspect its public history below.</p></header><div class="dossier-horizon-grid">${horizonCards}</div></section>` : ''}${horizons.map(h => dossierWindow(symbol, rows.filter(row => String(row.horizon) === h), h, h === primary)).join('') || '<section class="card"><p class="small-note">No public history.</p></section>'}${siteFooter()}</main>` });
}
