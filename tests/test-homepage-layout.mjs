import assert from 'node:assert/strict';
import fs from 'node:fs';

const production = JSON.parse(fs.readFileSync('data/latest.json', 'utf8'));
const home = fs.readFileSync('_site/index.html', 'utf8');
const today = fs.readFileSync('_site/today/index.html', 'utf8');
const productHomeCss = fs.readFileSync('assets/product-home.css', 'utf8');
const productCss = fs.readFileSync('assets/product.css', 'utf8');
function visibleMain(html) { const start=html.indexOf('<main'); const end=html.lastIndexOf('</main>'); return start>=0&&end>=0?html.slice(start,end+7):html; }
for (const page of [home,today]) {
  const html=visibleMain(page);
  for (const required of ['LATEST COMPLETED MODEL RUN','See how the model ranks the Egyptian market.','RANK PERCENTILE',"TODAY'S MARKET RANKING",'POSITIVE','NEUTRAL','NEGATIVE','HOW TO READ /ALPHA','MODEL EVIDENCE','data-hero-chart','site-footer','SEARCH','INSTITUTIONAL','aria-current="page"']) assert.ok(html.includes(required),`product UI should include ${required}`);
  for (const removed of ['DEEP-LEARNING MARKET RANKING','Cross-sectional ranking','OBSERVE','VALIDATE','INFER','PUBLISH','CONSTRUCTIVE','CAUTION','mega-footer']) assert.equal(html.includes(removed),false,`research-project-facing component/copy must be removed: ${removed}`);
  if (production.schema_version==='egx_alpha_public_wire_v1') assert.ok(html.includes('PUBLICATION NOTE'));
  else if (production.schema_version==='egx_alpha_public_wire_v2') for(const required of ['OUTLOOK','>1D<','>3D<','>5D<','>10D<','D = trading days','data-horizon-select="1"','data-horizon-select="10"']) assert.ok(html.includes(required),`V2 product UI should include ${required}`);
  else assert.fail(`unexpected production schema: ${production.schema_version}`);
}
for(const required of ['.product-hero','.leader-card','.product-model-head,.product-model-row','grid-template-columns:112px 86px 64px minmax(190px,1fr) 144px','.product-filter-set','@media(max-width:560px)']) assert.ok(productHomeCss.includes(required),`product home CSS should include ${required}`);
for(const required of ['.site-footer','grid-template-columns:1fr 1fr','--neutral: #aab4c0','.result-percentile']) assert.ok(productCss.includes(required),`product shell CSS should include ${required}`);
if(production.schema_version==='egx_alpha_public_wire_v2') assert.ok(home.includes('/ 88'));
console.log('test-homepage-layout passed');
