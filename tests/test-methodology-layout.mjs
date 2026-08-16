import assert from 'node:assert/strict';import fs from 'node:fs';
const html=fs.readFileSync('_site/methodology/index.html','utf8');
for(const required of ['PUBLIC RESEARCH NOTE','EGX /Alpha Methodology','ranking-first deep-learning research system','Research objective: relative opportunity','Observation discipline and time lock','Deep-learning ranking layer','Public publication boundary','sanitized primary-horizon universe ranking','What is public and what remains private','methodology-document-styles'])assert.ok(html.includes(required),`research page should include ${required}`);
for(const stale of ['publishes one bounded public signal','one selected research signal','complete daily rankings, private scores'])assert.equal(html.includes(stale),false,`old single-signal positioning must be removed: ${stale}`);
for(const privateTerm of ['ranking_score','direction_logit','x_seq','symbol_idx','memory/foresight','.onnx.data'])assert.equal(html.includes(privateTerm),false,`private implementation term leaked: ${privateTerm}`);
assert.ok(html.includes('@page{size:A4'));assert.ok(html.includes('break-inside:avoid'));
console.log('test-methodology-layout passed');
