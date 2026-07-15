import assert from 'node:assert/strict';
import fs from 'node:fs';
import { homePage } from '../src/home.mjs';

function fixture({
  symbol,
  displaySymbol,
  companyName,
  sector,
  directionBucket,
  plainDirection,
  rank,
  horizon,
  tradingDate,
  close,
  dailyChange,
  tradedValue,
  volume,
  liquidity,
  investorRead,
  modelLabel
}) {
  return {
    schema_version: 'egx_alpha_public_wire_v1',
    audience: 'public',
    domain: 'EGXResearch',
    signal_name: 'EGX /Alpha signal',
    trading_date: tradingDate,
    published_at: `${tradingDate}T15:10:00+00:00`,
    asset: {
      symbol,
      display_symbol: displaySymbol,
      company_name: companyName,
      sector,
      market: 'EGX',
      liquidity_tier: liquidity
    },
    public_signal: {
      stock_symbol: symbol,
      direction_bucket: directionBucket,
      plain_direction: plainDirection,
      rank_within_horizon: rank,
      rank_label: `Public rank #${rank}`,
      horizon: String(horizon),
      horizon_label: `${horizon}-session horizon`,
      source_freshness_status: 'live_observation_completed'
    },
    market_snapshot: {
      latest_close: close,
      daily_change_pct: dailyChange,
      traded_value_egp: tradedValue,
      volume,
      liquidity_tier: liquidity
    },
    public_copy: {
      headline: `Dynamic public signal: ${displaySymbol}`,
      investor_read: investorRead,
      one_line_summary: `Dynamic rank ${rank} for ${horizon} sessions.`
    },
    funnel_context: {
      public_position: 'one public signal from the dynamic daily ranking',
      full_product_hint: 'Dynamic full-product message for the complete ranked list and signal history.'
    },
    model_state: {
      public_label: modelLabel,
      public_note: 'Dynamic public model note for the current evidence state.'
    },
    publishing_context: {
      published_after: 'EGX close',
      published_at_utc: `${tradingDate}T15:10:00+00:00`,
      timezone: 'Africa/Cairo'
    }
  };
}

const longFixture = fixture({
  symbol: 'EGX:ULTRALONG12',
  displaySymbol: 'ULTRALONG12',
  companyName: 'A deliberately long Egyptian listed company name for layout testing',
  sector: 'Industrial services and diversified operations',
  directionBucket: 'positive_model_signal',
  plainDirection: 'Constructive / upside-pressure signal',
  rank: 8,
  horizon: 10,
  tradingDate: '2031-11-19',
  close: 123456.789,
  dailyChange: 12.34,
  tradedValue: 9876543210,
  volume: 456789012,
  liquidity: 'core_liquid',
  investorRead: 'Constructive pressure with a deliberately extended investor explanation for responsive layout testing.',
  modelLabel: 'Stable public tracking'
});

const sparseFixture = fixture({
  symbol: 'EGX:X1',
  displaySymbol: 'X1',
  companyName: null,
  sector: null,
  directionBucket: 'neutral_model_signal',
  plainDirection: 'Neutral watch',
  rank: 2,
  horizon: 3,
  tradingDate: '2032-02-07',
  close: 7.5,
  dailyChange: null,
  tradedValue: 2200000,
  volume: 310000,
  liquidity: 'core_liquid',
  investorRead: 'Neutral watch. This is a public market-intelligence signal to follow, not a trade instruction.',
  modelLabel: null
});

const recentItems = [
  { date: '2032-02-06', symbol: 'EGX:R1', display_symbol: 'R1', plain_direction: 'Caution', horizon: '5', url: '/archive/2032-02-06/' },
  { date: '2032-02-05', symbol: 'EGX:R2', display_symbol: 'R2', plain_direction: 'Constructive', horizon: '10', url: '/archive/2032-02-05/' },
  { date: '2032-02-04', symbol: 'EGX:R3', display_symbol: 'R3', plain_direction: 'Neutral', horizon: '3', url: '/archive/2032-02-04/' },
  { date: '2032-02-03', symbol: 'EGX:R4', display_symbol: 'R4', plain_direction: 'Neutral', horizon: '3', url: '/archive/2032-02-03/' }
];

const longHtml = homePage(longFixture, { canonicalPath: '/', recentItems });
const sparseHtml = homePage(sparseFixture, { canonicalPath: '/', recentItems });

for (const value of [
  'ULTRALONG12',
  'A deliberately long Egyptian listed company name for layout testing',
  'Industrial services and diversified operations',
  'Constructive / upside-pressure signal',
  '#8',
  '10 EGX sessions',
  '19 Nov 2031',
  'Dynamic full-product message for the complete ranked list and signal history.'
]) {
  assert.ok(longHtml.includes(value), `long fixture should render dynamic value: ${value}`);
}
assert.ok(longHtml.includes('symbol-long'), 'long ticker should select the non-truncating long-symbol class');
assert.equal(longHtml.includes('X1'), false, 'long fixture must not contain values from the sparse fixture');

for (const value of ['X1', 'EGX:X1', 'Neutral watch', '#2', '3 EGX sessions', '07 Feb 2032']) {
  assert.ok(sparseHtml.includes(value), `sparse fixture should render dynamic value: ${value}`);
}
assert.equal(sparseHtml.includes('Stable public tracking'), false, 'missing optional model label should remove the badge');
assert.equal(sparseHtml.includes('null'), false, 'nullable fields must not render as literal null');
assert.equal(sparseHtml.includes('undefined'), false, 'missing fields must not render as literal undefined');
assert.ok(sparseHtml.includes('Traded value'), 'traded value should replace missing daily change');
assert.equal((sparseHtml.match(/class="recent-record"/g) || []).length, 3, 'recent public records should be capped at three');

const source = fs.readFileSync('src/home.mjs', 'utf8');
for (const forbiddenHardcode of [
  'ULTRALONG12',
  'EGX:X1',
  'PHDC',
  '2026-07-14',
  'Palm Hills',
  '14.7'
]) {
  assert.equal(source.includes(forbiddenHardcode), false, `renderer source must not hardcode a daily stock value: ${forbiddenHardcode}`);
}

console.log('test-homepage-payload-fixtures passed');
