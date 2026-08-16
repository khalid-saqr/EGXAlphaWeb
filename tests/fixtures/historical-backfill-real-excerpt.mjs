// Genuine public-safe excerpt from the 2026-07-08 production prediction archive.
// Commit 5 accepts this session as a historical V2 candidate with N=91 at each
// native horizon. Only the first five sanitized rows per horizon are retained
// here for optical/rendering regression; this excerpt is intentionally incomplete
// and must not validate as a publishable full-universe wire.

const freshness = 'live_observation_completed';
const row = (stock_symbol, rank_within_horizon, direction_bucket) => ({
  stock_symbol,
  rank_within_horizon,
  direction_bucket,
  source_freshness_status: freshness
});

const windows = {
  '1': {
    horizon: '1',
    universe_count: 91,
    signals: [
      row('EGX:HDBK', 1, 'negative_model_signal'),
      row('EGX:PHDC', 2, 'positive_model_signal'),
      row('EGX:CCRS', 3, 'neutral_model_signal'),
      row('EGX:ASCM', 4, 'positive_model_signal'),
      row('EGX:AFDI', 5, 'positive_model_signal')
    ]
  },
  '3': {
    horizon: '3',
    universe_count: 91,
    signals: [
      row('EGX:PHDC', 1, 'neutral_model_signal'),
      row('EGX:CIEB', 2, 'positive_model_signal'),
      row('EGX:CCRS', 3, 'negative_model_signal'),
      row('EGX:GBCO', 4, 'positive_model_signal'),
      row('EGX:AFDI', 5, 'neutral_model_signal')
    ]
  },
  '5': {
    horizon: '5',
    universe_count: 91,
    signals: [
      row('EGX:IRAX', 1, 'neutral_model_signal'),
      row('EGX:AIH', 2, 'neutral_model_signal'),
      row('EGX:PHDC', 3, 'negative_model_signal'),
      row('EGX:SWDY', 4, 'neutral_model_signal'),
      row('EGX:GBCO', 5, 'neutral_model_signal')
    ]
  },
  '10': {
    horizon: '10',
    universe_count: 91,
    signals: [
      row('EGX:CIEB', 1, 'positive_model_signal'),
      row('EGX:GBCO', 2, 'neutral_model_signal'),
      row('EGX:COMI', 3, 'neutral_model_signal'),
      row('EGX:ELKA', 4, 'negative_model_signal'),
      row('EGX:COSG', 5, 'negative_model_signal')
    ]
  }
};

export const historicalStaticEvidence = {
  system_scale: {
    historical_model_samples: 435954,
    training_universe_count: 91,
    training_dates: 4129,
    validation_dates: 915,
    heldout_test_dates: 906
  },
  historical_validation: {
    status: 'historical_validation_passed',
    heldout_test_dates: 906,
    by_horizon: {
      '1': { heldout_mean_date_rank_ic: -0.010488130452780832, heldout_top_bottom_spread_return: 0.000255488632717139 },
      '3': { heldout_mean_date_rank_ic: 0.03220093354461174, heldout_top_bottom_spread_return: 0.0006753102460311763 },
      '5': { heldout_mean_date_rank_ic: 0.02803338819087396, heldout_top_bottom_spread_return: 0.001826747505944613 },
      '10': { heldout_mean_date_rank_ic: 0.034442932435659816, heldout_top_bottom_spread_return: 0.004983686574885856 }
    }
  },
  live_validation: null,
  governance: {
    outcomes_scored_after_horizon_maturity: true,
    live_metrics_maturity_gated: true,
    automatic_retraining: false,
    automatic_promotion: false,
    human_review_required: true
  }
};

export const realHistoricalBackfillExcerpt = {
  schema_version: 'egx_alpha_public_wire_v2',
  domain: 'EGXResearch',
  signal_name: 'EGX /Alpha signal',
  audience: 'public',
  trading_date: '2026-07-08',
  primary_horizon: '5',
  universe_count: 91,
  record_origin: 'historical_backfill',
  signals: windows['5'].signals,
  forecast_windows: windows,
  research_evidence: historicalStaticEvidence,
  disclaimer: {
    market_use: 'research_and_information_only',
    investment_advice: false,
    execution_instruction: false
  },
  integrity: {}
};
