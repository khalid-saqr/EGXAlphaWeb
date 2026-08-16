import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validatePublicWire } from '../src/validate.mjs';
import { asPublicV2Fixture } from './helpers/v2-fixture.mjs';

const v1 = JSON.parse(fs.readFileSync('data/latest.json', 'utf8'));
assert.equal(validatePublicWire(v1).ok, true, 'current production V1 wire must remain valid during transition');

for (const key of ['paid_subscriber', 'creator_full', 'ranking_score', 'direction_logit', 'predictions', 'model_version', 'prediction_id', 'feature_builder_version', 'run_id']) {
  const clone = structuredClone(v1);
  clone[key] = 'leak';
  assert.equal(validatePublicWire(clone).ok, false, `Expected ${key} to be rejected`);
}

const badV1Rank = structuredClone(v1);
badV1Rank.signal.rank_within_horizon = 1;
assert.equal(validatePublicWire(badV1Rank).ok, false, 'V1 rank other than 3 must remain rejected');

const july8Raw = JSON.parse(fs.readFileSync('tests/fixtures/universe-2026-07-08.json', 'utf8'));
const july9Raw = JSON.parse(fs.readFileSync('tests/fixtures/universe-2026-07-09.json', 'utf8'));
const july8 = asPublicV2Fixture(july8Raw);
const july9 = asPublicV2Fixture(july9Raw);

assert.equal(july8.universe_count, 91, 'V2 fixture must preserve genuine 8 July universe size');
assert.equal(july9.universe_count, 88, 'V2 fixture must preserve genuine 9 July universe size');
assert.equal(validatePublicWire(july8).ok, true, 'genuine 91-security V2 fixture must validate');
assert.equal(validatePublicWire(july9).ok, true, 'genuine 88-security V2 fixture must validate');

function expectInvalid(mutator, message) {
  const clone = structuredClone(july9);
  mutator(clone);
  const result = validatePublicWire(clone);
  assert.equal(result.ok, false, message);
}

expectInvalid(p => { p.universe_count = 91; }, 'universe_count mismatch must be rejected');
expectInvalid(p => { p.signals[1].rank_within_horizon = p.signals[0].rank_within_horizon; }, 'duplicate rank must be rejected');
expectInvalid(p => { p.signals.at(-1).rank_within_horizon = 89; }, 'rank gap must be rejected');
expectInvalid(p => { p.signals[1].stock_symbol = p.signals[0].stock_symbol; }, 'duplicate symbol must be rejected');
expectInvalid(p => { delete p.signals[4].rank_within_horizon; }, 'missing rank must be rejected');
expectInvalid(p => { p.signals[0].direction_bucket = 'strong_buy'; }, 'unknown direction bucket must be rejected');
expectInvalid(p => { p.primary_horizon = '3'; }, 'non-primary horizon must be rejected');
expectInvalid(p => { p.record_origin = 'historical_fixture'; }, 'unknown record origin must be rejected');
expectInvalid(p => { p.signals[0].ranking_score = 0.99; }, 'private ranking score must be rejected');
expectInvalid(p => { p.signals[0].company_name = 'Unexpected enrichment'; }, 'V2 row fields outside the allowlist must be rejected');
expectInvalid(p => { p.extra_public_field = 'not contracted'; }, 'V2 top-level fields outside the allowlist must be rejected');

const unknown = structuredClone(july9);
unknown.schema_version = 'egx_alpha_public_wire_v3';
assert.equal(validatePublicWire(unknown).ok, false, 'unknown schema must be rejected');

console.log('test-public-wire passed');
