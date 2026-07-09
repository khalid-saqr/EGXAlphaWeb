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
    insufficient_evidence: 'Insufficient evidence',
    source_healthy: 'Healthy',
    source_degraded: 'Degraded',
    source_unreliable: 'Unreliable',
    live_predictions_written: 'Generated today',
    live_observation_completed: 'Fresh observation',
    live_prediction_skipped: 'Prediction skipped'
  };
  return map[value] || String(value || 'Unknown').replaceAll('_', ' ');
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
  <meta name="theme-color" content="#09111f">
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
      <span class="brand-mark">EGX</span>
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
    <section>
      <p class="eyebrow">EGXResearch</p>
      <h2>EGX /Alpha signal</h2>
      <p class="small-note">A limited public preview that publishes only the third-ranked public model signal for the selected horizon.</p>
    </section>
    <section>
      <h3>Explore</h3>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="${rel('/today/')}">Today</a>
        <a href="${rel('/archive/')}">Archive</a>
        <a href="${rel('/search/')}">Search</a>
      </nav>
    </section>
    <section>
      <h3>Research boundary</h3>
      <p class="small-note">Research-only public signal. Not personalised investment advice and not an instruction to buy, sell, or hold any security.</p>
    </section>
  </footer>`;
}

export function signalCard(payload) {
  const signal = payload.signal;
  const context = payload.context || {};
  return `<main class="site-shell" data-page="signal">
  ${siteHeader(SITE.signalName)}

  <section class="hero-grid">
    <article class="card hero-card">
      <p class="eyebrow">Daily Public Signal</p>
      <h1>${escapeHtml(payload.signal_name)}</h1>
      <p class="lede">A limited public preview from EGXResearch. The card shows only the third-ranked public model signal for the selected horizon.</p>
      <div class="meta-row">
        <span class="badge badge-strong">${escapeHtml(payload.trading_date)}</span>
        <span class="badge">${escapeHtml(prettyState(context.prediction_status))}</span>
      </div>
    </article>

    <article class="card signal-card" aria-label="Today signal card">
      <p class="eyebrow">Today’s Signal</p>
      <div class="symbol">${escapeHtml(signal.stock_symbol)}</div>
      <div class="rank-line">${escapeHtml(signal.rank_label)}</div>
      <dl class="signal-grid">
        <div><dt>Horizon</dt><dd>${escapeHtml(signal.horizon)}</dd></div>
        <div><dt>Rank</dt><dd>#${escapeHtml(signal.rank_within_horizon)}</dd></div>
        <div><dt>Direction</dt><dd>${escapeHtml(prettyState(signal.direction_bucket))}</dd></div>
        <div><dt>Source</dt><dd>${escapeHtml(prettyState(signal.source_freshness_status))}</dd></div>
      </dl>
    </article>
  </section>

  <section class="card-grid">
    <article class="card">
      <p class="eyebrow">Context</p>
      <div class="status-stack">
        <span class="status-pill"><b>Model confidence</b>${escapeHtml(prettyState(context.trust_state))}</span>
        <span class="status-pill"><b>Data source</b>${escapeHtml(prettyState(context.source_quality_status))}</span>
        <span class="status-pill"><b>Published</b>${escapeHtml(payload.published_at)}</span>
      </div>
    </article>
    <article class="card disclaimer-card">
      <p class="eyebrow">Use Boundary</p>
      <p>Research-only public signal. This is not personalised investment advice and is not an instruction to buy, sell, or hold any security.</p>
    </article>
    <article class="card action-card">
      <p class="eyebrow">Share</p>
      <div class="button-row">
        <button class="button" data-share>Share</button>
        <button class="button" data-copy>Copy link</button>
        <a class="button" data-share-link="linkedin" href="#">LinkedIn</a>
        <a class="button" data-share-link="facebook" href="#">Facebook</a>
      </div>
      <p class="small-note" data-copy-status aria-live="polite">Share the page URL; the public card is rendered when opened.</p>
    </article>
  </section>
  ${megaFooter()}
</main>`;
}
