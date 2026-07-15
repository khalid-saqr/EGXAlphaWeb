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

function horizonText(value, label) {
  const raw = String(value ?? '').trim();
  if (/^\d+(\.0+)?$/.test(raw)) return `Next ${parseInt(raw, 10)} EGX trading sessions`;
  const fromLabel = String(label ?? '').trim();
  const match = fromLabel.match(/(\d+)/);
  if (match) return `Next ${parseInt(match[1], 10)} EGX trading sessions`;
  return fromLabel || raw || 'Defined EGX trading horizon';
}

function formatPublished(value) {
  if (!value) return 'Cairo time';
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

function directionTone(value) {
  if (value === 'positive_model_signal') return 'tone-positive';
  if (value === 'negative_model_signal') return 'tone-negative';
  return 'tone-neutral';
}

function payloadParts(payload) {
  const signal = payload.public_signal || payload.signal || {};
  const legacySignal = payload.signal || {};
  const asset = payload.asset || {};
  const market = payload.market_snapshot || {};
  const publicCopy = payload.public_copy || {};
  const publishing = payload.publishing_context || {};
  const stockSymbol = asset.symbol || signal.stock_symbol || legacySignal.stock_symbol || 'EGX signal';
  const displaySymbol = asset.display_symbol || displaySymbolFrom(stockSymbol);
  const directionBucket = signal.direction_bucket || legacySignal.direction_bucket;
  const plainDirection = signal.plain_direction || prettyState(directionBucket);
  const rank = signal.rank_within_horizon || legacySignal.rank_within_horizon;
  const rankLabel = signal.rank_label || legacySignal.rank_label || (rank ? `Public rank #${rank}` : 'Selected public signal');
  const investorRead = publicCopy.investor_read || publicCopy.one_line_summary || `${plainDirection}.`;
  const signalSentence = String(investorRead)
    .replace(/\s*This is a public market-intelligence signal to follow, not a trade instruction\.?$/i, '')
    .trim();
  return {
    signal,
    asset,
    market,
    publishing,
    stockSymbol,
    displaySymbol,
    directionBucket,
    plainDirection,
    rankLabel,
    signalSentence: signalSentence || plainDirection,
    horizon: horizonText(signal.horizon || legacySignal.horizon, signal.horizon_label),
    published: formatPublished(payload.published_at || publishing.published_at_utc),
    publishedAfter: publishing.published_after || 'After EGX close'
  };
}

function mailtoLink() {
  return `mailto:${SITE.accessEmail}?subject=${encodeURIComponent('EGX Alpha full ranked access request')}`;
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
      <button class="button theme-toggle theme-icon-button" type="button" data-theme-toggle aria-label="Toggle light and dark theme" aria-pressed="false" title="Switch theme">
        ${bulbIcon()}
      </button>
    </nav>
  </header>`;
}

function proof(index, title, body) {
  return `<div class="value-proof">
    <span class="value-proof-index">${escapeHtml(index)}</span>
    <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></div>
  </div>`;
}

function valuePitch() {
  return `<article class="value-pitch-card">
    <div>
      <p class="eyebrow">EGX /Alpha Mind</p>
      <h1>Turn the EGX close into a ranked market view.</h1>
      <p class="lede">EGX /Alpha monitors the Egyptian Exchange after the close, ranks liquid domestic shares across defined horizons, and publishes one signal you can track rather than a stream of disconnected tips.</p>
    </div>
    <div class="value-proof-grid" aria-label="EGX Alpha value">
      ${proof('01', 'Ranked, not guessed', 'The system compares eligible EGX shares before selecting the bounded public signal.')}
      ${proof('02', 'Time-locked after close', 'The reading is formed after the market observation window has stabilised in Cairo time.')}
      ${proof('03', 'Built to be followed', 'Every public signal receives a dated record so the idea can be revisited rather than forgotten.')}
    </div>
    <div class="value-pitch-actions">
      <a class="button button-primary" href="${mailtoLink()}">Request full ranked access</a>
      <a class="button" href="${rel('/methodology/')}">Read the methodology</a>
    </div>
  </article>`;
}

function marketMetric(label, value, note = '') {
  if (!hasValue(value)) return '';
  return `<div class="market-metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${note ? `<em>${escapeHtml(note)}</em>` : ''}</div>`;
}

function marketContext(parts) {
  const market = parts.market;
  const metrics = compact([
    marketMetric('Close', formatNumber(market.latest_close, 4), 'EGP per share'),
    marketMetric('Traded value', formatCompactNumber(market.traded_value_egp, 1), hasValue(market.traded_value_egp) ? 'EGP' : ''),
    marketMetric('Volume', formatCompactNumber(market.volume, 1), 'shares'),
    marketMetric('Liquidity', prettyState(market.liquidity_tier || parts.asset.liquidity_tier)),
    marketMetric('Sector', parts.asset.sector)
  ]).join('');
  if (!metrics) return '';
  return `<section class="market-context" aria-label="Market context">
    <span class="market-context-title">Market context</span>
    <div class="market-metrics">${metrics}</div>
  </section>`;
}

function decisionCell(label, value, note = '') {
  return `<div class="decision-cell"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${note ? `<em>${escapeHtml(note)}</em>` : ''}</div>`;
}

function investorSignalCard(payload, canonicalPath) {
  const parts = payloadParts(payload);
  const recordLabel = String(canonicalPath || '').startsWith('/archive/') ? 'Public signal record' : 'Today’s public signal';
  const company = compact([parts.asset.company_name, parts.asset.sector]).join(' • ') || parts.stockSymbol;
  return `<article class="investor-signal-card" id="today-signal" aria-label="EGX Alpha public signal">
    <div class="signal-card-top">
      <div class="signal-card-kicker">
        <p class="eyebrow">${escapeHtml(recordLabel)}</p>
        <span class="date-chip">${escapeHtml(payload.trading_date)}</span>
      </div>
      <div class="signal-card-actions" aria-label="Signal actions">
        <button class="icon-button" type="button" data-share aria-label="Share this public signal">Share</button>
        <button class="icon-button" type="button" data-copy aria-label="Copy this public signal link">Copy</button>
      </div>
    </div>

    <section class="signal-identity-grid">
      <div>
        <div class="signal-symbol" title="${escapeHtml(parts.stockSymbol)}">${escapeHtml(parts.displaySymbol)}</div>
        <p class="signal-company">${escapeHtml(company)}</p>
      </div>
      <div class="investor-verdict ${directionTone(parts.directionBucket)}">
        <span>Model view</span>
        <strong>${escapeHtml(parts.plainDirection)}</strong>
        <p>${escapeHtml(parts.signalSentence)}</p>
      </div>
    </section>

    <section class="investor-decision-grid" aria-label="Public signal decision frame">
      ${decisionCell('Public position', parts.rankLabel)}
      ${decisionCell('Evaluation window', parts.horizon)}
      ${decisionCell('Publication', parts.publishedAfter, parts.published)}
    </section>

    ${marketContext(parts)}

    <footer class="signal-card-footer">
      <p class="small-note">Research only. No buy, sell or hold instruction. The public page shows one bounded signal, not the complete ranked market view.</p>
      <a class="button button-primary" href="${mailtoLink()}">Unlock the broader ranked view</a>
      <p class="small-note" data-copy-status aria-live="polite"></p>
    </footer>
  </article>`;
}

export function homePage(payload, { canonicalPath = '/today/' } = {}) {
  return `<style data-home-styles>${HOME_CSS.replaceAll('</style', '<\/style')}</style>
  <main class="site-shell page-home" data-page="signal">
    ${homeHeader(SITE.signalName)}
    <section class="investor-hero">
      ${valuePitch()}
      ${investorSignalCard(payload, canonicalPath)}
    </section>
    ${megaFooter()}
  </main>`;
}
