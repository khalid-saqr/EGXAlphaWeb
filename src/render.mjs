import { escapeHtml, htmlShell, megaFooter, methodologyPage, prettyState, rel, signalCard, siteHeader } from './templates.mjs';

function signalParts(payload) {
  const signal = payload.public_signal || payload.signal || {};
  const asset = payload.asset || {};
  const symbol = asset.symbol || signal.stock_symbol || payload.signal?.stock_symbol || 'EGX signal';
  const display = asset.display_symbol || (String(symbol).includes(':') ? String(symbol).split(':').pop() : symbol);
  const company = asset.company_name ? ` — ${asset.company_name}` : '';
  return { symbol, display, company, signal };
}

function horizonDisplay(item) {
  const raw = String(item.horizon || '').trim();
  if (/^\d+(\.0+)?$/.test(raw)) return `Next ${parseInt(raw, 10)} EGX sessions`;
  const label = String(item.horizon_label || '').trim();
  const match = label.match(/(\d+)/);
  if (match) return `Next ${parseInt(match[1], 10)} EGX sessions`;
  return label || raw || 'Selected window';
}

export function renderSignalPage(payload, canonicalPath = '/today/') {
  const { symbol, display, company } = signalParts(payload);
  const title = `EGX /Alpha signal — ${display} — ${payload.trading_date}`;
  const description = `EGX /Alpha Mind daily public signal for ${payload.trading_date}: ${symbol}${company}. Research-only EGX market intelligence.`;
  return htmlShell({
    title,
    description,
    canonicalPath,
    payload,
    pageClass: 'page-signal',
    body: signalCard(payload)
  });
}

export function renderArchivePage(items) {
  const rows = items.map(item => `<a class="archive-row" href="${rel(item.url)}">
    <span>${escapeHtml(item.date)}</span>
    <strong>${escapeHtml(item.display_symbol || item.symbol)}</strong>
    <em>${escapeHtml(horizonDisplay(item))}</em>
    <small>${escapeHtml(item.company_name || prettyState(item.direction_bucket))}</small>
  </a>`).join('\n');
  return htmlShell({
    title: 'EGX /Alpha signal archive — EGXResearch',
    description: 'Archive of public EGX /Alpha signals from EGXResearch.',
    canonicalPath: '/archive/',
    body: `<main class="site-shell page-archive">
      ${siteHeader('Archive')}
      <section class="card hero-card archive-hero">
        <p class="eyebrow">Archive</p>
        <h1>Public signal archive</h1>
        <p class="lede">Review previous EGX /Alpha public signals by date, symbol, company, direction, and evaluation window.</p>
        <div class="meta-row"><span class="badge badge-strong">${items.length} public signal${items.length === 1 ? '' : 's'}</span><a class="badge badge-link" href="${rel('/search/')}">Search archive</a></div>
      </section>
      <section class="card archive-list">${rows || '<p>No archive records yet.</p>'}</section>
      ${megaFooter()}
    </main>`
  });
}

export function renderSearchPage() {
  return htmlShell({
    title: 'Search EGX /Alpha signals — EGXResearch',
    description: 'Search the public EGX /Alpha signal archive by stock symbol or date.',
    canonicalPath: '/search/',
    body: `<main class="site-shell page-search">
      ${siteHeader('Search')}
      <section class="card hero-card search-hero">
        <p class="eyebrow">Search</p>
        <h1>Public signal memory</h1>
        <p class="lede">Search the public archive by symbol, company name, date, month, sector, window, or direction.</p>
        <input class="search-input" data-search-input type="search" placeholder="Try TMGH, EGX:TMGH, Real Estate, or 2026-07" aria-label="Search signals">
      </section>
      <section class="card"><div class="search-results" data-search-results aria-live="polite"></div></section>
      ${megaFooter()}
    </main>`
  });
}

export function renderMethodologyPage() {
  return htmlShell({
    title: 'EGX /Alpha methodology — EGXResearch',
    description: 'Public-facing methodology white paper for the EGXResearch signal publication layer.',
    canonicalPath: '/methodology/',
    pageClass: 'page-methodology',
    body: methodologyPage()
  });
}
