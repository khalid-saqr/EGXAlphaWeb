import { escapeHtml, htmlShell, megaFooter, prettyState, rel, siteHeader, SITE } from './templates.mjs';
import { homePage } from './home.mjs';
import { methodologyPage } from './methodology.mjs';

function signalParts(payload) {
  const signal = payload.public_signal || payload.signal || payload.signals?.[0] || {};
  const asset = payload.asset || {};
  const symbol = asset.symbol || signal.stock_symbol || 'EGX /Alpha';
  const display = asset.display_symbol || String(symbol).split(':').pop();
  return { symbol, display };
}

function horizonDisplay(item) {
  const raw = String(item.horizon || '').trim();
  return /^\d+(\.0+)?$/.test(raw) ? `${parseInt(raw,10)} EGX sessions` : (item.horizon_label || raw || 'Primary horizon');
}

export function renderSignalPage(payload, canonicalPath = '/today/', recentItems = [], previousPayload = null) {
  const { display } = signalParts(payload);
  return htmlShell({ title:`EGX /Alpha — ${payload.trading_date} — ${display}`, description:`EGX /Alpha quantitative equity intelligence for the Egyptian Exchange, analysis date ${payload.trading_date}.`, canonicalPath, payload, pageClass:'page-signal', body:homePage(payload,{canonicalPath,recentItems,previousPayload}) });
}

export function renderArchivePage(items) {
  const rows = items.map(item=>`<a class="archive-row" href="${rel(item.url)}"><span>${escapeHtml(item.date)}</span><strong>${escapeHtml(item.display_symbol||item.symbol)}</strong><em>${escapeHtml(horizonDisplay(item))}</em><small>${escapeHtml(prettyState(item.direction_bucket))}</small></a>`).join('');
  return htmlShell({title:'EGX /Alpha analysis history — EGXResearch',description:'Dated public EGX /Alpha model records.',canonicalPath:'/archive/',body:`<main class="site-shell page-archive">${siteHeader('HISTORY')}<section class="page-hero"><p class="eyebrow">ANALYSIS HISTORY</p><h1>Completed model records.</h1><p class="lede">Inspect dated public EGX /Alpha outputs. Historical pages preserve what the public publication layer received for each session.</p><div class="meta-row"><span class="badge">${items.length} PUBLIC RECORD${items.length===1?'':'S'}</span><a class="badge" href="${rel('/search/')}">SEARCH HISTORY</a></div></section><section class="card archive-list">${rows||'<p class="small-note">No public records yet.</p>'}</section>${megaFooter()}</main>`});
}

export function renderSearchPage() {
  return htmlShell({title:'Search EGX /Alpha history — EGXResearch',description:'Search public EGX /Alpha model records by date or symbol.',canonicalPath:'/search/',body:`<main class="site-shell page-search">${siteHeader('SEARCH')}<section class="page-hero"><p class="eyebrow">PUBLIC MODEL MEMORY</p><h1>Search the research archive.</h1><p class="lede">Find a published model record by ticker, date, sector, horizon or public model view.</p></section><section class="card search-panel"><input class="search-input" data-search-input type="search" placeholder="EGX symbol or YYYY-MM-DD" aria-label="Search model records"><div class="search-results" data-search-results aria-live="polite"></div></section>${megaFooter()}</main>`});
}

export function renderMethodologyPage(){return htmlShell({title:'EGX /Alpha research methodology — EGXResearch',description:'Public research methodology for EGX /Alpha.',canonicalPath:'/methodology/',pageClass:'page-methodology',body:methodologyPage()});}

export function renderInstitutionalPage(){
  const href=`mailto:${SITE.accessEmail}?subject=${encodeURIComponent('EGX Alpha institutional enquiry')}`;
  return htmlShell({title:'Institutional research — EGX /Alpha',description:'Institutional research and technology enquiries for EGX /Alpha.',canonicalPath:'/institutional/',body:`<main class="site-shell page-institutional">${siteHeader('INSTITUTIONAL')}<section class="page-hero"><p class="eyebrow">INSTITUTIONAL RESEARCH & TECHNOLOGY</p><h1>Systematic intelligence built around the Egyptian market.</h1><p class="lede">EGXResearch develops a production deep-learning research engine for cross-sectional analysis of Egyptian listed equities.</p></section><section class="institutional-grid"><article class="card"><p class="section-kicker">CAPABILITIES</p><h2>Designed as research infrastructure.</h2><div class="capability-list"><div><span>01</span><section><strong>Research distribution</strong><p>Structured public model outputs and dated signal history.</p></section></div><div><span>02</span><section><strong>Technology integration</strong><p>A bounded publication architecture designed to keep model internals private.</p></section></div><div><span>03</span><section><strong>Strategic research applications</strong><p>Institutional conversations around Egyptian-equity intelligence and systematic workflows.</p></section></div></div></article><article class="card institutional-contact"><p class="section-kicker">ENQUIRIES</p><h2>Institutional contact.</h2><p class="lede">For research partnerships, technology integration, signal distribution or strategic enquiries:</p><a href="${href}">${escapeHtml(SITE.accessEmail)}</a><p class="small-note" style="margin-top:28px">Research and information only. No execution service is offered by this public website.</p></article></section>${megaFooter()}</main>`});
}

export function renderSymbolDossierPage(symbol, history) {
  const rows=[...(history||[])].sort((a,b)=>b.date.localeCompare(a.date));
  const latest=rows[0]||{};
  const table=rows.map(row=>`<div class="archive-row"><span>${escapeHtml(row.date)}</span><strong>#${escapeHtml(row.rank)}</strong><em>${escapeHtml(prettyState(row.direction_bucket))}</em><small>${escapeHtml(row.movement==null?'—':`${row.movement>0?'+':''}${row.movement}`)}</small></div>`).join('');
  return htmlShell({title:`${symbol} — EGX /Alpha model history`,description:`Public EGX /Alpha model history for ${symbol}.`,canonicalPath:`/symbol/${symbol}/`,body:`<main class="site-shell page-symbol">${siteHeader('INSTRUMENT INTELLIGENCE')}<section class="page-hero"><p class="eyebrow">INSTRUMENT INTELLIGENCE</p><h1>${escapeHtml(symbol)}</h1><p class="lede">Longitudinal public /Alpha ranking history for this EGX security.</p><div class="meta-row"><span class="badge">LATEST RANK #${escapeHtml(latest.rank??'—')}</span><span class="badge">${escapeHtml(prettyState(latest.direction_bucket))}</span></div></section><section class="card archive-list">${table||'<p class="small-note">No public history.</p>'}</section>${megaFooter()}</main>`});
}
