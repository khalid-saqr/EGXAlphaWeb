import assert from 'node:assert/strict';
import fs from 'node:fs';

const production = JSON.parse(fs.readFileSync('data/latest.json', 'utf8'));
const home = fs.readFileSync('_site/index.html', 'utf8');
const today = fs.readFileSync('_site/today/index.html', 'utf8');
const productHomeCss = fs.readFileSync('assets/product-home.css', 'utf8');
const forwardHeroCss = fs.readFileSync('assets/forward-hero.css', 'utf8');
const productCss = fs.readFileSync('assets/product.css', 'utf8');
const shellCss = fs.readFileSync('assets/shell.css', 'utf8');
function visibleMain(html) { const start=html.indexOf('<main'); const end=html.lastIndexOf('</main>'); return start>=0&&end>=0?html.slice(start,end+7):html; }
for (const page of [home,today]) {
  const html=visibleMain(page);
  for (const required of ['EGX Research','NEXT MODEL OUTLOOK','Deep learning forecast of the EGX stocks ranking.',"EGX /Alpha helps investors structure forward-looking decisions by showing which eligible EGX stocks the deep-learning model ranks strongest for tomorrow",'After each completed market session, the engine forecasts relative future stock performance across the eligible universe','WHAT /ALPHA SEES NEXT','Highest-ranked public forecasts','RANK PERCENTILE · ZOOMED 90–100','NEXT TRADING DAY','THREE TRADING DAYS','Δ','RANK PERCENTILE',"TODAY'S MARKET RANKING",'POSITIVE','NEUTRAL','NEGATIVE','HOW TO READ /ALPHA','MODEL EVIDENCE','EGX Research Community LLP','https://knowdyn.com','https://60arabia.com','footer-disclaimer','site-footer','SEARCH','INSTITUTIONAL','aria-current="page"','brand-lockup','alpha-mark','research-footer','nav-desktop','mobile-menu']) assert.ok(html.includes(required),`product UI should include ${required}`);
  for (const removed of ['EGXRESEARCH',"Tomorrow's strongest model forecasts.","Use 1D to prioritise tomorrow's research and 3D to see whether the view persists.",'After each EGX close, /Alpha ranks the eligible market for the next trading day.','access@egxresearch.com','See how the model ranks the Egyptian market.','data-hero-chart','Loading historical rank percentile','DEEP-LEARNING MARKET RANKING','Cross-sectional ranking','OBSERVE','VALIDATE','INFER','PUBLISH','CONSTRUCTIVE','CAUTION','mega-footer']) assert.equal(html.includes(removed),false,`stale project/history-first component or copy must be removed: ${removed}`);
  if (production.schema_version==='egx_alpha_public_wire_v1') assert.ok(html.includes('PUBLICATION NOTE'));
  else if (production.schema_version==='egx_alpha_public_wire_v2') for(const required of ['OUTLOOK','>1D<','>3D<','>5D<','>10D<','D = trading days','data-horizon-select="1"','data-horizon-select="10"','id="hero-forward-1"','id="hero-forward-3"','data-hero-forecast-panel="1"','data-hero-forecast-panel="3"']) assert.ok(html.includes(required),`V2 product UI should include ${required}`);
  else assert.fail(`unexpected production schema: ${production.schema_version}`);
}
assert.ok(home.includes('<meta name="theme-color" content="#070B14">'),'dark Midnight Lapis should be the shell theme color');
for(const required of ['.product-hero','.product-model-head,.product-model-row','grid-template-columns:112px 86px 64px minmax(190px,1fr) 144px','.product-filter-set','@media(max-width:560px)']) assert.ok(productHomeCss.includes(required),`product home CSS should include ${required}`);
for(const required of ['.forward-board','.hero-forecast-row','.forecast-rail','--forecast-fill','var(--positive)','var(--neutral)','var(--negative)',':root[data-theme="light"] .forward-board','@media(max-width:620px)']) assert.ok(forwardHeroCss.includes(required),`forward hero CSS should include ${required}`);
for(const required of ['.site-footer','grid-template-columns:1fr 1fr','--neutral: #aab4c0','.result-percentile']) assert.ok(productCss.includes(required),`product shell CSS should include ${required}`);
for(const required of [
  '--bg: #070B14',
  '--surface: #0D1420',
  '--brand: #5F7CFF',
  '--bg: #F6F1E6',
  '--surface: #FFFDF8',
  '--brand: #3555D9',
  '--positive: #39D98A',
  '--neutral: #F2C14E',
  '--negative: #FF6B6B',
  '.alpha-mark',
  '.brand-lockup',
  '.nav-desktop',
  '.mobile-menu',
  '.research-footer.site-footer',
  '.footer-theme-toggle',
  '@media (max-width:900px)',
  '@media (max-width:620px)',
  '@media (prefers-reduced-motion:reduce)'
]) assert.ok(shellCss.includes(required),`research shell CSS should include ${required}`);
assert.equal(shellCss.includes('grid-template-columns:repeat(5'),false,'new shell must not reproduce the obsolete five-column navigation grid');
if(production.schema_version==='egx_alpha_public_wire_v2') assert.ok(home.includes('/ 88'));
console.log('test-homepage-layout passed');
