import fs from 'node:fs';

const INLINE_CSS = fs.readFileSync(new URL('../assets/app.css', import.meta.url), 'utf8');
const PRODUCT_CSS = fs.readFileSync(new URL('../assets/product.css', import.meta.url), 'utf8');

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
    positive_model_signal: 'Positive',
    neutral_model_signal: 'Neutral',
    negative_model_signal: 'Negative',
    source_healthy: 'Validated',
    live_observation_completed: 'Validated',
    historical_backfill: 'Historical model record',
    live: 'Live',
    evidence_accumulating: 'Evidence accumulating',
    historical_validation_passed: 'Historical validation passed'
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
  <meta name="theme-color" content="#0b1016">
  <meta name="color-scheme" content="dark light">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(url)}">
  <style>${INLINE_CSS.replaceAll('</style', '<\\/style')}\n${PRODUCT_CSS.replaceAll('</style', '<\\/style')}</style>
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
  return `<header class="topbar product-topbar" aria-label="Site header">
    <a class="brand" href="${rel('/')}">
      <span class="brand-word">EGX Research</span>
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

const FOOTER_CSS = String.raw`
.ecosystem-footer{display:grid;grid-template-columns:minmax(230px,1fr) minmax(300px,1.25fr) auto;gap:28px;align-items:start;margin-top:60px;padding:30px 0 12px;border-top:1px solid var(--line);color:var(--muted)}
.ecosystem-footer .footer-brand strong{display:block;color:var(--text);font-family:var(--mono);font-size:.82rem;letter-spacing:.04em}
.ecosystem-footer .footer-brand p,.ecosystem-footer .footer-attribution p{margin:7px 0 0;max-width:46ch;font-size:.79rem;line-height:1.55}
.ecosystem-footer .footer-attribution>span{display:block;color:var(--blue);font-family:var(--mono);font-size:.59rem;font-weight:800;letter-spacing:.075em}
.ecosystem-footer .footer-attribution strong{color:var(--soft);font-weight:750}
.ecosystem-footer .footer-attribution a{color:var(--text);font-weight:750;text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--blue) 48%,transparent);text-underline-offset:3px}
.ecosystem-footer .footer-attribution a:hover,.ecosystem-footer .footer-links a:hover{color:var(--blue)}
.ecosystem-footer .footer-links{display:grid;grid-template-columns:1fr 1fr;gap:7px 18px;min-width:190px}
.ecosystem-footer .footer-links a{color:var(--soft);font-size:.75rem}
.ecosystem-footer .footer-disclaimer{grid-column:1 / -1;margin:6px 0 0;padding-top:13px;border-top:1px solid var(--line);color:var(--muted);font-size:.56rem;line-height:1.55;letter-spacing:.005em}
.ecosystem-footer .footer-rights{grid-column:1 / -1;margin-top:-14px;color:var(--muted);font-family:var(--mono);font-size:.54rem;text-align:right}
@media(max-width:900px){.ecosystem-footer{grid-template-columns:1fr 1fr}.ecosystem-footer .footer-links{grid-column:1 / -1;display:flex;flex-wrap:wrap;min-width:0}.ecosystem-footer .footer-rights{text-align:left;margin-top:-8px}}
@media(max-width:600px){.ecosystem-footer{grid-template-columns:1fr;gap:18px;margin-top:44px;padding-top:23px}.ecosystem-footer .footer-links{grid-column:auto;display:grid;grid-template-columns:1fr 1fr}.ecosystem-footer .footer-disclaimer,.ecosystem-footer .footer-rights{grid-column:auto}.ecosystem-footer .footer-disclaimer{font-size:.54rem}.ecosystem-footer .footer-rights{margin-top:-8px;text-align:left}}
`;

export function siteFooter() {
  const year = new Date().getUTCFullYear();
  return `<style id="ecosystem-footer-styles">${FOOTER_CSS}</style><footer class="site-footer ecosystem-footer" aria-label="Site footer">
    <div class="footer-brand"><strong>EGX Research / ALPHA</strong><p>Public quantitative research for the Egyptian Exchange.</p></div>
    <div class="footer-attribution"><span>RESEARCH ECOSYSTEM</span><p>EGX Research is a project of <strong>EGX Research Community LLP</strong>, in association with <a href="https://knowdyn.com" target="_blank" rel="noopener noreferrer">KNOWDYN</a> and <a href="https://60arabia.com" target="_blank" rel="noopener noreferrer">60Arabia</a>.</p></div>
    <nav class="footer-links" aria-label="Footer navigation">
      <a href="${rel('/today/')}">Latest</a>
      <a href="${rel('/archive/')}">History</a>
      <a href="${rel('/search/')}">Search</a>
      <a href="${rel('/methodology/')}">Research</a>
      <a href="${rel('/institutional/')}">Institutional</a>
    </nav>
    <p class="footer-disclaimer">Research and information only. Not investment advice. Public engine outputs are provided as-is. Nothing on this site is a recommendation, solicitation, target price or execution instruction. EGX Research Community LLP, KNOWDYN, 60Arabia and their affiliates accept no responsibility for trading decisions, losses, damages or other outcomes arising from use of, reliance on or interpretation of the public engine data, to the fullest extent permitted by applicable law.</p>
    <div class="footer-rights">© ${year} EGX Research Community LLP.</div>
  </footer>`;
}

export const megaFooter = siteFooter;
