import assert from 'node:assert/strict';
import fs from 'node:fs';
import { homePage } from '../src/home.mjs';

function payload(symbol, name, rank, date, change) {
  return {
    schema_version: 'egx_alpha_public_wire_v1',
    audience: 'public',
    domain: 'EGXResearch',
    signal_name: 'EGX /Alpha signal',
    trading_date: date,
    published_at: `${date}T15:10:00Z`,
    asset: {
      symbol: `EGX:${symbol}`,
      display_symbol: symbol,
      company_name: name,
      sector: name ? 'Test sector' : null,
      market: 'EGX',
      liquidity_tier: 'core_liquid'
    },
    public_signal: {
      stock_symbol: `EGX:${symbol}`,
      direction_bucket: 'neutral_model_signal',
      plain_direction: 'Neutral watch',
      rank_within_horizon: rank,
      horizon: '5',
      horizon_label: '5-session horizon'
    },
    ranking_context: {
      comparison_count: 41,
      rank_direction_relationship: 'SUPPRESSED_NOTE'
    },
    market_snapshot: {
      latest_close: 7.5,
      daily_change_pct: change,
      traded_value_egp: 2200000,
      volume: 310000
    },
    public_copy: {
      direction_explanation: 'Neutral model reading for the fixture.',
      rank_explanation: `Ranked #${rank} in the fixture comparison set.`,
      use_guidance: 'Use the fixture as a research starting point.',
      rank_direction_note: 'SUPPRESSED_NOTE'
    },
    funnel_context: {
      full_product_hint: 'Fixture full-product message.'
    },
    model_state: {},
    publishing_context: {
      published_after: 'EGX close'
    }
  };
}

const longHtml = homePage(payload('ULTRALONG12', 'A deliberately long listed company name', 8, '2031-11-19', 12.34));
const sparseHtml = homePage(payload('X1', null, 2, '2032-02-07', null));

for (const expected of ['ULTRALONG12', 'A deliberately long listed company name', '#8', '19 Nov 2031']) {
  assert.ok(longHtml.includes(expected), `long fixture should render ${expected}`);
}
for (const expected of ['X1', 'EGX:X1', '#2', '07 Feb 2032', 'Traded value']) {
  assert.ok(sparseHtml.includes(expected), `sparse fixture should render ${expected}`);
}

assert.ok(longHtml.includes('symbol-long'));
assert.equal(longHtml.includes('X1'), false);
assert.equal(sparseHtml.includes('null'), false);
assert.equal(sparseHtml.includes('undefined'), false);
assert.equal(longHtml.includes('SUPPRESSED_NOTE'), false);
assert.equal(sparseHtml.includes('SUPPRESSED_NOTE'), false);

const source = fs.readFileSync('src/home.mjs', 'utf8');
for (const forbidden of ['ULTRALONG12', 'EGX:X1', 'PHDC', 'Palm Hills']) {
  assert.equal(source.includes(forbidden), false, `renderer must not hardcode ${forbidden}`);
}

console.log('test-homepage-payload-fixtures passed');
