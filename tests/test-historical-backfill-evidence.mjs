import assert from 'node:assert/strict';
import { homePage } from '../src/home.mjs';
import { validatePublicWire } from '../src/validate.mjs';
import { realMultiHorizonExcerpt } from './fixtures/multi-horizon-real-excerpt.mjs';
import { historicalStaticEvidence, realHistoricalBackfillExcerpt } from './fixtures/historical-backfill-real-excerpt.mjs';

// The real Commit-5-derived excerpt is intentionally incomplete, so it must not
// pass the production wire validator; null live evidence itself must not be the
// reason for rejection because this is a historical_backfill record.
const realResult = validatePublicWire(realHistoricalBackfillExcerpt);
assert.equal(realResult.ok, false);
assert.ok(realResult.errors.some(error => error.includes('length (5) must equal universe_count (91)')));
assert.equal(realResult.errors.some(error => error.includes('live_validation may be null')), false);

const historicalHtml = homePage(realHistoricalBackfillExcerpt);
for (const required of [
  'FORECAST WINDOW',
  'data-horizon-select="1"',
  'data-horizon-select="3"',
  'data-horizon-select="5"',
  'data-horizon-select="10"',
  'MODEL EVIDENCE',
  '435,954',
  '+0.0280',
  '+0.18 pp',
  'LIVE REALISED EVIDENCE',
  'NOT RECONSTRUCTED',
  'not retroactively inferred for this historical record',
  'Live realised evidence was not retroactively reconstructed.',
  'HISTORICAL BACKFILL'
]) {
  assert.ok(historicalHtml.includes(required), `historical backfill UI should render ${required}`);
}
assert.equal(historicalHtml.includes('LIVE OUTCOMES SCORED'), false);
assert.equal(historicalHtml.includes('EVIDENCE DAYS'), false);
assert.equal(historicalHtml.includes('evidence accumulating'), false);

// Contract-only probe: a complete small wire proves that null live_validation is
// accepted for historical_backfill but rejected for live records. The market rows
// here are intentionally synthetic and are not used for ranking/movement claims.
const contractRow = {
  stock_symbol: 'EGX:TEST',
  rank_within_horizon: 1,
  direction_bucket: 'neutral_model_signal',
  source_freshness_status: 'live_observation_completed'
};
const contractWindows = Object.fromEntries(['1', '3', '5', '10'].map(horizon => [horizon, {
  horizon,
  universe_count: 1,
  signals: [{ ...contractRow }]
}]));
const completeHistorical = {
  schema_version: 'egx_alpha_public_wire_v2',
  domain: 'EGXResearch',
  signal_name: 'EGX /Alpha signal',
  audience: 'public',
  trading_date: '2026-07-08',
  primary_horizon: '5',
  universe_count: 1,
  record_origin: 'historical_backfill',
  signals: [{ ...contractRow }],
  forecast_windows: contractWindows,
  research_evidence: structuredClone(historicalStaticEvidence),
  disclaimer: {
    market_use: 'research_and_information_only',
    investment_advice: false,
    execution_instruction: false
  },
  integrity: {}
};
assert.deepEqual(validatePublicWire(completeHistorical), { ok: true, errors: [] });

const invalidLive = structuredClone(completeHistorical);
invalidLive.record_origin = 'live';
const invalidLiveResult = validatePublicWire(invalidLive);
assert.equal(invalidLiveResult.ok, false);
assert.ok(invalidLiveResult.errors.includes('research_evidence.live_validation may be null only for historical_backfill records'));

// Preserve the existing live V2 presentation unchanged.
const liveHtml = homePage(realMultiHorizonExcerpt);
for (const required of [
  'Historical validation and live realised-outcome tracking are shown separately.',
  'LIVE OUTCOMES SCORED',
  '1,944',
  '22 / 60',
  'evidence accumulating'
]) {
  assert.ok(liveHtml.includes(required), `live V2 UI regression: expected ${required}`);
}
assert.equal(liveHtml.includes('NOT RECONSTRUCTED'), false);

console.log('test-historical-backfill-evidence passed');
