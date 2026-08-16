export function asPublicV2Fixture(fixture, { recordOrigin = 'historical_backfill' } = {}) {
  return {
    schema_version: 'egx_alpha_public_wire_v2',
    domain: 'EGXResearch',
    signal_name: 'EGX /Alpha signal',
    audience: 'public',
    trading_date: fixture.trading_date,
    primary_horizon: String(fixture.primary_horizon),
    universe_count: Number(fixture.universe_count),
    record_origin: recordOrigin,
    signals: (fixture.signals || []).map(row => ({
      stock_symbol: row.stock_symbol,
      rank_within_horizon: row.rank_within_horizon,
      direction_bucket: row.direction_bucket,
      source_freshness_status: row.source_freshness_status
    })),
    disclaimer: {
      market_use: 'research_and_information_only',
      investment_advice: false,
      execution_instruction: false
    },
    integrity: {}
  };
}
