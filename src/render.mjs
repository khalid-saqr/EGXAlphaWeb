import { escapeHtml, htmlShell, megaFooter, prettyState, rel, signalCard, siteHeader } from './templates.mjs';

export function renderSignalPage(payload, canonicalPath = '/today/') {
  const symbol = payload.signal?.stock_symbol || 'EGX signal';
  const title = `EGX /Alpha signal — ${symbol} — ${payload.trading_date}`;
  const description = `EGXResearch daily public EGX /Alpha signal for ${payload.trading_date}: ${payload.signal?.rank_label || 'public signal'}. Research-only.`;
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
    <strong>${escapeHtml(item.symbol)}</strong>
    <em>${escapeHtml(item.horizon)}</em>
    <small>${escapeHtml(prettyState(item.direction_bucket))}</small>
  </a>`).join('\n');
  return htmlShell({
    title: 'EGX /Alpha signal archive — EGXResearch',
    description: 'Archive of public EGX /Alpha signals from EGXResearch.',
    canonicalPath: '/archive/',
    body: `<main class="site-shell">
      ${siteHeader('Archive')}
      <section class="card hero-card"><p class="eyebrow">Archive</p><h1>Public signal archive</h1><p class="lede">Permanent public pages for the EGX /Alpha signal.</p></section>
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
    body: `<main class="site-shell">
      ${siteHeader('Search')}
      <section class="card hero-card"><p class="eyebrow">Search</p><h1>Find public signals</h1><p class="lede">Search by symbol, date, month, horizon, or direction.</p><input class="search-input" data-search-input type="search" placeholder="Try EGX:DEMO or 2026-07" aria-label="Search signals"></section>
      <section class="card"><div class="search-results" data-search-results aria-live="polite"></div></section>
      ${megaFooter()}
    </main>`
  });
}
