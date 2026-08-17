import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildSymbolHistories, indexItems } from '../src/build.mjs';
import { renderArchivePage, renderSearchPage, renderSignalPage, renderSymbolDossierPage } from '../src/render.mjs';
import { realMultiHorizonExcerpt, realPreviousExcerpt } from './fixtures/multi-horizon-real-excerpt.mjs';

const payload=structuredClone(realMultiHorizonExcerpt);
payload.integrity={public_content_hash:'sha256:1234567890abcdef1234567890abcdef',public_wire_hash:'sha256:abcdef1234567890abcdef1234567890'};
const live=renderSignalPage(payload,'/today/');
for(const required of ['VERIFY PUBLIC RECORD','2026-08-16','Live model record','88 STOCKS','1D · 3D · 5D · 10D','sha256:1234567890abcd…','VIEW PUBLIC JSON','data/latest.json'])assert.ok(live.includes(required),`live verification should render ${required}`);
assert.ok(live.indexOf('VERIFY PUBLIC RECORD')<live.indexOf('<footer class="site-footer research-footer"'),'verification must appear before the mega-footer');
const archived=renderSignalPage({...payload,record_origin:'historical_backfill'},'/archive/2026-08-16/');
for(const required of ['Historical model record','data/archive/2026-08-16.json'])assert.ok(archived.includes(required),`archive verification should render ${required}`);

const items=[
  {date:'2026-08-16',universe_count:88,published_count:88,horizon:'5',multi_horizon:true,record_origin:'live',schema_version:'egx_alpha_public_wire_v2',url:'/archive/2026-08-16/'},
  {date:'2026-08-15',universe_count:91,published_count:91,horizon:'5',multi_horizon:true,record_origin:'historical_backfill',schema_version:'egx_alpha_public_wire_v2',url:'/archive/2026-08-15/'}
];
const archive=renderArchivePage(items);for(const required of ['PUBLIC MODEL MEMORY','PUBLIC SESSIONS','LIVE RECORDS','HISTORICAL RECORDS','NATIVE HORIZONS','OPEN SESSION','SEARCH MODEL MEMORY'])assert.ok(archive.includes(required),`model memory should render ${required}`);
const search=renderSearchPage();for(const required of ['SEARCH PUBLIC MODEL MEMORY','SEARCH /ALPHA MEMORY','TICKER · DATE · HORIZON · MODEL DIRECTION','MICH','2026-08-17','5D','Positive'])assert.ok(search.includes(required),`research search should render ${required}`);

const current=indexItems(realMultiHorizonExcerpt);const previous=indexItems(realPreviousExcerpt);const histories=buildSymbolHistories([...previous,...current]);const uegc=histories.get('UEGC');assert.ok(uegc);
const dossier=renderSymbolDossierPage('UEGC',uegc);
for(const required of ['EGX /ALPHA STOCK RESEARCH','5D PRIMARY VIEW','TODAY ACROSS HORIZONS','One stock. Four forward model views.','data-horizon-select="1"','data-horizon-select="10"','PRIMARY RESEARCH VIEW','SELECTED HORIZON DETAIL','RELATIVE RANK HISTORY','LAST 30 PUBLIC SESSIONS','secondary normalization','PUBLIC MODEL HISTORY','MODEL DIRECTION','RANK MOVE'])assert.ok(dossier.includes(required),`dossier should render ${required}`);
assert.equal((dossier.match(/class="dossier-horizon-card/g)||[]).length,4,'multi-horizon dossier should expose exactly four public horizon cards');
assert.ok(dossier.includes('↑ 2 PLACES'),'rank movement should be human-readable');
assert.ok(dossier.includes('NO PRIOR RANK'),'missing previous observations must not be mislabelled as unchanged');
assert.ok(dossier.includes('RANK PERCENTILE'),'deeper dossier research should preserve percentile normalization');
assert.equal(dossier.includes('Δ RANK'),false,'dossier should not revert to quant shorthand');

const css=fs.readFileSync('assets/research-depth.css','utf8');for(const required of ['.record-verification','.dossier-horizon-grid','.research-dossier-row','.memory-session','.research-search-panel','@media(max-width:520px)','@media(max-width:360px)','margin-inline-start','text-align:start'])assert.ok(css.includes(required),`research depth CSS should include ${required}`);
console.log('test-research-depth passed');
