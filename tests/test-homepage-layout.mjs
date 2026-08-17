import assert from 'node:assert/strict';
import fs from 'node:fs';

const production = JSON.parse(fs.readFileSync('data/latest.json', 'utf8'));
const home = fs.readFileSync('_site/index.html', 'utf8');
const today = fs.readFileSync('_site/today/index.html', 'utf8');
const productHomeCss = fs.readFileSync('assets/product-home.css', 'utf8');
const productCss = fs.readFileSync('assets/product.css', 'utf8');
const shellCss = fs.readFileSync('assets/shell.css', 'utf8');
const terminalCss = fs.readFileSync('assets/research-terminal.css', 'utf8');
function visibleMain(html) { const start=html.indexOf('<main'); const end=html.lastIndexOf('</main>'); return start>=0&&end>=0?html.slice(start,end+7):html; }
for (const page of [home,today]) {
  const html=visibleMain(page);
  for (const required of ['EGX Research','EGX /ALPHA PUBLIC RESEARCH TERMINAL','Deep-learning ranking of Egyptian equities.','After each completed EGX session, /Alpha ranks the eligible stock universe across multiple forward horizons.','WHAT /ALPHA RANKS HIGHEST','TOP 5 · SELECTED HORIZON','RELATIVE RANK','MODEL DIRECTION','RANK MOVE','MARKET PULSE','RANK MOVERS','/ALPHA MARKET RANKING','The complete eligible EGX universe.','POSITIVE','NEUTRAL','NEGATIVE','HOW TO READ /ALPHA','RESEARCH EVIDENCE','PUBLIC MODEL MEMORY','EGX Research Community LLP','https://knowdyn.com','https://60arabia.com','footer-disclaimer','site-footer','SEARCH','INSTITUTIONAL','aria-current="page"','brand-lockup','alpha-mark','research-footer','nav-desktop','mobile-menu']) assert.ok(html.includes(required),`product UI should include ${required}`);
  for (const removed of ['RANK PERCENTILE · ZOOMED 90–100','Bar length is public rank percentile','NEXT MODEL OUTLOOK','WHAT /ALPHA SEES NEXT','Highest-ranked public forecasts','hero-forward-1','hero-forward-3','data-hero-forecast-panel','data-hero-chart','Loading historical rank percentile','DEEP-LEARNING MARKET RANKING','Cross-sectional ranking','OBSERVE','VALIDATE','INFER','PUBLISH','CONSTRUCTIVE','CAUTION','mega-footer']) assert.equal(html.includes(removed),false,`old or misleading homepage construct must be removed: ${removed}`);
  if (production.schema_version==='egx_alpha_public_wire_v1') assert.ok(html.includes('PUBLICATION NOTE'));
  else if (production.schema_version==='egx_alpha_public_wire_v2') for(const required of ['FORECAST HORIZON','>1D<','>3D<','>5D<','>10D<','D = trading days','data-horizon-select="1"','data-horizon-select="10"','PRIMARY RESEARCH VIEW','data-horizon-panel="1"','data-horizon-panel="3"','data-horizon-panel="5"','data-horizon-panel="10"']) assert.ok(html.includes(required),`V2 product UI should include ${required}`);
  else assert.fail(`unexpected production schema: ${production.schema_version}`);
}
assert.ok(home.includes('<meta name="theme-color" content="#070B14">'),'dark Midnight Lapis should remain the shell theme color');
for(const required of ['.product-ranking','.product-filter-set','@media(max-width:760px)']) assert.ok(productHomeCss.includes(required),`legacy product CSS dependency should remain available for ${required}`);
for(const required of ['.site-footer','grid-template-columns:1fr 1fr','--neutral: #aab4c0','.result-percentile']) assert.ok(productCss.includes(required),`product shell CSS should include ${required}`);
for(const required of ['--bg: #070B14','--surface: #0D1420','--brand: #5F7CFF','--bg: #F6F1E6','--surface: #FFFDF8','--brand: #3555D9','--positive: #39D98A','--neutral: #F2C14E','--negative: #FF6B6B','.alpha-mark','.brand-lockup','.nav-desktop','.mobile-menu','.research-footer.site-footer','.footer-theme-toggle','@media (max-width:900px)','@media (max-width:620px)','@media (prefers-reduced-motion:reduce)']) assert.ok(shellCss.includes(required),`research shell CSS should include ${required}`);
for(const required of ['.alpha-control-deck','.alpha-horizon-control','.deck-rank-row','.alpha-market-pulse','.breadth-bar','.mover-columns','.terminal-ranking-control','.terminal-model-head,.terminal-model-row','grid-template-columns:136px 128px minmax(190px,1fr) 150px','@media(max-width:680px)','@media(max-width:430px)','@media(max-width:340px)']) assert.ok(terminalCss.includes(required),`research terminal CSS should include ${required}`);
assert.equal(shellCss.includes('grid-template-columns:repeat(5'),false,'new shell must not reproduce the obsolete five-column navigation grid');
if(production.schema_version==='egx_alpha_public_wire_v2'){assert.ok(Number.isInteger(Number(production.universe_count))&&Number(production.universe_count)>0,'V2 production payload should provide universe_count');assert.ok(home.includes(`/ ${production.universe_count}`),'homepage should render the current public universe count rather than a hardcoded count');}
console.log('test-homepage-layout passed');
