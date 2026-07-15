import assert from 'node:assert/strict';
import fs from 'node:fs';
import { homePage } from '../src/home.mjs';

function payload({ symbol, name, rank, date, change, direction }) {
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
      direction_bucket: direction,
      plain_direction: 'VERBOSE_DIRECTION_LABEL',
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
      direction_explanation: 'VERBOSE_DIRECTION_EXPLANATION',
      rank_explanation: `VERBOSE_RANK_EXPLANATION_${rank}`,
      use_guidance: 'VERBOSE_USE_GUIDANCE',
      rank_direction_note: 'SUPPRESSED_NOTE'
    },
    funnel_context: {
      full_product_hint: 'VERBOSE_FULL_PRODUCT_MESSAGE'
    },
    model_state: {},
    publishing_context: {
      published_after: 'EGX close'
    }
  };
}

const positiveHtml = homePage(payload({ symbol: 'ULTRALONG12', name: 'A deliberately long listed company name', rank: 8, date: '2031-11-19', change: 12.34, direction: 'positive_model_signal' }));
const neutralHtml = homePage(payload({ symbol: 'X1', name: null, rank: 2, date: '2032-02-07', change: null, direction: 'neutral_model_signal' }));
const cautionHtml = homePage(payload({ symbol: 'RISK', name: 'Risk Test Company', rank: 3, date: '2032-03-01', change: -2.4, direction: 'negative_model_signal' }));

for (const expected of [
  'ULTRALONG12',
  'A deliberately long listed company name',
  '#8',
  'out of 41 stocks',
  'Positive signal',
  'The model leans positive for this period.',
  '19 Nov 2031'
]) {
  assert.ok(positiveHtml.includes(expected), `positive fixture should render ${expected}`);
}

for (const expected of [
  'X1',
  'EGX:X1',
  '#2',
  'No clear signal',
  'The model sees no clear direction for this period.',
  '07 Feb 2032',
  'Traded value'
]) {
  assert.ok(neutralHtml.includes(expected), `neutral fixture should render ${expected}`);
}

for (const expected of ['RISK', 'Caution signal', 'The model leans negative for this period.']) {
  assert.ok(cautionHtml.includes(expected), `caution fixture should render ${expected}`);
}

assert.ok(positiveHtml.includes('symbol-long'));
assert.equal(positiveHtml.includes('X1'), false);
assert.equal(neutralHtml.includes('null'), false);
assert.equal(neutralHtml.includes('undefined'), false);

for (const suppressed of [
  'SUPPRESSED_NOTE',
  'VERBOSE_DIRECTION_LABEL',
  'VERBOSE_DIRECTION_EXPLANATION',
  'VERBOSE_RANK_EXPLANATION',
  'VERBOSE_USE_GUIDANCE',
  'VERBOSE_FULL_PRODUCT_MESSAGE'
]) {
  assert.equal(positiveHtml.includes(suppressed), false, `renderer should suppress payload jargon: ${suppressed}`);
  assert.equal(neutralHtml.includes(suppressed), false, `renderer should suppress payload jargon: ${suppressed}`);
}

const source = fs.readFileSync('src/home.mjs', 'utf8');
for (const forbidden of ['ULTRALONG12', 'EGX:X1', 'PHDC', 'Palm Hills']) {
  assert.equal(source.includes(forbidden), false, `renderer must not hardcode ${forbidden}`);
}

console.log('test-homepage-payload-fixtures passed');
