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

function isPresent(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function compact(list) {
  return list.filter(Boolean);
}

export function prettyState(value) {
  const map = {
    positive_model_signal: 'Constructive model signal',
    negative_model_signal: 'Caution signal',
    neutral_model_signal: 'Neutral watch signal',
    weak_but_usable: 'Live tracking active',
    stable_positive: 'Live tracking stable',
    insufficient_evidence: 'Early live tracking',
    source_healthy: 'Healthy data check',
    source_degraded: 'Partial data check',
    source_unreliable: 'Data-source caution',
    live_predictions_written: 'Generated after close',
    live_observation_completed: 'Fresh post-close data',
    live_prediction_skipped: 'Signal skipped'
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
  if (!value) return 'After EGX close';
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
  if (!isPresent(value)) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return new Intl.NumberFormat('en-GB', { maximumFractionDigits: digits }).format(number);
}

function formatMoney(value) {
  const formatted = formatNumber(value, 0);
  return formatted ? `EGP ${formatted}` : null;
}

function formatPct(value) {
  if (!isPresent(value)) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  const sign = number > 0 ? '+' : '';
  return `${sign}${number.toFixed(2)}%`;
}

function displaySymbolFrom(symbol) {
  const text = String(symbol || '').trim();
  if (!text) return 'EGX signal';
  return text.includes(':') ? text.split(':').pop() : text;
}

function normaliseHumanLabel(value) {
  if (!isPresent(value)) return null;
  return String(value).replaceAll('_', ' ');
}

function dataQualityLabel(value) {
  const map = {
    live_observation_completed: 'Fresh post-close data',
    source_healthy: 'Healthy data check',
    source_degraded: 'Partial data check',
    source_unreliable: 'Data-source caution',
    above_recent_baseline: 'Above recent value baseline',
    near_recent_baseline: 'Near recent value baseline',
    below_recent_baseline: 'Below recent value baseline'
  };
  return map[value] || normaliseHumanLabel(value) || 'Data status unavailable';
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
  const modelNote = modelState.public_note || 'The public signal is generated from the latest EGX /Alpha post-close scan.';
  const dataLabel = dataQualityLabel(signal.source_freshness_status || legacySignal.source_freshness_status || context.source_quality_status);
  const headline = publicCopy.headline || `Today’s EGX /Alpha public signal: ${displaySymbol}`;
  const summary = publicCopy.one_line_summary || `Public rank #${rank} for the ${horizon} after the latest EGX /Alpha post-close scan.`;
  const investorRead = publicCopy.investor_read || `${plainDirection}. Research-only market intelligence, not a trade instruction.`;
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
    dataLabel,
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
  <meta name="theme-color" content="#07111f">
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
      <p class="small-note">Daily EGX market intelligence built around post-close observation, model-ranked signals, and public follow-up.</p>
    </section>
    <section>
      <h3>Today</h3>
      <nav class="footer-links" aria-label="Today links">
        <a href="${rel('/today/')}">Public signal</a>
        <a href="${rel('/archive/')}">Signal archive</a>
      </nav>
    </section>
    <section>
      <h3>Research use</h3>
      <p class="small-note">The public signal is a market-intelligence observation, not a personalised recommendation or execution instruction.</p>
    </section>
    <section>
      <h3>Follow-up</h3>
      <nav class="footer-links" aria-label="Follow-up links">
        <a href="${rel('/search/')}">Search public signals</a>
        <a href="${rel('/archive/')}">Review previous dates</a>
      </nav>
    </section>
  </footer>`;
}

function metricCard(label, value, note = null, className = '') {
  if (!isPresent(value)) return '';
  return `<div class="metric-card ${escapeHtml(className)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${note ? `<em>${escapeHtml(note)}</em>` : ''}</div>`;
}

function marketSnapshot(parts) {
  const market = parts.market;
  const metrics = compact([
    metricCard('Latest close', formatNumber(market.latest_close, 4), 'EGP/share'),
    metricCard('Daily move', formatPct(market.daily_change_pct), 'vs previous close', Number(market.daily_change_pct) > 0 ? 'tone-box-positive' : Number(market.daily_change_pct) < 0 ? 'tone-box-negative' : 'tone-box-neutral'),
    metricCard('Traded value', formatMoney(market.traded_value_egp), dataQualityLabel(market.value_traded_status)),
    metricCard('Volume', formatNumber(market.volume, 0), 'shares'),
    metricCard('Liquidity', normaliseHumanLabel(market.liquidity_tier || parts.asset.liquidity_tier), null),
    metricCard('Sector', parts.asset.sector || market.market_structure_sector, null)
  ]).join('');
  if (!metrics) {
    return `<article class="card market-card">
      <p class="eyebrow">Market snapshot</p>
      <h2>Public-safe market context will appear here when available.</h2>
      <p class="small-note">The card never invents missing price, volume, or sector information.</p>
    </article>`;
  }
  return `<article class="card market-card">
    <div class="section-head">
      <div><p class="eyebrow">Market snapshot</p><h2>Public-safe context for today’s signal</h2></div>
      <span class="badge">${escapeHtml(parts.dataLabel)}</span>
    </div>
    <div class="metric-grid">${metrics}</div>
  </article>`;
}

function alphaMindPanel() {
  return `<article class="card mind-card">
    <p class="eyebrow">EGX /Alpha Mind</p>
    <h2>A daily market-intelligence engine for the Egyptian Exchange.</h2>
    <p>EGX /Alpha Mind converts post-close EGX observations into a model-ranked signal view. The public page shows one daily signal with enough context to follow the market, while preserving the full ranked intelligence layer.</p>
    <div class="mind-points" aria-label="EGX Alpha Mind pillars">
      <span>Post-close scan</span>
      <span>Model-ranked signal</span>
      <span>Public archive</span>
    </div>
  </article>`;
}

function rankedContext(parts) {
  return `<article class="card ranking-card" aria-label="Daily ranking context">
    <div class="section-head">
      <div><p class="eyebrow">Daily ranking context</p><h2>Today’s public window into the model-ranked EGX scan</h2></div>
      <span class="badge badge-soft">Rank #${escapeHtml(parts.rank || 3)}</span>
    </div>
    <div class="rank-window">
      <div class="rank-window-row"><span>Selected public signal</span><strong>${escapeHtml(parts.stockSymbol || parts.displaySymbol)}</strong></div>
      <div class="rank-window-row"><span>Horizon</span><strong>${escapeHtml(parts.horizon)}</strong></div>
      <div class="rank-window-row"><span>Signal read</span><strong>${escapeHtml(parts.plainDirection)}</strong></div>
    </div>
    <p class="small-note">The public page shows one daily signal from the EGX /Alpha ranking. Broader ranked views remain outside the public page.</p>
  </article>`;
}

export function signalCard(payload) {
  const parts = payloadParts(payload);
  const published = formatPublished(payload.published_at || parts.publishing.published_at_utc);
  const companyLine = compact([parts.asset.company_name, parts.asset.sector]).join(' • ');
  const directionClass = directionTone(parts.directionBucket);
  return `<main class="site-shell page-home" data-page="signal">
  ${siteHeader(SITE.signalName)}

  <section class="hero-stage">
    <article class="card hero-card hero-card--investor">
      <p class="eyebrow">${escapeHtml(SITE.mindName)}</p>
      <h1>Daily EGX market intelligence after the close.</h1>
      <p class="lede">${escapeHtml(parts.summary)}</p>
      <div class="hero-actions">
        <a class="button button-primary" href="#today-signal">View today’s signal</a>
        <a class="button" href="${rel('/archive/')}">Review archive</a>
        <a class="button" href="${rel('/search/')}">Search signals</a>
      </div>
      <div class="meta-row">
        <span class="badge badge-strong">${escapeHtml(payload.trading_date)}</span>
        <span class="badge">${escapeHtml(parts.modelLabel)}</span>
        <span class="badge">${escapeHtml(published)}</span>
      </div>
    </article>

    <article class="card signal-card signal-card--premium" id="today-signal" aria-label="Today public signal card">
      <div>
        <p class="eyebrow">Today’s public signal</p>
        <div class="symbol" title="${escapeHtml(parts.stockSymbol)}">${escapeHtml(parts.displaySymbol)}</div>
        <div class="symbol-subtitle">${companyLine ? escapeHtml(companyLine) : escapeHtml(parts.stockSymbol)}</div>
      </div>
      <dl class="signal-grid">
        <div><dt>Rank</dt><dd>#${escapeHtml(parts.rank || 3)}</dd></div>
        <div><dt>Horizon</dt><dd>${escapeHtml(parts.horizon)}</dd></div>
        <div><dt>Signal read</dt><dd class="${directionClass}">${escapeHtml(parts.plainDirection)}</dd></div>
        <div><dt>Data check</dt><dd>${escapeHtml(parts.dataLabel)}</dd></div>
      </dl>
    </article>
  </section>

  <section class="insight-strip" aria-label="Signal summary">
    <div><span>Public signal</span><strong>${escapeHtml(parts.stockSymbol || parts.displaySymbol)}</strong></div>
    <div><span>Model state</span><strong>${escapeHtml(parts.modelLabel)}</strong></div>
    <div><span>Direction</span><strong>${escapeHtml(parts.plainDirection)}</strong></div>
    <div><span>Published</span><strong>${escapeHtml(published)}</strong></div>
  </section>

  <section class="funnel-grid">
    ${alphaMindPanel()}
    ${rankedContext(parts)}
  </section>

  ${marketSnapshot(parts)}

  <section class="card-grid card-grid--investor">
    <article class="card context-card">
      <p class="eyebrow">Investor read</p>
      <h2>${escapeHtml(parts.headline)}</h2>
      <p>${escapeHtml(parts.investorRead)}</p>
      <p class="small-note">${escapeHtml(parts.modelNote)}</p>
    </article>
    <article class="card archive-card">
      <p class="eyebrow">Public record</p>
      <h2>Review previous public signals.</h2>
      <p>The archive helps investors compare today’s public signal with earlier public signals by date, symbol, horizon, and direction.</p>
      <div class="button-row button-row-wide">
        <a class="button" href="${rel('/archive/')}">Open archive</a>
        <a class="button" href="${rel('/search/')}">Search archive</a>
      </div>
    </article>
    <article class="card action-card share-card">
      <p class="eyebrow">Share</p>
      <h2>Share today’s public signal</h2>
      <p>Copy the public page URL or share it with investors following the Egyptian Exchange.</p>
      <div class="button-row button-row-wide">
        <button class="button button-primary" data-copy>Copy link</button>
        <button class="button" data-share>Share</button>
        <a class="button" data-share-link="linkedin" href="#">LinkedIn</a>
        <a class="button" data-share-link="facebook" href="#">Facebook</a>
      </div>
      <p class="small-note" data-copy-status aria-live="polite">Public signal page ready to share.</p>
    </article>
  </section>

  <section class="card conversion-card">
    <div>
      <p class="eyebrow">Full intelligence layer</p>
      <h2>The public signal is one view into a broader daily EGX ranking.</h2>
      <p>EGX /Alpha Mind is designed to support a fuller daily intelligence experience with broader rankings, model context, and public signal follow-up as the product layer develops.</p>
    </div>
    <div class="conversion-columns" aria-label="Public product path">
      <div><b>Today</b><span>One public signal</span></div>
      <div><b>Archive</b><span>Previous public signals</span></div>
      <div><b>Next</b><span>Broader intelligence layer</span></div>
    </div>
  </section>

  <section class="card disclaimer-card disclaimer-card--wide">
    <p class="eyebrow">Research boundary</p>
    <p>Research-only public signal. This is not personalised investment advice and is not an instruction to buy, sell, or hold any security.</p>
  </section>
  ${megaFooter()}
</main>`;
}
