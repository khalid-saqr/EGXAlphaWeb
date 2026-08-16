import assert from 'node:assert/strict';
import fs from 'node:fs';
import { homePage, signalsFrom } from '../src/home.mjs';
import { renderSymbolDossierPage } from '../src/render.mjs';

const july8=JSON.parse(fs.readFileSync('tests/fixtures/universe-2026-07-08.json','utf8'));
const july9=JSON.parse(fs.readFileSync('tests/fixtures/universe-2026-07-09.json','utf8'));

assert.equal(july8.universe_count,91,'8 July genuine session must preserve its 91-security universe');
assert.equal(july9.universe_count,88,'9 July genuine session must preserve its 88-security universe');
assert.equal(july8.signals.length,91);assert.equal(july9.signals.length,88);
assert.deepEqual(july8.signals.reduce((a,r)=>(a[r.direction_bucket]=(a[r.direction_bucket]||0)+1,a),{}),{neutral_model_signal:5,negative_model_signal:85,positive_model_signal:1},'8 July fixture must preserve the genuine public direction distribution');
assert.deepEqual(july9.signals.reduce((a,r)=>(a[r.direction_bucket]=(a[r.direction_bucket]||0)+1,a),{}),{neutral_model_signal:3,negative_model_signal:85},'9 July fixture must preserve the genuine public direction distribution');
assert.equal(july8.signals[0].stock_symbol,'EGX:IRAX');assert.equal(july8.signals.at(-1).stock_symbol,'EGX:ACGC');
assert.equal(july9.signals[0].stock_symbol,'EGX:PRCL');assert.equal(july9.signals.at(-1).stock_symbol,'EGX:KABO');

for(const fixture of [july8,july9]){
  assert.deepEqual(fixture.signals.map(row=>row.rank_within_horizon),Array.from({length:fixture.universe_count},(_,i)=>i+1));
  assert.equal(new Set(fixture.signals.map(row=>row.stock_symbol)).size,fixture.universe_count);
  const text=JSON.stringify(fixture);
  for(const forbidden of ['ranking_score','direction_logit','model_version','prediction_id','feature_builder_version','run_id'])assert.equal(text.includes(forbidden),false,`sanitized fixture must not expose ${forbidden}`);
}

const july8Html=homePage(july8);assert.equal((july8Html.match(/data-model-row/g)||[]).length,91,'full-universe UI must render all 91 genuine 8 July rows');
const html=homePage(july9,{previousPayload:july8});
assert.equal((html.match(/data-model-row/g)||[]).length,88,'full-universe UI must render all 88 genuine 9 July rows');
for(const required of ['Cross-sectional ranking','CONSTRUCTIVE','NEUTRAL','CAUTION','data-model-search','EGX /ALPHA','DEEP-LEARNING MARKET RANKING'])assert.ok(html.includes(required),`institutional fixture should render ${required}`);
const comi=html.match(/<div class="model-row"[^>]*data-search-text="comi[\s\S]*?<\/div>\s*<\/div>/i)?.[0]||html.slice(html.indexOf('EGX:COMI')-300,html.indexOf('EGX:COMI')+500);
assert.ok(comi.includes('#</span>004')||comi.includes('004'),'COMI should be rank 4 on genuine 9 July fixture');
assert.ok(comi.includes('+7'),'COMI should improve seven ranks from genuine 8 July rank 11 to 9 July rank 4');

const bySymbol=datePayload=>new Map(signalsFrom(datePayload).map(row=>[row.stock_symbol,row]));
const p8=bySymbol(july8).get('EGX:COMI');const p9=bySymbol(july9).get('EGX:COMI');
const dossier=renderSymbolDossierPage('COMI',[{date:july9.trading_date,rank:p9.rank_within_horizon,direction_bucket:p9.direction_bucket,movement:p8.rank_within_horizon-p9.rank_within_horizon},{date:july8.trading_date,rank:p8.rank_within_horizon,direction_bucket:p8.direction_bucket,movement:null}]);
for(const required of ['INSTRUMENT INTELLIGENCE','COMI','LATEST RANK #4','2026-07-09','2026-07-08','+7'])assert.ok(dossier.includes(required),`symbol dossier should render ${required}`);

const source=fs.readFileSync('src/home.mjs','utf8');
for(const forbidden of ['universeCount(payload, rows) = 88','const universeCount = 88','Array(88)'])assert.equal(source.includes(forbidden),false,'renderer must not hard-code the universe size');
console.log('test-homepage-payload-fixtures passed');
