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

function sameText(a, b) {
  const normalise = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  return normalise(a) === normalise(b);
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
  const stockSymbol = asset.symbol || signal.stock_symbol || legacySignal.stock_symbol || 'EGX signal';
  const displaySymbol = asset.display_symbol || displaySymbolFrom(stockSymbol);
  const directionBucket = signal.direction_bucket || legacySignal.direction_bucket;
  const plainDirection = signal.plain_direction || prettyState(directionBucket);
  const rank = signal.rank_within_horizon ?? legacySignal.rank_within_horizon;
  const rankDisplay = hasValue(rank) ? `#${rank}` : (signal.rank_label || legacySignal.rank_label || 'Selected');
  const investorRead = cleanInvestorRead(publicCopy.investor_read);
  const supportingRead = investorRead && !sameText(investorRead, plainDirection) ? investorRead : '';
  const identity = compact([asset.company_name, asset.sector]).join(' · ') || stockSymbol;
  return {
    signal,
    asset,
    market,
    publishing,
    modelState,
    funnel,
    stockSymbol,
    displaySymbol,
    symbolClass: symbolSizeClass(displaySymbol),
    identity,
    directionBucket,
    tone: directionTone(directionBucket),
    plainDirection,
    supportingRead,
    rankDisplay,
    horizon: horizonText(signal.horizon || legacySignal.horizon, signal.horizon_label),
    tradingDate: formatTradingDate(payload.trading_date),
    published: formatPublished(payload.published_at || publishing.published_at_utc),
    publishedAfter: publishing.published_after || 'After EGX close',
    publicPosition: funnel.public_position || 'one public signal from the daily EGX /Alpha ranking',
    fullProductHint: funnel.full_product_hint || 'The complete view includes the full ranked list, model context and signal history.'
  };
}

function mailtoLink() {
  return `mailto:${SITE.accessEmail}?subject=${encodeURIComponent('EGX Alpha complete ranked view request')}`;
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

function productHero(canonicalPath) {
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
  return `<section class="product-hero">
    <div>
      <p class="eyebrow">One public signal from a market-wide EGX ranking</p>
      <h1>See what the ranking surfaced after the EGX close.</h1>
      <p class="lede">EGX /Alpha monitors the market, compares eligible domestic shares and publishes one bounded result for public follow-up. The complete ranked view remains private.</p>
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
    metric('Latest close', formatNumber(market.latest_close, 4), 'EGP / share'),
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
  const supporting = parts.supportingRead ? `<p>${escapeHtml(parts.supportingRead)}</p>` : '';
  const published = compact([parts.publishedAfter, parts.published]).join(' · ');
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
      <span class="share-section-label">Model view</span>
      <strong>${escapeHtml(parts.plainDirection)}</strong>
      ${supporting}
    </section>

    <section class="share-decision" aria-label="Public signal decision frame">
      <div><span>Public position</span><strong>${escapeHtml(parts.rankDisplay)}</strong></div>
      <div><span>Evaluation window</span><strong>${escapeHtml(parts.horizon)}</strong></div>
      <div><span>Publication</span><strong>${escapeHtml(parts.publishedAfter)}</strong>${published && parts.published ? `<em>${escapeHtml(parts.published)}</em>` : ''}</div>
    </section>

    ${marketMetrics(parts)}

    <footer class="share-card-footer">
      <p>${escapeHtml(parts.publicPosition)}</p>
      <strong>EGXRESEARCH.COM</strong>
    </footer>
  </article>`;
}

function conversionRail(payload) {
  const parts = payloadParts(payload);
  const modelNote = hasValue(parts.modelState.public_note)
    ? `<div class="rail-state"><span>${escapeHtml(parts.modelState.public_label || 'Public model state')}</span><p>${escapeHtml(parts.modelState.public_note)}</p></div>`
    : '';
  return `<aside class="conversion-rail" aria-label="Full access information">
    <p class="eyebrow">Beyond the public card</p>
    <h2>One result is public. The wider ranked market view is not.</h2>
    <p class="rail-lede">${escapeHtml(parts.fullProductHint)}</p>
    <div class="rail-includes" aria-label="Full view includes">
      <div><strong>Complete daily ranking</strong><span>See the broader cross-market ordering, not one selected result.</span></div>
      <div><strong>Model context</strong><span>Follow the research state around each published view.</span></div>
      <div><strong>Signal history</strong><span>Review dated records instead of relying on disappearing tips.</span></div>
    </div>
    ${modelNote}
    <a class="button button-primary rail-cta" href="${mailtoLink()}">Request the complete ranked view</a>
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
    ${productHero(canonicalPath)}
    <section class="signal-product-grid">
      <div class="share-card-stage">
        <div class="share-card-toolbar">
          <span>Screenshot-ready public card</span>
          <div><button class="icon-button" type="button" data-share aria-label="Share this public signal">Share</button><button class="icon-button" type="button" data-copy aria-label="Copy this public signal link">Copy link</button></div>
        </div>
        ${shareCard(payload)}
        <p class="small-note share-boundary">Research only. No buy, sell or hold instruction.</p>
        <p class="small-note" data-copy-status aria-live="polite"></p>
      </div>
      ${conversionRail(payload)}
    </section>
    ${recentRecords(recentItems, payload.trading_date)}
    ${megaFooter()}
  </main>`;
}
