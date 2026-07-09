export const SITE = {
  domain: 'EGXResearch',
  signalName: 'EGX /Alpha signal',
  mindName: 'EGX /Alpha Mind',
  accessEmail: 'access@egxresearch.com',
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
    source_healthy: 'Verified source',
    source_degraded: 'Partial source',
    source_unreliable: 'Source caution',
    live_predictions_written: 'Generated',
    live_observation_completed: 'Observation complete',
    above_recent_baseline: 'Above baseline',
    near_recent_baseline: 'Near baseline',
    below_recent_baseline: 'Below baseline',
    core_liquid: 'Core liquid'
  };
  return map[value] || String(value || 'Unavailable').replaceAll('_', ' ');
}

function directionTone(value) {
  if (value === 'positive_model_signal') return 'tone-positive';
  if (value === 'negative_model_signal') return 'tone-negative';
  return 'tone-neutral';
}

function horizonText(value, label) {
  const raw = String(value ?? '').trim();
  if (/^\d+(\.0+)?$/.test(raw)) return `Next ${parseInt(raw, 10)} EGX trading sessions`;
  const fromLabel = String(label ?? '').trim();
  const match = fromLabel.match(/(\d+)/);
  if (match) return `Next ${parseInt(match[1], 10)} EGX trading sessions`;
  return fromLabel || raw || 'Selected EGX trading horizon';
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

function displaySymbolFrom(symbol) {
  const text = String(symbol || '').trim();
  if (!text) return 'EGX';
  return text.includes(':') ? text.split(':').pop() : text;
}

function humanLabel(value) {
  if (!hasValue(value)) return null;
  return prettyState(value);
}

function shortHash(value) {
  const text = String(value || '').trim();
  if (!text) return null;
  const clean = text.replace(/^sha256:/, '');
  return clean.length > 14 ? `${clean.slice(0, 8)}…${clean.slice(-6)}` : clean;
}

function mailtoLink(subject = 'EGX Alpha early access request') {
  return `mailto:${SITE.accessEmail}?subject=${encodeURIComponent(subject)}`;
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
  const directionBucket = signal.direction_bucket || legacySignal.direction_bucket;
  const plainDirection = signal.plain_direction || prettyState(directionBucket);
  const rank = signal.rank_within_horizon || legacySignal.rank_within_horizon;
  const rankLabel = signal.rank_label || legacySignal.rank_label || (rank ? `Public rank #${rank}` : 'Public signal');
  const investorRead = publicCopy.investor_read || `${plainDirection}.`;
  const signalSentence = investorRead.replace(/\s*This is a public market-intelligence signal to follow, not a trade instruction\.?$/i, '').trim();
  return {
    signal,
    asset,
    market,
    modelState,
    publishing,
    context,
    stockSymbol,
    displaySymbol,
    directionBucket,
    plainDirection,
    rank,
    rankLabel,
    horizon: horizonText(signal.horizon || legacySignal.horizon, signal.horizon_label),
    signalSentence: signalSentence || plainDirection,
    headline: publicCopy.headline || `Today’s EGX /Alpha public signal: ${displaySymbol}`,
    summary: publicCopy.one_line_summary || `${rankLabel} for the selected horizon.`
  };
}

export function rel(rootRelative) {
  const base = SITE.basePath.replace(/\/$/, '');
  const path = String(rootRelative || '/').startsWith('/') ? rootRelative : `/${rootRelative}`;
  return `${base}${path}`;
}

export function abs(rootRelative) {
  if (!SITE.siteUrl) return rel(rootRelative);
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
      <a href="${rel('/methodology/')}">Methodology</a>
      <button class="button theme-toggle" type="button" data-theme-toggle aria-label="Toggle light and dark theme" aria-pressed="false">
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
      <a class="button button-primary footer-cta" href="${mailtoLink()}">Request early access</a>
    </section>
    <section>
      <h3>Explore</h3>
      <nav class="footer-links" aria-label="Explore links">
        <a href="${rel('/today/')}">Today</a>
        <a href="${rel('/archive/')}">Archive</a>
        <a href="${rel('/search/')}">Search</a>
        <a href="${rel('/methodology/')}">Methodology</a>
      </nav>
    </section>
    <section class="footer-disclaimer">
      <h3>Research boundary</h3>
      <p class="small-note">Research-only. Not personalised investment advice. No buy/sell/hold instruction.</p>
      <p class="small-note legal-note">© EGX Research LLP. IP management rights and disclaimer administration are managed by KNOWDYN LTD (UK).</p>
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
    metricTile('Traded value', formatMoney(market.traded_value_egp), humanLabel(market.value_traded_status)),
    metricTile('Volume', formatCompactNumber(market.volume, 2), 'shares'),
    metricTile('Liquidity', humanLabel(market.liquidity_tier || parts.asset.liquidity_tier)),
    metricTile('Sector', parts.asset.sector)
  ]).join('');
}

function signalFacts(parts, payload, published) {
  const hash = shortHash(payload.integrity?.public_wire_hash);
  return compact([
    `<div><span>Rank</span><strong>${escapeHtml(parts.rankLabel)}</strong></div>`,
    `<div><span>Window</span><strong>${escapeHtml(parts.horizon)}</strong><em>Not an intraday instruction.</em></div>`,
    `<div><span>Published</span><strong>${escapeHtml(parts.publishing.published_after || 'After EGX close')}</strong><em>${escapeHtml(published)}</em></div>`,
    hash ? `<div><span>Public wire</span><strong>Verified</strong><em>${escapeHtml(hash)}</em></div>` : ''
  ]).join('');
}

function signalCardShell(parts, payload, published) {
  const metrics = signalMetricTiles(parts);
  const company = parts.asset.company_name;
  const sector = parts.asset.sector;
  const subtitle = compact([company, sector]).join(' • ') || parts.stockSymbol || 'EGX market signal';

  return `<article class="signal-hero-card" id="today-signal" aria-label="Today’s EGX Alpha signal">
    <div class="signal-hero-head">
      <div>
        <p class="eyebrow">Today’s public signal</p>
        <div class="symbol" title="${escapeHtml(parts.stockSymbol)}">${escapeHtml(parts.displaySymbol)}</div>
        <p class="symbol-subtitle">${escapeHtml(subtitle)}</p>
      </div>
      <div class="signal-tools" aria-label="Signal actions">
        <span class="date-chip">${escapeHtml(payload.trading_date)}</span>
        <button class="icon-button" type="button" data-share aria-label="Share today’s public signal">Share</button>
        <button class="icon-button" type="button" data-copy aria-label="Copy public signal link">Copy</button>
      </div>
    </div>
    <div class="signal-band ${directionTone(parts.directionBucket)}">
      <span>Signal</span>
      <strong>${escapeHtml(parts.signalSentence)}</strong>
    </div>
    <div class="signal-metrics">${metrics || `<p class="small-note">Market context appears when the public wire includes price and liquidity fields.</p>`}</div>
    <div class="signal-facts">${signalFacts(parts, payload, published)}</div>
    <p class="small-note boundary-line">Research-only. Not personalised investment advice. No buy/sell/hold instruction.</p>
    <p class="small-note" data-copy-status aria-live="polite"></p>
  </article>`;
}

function introPanel(parts) {
  return `<article class="mind-hero-card">
    <p class="eyebrow">${escapeHtml(SITE.mindName)}</p>
    <h1>One public signal from the EGX ranking engine.</h1>
    <p class="lede">A compact daily view for following one bounded public EGX /Alpha signal after market close.</p>
    <div class="mind-summary">
      <div><span>Today</span><strong>${escapeHtml(parts.displaySymbol)}</strong></div>
      <div><span>Signal</span><strong>${escapeHtml(parts.plainDirection)}</strong></div>
      <div><span>Window</span><strong>${escapeHtml(parts.horizon)}</strong></div>
    </div>
    <div class="hero-actions">
      <a class="button button-primary" href="${mailtoLink()}">Request early access</a>
      <a class="button" href="${rel('/methodology/')}">Methodology</a>
    </div>
  </article>`;
}

function archiveTeaser() {
  return `<section class="compact-strip" aria-label="Public signal tools">
    <a class="strip-card" href="${rel('/archive/')}">
      <span>Archive</span>
      <strong>Dated public signal trail</strong>
    </a>
    <a class="strip-card" href="${rel('/search/')}">
      <span>Search</span>
      <strong>Find by symbol, sector, date, or direction</strong>
    </a>
    <a class="strip-card" href="${rel('/methodology/')}">
      <span>Methodology</span>
      <strong>Public-wire publication discipline</strong>
    </a>
  </section>`;
}

export function signalCard(payload) {
  const parts = payloadParts(payload);
  const published = formatPublished(payload.published_at || parts.publishing.published_at_utc);
  return `<main class="site-shell page-home" data-page="signal">
  ${siteHeader(SITE.signalName)}

  <section class="v3-hero">
    ${introPanel(parts)}
    ${signalCardShell(parts, payload, published)}
  </section>

  ${archiveTeaser()}
  ${megaFooter()}
</main>`;
}

function whitePaperSection(label, title, body) {
  return `<section class="whitepaper-section">
    <p class="eyebrow">${escapeHtml(label)}</p>
    <h2>${escapeHtml(title)}</h2>
    <p>${escapeHtml(body)}</p>
  </section>`;
}

export function methodologyPage() {
  return `<main class="site-shell page-methodology" data-page="methodology">
    ${siteHeader('Methodology')}
    <article class="whitepaper">
      <header class="whitepaper-header">
        <div>
          <p class="eyebrow">Investor white paper</p>
          <h1>EGX /Alpha Methodology</h1>
          <p class="lede">A public-facing explanation of how EGXResearch publishes one bounded daily signal without exposing the private intelligence layer.</p>
        </div>
        <div class="whitepaper-actions" aria-label="White paper actions">
          <button class="icon-button" type="button" data-share aria-label="Share methodology page">Share</button>
          <button class="icon-button" type="button" data-print aria-label="Print methodology page">Print</button>
        </div>
      </header>

      <section class="process-strip" aria-label="Publication workflow">
        <div><span>01</span><strong>Observe</strong></div>
        <div><span>02</span><strong>Time-lock</strong></div>
        <div><span>03</span><strong>Rank</strong></div>
        <div><span>04</span><strong>Publish public wire</strong></div>
        <div><span>05</span><strong>Archive</strong></div>
      </section>

      <div class="whitepaper-grid">
        ${whitePaperSection('01', 'Executive summary', 'EGX /Alpha is a post-close market-intelligence publication layer for the Egyptian Exchange. The public website shows one bounded public signal, its market context, and a dated record for follow-up.')}
        ${whitePaperSection('02', 'Public-wire philosophy', 'The public website receives only a compact publication wire. It is designed to be useful enough for market follow-up while keeping the private research system outside the public repository.')}
        ${whitePaperSection('03', 'Post-close publication workflow', 'The daily public page is generated after EGX close, using Cairo-time publication context and static pages that can be shared, archived, and revisited.')}
        ${whitePaperSection('04', 'Availability-aware market context', 'The public card can show symbol, company, sector, liquidity, close, traded value, volume, publication timing, and integrity metadata when those fields are present in the public wire.')}
        ${whitePaperSection('05', 'Model-ranked signal layer', 'The private engine produces a model-ranked research view. The public site receives one selected public signal, its horizon, and a plain-language direction label.')}
        ${whitePaperSection('06', 'Public website receives', 'The public repository can render the selected asset, public rank, signal direction, horizon, market snapshot, publication context, public copy, integrity hash, and archive index.')}
        ${whitePaperSection('07', 'Public website never receives', 'The public repository does not receive paid subscriber material, creator-only material, raw model output, private research memory, tokens, source files, or operational internals.')}
        ${whitePaperSection('08', 'Research-only boundary', 'The public material is for information, research, and market follow-up only. It is not personalised investment advice and does not provide buy, sell, or hold instructions.')}
        ${whitePaperSection('09', 'Archive and follow-up design', 'Every public signal becomes a dated static page. The archive and search pages make the public trail reviewable without exposing the private intelligence layer.')}
      </div>

      <section class="rights-card">
        <p class="eyebrow">Rights and disclaimer</p>
        <p>© EGX Research LLP. All rights reserved.</p>
        <p>EGX /Alpha, EGXResearch, the public signal publication layer, public-wire design, methodology descriptions, visual presentation, and related materials are copyright EGX Research LLP unless otherwise stated.</p>
        <p>IP management rights, technical governance, research commercialisation support, and disclaimer administration are managed by KNOWDYN LTD (UK).</p>
        <p>Research-only. Not personalised investment advice. No buy, sell, or hold instruction. Public materials are provided for information, research, and market-follow-up purposes only.</p>
        <a class="button button-primary" href="${mailtoLink()}">Request early access</a>
      </section>
    </article>
    ${megaFooter()}
  </main>`;
}
