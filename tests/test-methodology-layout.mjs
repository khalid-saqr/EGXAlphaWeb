import assert from 'node:assert/strict';import fs from 'node:fs';
const html=fs.readFileSync('_site/methodology/index.html','utf8');
for(const required of ['HOW /ALPHA WORKS','A quantitative ranking system, not a recommendation engine.','PUBLIC OUTLOOKS','1D / 3D / 5D / 10D','DEFAULT VIEW','5D','Rank and signal answer different questions.','Quantitative public interpretation','Rank percentile is derived only from public rank','Observation discipline and time lock','Deep-learning ranking layer','Public publication boundary','What is public and what remains private','methodology-document-styles'])assert.ok(html.includes(required),`research page should include ${required}`);
for(const stale of ['publishes one bounded public signal','one selected research signal','sanitized primary-horizon universe ranking','1 / 3 / 5 / 10 S'])assert.equal(html.includes(stale),false,`old positioning must be removed: ${stale}`);
for(const privateTerm of ['ranking_score','direction_logit','x_seq','symbol_idx','memory/foresight','.onnx.data'])assert.equal(html.includes(privateTerm),false,`private implementation term leaked: ${privateTerm}`);
assert.ok(html.includes('@page{size:A4'));assert.ok(html.includes('break-inside:avoid'));
console.log('test-methodology-layout passed');
