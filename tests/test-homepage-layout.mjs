import assert from 'node:assert/strict';
import fs from 'node:fs';

const production = JSON.parse(fs.readFileSync('data/latest.json', 'utf8'));
const home = fs.readFileSync('_site/index.html', 'utf8');
const today = fs.readFileSync('_site/today/index.html', 'utf8');
const productHomeCss = fs.readFileSync('assets/product-home.css', 'utf8');
const productCss = fs.readFileSync('assets/product.css', 'utf8');
const shellCss = fs.readFileSync('assets/shell.css', 'utf8');
const fineTuneCss = fs.readFileSync('assets/fine-tune.css', 'utf8');
const terminalCss = fs.readFileSync('assets/research-terminal.css', 'utf8');
function visibleMain(html) { const start=html.indexOf('<main'); const end=html.lastIndexOf('</main>'); return start>=0&&end>=0?html.slice(start,end+7):html; }
for (const page of [home,today]) {
  const html=visibleMain(page);
  for (const required of ['EGX Research','EGX /ALPHA PUBLIC RESEARCH TERMINAL','Which EGX stocks deserve your attention tomorrow?','Every EGX session leaves investors with the same problem:','<strong>too many stocks, too much noise, and limited attention.</strong>','EGX /Alpha turns the market into a daily order of priority, showing which stocks its model expects to perform better relative to the rest in the days ahead.','<strong>The higher a stock appears, the stronger EGX /Alpha’s relative preference for it.</strong>','Model Direction adds a separate Positive, Neutral or Negative view, helping you decide where your research should begin.','WHAT /ALPHA RANKS HIGHEST','TOP 5 · SELECTED HORIZON','RELATIVE RANK','MODEL DIRECTION','RANK MOVE','MARKET PULSE','RANK MOVERS','/ALPHA MARKET RANKING','The complete eligible EGX universe.','POSITIVE','NEUTRAL','NEGATIVE','HOW TO READ /ALPHA','RESEARCH EVIDENCE','PUBLIC MODEL MEMORY','EGX Research Community LLP','https://knowdyn.com','https://60arabia.com','footer-disclaimer','site-footer','SEARCH','INSTITUTIONAL','aria-current="page"','brand-lockup','alpha-mark','research-footer','nav-desktop','mobile-menu']) assert.ok(html.includes(required),`product UI should include ${required}`);
  for (const removed of ['Deep-learning ranking of Egyptian equities.','After each completed EGX session, /Alpha ranks the eligible stock universe across multiple forward horizons.','RANK PERCENTILE · ZOOMED 90–100','Bar length is public rank percentile','NEXT MODEL OUTLOOK','WHAT /ALPHA SEES NEXT','Highest-ranked public forecasts','hero-forward-1','hero-forward-3','data-hero-forecast-panel','data-hero-chart','Loading historical rank percentile','DEEP-LEARNING MARKET RANKING','Cross-sectional ranking','OBSERVE','VALIDATE','INFER','>PUBLISH<','CONSTRUCTIVE','CAUTION','mega-footer']) assert.equal(html.includes(removed),false,`old or misleading homepage construct must be removed: ${removed}`);
  if (production.schema_version==='egx_alpha_public_wire_v1') assert.ok(html.includes('PUBLICATION NOTE'));
  else if (production.schema_version==='egx_alpha_public_wire_v2') for(const required of ['FORECAST HORIZON','>1D<','>3D<','>5D<','>10D<','D = trading days','data-horizon-select="1"','data-horizon-select="10"','PRIMARY RESEARCH VIEW','data-horizon-panel="1"','data-horizon-panel="3"','data-horizon-panel="5"','data-horizon-panel="10"']) assert.ok(html.includes(required),`V2 product UI should include ${required}`);
  else assert.fail(`unexpected production schema: ${production.schema_version}`);
}
assert.ok(home.includes('<meta name="theme-color" content="#010201">'),'ultra-black should be the shell/PWA theme color');
assert.ok(home.includes('href="/assets/fine-tune.css"'),'fine-tune identity stylesheet should be loaded last');
const searchAction = home.match(/<a class="search-action[^"]*"[^>]*>([\s\S]*?)<\/a>/);
assert.ok(searchAction,'desktop search control should exist');
assert.ok(searchAction[0].includes('aria-label="Search EGX /Alpha"'),'desktop search should retain its accessible label');
assert.ok(searchAction[1].includes('<svg'),'desktop search should retain its icon');
assert.equal(searchAction[1].includes('SEARCH'),false,'desktop search control must not show the Search word');
assert.ok(/class="language-action"[^>]*data-language-code="AR"[^>]*>Ar<\/a>/.test(home),'English header should show Ar');
const footerMarkup = home.match(/<footer class="site-footer research-footer"[\s\S]*?<\/footer>/)?.[0] || '';
assert.ok(footerMarkup,'research-close footer markup should exist');
assert.equal(footerMarkup.includes('footer-language'),false,'footer must not duplicate the language switch');
assert.equal(footerMarkup.includes('footer-theme-toggle'),false,'footer must not duplicate the theme switch');
for(const required of ['footer-close','A daily order of priority for the Egyptian market.','footer-grid','USE /ALPHA','UNDERSTAND /ALPHA','ACCESS','footer-provenance','VERIFY PUBLIC RECORD']) assert.ok(footerMarkup.includes(required),`research-close footer should include ${required}`);
assert.ok(footerMarkup.includes('class="footer-record-link" href="/data/latest.json"'),'footer verification action must preserve the public record target');
assert.equal(footerMarkup.includes('Public quantitative research for the Egyptian Exchange.'),false,'generic footer identity line should be retired');
for(const required of ['.product-ranking','.product-filter-set','@media(max-width:760px)']) assert.ok(productHomeCss.includes(required),`legacy product CSS dependency should remain available for ${required}`);
for(const required of ['.site-footer','grid-template-columns:1fr 1fr','--neutral: #aab4c0','.result-percentile']) assert.ok(productCss.includes(required),`product shell CSS should include ${required}`);
for(const required of ['.alpha-mark','.brand-lockup','.nav-desktop','.mobile-menu','@media (max-width:900px)','@media (max-width:620px)','@media (prefers-reduced-motion:reduce)']) assert.ok(shellCss.includes(required),`research shell CSS should include ${required}`);
assert.equal(shellCss.includes('.footer-grid'),false,'shell CSS must not define footer grid tracks');
for(const required of ['--bg:#010201','--text:#FFFFFF','--brand:#00D084','--bg:#FFFFFF','--text:#050706','--brand:#007A4B','--blue:var(--brand)','.search-action','.language-action','.footer-close','.footer-grid','.footer-provenance','.footer-language,.footer-appearance','.footer-record-link','@media(max-width:620px)']) assert.ok(fineTuneCss.includes(required),`fine-tune identity CSS should include ${required}`);
for(const forbidden of ['#5F7CFF','#7890FF','#3555D9','#2847C4','#5688ff','#5688FF']) assert.equal(fineTuneCss.includes(forbidden),false,`fine-tune identity must not reintroduce blue ${forbidden}`);
for(const required of ['.alpha-control-deck','.alpha-horizon-control','.deck-rank-row','.alpha-market-pulse','.breadth-bar','.mover-columns','.terminal-ranking-control','.terminal-model-head,.terminal-model-row','grid-template-columns:136px 128px minmax(190px,1fr) 150px','@media(max-width:680px)','@media(max-width:430px)','@media(max-width:340px)']) assert.ok(terminalCss.includes(required),`research terminal CSS should include ${required}`);
assert.equal(shellCss.includes('grid-template-columns:repeat(5'),false,'new shell must not reproduce the obsolete five-column navigation grid');
if(production.schema_version==='egx_alpha_public_wire_v2'){assert.ok(Number.isInteger(Number(production.universe_count))&&Number(production.universe_count)>0,'V2 production payload should provide universe_count');assert.ok(home.includes(`/ ${production.universe_count}`),'homepage should render the current public universe count rather than a hardcoded count');}
console.log('test-homepage-layout passed');
