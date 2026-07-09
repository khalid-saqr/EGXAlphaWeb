export const SITE = {
  domain: 'EGXResearch',
  signalName: 'EGX /Alpha signal',
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

export function prettyState(value) {
  const map = {
    positive_model_signal: 'Positive model signal',
    negative_model_signal: 'Negative model signal',
    neutral_model_signal: 'Neutral model signal',
    weak_but_usable: 'Early / usable',
    stable_positive: 'Stable positive',
    insufficient_evidence: 'Early live tracking',
    source_healthy: 'Healthy',
    source_degraded: 'Degraded',
    source_unreliable: 'Unreliable',
    live_predictions_written: 'Generated today',
    live_observation_completed: 'Fresh observation',
    live_prediction_skipped: 'Prediction skipped'
  };
  return map[value] || String(value || 'Unknown').replaceAll('_', ' ');
}

function confidenceCopy(value) {
  const map = {
    insufficient_evidence: 'Early live tracking',
    weak_but_usable: 'Usable research signal',
    stable_positive: 'Stable positive evidence',
    decaying: 'Under review',
    regime_broken: 'Regime warning',
    source_unreliable: 'Source caution'
  };
  return map[value] || prettyState(value);
}

function sourceCopy(value) {
  const map = {
    source_healthy: 'Fresh source check',
    source_degraded: 'Partial source check',
    source_unreliable: 'Source caution',
    live_observation_completed: 'Fresh observation'
  };
  return map[value] || prettyState(value);
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
  if (!value) return 'After close';
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
        <span data-theme-label>Dark</span>
      </button>
    </nav>
  </header>`;
}

export function megaFooter() {
  return `<footer class="mega-footer" aria-label="Site footer">
    <section class="footer-branding">
      <p class="eyebrow">EGXResearch</p>
      <h2>EGX /Alpha signal</h2>
      <p class="small-note">Every EGX trading day, EGX /Alpha publishes one public model-ranked signal as a preview of the wider research workflow.</p>
    </section>
    <section>
      <h3>Free preview</h3>
      <p class="small-note">One public signal, one selected horizon, one daily archive page.</p>
    </section>
    <section>
      <h3>Full report</h3>
      <p class="small-note">The full ranked list, all model rows, confidence context, and tracking history remain reserved for the paid product layer.</p>
    </section>
    <section>
      <h3>Research boundary</h3>
      <p class="small-note">Research-only public signal. Not personalised investment advice and not an instruction to buy, sell, or hold any security.</p>
    </section>
  </footer>`;
}

function lockedRankingPreview(signal) {
  const currentSymbol = escapeHtml(signal.stock_symbol);
  return `<article class="card ranking-card" aria-label="Model ranking preview">
    <div class="section-head">
      <p class="eyebrow">Model ranking preview</p>
      <span class="badge badge-soft">Free unlock: #3 only</span>
    </div>
    <div class="ranking-list">
      <div class="rank-row locked"><span>#1</span><strong>Locked</strong><em>Subscribers only</em></div>
      <div class="rank-row locked"><span>#2</span><strong>Locked</strong><em>Subscribers only</em></div>
      <div class="rank-row unlocked"><span>#3</span><strong>${currentSymbol}</strong><em>Today’s public signal</em></div>
      <div class="rank-row locked"><span>#4</span><strong>Locked</strong><em>Subscribers only</em></div>
      <div class="rank-row locked"><span>#5</span><strong>Locked</strong><em>Subscribers only</em></div>
    </div>
    <p class="small-note">The public page reveals only one rank. The full daily list is intentionally withheld for subscribers.</p>
  </article>`;
}

export function signalCard(payload) {
  const signal = payload.signal || {};
  const context = payload.context || {};
  const published = formatPublished(payload.published_at);
  const horizon = horizonLabel(signal.horizon);
  const direction = prettyState(signal.direction_bucket);
  const directionClass = directionTone(signal.direction_bucket);
  const modelStage = confidenceCopy(context.trust_state);
  const sourceState = sourceCopy(context.source_quality_status || signal.source_freshness_status);
  const status = prettyState(context.prediction_status);
  return `<main class="site-shell page-home" data-page="signal">
  ${siteHeader(SITE.signalName)}

  <section class="hero-stage">
    <article class="card hero-card hero-card--sales">
      <p class="eyebrow">Daily EGX public signal</p>
      <h1>Today’s EGX /Alpha public signal</h1>
      <p class="lede">One stock from today’s model-ranked EGX watchlist. The public preview reveals rank #3 only; the full ranked intelligence is reserved for the paid report.</p>
      <div class="hero-actions">
        <a class="button button-primary" href="#today-signal">View today’s signal</a>
        <a class="button" href="${rel('/archive/')}">See archive</a>
        <button class="button button-muted" type="button" disabled>Full list coming soon</button>
      </div>
      <div class="meta-row">
        <span class="badge badge-strong">${escapeHtml(payload.trading_date)}</span>
        <span class="badge">${escapeHtml(status)}</span>
        <span class="badge">After market close</span>
      </div>
    </article>

    <article class="card signal-card signal-card--premium" id="today-signal" aria-label="Today unlocked public signal card">
      <p class="eyebrow">Unlocked today</p>
      <div class="symbol" title="${escapeHtml(signal.stock_symbol)}">${escapeHtml(signal.stock_symbol)}</div>
      <div class="rank-line">Rank #${escapeHtml(signal.rank_within_horizon)} public signal</div>
      <dl class="signal-grid">
        <div><dt>Horizon</dt><dd>${escapeHtml(horizon)}</dd></div>
        <div><dt>Rank</dt><dd>#${escapeHtml(signal.rank_within_horizon)}</dd></div>
        <div><dt>Direction</dt><dd class="${directionClass}">${escapeHtml(direction)}</dd></div>
        <div><dt>Source</dt><dd>${escapeHtml(sourceCopy(signal.source_freshness_status))}</dd></div>
      </dl>
    </article>
  </section>

  <section class="market-strip" aria-label="Signal status summary">
    <div><span>Signal type</span><strong>Public preview</strong></div>
    <div><span>Model stage</span><strong>${escapeHtml(modelStage)}</strong></div>
    <div><span>Data source</span><strong>${escapeHtml(sourceState)}</strong></div>
    <div><span>Published</span><strong>${escapeHtml(published)}</strong></div>
  </section>

  <section class="funnel-grid">
    ${lockedRankingPreview(signal)}
    <article class="card explanation-card">
      <p class="eyebrow">Why rank #3?</p>
      <h2>The free signal is only a teaser.</h2>
      <p>EGX /Alpha ranks the market every trading day. The public page reveals one selected signal so investors can follow the system without exposing the full ranking table.</p>
      <ul class="feature-list">
        <li><strong>Free:</strong> one public signal and archive.</li>
        <li><strong>Subscriber:</strong> full daily ranks, model scores, horizons, and tracking.</li>
        <li><strong>Creator:</strong> full system diagnostics and internal state.</li>
      </ul>
    </article>
  </section>

  <section class="card-grid card-grid--investor">
    <article class="card context-card">
      <p class="eyebrow">Investor context</p>
      <div class="status-stack">
        <span class="status-pill"><b>Model stage</b>${escapeHtml(modelStage)}</span>
        <span class="status-pill"><b>Data source</b>${escapeHtml(sourceState)}</span>
        <span class="status-pill"><b>Next habit</b>Check after each EGX close</span>
      </div>
      <p class="small-note">Early live tracking means the system is still collecting realised outcomes. Signals are published for research observation, not as trade instructions.</p>
    </article>
    <article class="card archive-card">
      <p class="eyebrow">Daily habit</p>
      <h2>Build the archive. Watch the pattern.</h2>
      <p>Every new public signal becomes a permanent dated page. Search by symbol or date to follow what the public model preview has been surfacing.</p>
      <div class="button-row button-row-wide">
        <a class="button" href="${rel('/archive/')}">Open archive</a>
        <a class="button" href="${rel('/search/')}">Search signals</a>
      </div>
    </article>
    <article class="card action-card share-card">
      <p class="eyebrow">Share today’s signal</p>
      <h2>Share the public card</h2>
      <p>Copy the daily page URL or share it with investors watching EGX today.</p>
      <div class="button-row button-row-wide">
        <button class="button button-primary" data-copy>Copy link</button>
        <button class="button" data-share>Native share</button>
        <a class="button" data-share-link="linkedin" href="#">LinkedIn</a>
        <a class="button" data-share-link="facebook" href="#">Facebook</a>
      </div>
      <p class="small-note" data-copy-status aria-live="polite">The public card renders when the page is opened.</p>
    </article>
  </section>

  <section class="card conversion-card">
    <div>
      <p class="eyebrow">Coming product layer</p>
      <h2>Free signal today. Full ranked list later.</h2>
      <p>EGX /Alpha is being shaped as a daily EGX research intelligence layer: public teaser, paid ranked report, and private creator diagnostics.</p>
    </div>
    <div class="conversion-columns" aria-label="Product tiers">
      <div><b>Free</b><span>One public signal</span></div>
      <div><b>Paid</b><span>Full daily ranked list</span></div>
      <div><b>Creator</b><span>Full system state</span></div>
    </div>
  </section>

  <section class="card disclaimer-card disclaimer-card--wide">
    <p class="eyebrow">Research boundary</p>
    <p>Research-only public signal. This is not personalised investment advice and is not an instruction to buy, sell, or hold any security.</p>
  </section>
  ${megaFooter()}
</main>`;
}
