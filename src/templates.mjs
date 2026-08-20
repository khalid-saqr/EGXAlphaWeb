import fs from 'node:fs';
import { clientStrings, counterpartPath, directionFor, localePath, localizeHtml, normalizeLocale, stripLocalePath, translateText } from './i18n.mjs';
import { polishLocalizedHtml, polishLocalizedText } from './i18n-polish.mjs';

const INLINE_CSS = fs.readFileSync(new URL('../assets/app.css', import.meta.url), 'utf8');
const PRODUCT_CSS = fs.readFileSync(new URL('../assets/product.css', import.meta.url), 'utf8');
const SHELL_CSS = fs.readFileSync(new URL('../assets/shell.css', import.meta.url), 'utf8');
const RESEARCH_DEPTH_CSS = fs.readFileSync(new URL('../assets/research-depth.css', import.meta.url), 'utf8');
const I18N_CSS = fs.readFileSync(new URL('../assets/i18n.css', import.meta.url), 'utf8');

const LEGACY_VISUAL_PALETTE = [
  ['#070B14', '#010201'], ['#0D1420', '#050806'], ['#121C2A', '#0A100C'], ['#243247', '#18231D'], ['#33455F', '#2A3B31'],
  ['#F3F6FA', '#FFFFFF'], ['#A9B5C5', '#8B9990'], ['#CED6E1', '#D4DDD7'], ['#5F7CFF', '#00D084'], ['#7890FF', '#35E7A6'],
  ['#F6F1E6', '#FFFFFF'], ['#FFFDF8', '#FAFCFA'], ['#F0EADC', '#F1F6F2'], ['#D4C9B7', '#D6E1D9'], ['#B7AA94', '#A8B9AD'],
  ['#17202B', '#050706'], ['#5D6876', '#5C6A61'], ['#3F4A57', '#273129'], ['#3555D9', '#007A4B'], ['#2847C4', '#005F3A'],
  ['#0b0e13', '#010201'], ['#10151c', '#050806'], ['#151b24', '#0A100C'], ['#242d38', '#18231D'], ['#344152', '#2A3B31'],
  ['#f1f4f6', '#FFFFFF'], ['#96a1af', '#8B9990'], ['#c9d0d8', '#D4DDD7'], ['#5688ff', '#00D084'],
  ['#f4f6f8', '#FFFFFF'], ['#eef2f6', '#F1F6F2'], ['#d9e0e8', '#D6E1D9'], ['#bcc7d4', '#A8B9AD'],
  ['#111820', '#050706'], ['#5c6875', '#5C6A61'], ['#34404d', '#273129'],
  ['#0b1016', '#010201'], ['#111821', '#050806'], ['#17202b', '#0A100C'], ['#253242', '#18231D'], ['#36485d', '#2A3B31'],
  ['#f5f7fa', '#FFFFFF'], ['#98a4b3', '#8B9990'], ['#cbd3dd', '#D4DDD7'], ['#557cff', '#00D084'],
  ['#eef2f7', '#F1F6F2'], ['#d8e0e9', '#D6E1D9'], ['#b9c5d3', '#A8B9AD'], ['#101720', '#050706'], ['#647181', '#5C6A61'], ['#354251', '#273129']
];

function applyFineTunePalette(value) {
  let output = String(value ?? '');
  for (const [legacy, current] of LEGACY_VISUAL_PALETTE) output = output.replace(new RegExp(legacy, 'gi'), current);
  return output;
}

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

function pwaShellStrings(locale) {
  if (locale === 'ar') return {
    app: 'التطبيق',
    install: 'تثبيت EGX /ALPHA',
    installAria: 'تثبيت EGX /Alpha',
    online: 'متصل · يتم فحص أحدث سجل عند فتح التطبيق',
    offline: 'غير متصل · عرض آخر سجل عام محفوظ'
  };
  return {
    app: 'APP',
    install: 'INSTALL EGX /ALPHA',
    installAria: 'Install EGX /Alpha',
    online: 'ONLINE · LATEST RECORD CHECKED ON OPEN',
    offline: 'OFFLINE · SHOWING LAST CACHED PUBLIC RECORD'
  };
}

function footerShellStrings(locale) {
  if (locale === 'ar') return {
    close: 'خلاصة البحث',
    value: 'ترتيب يومي للأولوية في السوق المصري.',
    next: 'ابدأ بما يضعه النموذج في أعلى الترتيب، ثم ابدأ بحثك.',
    use: 'استخدم /ALPHA',
    today: 'ترتيب اليوم',
    search: 'ابحث عن الأسهم',
    history: 'سجل الترتيب',
    understand: 'افهم /ALPHA',
    guide: 'دليل المستثمر',
    methodology: 'منهجية البحث',
    faq: 'الاسئلة الشائعة',
    access: 'الوصول',
    institutional: 'الوصول المؤسسي',
    verify: 'تحقق من السجل العام',
    recordMeta: 'JSON · قابل للقراءة آلياً',
    app: 'التطبيق',
    provenance: 'المصدر'
  };
  return {
    close: 'RESEARCH CLOSE',
    value: 'A daily order of priority for the Egyptian market.',
    next: 'Start with what the model ranks highest. Then do your research.',
    use: 'USE /ALPHA',
    today: "Today's Ranking",
    search: 'Search Stocks',
    history: 'Ranking History',
    understand: 'UNDERSTAND /ALPHA',
    guide: 'Investor Guide',
    methodology: 'Research Methodology',
    faq: 'Frequently Asked Questions',
    access: 'ACCESS',
    institutional: 'Institutional Access',
    verify: 'VERIFY PUBLIC RECORD',
    recordMeta: 'JSON · MACHINE-READABLE',
    app: 'APP',
    provenance: 'PROVENANCE'
  };
}

export function htmlShell({ title, description, canonicalPath, payload, body, pageClass = '', locale }) {
  const lang = normalizeLocale(locale || globalThis.__EGX_RENDER_LOCALE || 'en');
  const englishPath = stripLocalePath(canonicalPath || '/');
  const currentPath = localePath(englishPath, lang);
  const url = abs(currentPath);
  const englishUrl = abs(englishPath);
  const arabicUrl = abs(localePath(englishPath, 'ar'));
  const localizedTitle = polishLocalizedText(translateText(title, lang), lang);
  const localizedDescription = polishLocalizedText(translateText(description, lang), lang);
  const payloadJson = payload ? JSON.stringify(payload).replaceAll('</script', '<\\/script') : '';
  const clientConfig = JSON.stringify({ basePath: SITE.basePath, locale: lang, strings: clientStrings(lang) }).replaceAll('</script', '<\\/script');
  const switchUrl = rel(counterpartPath(englishPath, lang));
  const switchLabel = lang === 'ar' ? 'En' : 'Ar';
  const switchCode = lang === 'ar' ? 'EN' : 'AR';
  const pwa = pwaShellStrings(lang);
  const footer = footerShellStrings(lang);
  let localizedBody = localizeHtml(body, lang, { basePath: SITE.basePath })
    .replaceAll('__LANGUAGE_URL__', escapeHtml(switchUrl))
    .replaceAll('__LANGUAGE_LABEL__', escapeHtml(switchLabel))
    .replaceAll('__LANGUAGE_CODE__', escapeHtml(switchCode))
    .replaceAll('__X1__', escapeHtml(pwa.app))
    .replaceAll('__X2__', escapeHtml(pwa.install))
    .replaceAll('__X3__', escapeHtml(pwa.installAria))
    .replaceAll('__X4__', escapeHtml(pwa.online))
    .replaceAll('__X5__', escapeHtml(pwa.offline))
    .replaceAll('__F1__', escapeHtml(footer.close))
    .replaceAll('__F2__', escapeHtml(footer.value))
    .replaceAll('__F3__', escapeHtml(footer.next))
    .replaceAll('__F4__', escapeHtml(footer.use))
    .replaceAll('__F5__', escapeHtml(footer.today))
    .replaceAll('__F6__', escapeHtml(footer.search))
    .replaceAll('__F7__', escapeHtml(footer.history))
    .replaceAll('__F8__', escapeHtml(footer.understand))
    .replaceAll('__F9__', escapeHtml(footer.guide))
    .replaceAll('__F10__', escapeHtml(footer.methodology))
    .replaceAll('__F11__', escapeHtml(footer.access))
    .replaceAll('__F12__', escapeHtml(footer.institutional))
    .replaceAll('__F13__', escapeHtml(footer.verify))
    .replaceAll('__F14__', escapeHtml(footer.recordMeta))
    .replaceAll('__F15__', escapeHtml(footer.app))
    .replaceAll('__F16__', escapeHtml(footer.provenance))
    .replaceAll('__F17__', escapeHtml(footer.faq))
    .replaceAll('__FAQ_URL__', escapeHtml(rel(localePath('/faq/', lang))));
  localizedBody = polishLocalizedHtml(localizedBody, lang);
  const page = `<!doctype html>
<html lang="${lang}" dir="${directionFor(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escapeHtml(localizedTitle)}</title>
  <meta name="description" content="${escapeHtml(localizedDescription)}">
  <meta name="theme-color" content="#010201">
  <meta name="color-scheme" content="dark light">
  <meta name="application-name" content="EGX /Alpha">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="EGX /Alpha">
  <meta property="og:title" content="${escapeHtml(localizedTitle)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:description" content="${escapeHtml(localizedDescription)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(localizedTitle)}">
  <meta name="twitter:description" content="${escapeHtml(localizedDescription)}">
  <link rel="canonical" href="${escapeHtml(url)}">
  <link rel="alternate" hreflang="en" href="${escapeHtml(englishUrl)}">
  <link rel="alternate" hreflang="ar" href="${escapeHtml(arabicUrl)}">
  <link rel="alternate" hreflang="x-default" href="${escapeHtml(englishUrl)}">
  <link rel="manifest" href="${rel('/manifest.webmanifest')}">
  <link rel="apple-touch-icon" href="${rel('/assets/icons/apple-touch-icon.png')}">
  <link rel="stylesheet" href="${rel('/assets/pwa.css')}">
  <style>${INLINE_CSS.replaceAll('</style', '<\\/style')}\n${PRODUCT_CSS.replaceAll('</style', '<\\/style')}\n${SHELL_CSS.replaceAll('</style', '<\\/style')}\n${RESEARCH_DEPTH_CSS.replaceAll('</style', '<\\/style')}\n${I18N_CSS.replaceAll('</style', '<\\/style')}</style>
  <link rel="stylesheet" href="${rel('/assets/fine-tune.css')}">
</head>
<body class="${escapeHtml(`${pageClass} locale-${lang}`.trim())}">
  <script id="site-config" type="application/json">${clientConfig}</script>
  <script id="beacon-payload" type="application/json">${payloadJson}</script>
  ${localizedBody}
  <script src="${rel('/assets/app.js')}" defer></script>
  <script src="${rel('/assets/pwa.js')}" defer></script>
</body>
</html>\n`;
  return applyFineTunePalette(page);
}

function themeIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.64 5.64 7.2 7.2M16.8 16.8l1.56 1.56M18.36 5.64 16.8 7.2M7.2 16.8l-1.56 1.56M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
}

function searchIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.1" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m15.4 15.4 4.1 4.1" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;
}

function menuIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;
}

export function alphaMark() {
  return `<span class="alpha-mark" aria-hidden="true"><span class="alpha-mark-slash">/</span><strong>A</strong></span>`;
}

function navLink(href, label, key, activeSection, className = '') {
  const active = key === activeSection;
  const classes = [className, active ? 'active' : ''].filter(Boolean).join(' ');
  return `<a href="${rel(href)}"${classes ? ` class="${classes}"` : ''}${active ? ' aria-current="page"' : ''}>${label}</a>`;
}

function primaryNav(activeSection, className = '') {
  return `<nav class="${className}" aria-label="Primary navigation">
    ${navLink('/today/', 'TODAY', 'latest', activeSection)}
    ${navLink('/archive/', 'HISTORY', 'history', activeSection)}
    ${navLink('/methodology/', 'RESEARCH', 'research', activeSection)}
    ${navLink('/investor-guide/', 'GUIDE', 'guide', activeSection)}
    ${navLink('/institutional/', 'INSTITUTIONAL', 'institutional', activeSection)}
  </nav>`;
}

export function siteHeader(sectionLabel = SITE.signalName, activeSection = '') {
  const searchActive = activeSection === 'search';
  return `<header class="topbar product-topbar research-topbar" aria-label="Site header">
    <a class="brand brand-lockup" href="${rel('/')}">
      ${alphaMark()}
      <span class="brand-copy">
        <span class="brand-word">EGX Research</span>
        <span class="brand-product"><span class="brand-divider">/</span><span class="brand-alpha">ALPHA</span></span>
      </span>
      <span class="brand-context">${escapeHtml(sectionLabel)}</span>
    </a>
    ${primaryNav(activeSection, 'navlinks nav-desktop')}
    <div class="header-actions">
      <a class="search-action${searchActive ? ' active' : ''}" href="${rel('/search/')}"${searchActive ? ' aria-current="page"' : ''} aria-label="Search EGX /Alpha">${searchIcon()}</a>
      <a class="language-action" href="__LANGUAGE_URL__" aria-label="Switch language" data-language-code="__LANGUAGE_CODE__">__LANGUAGE_LABEL__</a>
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle light and dark theme" aria-pressed="false">${themeIcon()}</button>
      <details class="mobile-menu">
        <summary aria-label="Open navigation">${menuIcon()}<span>MENU</span></summary>
        <div class="mobile-menu-panel">
          ${primaryNav(activeSection, 'mobile-menu-links')}
          <a class="mobile-search-link${searchActive ? ' active' : ''}" href="${rel('/search/')}"${searchActive ? ' aria-current="page"' : ''}>${searchIcon()}<span>SEARCH</span></a>
        </div>
      </details>
    </div>
  </header>`;
}

export function siteFooter() {
  const year = new Date().getUTCFullYear();
  return `<footer class="site-footer research-footer" aria-label="Site footer">
    <section class="footer-close">
      <div class="footer-close-brand">
        <a class="footer-brand-lockup" href="${rel('/')}">${alphaMark()}<span><strong>EGX Research</strong><em>/ ALPHA</em></span></a>
      </div>
      <div class="footer-close-copy">
        <span class="footer-label">__F1__</span>
        <h2>__F2__</h2>
        <p>__F3__</p>
      </div>
      <div class="footer-close-meta"><span>POST-CLOSE · CAIRO</span><span>1D · 3D · 5D · 10D</span></div>
    </section>
    <div class="footer-grid">
      <section class="footer-section footer-use">
        <span class="footer-label">__F4__</span>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="${rel('/today/')}">__F5__</a>
          <a href="${rel('/search/')}">__F6__</a>
          <a href="${rel('/archive/')}">__F7__</a>
        </nav>
      </section>
      <section class="footer-section footer-understand">
        <span class="footer-label">__F8__</span>
        <nav class="footer-links" aria-label="Research guidance">
          <a href="${rel('/investor-guide/')}">__F9__</a>
          <a href="${rel('/methodology/')}">__F10__</a>
          <a href="__FAQ_URL__">__F17__</a>
        </nav>
      </section>
      <section class="footer-section footer-app">
        <span class="footer-label">__F11__</span>
        <div class="footer-access-links">
          <a class="footer-access-link" href="${rel('/institutional/')}">__F12__</a>
          <a class="footer-record-link" href="${rel('/data/latest.json')}"><strong>__F13__</strong><span class="footer-record-meta">__F14__</span></a>
        </div>
        <div class="footer-install">
          <span class="footer-app-kicker">__F15__</span>
          <button class="pwa-install-button" type="button" data-pwa-install aria-label="__X3__">__X2__</button>
          <p class="pwa-status" data-pwa-status aria-live="polite">__X4__</p>
          <p class="pwa-install-help" data-pwa-install-help hidden></p>
        </div>
      </section>
    </div>
    <section class="footer-provenance">
      <div class="footer-provenance-line">
        <span class="footer-label">__F16__</span>
        <p>EGX Research is a project of <strong>EGX Research Community LLP</strong>, in association with <a href="https://knowdyn.com" target="_blank" rel="noopener noreferrer">KNOWDYN</a> and <a href="https://60arabia.com" target="_blank" rel="noopener noreferrer">60Arabia</a>.</p>
      </div>
      <p class="footer-disclaimer">Research and information only. Not investment advice. Public engine outputs are provided as-is. Nothing on this site is a recommendation, solicitation, target price or execution instruction. EGX Research Community LLP, KNOWDYN, 60Arabia and their affiliates accept no responsibility for trading decisions, losses, damages or other outcomes arising from use of, reliance on or interpretation of the public engine data, to the fullest extent permitted by applicable law.</p>
      <div class="footer-rights">© ${year} EGX Research Community LLP.</div>
    </section>
    <div class="offline-notice" data-pwa-offline role="status" aria-live="polite" hidden>__X5__</div>
  </footer>`;
}

export const megaFooter = siteFooter;