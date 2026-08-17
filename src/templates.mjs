import fs from 'node:fs';

const INLINE_CSS = fs.readFileSync(new URL('../assets/app.css', import.meta.url), 'utf8');

export const SITE = {
  domain: 'EGXResearch',
  signalName: 'EGX /Alpha',
  accessEmail: 'access@egxresearch.com',
  basePath: process.env.EGX_BASE_PATH || '/EGXResearch',
  siteUrl: process.env.EGX_SITE_URL || (process.env.GITHUB_REPOSITORY_OWNER ? `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io/EGXResearch` : '')
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
    positive_model_signal: 'Constructive',
    neutral_model_signal: 'Neutral',
    negative_model_signal: 'Caution',
    source_healthy: 'Validated',
    live_observation_completed: 'Validated',
    historical_backfill: 'Historical backfill',
    live: 'Live'
  };
  return map[value] || String(value || 'Unavailable').replaceAll('_', ' ');
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
  <meta name="theme-color" content="#0b0e13">
  <meta name="color-scheme" content="dark light">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(url)}">
  <style>${INLINE_CSS.replaceAll('</style', '<\\/style')}</style>
</head>
<body class="${escapeHtml(pageClass)}">
  <script id="site-config" type="application/json">${clientConfig}</script>
  <script id="beacon-payload" type="application/json">${payloadJson}</script>
  ${body}
  <script src="${rel('/assets/app.js')}" defer></script>
</body>
</html>\n`;
}

function themeIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.64 5.64 7.2 7.2M16.8 16.8l1.56 1.56M18.36 5.64 16.8 7.2M7.2 16.8l-1.56 1.56M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
}

function navLink(href, label, key, activeSection) {
  const active = key === activeSection;
  return `<a href="${rel(href)}"${active ? ' class="active" aria-current="page"' : ''}>${label}</a>`;
}

export function siteHeader(sectionLabel = SITE.signalName, activeSection = '') {
  return `<header class="topbar" aria-label="Site header">
    <a class="brand" href="${rel('/')}">
      <span class="brand-word">EGXRESEARCH</span>
      <span class="brand-divider">/</span>
      <span class="brand-alpha">ALPHA</span>
      <span class="brand-context">${escapeHtml(sectionLabel)}</span>
    </a>
    <nav class="navlinks" aria-label="Primary navigation">
      ${navLink('/today/', 'LATEST', 'latest', activeSection)}
      ${navLink('/archive/', 'HISTORY', 'history', activeSection)}
      ${navLink('/search/', 'SEARCH', 'search', activeSection)}
      ${navLink('/methodology/', 'RESEARCH', 'research', activeSection)}
      ${navLink('/institutional/', 'INSTITUTIONAL', 'institutional', activeSection)}
    </nav>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle light and dark theme" aria-pressed="false">${themeIcon()}</button>
  </header>`;
}

export function megaFooter() {
  const institutional = `mailto:${SITE.accessEmail}?subject=${encodeURIComponent('EGX Alpha institutional enquiry')}`;
  return `<footer class="mega-footer" aria-label="Site footer">
    <section>
      <strong>EGXRESEARCH / ALPHA</strong>
      <p>Systematic deep-learning market intelligence for Egyptian listed equities.</p>
    </section>
    <nav aria-label="Footer navigation">
      <a href="${rel('/today/')}">Latest</a>
      <a href="${rel('/archive/')}">History</a>
      <a href="${rel('/search/')}">Search</a>
      <a href="${rel('/methodology/')}">Research</a>
      <a href="${rel('/institutional/')}">Institutional</a>
    </nav>
    <section class="footer-rights">
      <a href="${institutional}">${escapeHtml(SITE.accessEmail)}</a>
      <p>Research and information only. No buy, sell or hold instruction.</p>
      <p>© EGX Research LLP. All rights reserved.</p>
    </section>
  </footer>`;
}
