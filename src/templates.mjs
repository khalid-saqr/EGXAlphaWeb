export const SITE = {
  domain: 'EGXResearch',
  signalName: 'EGX /Alpha signal',
  mindName: 'EGX /Alpha Mind',
  basePath: process.env.EGX_BASE_PATH || '/EGXAlphaWeb',
  siteUrl: process.env.EGX_SITE_URL || (process.env.GITHUB_REPOSITORY_OWNER ? `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io/EGXAlphaWeb` : '')
};

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function compact(items) {
  return items.filter(Boolean);
}

export function prettyState(value) {
  const map = {
    positive_model_signal: 'Constructive',
    negative_model_signal: 'Caution',
    neutral_model_signal: 'Neutral watch',
    weak_but_usable: 'Live tracking',
    stable_positive: 'Stable tracking',
    insufficient_evidence: 'Early tracking',
    source_healthy: 'Healthy data',
    source_degraded: 'Partial data',
    source_unreliable: 'Data caution',
    live_predictions_written: 'Generated',
    live_observation_completed: 'Fresh data',
    above_recent_baseline: 'Above baseline',
    near_recent_baseline: 'Near baseline',
    below_recent_baseline: 'Below baseline'
  };
  return map[value] || String(value || 'Unavailable').replaceAll('_', ' ');
}

function directionTone(value) {
  if (value === 'positive_model_signal') return 'tone-positive';
  if (value === 'negative_model_signal') return 'tone-negative';
  return 'tone-neutral';
}

function horizonLabel(value) {
  const text = String(value ?? '').trim();
  if (!text) return 'Selected horizon';
  if (/^\d+(\.0+)?$/.test(text)) return `${parseInt(text, 10)} sessions`;
  return text.replace(/d$/i, 'D');
}

function formatPublished(value) {
  if (!value) return 'EGX close';
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

function formatNumber(value, digits = 2) {
  if (!hasValue(value)) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: digits }).format(number);
}

function formatCompactNumber(value, digits = 2) {
  if (!hasValue(value)) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  const abs = Math.abs(number);
  if (abs >= 1_000_000_000) return `${(number / 1_000_000_000).toFixed(digits).replace(/\.0+$/, '')}B`;
  if (abs >= 1_000_000) return `${(number / 1_000_000).toFixed(digits).replace(/\.0+$/, '')}M`;
  if (abs >= 1_000) return `${(number / 1_000).toFixed(digits).replace(/\.0+$/, '')}K`;
  return formatNumber(number, digits);
}

function formatMoney(value) {
  const compact = formatCompactNumber(value, 1);
  return compact ? `EGP ${compact}` : null;
}

function formatPct(value) {
  if (!hasValue(value)) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  const sign = number > 0 ? '+' : '';
  return `${sign}${number.toFixed(2)}%`;
}

function displaySymbolFrom(symbol) {
  const text = String(symbol || '').trim();
  if (!text) return 'EGX';
  return text.includes(':') ? text.split(':').pop() : text;
}

function humanLabel(value) {
  if (!hasValue(value)) return null;
  return String(value).replaceAll('_', ' ');
}

function dataLabel(value) {
  return prettyState(value);
}

function payloadParts(payload) {
  const signal = payload.public_signal || payload.signal || {};
  const legacySignal = payload.signal || {};
  const asset = payload.asset || {};
  const market = payload.market_snapshot || {};
  const modelState = payload.model_state || {};
  const publicCopy = payload.public_copy || {};
  const publishing = payload.publishing_context || {};
  const context = payload.context || {};
  const stockSymbol = asset.symbol || signal.stock_symbol || legacySignal.stock_symbol;
  const displaySymbol = asset.display_symbol || displaySymbolFrom(stockSymbol);
  const horizon = signal.horizon_label || horizonLabel(signal.horizon || legacySignal.horizon);
  const directionBucket = signal.direction_bucket || legacySignal.direction_bucket;
  const plainDirection = signal.plain_direction || prettyState(directionBucket);
  const rank = signal.rank_within_horizon || legacySignal.rank_within_horizon;
  const modelLabel = modelState.public_label || prettyState(context.trust_state);
  const modelNote = modelState.public_note || 'Track the signal record over time as live outcomes accumulate.';
  const sourceLabel = dataLabel(signal.source_freshness_status || legacySignal.source_freshness_status || context.source_quality_status);
  const headline = publicCopy.headline || `Today’s EGX /Alpha signal: ${displaySymbol}`;
  const summary = publicCopy.one_line_summary || `Rank #${rank} for the ${horizon}.`;
  const investorRead = publicCopy.investor_read || `${plainDirection}.`;
  return {
    signal,
    asset,
    market,
    modelState,
    publishing,
    context,
    stockSymbol,
    displaySymbol,
    horizon,
    directionBucket,
    plainDirection,
    rank,
    modelLabel,
    modelNote,
    sourceLabel,
    headline,
    summary,
    investorRead
  };
}

export function rel(rootRelative) {
  const base = SITE.basePath.replace(/\/$/, '');
  const path = String(rootRelative || '/').startsWith('/') ? rootRelative : `/${rootRelative}`;
  return `${base}${path}`;
}

export function abs(rootRelative) {
  const relative = rel(rootRelative);
  if (!SITE.siteUrl) return relative;
  return `${SITE.siteUrl.replace(/\/$/, '')}${String(rootRelative || '/').startsWith('/') ? rootRelative : `/${rootRelative}`}`;
}

export function htmlShell({ title, description, canonicalPath, payload, body, pageClass = '' }) {
  const url = abs(canonicalPath);
  const payloadJson = payload ? JSON.stringify(payload).replaceAll('</script', '<\\/script') : '';
  const clientConfig = JSON.stringify({ basePath: SITE.basePath }).replaceAll('</script', '<\\/script');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#08111d">
  <meta name="color-scheme" content="dark light">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(url)}">
  <link rel="manifest" href="${rel('/manifest.webmanifest')}">
  <link rel="stylesheet" href="${rel('/assets/app.css')}">
</head>
<body class="${escapeHtml(pageClass)}">
  <script id="site-config" type="application/json">${clientConfig}</script>
  <script id="beacon-payload" type="application/json">${payloadJson}</script>
  ${body}
  <script src="${rel('/assets/app.js')}" defer></script>
</body>
</html>\n`;
}

export function siteHeader(sectionLabel = SITE.signalName) {
  return `<header class="topbar" aria-label="Site header">
    <a class="brand" href="${rel('/')}">
      <span class="brand-mark" aria-hidden="true">EGX</span>
      <span><strong>${escapeHtml(SITE.domain)}</strong><em>${escapeHtml(sectionLabel)}</em></span>
    </a>
    <nav class="navlinks" aria-label="Primary navigation">
      <a href="${rel('/today/')}">Today</a>
      <a href="${rel('/archive/')}">Archive</a>
      <a href="${rel('/search/')}">Search</a>
      <button class="button theme-toggle" type="button" data-theme-toggle aria-label="Toggle light and dark theme" aria-pressed="false">
        <span class="theme-bulb" aria-hidden="true">💡</span>
        <span data-theme-label>Theme</span>
      </button>
    </nav>
  </header>`;
}

export function megaFooter() {
  return `<footer class="mega-footer" aria-label="Site footer">
    <section class="footer-branding">
      <p class="eyebrow">EGXResearch</p>
      <h2>EGX /Alpha Mind</h2>
      <p class="small-note">Daily ranked intelligence for the Egyptian Exchange.</p>
    </section>
    <section>
      <h3>Explore</h3>
      <nav class="footer-links" aria-label="Explore links">
        <a href="${rel('/today/')}">Today</a>
        <a href="${rel('/archive/')}">Archive</a>
        <a href="${rel('/search/')}">Search</a>
      </nav>
    </section>
    <section class="footer-disclaimer">
      <h3>Research boundary</h3>
      <p class="small-note">Research-only. Not personalised investment advice. No buy/sell/hold instruction.</p>
    </section>
  </footer>`;
}

function metricTile(label, value, note = '', className = '') {
  if (!hasValue(value)) return '';
  return `<div class="metric-tile ${escapeHtml(className)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${note ? `<em>${escapeHtml(note)}</em>` : ''}</div>`;
}

function signalMetricTiles(parts) {
  const market = parts.market;
  return compact([
    metricTile('Close', formatNumber(market.latest_close, 4), 'EGP/share'),
    metricTile('Move', formatPct(market.daily_change_pct), 'vs previous close', Number(market.daily_change_pct) > 0 ? 'tone-box-positive' : Number(market.daily_change_pct) < 0 ? 'tone-box-negative' : ''),
    metricTile('Traded value', formatMoney(market.traded_value_egp), dataLabel(market.value_traded_status)),
    metricTile('Volume', formatCompactNumber(market.volume, 2), 'shares'),
    metricTile('Liquidity', humanLabel(market.liquidity_tier || parts.asset.liquidity_tier), ''),
    metricTile('Sector', parts.asset.sector, '')
  ]).join('');
}

function signalFacts(parts, published) {
  return compact([
    `<div><span>Rank</span><strong>#${escapeHtml(parts.rank || 3)}</strong></div>`,
    `<div><span>Horizon</span><strong>${escapeHtml(parts.horizon)}</strong></div>`,
    `<div><span>Model read</span><strong class="${directionTone(parts.directionBucket)}">${escapeHtml(parts.plainDirection)}</strong></div>`,
    `<div><span>Data</span><strong>${escapeHtml(parts.sourceLabel)}</strong></div>`,
    `<div><span>Model state</span><strong>${escapeHtml(parts.modelLabel)}</strong></div>`,
    `<div><span>Published</span><strong>${escapeHtml(published)}</strong></div>`
  ]).join('');
}

function signalHero(parts, payload, published) {
  const metrics = signalMetricTiles(parts);
  const company = parts.asset.company_name;
  const sector = parts.asset.sector;
  const subtitle = compact([company, sector]).join(' • ') || parts.stockSymbol || 'EGX market signal';

  return `<article class="signal-hero-card" id="today-signal" aria-label="Today’s EGX Alpha signal">
    <div class="signal-hero-head">
      <div>
        <p class="eyebrow">Today’s signal</p>
        <div class="symbol" title="${escapeHtml(parts.stockSymbol)}">${escapeHtml(parts.displaySymbol)}</div>
        <p class="symbol-subtitle">${escapeHtml(subtitle)}</p>
      </div>
      <span class="date-chip">${escapeHtml(payload.trading_date)}</span>
    </div>
    <div class="readout ${directionTone(parts.directionBucket)}">
      <span>Signal read</span>
      <strong>${escapeHtml(parts.plainDirection)}</strong>
    </div>
    <div class="signal-metrics">${metrics || `<p class="small-note">Market context will appear when the daily payload includes price and liquidity fields.</p>`}</div>
    <div class="signal-facts">${signalFacts(parts, published)}</div>
  </article>`;
}

function mindHero(parts) {
  return `<article class="mind-hero-card">
    <p class="eyebrow">${escapeHtml(SITE.mindName)}</p>
    <h1>Market intelligence for the Egyptian Exchange.</h1>
    <p class="lede">A daily model-ranked EGX view based on deep-learning and real-time monitoring</p>
    <div class="mind-summary">
      <div><span>Today</span><strong>${escapeHtml(parts.displaySymbol)}</strong></div>
      <div><span>Read</span><strong>${escapeHtml(parts.plainDirection)}</strong></div>
      <div><span>Horizon</span><strong>${escapeHtml(parts.horizon)}</strong></div>
    </div>
    <div class="hero-actions">
      <a class="button button-primary" href="#today-signal">View signal</a>
      <a class="button" href="${rel('/archive/')}">Archive</a>
      <a class="button" href="${rel('/search/')}">Search</a>
    </div>
  </article>`;
}

function howItWorks() {
  return `<section class="system-strip" aria-label="How EGX Alpha Mind works">
    <article>
      <span>01</span>
      <h2>Scan</h2>
      <p>Read the latest EGX observations from the live pipeline.</p>
    </article>
    <article>
      <span>02</span>
      <h2>Rank</h2>
      <p>Convert market observations into a model-ranked signal view.</p>
    </article>
    <article>
      <span>03</span>
      <h2>Track</h2>
      <p>Keep a dated record so signals can be reviewed over time.</p>
    </article>
  </section>`;
}

function secondaryCards(parts) {
  return `<section class="support-grid">
    <article class="card compact-card">
      <p class="eyebrow">Investor read</p>
      <h2>${escapeHtml(parts.displaySymbol)} in context</h2>
      <p>${escapeHtml(parts.investorRead.replace(/ Research-only\.$/, '.'))}</p>
      <p class="small-note">${escapeHtml(parts.modelNote)}</p>
    </article>
    <article class="card compact-card">
      <p class="eyebrow">Archive</p>
      <h2>Review earlier signals.</h2>
      <p>Compare previous dates by symbol, horizon, direction, and available market context.</p>
      <a class="button button-wide" href="${rel('/archive/')}">Open archive</a>
    </article>
    <article class="card compact-card share-card">
      <p class="eyebrow">Share</p>
      <h2>Share today’s card.</h2>
      <p>Copy the page link or use the native share action.</p>
      <div class="button-row button-row-wide">
        <button class="button button-primary" data-copy>Copy link</button>
        <button class="button" data-share>Share</button>
        <a class="button" data-share-link="linkedin" href="#">LinkedIn</a>
        <a class="button" data-share-link="facebook" href="#">Facebook</a>
      </div>
      <p class="small-note" data-copy-status aria-live="polite"></p>
    </article>
  </section>`;
}

function broaderLayer() {
  return `<section class="card intelligence-card">
    <div>
      <p class="eyebrow">Daily ranking layer</p>
      <h2>One card from a broader model-ranked EGX scan.</h2>
      <p>The site shows the day’s selected signal and keeps the dated record visible. Broader rankings, model context, and extended history belong to the full intelligence layer.</p>
    </div>
    <div class="layer-points">
      <span>Signal</span>
      <span>Market context</span>
      <span>Archive</span>
    </div>
  </section>`;
}

export function signalCard(payload) {
  const parts = payloadParts(payload);
  const published = formatPublished(payload.published_at || parts.publishing.published_at_utc);
  return `<main class="site-shell page-home" data-page="signal">
  ${siteHeader(SITE.signalName)}

  <section class="v3-hero">
    ${mindHero(parts)}
    ${signalHero(parts, payload, published)}
  </section>

  ${howItWorks()}
  ${secondaryCards(parts)}
  ${broaderLayer()}
  ${megaFooter()}
</main>`;
}
