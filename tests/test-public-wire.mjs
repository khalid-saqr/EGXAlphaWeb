import assert from 'node:assert/strict';
import { validatePublicWire } from '../src/validate.mjs';

const valid = JSON.parse(await import('node:fs').then(fs => fs.readFileSync('data/latest.json', 'utf8')));
assert.equal(validatePublicWire(valid).ok, true);

for (const key of ['paid_subscriber', 'creator_full', 'ranking_score', 'direction_logit', 'predictions']) {
  const clone = structuredClone(valid);
  clone[key] = 'leak';
  assert.equal(validatePublicWire(clone).ok, false, `Expected ${key} to be rejected`);
}

const badRank = structuredClone(valid);
badRank.signal.rank_within_horizon = 1;
assert.equal(validatePublicWire(badRank).ok, false, 'Rank other than 3 must be rejected');
console.log('test-public-wire passed');
