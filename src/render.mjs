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

export function renderSignalPage(payload, canonicalPath = '/today/', recentItems = [], previousPayload = null) {
  const { display } = signalParts(payload);
  const isV2 = payload.schema_version === 'egx_alpha_public_wire_v2';
  const titleSuffix = isV2 ? `${payload.universe_count} stocks` : display;
  return htmlShell({ title: `EGX /Alpha — ${payload.trading_date} — ${titleSuffix}`, description: `EGX /Alpha quantitative market ranking for the Egyptian Exchange, analysis date ${payload.trading_date}.`, canonicalPath, payload, pageClass: 'page-signal', body: homePage(payload, { canonicalPath, recentItems, previousPayload }) });
}

export function renderArchivePage(items) {
  const rows = items.map(item => {
    const isV2 = item.schema_version === 'egx_alpha_public_wire_v2';
    const count = Number(item.universe_count || item.published_count || 0);
    const state = archiveState(item);
    const summary = isV2 ? `${count} stocks analysed` : `${item.published_count || 1} public row`;
    return `<a class="archive-row product-archive-row" href="${rel(item.url)}"><span>${escapeHtml(item.date)}</span><strong>${escapeHtml(summary)}</strong><em>${escapeHtml(horizonDisplay(item))}</em><small class="archive-state ${state.className}">${escapeHtml(state.label)}</small></a>`;
  }).join('');
  return htmlShell({ title: 'EGX /Alpha model history — EGXResearch', description: 'Explore dated EGX /Alpha quantitative model rankings.', canonicalPath: '/archive/', body: `<main class="site-shell page-archive">${siteHeader('HISTORY', 'history')}<section class="page-hero"><p class="eyebrow">MODEL HISTORY</p><h1>Every completed ranking, preserved.</h1><p class="lede">Explore dated EGX /Alpha rankings across the public 1D, 3D, 5D and 10D trading-day outlooks. Historical model records are labelled by provenance without rewriting what the model produced.</p><div class="meta-row"><span class="badge">${items.length} MODEL SESSION${items.length === 1 ? '' : 'S'}</span><a class="badge" href="${rel('/search/')}">SEARCH HISTORY</a></div></section><section class="card archive-list">${rows || '<p class="small-note">No public records yet.</p>'}</section>${siteFooter()}</main>` });
}

export function renderSearchPage() {
  return htmlShell({ title: 'Search EGX /Alpha model history — EGXResearch', description: 'Search public EGX /Alpha rankings by date, stock, outlook or signal.', canonicalPath: '/search/', body: `<main class="site-shell page-search">${siteHeader('SEARCH', 'search')}<section class="page-hero"><p class="eyebrow">PUBLIC MODEL MEMORY</p><h1>Find a stock, date or outlook.</h1><p class="lede">Search the quantitative archive by ticker, analysis date, 1D / 3D / 5D / 10D outlook, or Positive / Neutral / Negative signal.</p></section><section class="card search-panel"><input class="search-input" data-search-input type="search" placeholder="Ticker, YYYY-MM-DD, 5D, Positive…" aria-label="Search model records"><div class="search-meta"><span>PUBLIC ARCHIVE INDEX</span><strong data-search-count>READY</strong></div><div class="search-results" data-search-results aria-live="polite"></div></section>${siteFooter()}</main>` });
}
export function renderMethodologyPage() { return htmlShell({ title: 'How EGX /Alpha works — EGXResearch', description: 'Public methodology and interpretation guide for EGX /Alpha.', canonicalPath: '/methodology/', pageClass: 'page-methodology', body: methodologyPage() }); }
export function renderInstitutionalPage() {
  const href = `mailto:${SITE.accessEmail}?subject=${encodeURIComponent('EGX Alpha institutional enquiry')}`;
  return htmlShell({ title: 'Institutional — EGX /Alpha', description: 'Institutional research and technology enquiries for EGX /Alpha.', canonicalPath: '/institutional/', body: `<main class="site-shell page-institutional">${siteHeader('INSTITUTIONAL', 'institutional')}<section class="page-hero"><p class="eyebrow">INSTITUTIONAL</p><h1>Quantitative Egyptian-equity intelligence, built for disciplined research.</h1><p class="lede">EGXResearch operates EGX /Alpha as a production ranking system with a bounded public disclosure layer and a reproducible daily research record.</p></section><section class="institutional-grid"><article class="card"><p class="section-kicker">CAPABILITIES</p><h2>Research distribution without exposing the model core.</h2><div class="capability-list"><div><span>01</span><section><strong>Structured model outputs</strong><p>Daily public rankings and longitudinal model history across four trading-day outlooks.</p></section></div><div><span>02</span><section><strong>Bounded technology integration</strong><p>A publication architecture that separates public research output from proprietary model internals.</p></section></div><div><span>03</span><section><strong>Strategic research applications</strong><p>Institutional conversations around Egyptian-equity intelligence and systematic research workflows.</p></section></div></div></article><article class="card institutional-contact"><p class="section-kicker">ENQUIRIES</p><h2>Institutional contact.</h2><p class="lede">For research partnerships, technology integration, signal distribution or strategic enquiries:</p><a href="${href}">${escapeHtml(SITE.accessEmail)}</a><p class="small-note" style="margin-top:28px">Research and information only. No execution service is offered by this public website.</p></article></section>${siteFooter()}</main>` });
}

function dossierWindow(symbol, rows, horizon, isPrimary) {
  const ordered = [...rows].sort((a, b) => b.date.localeCompare(a.date));
  const latest = ordered[0] || {};
  const percentile = formatPercentile(latest.rank, latest.universe_count);
  const moveClass = latest.movement == null || latest.movement === 0 ? 'move-flat' : latest.movement > 0 ? 'move-positive' : 'move-negative';
  const moveLabel = latest.movement == null || latest.movement === 0 ? '—' : `${latest.movement > 0 ? '+' : ''}${latest.movement}`;
  const table = ordered.map(row => {
    const rowMoveClass = row.movement == null || row.movement === 0 ? 'move-flat' : row.movement > 0 ? 'move-positive' : 'move-negative';
    const rowMoveLabel = row.movement == null || row.movement === 0 ? '—' : `${row.movement > 0 ? '+' : ''}${row.movement}`;
    return `<div class="dossier-row"><span class="dossier-date">${escapeHtml(row.date)}</span><strong class="dossier-rank">#${escapeHtml(row.rank)}</strong><em class="dossier-universe">${row.universe_count ? `${escapeHtml(row.universe_count)} stocks` : 'universe —'}</em><span class="dossier-percentile">${escapeHtml(formatPercentile(row.rank, row.universe_count))} pctl</span><span class="dossier-view tone-${signalTone(row.direction_bucket)}">${escapeHtml(signalLabel(row.direction_bucket))}</span><small class="dossier-move ${rowMoveClass}">${escapeHtml(rowMoveLabel)}</small></div>`;
  }).join('');
  return `<section class="symbol-horizon-panel" data-horizon-panel="${escapeHtml(horizon)}"${isPrimary ? '' : ' hidden'}><div class="symbol-summary"><div><span>RANK</span><strong>#${escapeHtml(latest.rank ?? '—')} / ${escapeHtml(latest.universe_count ?? '—')}</strong></div><div><span>RANK PERCENTILE</span><strong>${escapeHtml(percentile)}</strong></div><div><span>SIGNAL</span><strong class="tone-${signalTone(latest.direction_bucket)}">${escapeHtml(signalLabel(latest.direction_bucket))}</strong></div><div><span>Δ RANK</span><strong class="${moveClass}">${escapeHtml(moveLabel)}</strong></div></div><section class="card dossier-chart-card"><header><p class="eyebrow">RANK PERCENTILE HISTORY</p><strong>${escapeHtml(horizonLabel(horizon))}</strong></header><div class="rank-chart dossier-rank-chart" data-rank-chart data-rank-chart-symbol="${escapeHtml(symbol)}" data-rank-chart-horizon="${escapeHtml(horizon)}"><p class="chart-empty">Loading historical rank percentile…</p></div><p>Relative rank history only; not a price chart or confidence series.</p></section><section class="card archive-list dossier-table"><div class="dossier-head"><span>DATE</span><span>RANK</span><span>UNIVERSE</span><span>PCTL</span><span>SIGNAL</span><span>Δ RANK</span></div>${table || `<p class="small-note">No ${escapeHtml(horizonLabel(horizon))} public history.</p>`}</section></section>`;
}
export function renderSymbolDossierPage(symbol, history) {
  const rows = [...(history || [])].map(row => ({ ...row, horizon: String(row.horizon || '5') }));
  const horizons = orderedHorizons(rows);
  const primary = horizons.includes('5') ? '5' : horizons[0] || '5';
  const multi = horizons.length > 1;
  const switcher = multi ? `<div class="horizon-switcher symbol-horizon-switcher product-switcher" role="group" aria-label="Outlook"><span>OUTLOOK <small>D = trading days</small></span><div>${horizons.map(h => `<button type="button" class="${h === primary ? 'active' : ''}" data-horizon-select="${escapeHtml(h)}" aria-pressed="${h === primary ? 'true' : 'false'}">${escapeHtml(horizonLabel(h))}</button>`).join('')}</div></div>` : '';
  const localStyle = `<style>.symbol-horizon-panel[hidden]{display:none!important}.symbol-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin:22px 0;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:var(--line)}.symbol-summary>div{padding:16px;background:var(--surface)}.symbol-summary span{display:block;color:var(--muted);font-family:var(--mono);font-size:.6rem;letter-spacing:.05em}.symbol-summary strong{display:block;margin-top:7px;font-family:var(--mono)}.dossier-chart-card{padding:20px;margin-bottom:16px}.dossier-chart-card header{display:flex;justify-content:space-between;gap:14px}.dossier-chart-card header>strong{font-family:var(--mono);color:var(--blue)}.dossier-chart-card>p{margin:4px 0 0;color:var(--muted);font-size:.72rem}@media(max-width:650px){.symbol-summary{grid-template-columns:1fr 1fr}.symbol-horizon-switcher{margin-top:20px}.symbol-horizon-switcher>div{display:grid;grid-template-columns:repeat(4,1fr)}} </style>`;
  return htmlShell({ title: `${symbol} — EGX /Alpha model history`, description: `Public quantitative EGX /Alpha ranking history for ${symbol}.`, canonicalPath: `/symbol/${symbol}/`, body: `${localStyle}<main class="site-shell page-symbol">${siteHeader('STOCK HISTORY', 'history')}<section class="page-hero"><p class="eyebrow">STOCK MODEL HISTORY</p><h1>${escapeHtml(symbol)}</h1><p class="lede">Track how this stock has ranked within the eligible EGX universe. Rank percentile normalises changing universe size; signal remains a separate directional classification.</p>${switcher}</section>${horizons.map(h => dossierWindow(symbol, rows.filter(row => String(row.horizon) === h), h, h === primary)).join('') || '<section class="card"><p class="small-note">No public history.</p></section>'}${siteFooter()}</main>` });
}
