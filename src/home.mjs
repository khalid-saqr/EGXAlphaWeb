import fs from 'node:fs';
import { SITE, escapeHtml, megaFooter, prettyState, rel } from './templates.mjs';

const HOME_CSS = fs.readFileSync(new URL('../assets/home.css', import.meta.url), 'utf8');

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function compact(items) {
  return items.filter(Boolean);
}

function displaySymbolFrom(symbol) {
  const text = String(symbol || '').trim();
  if (!text) return 'EGX';
  return text.includes(':') ? text.split(':').pop() : text;
}

function formatNumber(value, digits = 2) {
  if (!hasValue(value)) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: digits }).format(number);
}

function formatCompactNumber(value, digits = 1) {
  if (!hasValue(value)) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  const abs = Math.abs(number);
  if (abs >= 1_000_000_000) return `${(number / 1_000_000_000).toFixed(digits).replace(/\.0+$/, '')}B`;
  if (abs >= 1_000_000) return `${(number / 1_000_000).toFixed(digits).replace(/\.0+$/, '')}M`;
  if (abs >= 1_000) return `${(number / 1_000).toFixed(digits).replace(/\.0+$/, '')}K`;
  return formatNumber(number, digits);
}

function formatPercentage(value) {
  if (!hasValue(value)) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  const sign = number > 0 ? '+' : '';
  return `${sign}${number.toFixed(2).replace(/\.00$/, '')}%`;
}

function horizonText(value, label) {
  const raw = String(value ?? '').trim();
  const fromLabel = String(label ?? '').trim();
  const match = fromLabel.match(/(\d+)/) || raw.match(/(\d+)/);
  if (match) return `${parseInt(match[1], 10)} EGX sessions`;
  return fromLabel || raw || 'Defined horizon';
}

function horizonSessions(value, label) {
  const raw = String(value ?? '').trim();
  const fromLabel = String(label ?? '').trim();
  const match = fromLabel.match(/(\d+)/) || raw.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function formatPublished(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-GB', {
    timeZone: 'Africa/Cairo',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }) + ' Cairo';
}

function formatTradingDate(value) {
  if (!value) return 'Latest record';
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

function directionTone(value) {
  if (value === 'positive_model_signal') return 'positive';
  if (value === 'negative_model_signal') return 'negative';
  return 'neutral';
}

function symbolSizeClass(symbol) {
  const length = String(symbol || '').length;
  if (length <= 4) return 'symbol-short';
  if (length <= 7) return 'symbol-medium';
  return 'symbol-long';
}

function cleanInvestorRead(value) {
  return String(value || '')
    .replace(/\s*This is a public market-intelligence signal to follow, not a trade instruction\.?$/i, '')
    .trim();
}

function payloadParts(payload) {
  const signal = payload.public_signal || payload.signal || {};
  const legacySignal = payload.signal || {};
  const asset = payload.asset || {};
  const market = payload.market_snapshot || {};
  const publicCopy = payload.public_copy || {};
  const publishing = payload.publishing_context || {};
  const modelState = payload.model_state || {};
  const funnel = payload.funnel_context || {};
  const rankingContext = payload.ranking_context || {};
  const stockSymbol = asset.symbol || signal.stock_symbol || legacySignal.stock_symbol || 'EGX signal';
  const displaySymbol = asset.display_symbol || displaySymbolFrom(stockSymbol);
  const directionBucket = signal.direction_bucket || legacySignal.direction_bucket;
  const plainDirection = signal.plain_direction || prettyState(directionBucket);
  const rank = signal.rank_within_horizon ?? legacySignal.rank_within_horizon;
  const rankDisplay = hasValue(rank) ? `#${rank}` : (signal.rank_label || legacySignal.rank_label || 'Selected');
  const sessions = horizonSessions(signal.horizon || legacySignal.horizon, signal.horizon_label);
  const investorRead = cleanInvestorRead(publicCopy.investor_read);
  const directionExplanation = publicCopy.direction_explanation || investorRead || plainDirection;
  const comparisonCount = Number.isFinite(Number(rankingContext.comparison_count))
    ? Number(rankingContext.comparison_count)
    : null;
  const rankExplanation = publicCopy.rank_explanation || (
    comparisonCount
      ? `Ranked ${rankDisplay} among ${comparisonCount} eligible domestic EGX shares assessed for this horizon.`
      : `Ranked ${rankDisplay} among the eligible domestic EGX shares assessed for this horizon.`
  );
  const horizonExplanation = publicCopy.horizon_explanation || (
    sessions
      ? `This signal will be evaluated over the next ${sessions} EGX trading sessions. This is not a suggested holding period.`
      : 'This signal will be evaluated over the stated model horizon. This is not a suggested holding period.'
  );
  return {
    signal,
    asset,
    market,
    publishing,
    modelState,
    funnel,
    rankingContext,
    publicCopy,
    stockSymbol,
    displaySymbol,
    symbolClass: symbolSizeClass(displaySymbol),
    identity: compact([asset.company_name, asset.sector]).join(' · ') || stockSymbol,
    directionBucket,
    tone: directionTone(directionBucket),
    plainDirection,
    directionExplanation,
    rank,
    rankDisplay,
    rankExplanation,
    comparisonCount,
    horizon: horizonText(signal.horizon || legacySignal.horizon, signal.horizon_label),
    horizonExplanation,
    tradingDate: formatTradingDate(payload.trading_date),
    published: formatPublished(payload.published_at || publishing.published_at_utc),
    publishedAfter: publishing.published_after || 'After EGX close',
    useGuidance: publicCopy.use_guidance || 'Use this signal as a starting point for research and monitoring. Read the rank, direction and model horizon together; do not treat the card alone as a buy, sell or hold instruction.',
    fullProductHint: funnel.full_product_hint || 'The complete daily view includes every eligible ranked share, model context, and signal history.'
  };
}

function mailtoLink() {
  return `mailto:${SITE.accessEmail}?subject=${encodeURIComponent('EGX Alpha complete daily ranking access request')}`;
}

function bulbIcon() {
  return `<svg class="theme-bulb" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M9 18h6M10 22h4M8.3 14.5A6 6 0 1 1 15.7 14.5c-.95.72-1.35 1.42-1.45 2.5h-4.5c-.1-1.08-.5-1.78-1.45-2.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function homeHeader(sectionLabel = SITE.signalName) {
  return `<header class="topbar" aria-label="Site header">
    <a class="brand" href="${rel('/')}">
      <span class="brand-mark" aria-hidden="true">EGX</span>
      <span><strong>${escapeHtml(SITE.domain)}</strong><em>${escapeHtml(sectionLabel)}</em></span>
    </a>
    <nav class="navlinks" aria-label="Primary navigation">
      <a href="${rel('/today/')}">Today</a>
      <a href="${rel('/archive/')}">Archive</a>
      <a href="${rel('/search/')}">Search</a>
      <a href="${rel('/methodology/')}">Methodology</a>
      <button class="button theme-toggle theme-icon-button" type="button" data-theme-toggle aria-label="Toggle light and dark theme" aria-pressed="false" title="Switch theme">${bulbIcon()}</button>
    </nav>
  </header>`;
}

function productHero(payload, canonicalPath) {
  const archived = String(canonicalPath || '').startsWith('/archive/');
  if (archived) {
    return `<section class="product-hero product-hero-record">
      <div>
        <p class="eyebrow">Dated public signal record</p>
        <h1>Review the signal exactly as it entered the public archive.</h1>
        <p class="lede">A permanent, research-only record from the wider EGX /Alpha ranking process.</p>
      </div>
      <a class="text-link" href="${rel('/archive/')}">Return to the archive →</a>
    </section>`;
  }
  const parts = payloadParts(payload);
  return `<section class="product-hero">
    <div>
      <p class="eyebrow">One free signal from today’s complete EGX ranking</p>
      <h1>See the share EGX /Alpha ranked ${escapeHtml(parts.rankDisplay)} after today’s market close.</h1>
      <p class="lede">EGX /Alpha compares eligible Egyptian shares over a defined model horizon. The free card reveals one relative rank, its separate direction signal and the market context available at publication. Full access reveals the complete daily ranking and signal history.</p>
    </div>
    <a class="text-link" href="${rel('/methodology/')}">How the ranking works →</a>
  </section>`;
}

function metric(label, value, note = '') {
  if (!hasValue(value)) return null;
  return `<div class="share-metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${note ? `<em>${escapeHtml(note)}</em>` : ''}</div>`;
}

function marketMetrics(parts) {
  const market = parts.market;
  const selected = [
    metric('Latest recorded close', formatNumber(market.latest_close, 4), 'EGP / share'),
    hasValue(market.daily_change_pct)
      ? metric('Daily move', formatPercentage(market.daily_change_pct))
      : metric('Traded value', formatCompactNumber(market.traded_value_egp, 1), 'EGP'),
    metric('Volume', formatCompactNumber(market.volume, 1), 'shares'),
    metric('Liquidity', prettyState(market.liquidity_tier || parts.asset.liquidity_tier))
  ].filter(Boolean).slice(0, 4);
  if (!selected.length) return '';
  return `<section class="share-market" aria-label="Market context">
    <span class="share-section-label">Market context</span>
    <div class="share-metric-grid share-metric-count-${selected.length}">${selected.join('')}</div>
  </section>`;
}

function shareCard(payload) {
  const parts = payloadParts(payload);
  const status = hasValue(parts.modelState.public_label)
    ? `<span class="share-status">${escapeHtml(parts.modelState.public_label)}</span>`
    : '';
  const published = compact([parts.publishedAfter, parts.published]).join(' · ');
  const rankNote = parts.comparisonCount
    ? `of ${parts.comparisonCount} eligible shares`
    : 'relative model rank';
  return `<article class="signal-share-card tone-${parts.tone}" id="public-signal-card" data-screenshot-card aria-label="EGX Alpha public signal card">
    <header class="share-card-header">
      <div class="share-brand"><strong>EGX /ALPHA</strong><span>PUBLIC SIGNAL</span></div>
      <div class="share-header-meta"><time datetime="${escapeHtml(payload.trading_date)}">${escapeHtml(parts.tradingDate)}</time>${status}</div>
    </header>

    <section class="share-asset">
      <div class="share-symbol ${parts.symbolClass}" title="${escapeHtml(parts.stockSymbol)}">${escapeHtml(parts.displaySymbol)}</div>
      <p>${escapeHtml(parts.identity)}</p>
    </section>

    <section class="share-model-view">
      <span class="share-section-label">Direction signal</span>
      <strong>${escapeHtml(parts.plainDirection)}</strong>
      <p>${escapeHtml(parts.directionExplanation)}</p>
    </section>

    <section class="share-decision" aria-label="Public signal interpretation">
      <div><span>Rank in today’s model</span><strong>${escapeHtml(parts.rankDisplay)}</strong><em>${escapeHtml(rankNote)}</em></div>
      <div><span>Model horizon</span><strong>${escapeHtml(parts.horizon)}</strong><em>not a suggested holding period</em></div>
      <div><span>Publication</span><strong>${escapeHtml(parts.publishedAfter)}</strong>${published && parts.published ? `<em>${escapeHtml(parts.published)}</em>` : ''}</div>
    </section>

    ${marketMetrics(parts)}
  </article>`;
}

function conversionRail(payload) {
  const parts = payloadParts(payload);
  const modelNote = hasValue(parts.modelState.public_note)
    ? `<div class="rail-state"><span>${escapeHtml(parts.modelState.public_label || 'Public model state')}</span><p>${escapeHtml(parts.modelState.public_note)}</p></div>`
    : '';
  return `<aside class="conversion-rail" aria-label="Signal guidance and full access information">
    <p class="eyebrow">What the free card shows</p>
    <h2>You are seeing ${escapeHtml(parts.rankDisplay)} from today’s model.</h2>
    <p class="rail-lede">${escapeHtml(parts.rankExplanation)}</p>
    <div class="rail-state rail-guidance"><span>How to use this signal</span><p>${escapeHtml(parts.useGuidance)}</p></div>
    <div class="rail-includes" aria-label="Complete view includes">
      <div><strong>Complete daily ranking</strong><span>See all eligible shares in model order, not only the one public rank.</span></div>
    </div>
    <p class="rail-lede">${escapeHtml(parts.fullProductHint)}</p>
    ${modelNote}
    <a class="button button-primary rail-cta" href="${mailtoLink()}">Request access to the complete daily ranking</a>
    <p class="small-note">Research access only. No personalised investment advice.</p>
  </aside>`;
}

function recordHorizon(item) {
  return horizonText(item.horizon, item.horizon_label);
}

function recentRecords(items, currentDate) {
  const candidates = (Array.isArray(items) ? items : []).filter(item => item?.date !== currentDate).slice(0, 3);
  if (!candidates.length) return '';
  const rows = candidates.map(item => `<a class="recent-record" href="${rel(item.url)}">
    <time datetime="${escapeHtml(item.date)}">${escapeHtml(formatTradingDate(item.date))}</time>
    <strong>${escapeHtml(item.display_symbol || displaySymbolFrom(item.symbol))}</strong>
    <span>${escapeHtml(item.plain_direction || prettyState(item.direction_bucket))}</span>
    <em>${escapeHtml(recordHorizon(item))}</em>
  </a>`).join('');
  return `<section class="recent-public-records" aria-labelledby="recent-records-title">
    <div class="recent-records-heading">
      <div><p class="eyebrow">Public signal memory</p><h2 id="recent-records-title">Recent public records</h2></div>
      <a class="text-link" href="${rel('/archive/')}">View full archive →</a>
    </div>
    <div class="recent-record-list">${rows}</div>
  </section>`;
}

export function homePage(payload, { canonicalPath = '/today/', recentItems = [] } = {}) {
  return `<style data-home-styles>${HOME_CSS.replaceAll('</style', '<\/style')}</style>
  <main class="site-shell page-home" data-page="signal">
    ${homeHeader(SITE.signalName)}
    ${productHero(payload, canonicalPath)}
    <section class="signal-product-grid">
      <div class="share-card-stage">
        <div class="share-card-toolbar">
          <span>Screenshot-ready public card</span>
          <div><button class="icon-button" type="button" data-share aria-label="Share this public signal">Share</button><button class="icon-button" type="button" data-copy aria-label="Copy this public signal link">Copy link</button></div>
        </div>
        ${shareCard(payload)}
        <p class="small-note share-boundary">Copyright © EGX Research. All rights reserved.</p>
        <p class="small-note" data-copy-status aria-live="polite"></p>
      </div>
      ${conversionRail(payload)}
    </section>
    ${recentRecords(recentItems, payload.trading_date)}
    ${megaFooter()}
  </main>`;
}
