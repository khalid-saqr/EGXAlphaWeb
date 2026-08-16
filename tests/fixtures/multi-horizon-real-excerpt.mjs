// Genuine sanitized excerpts from private EGX /Alpha prediction memory.
// Source session: 2026-08-16. Only rank, symbol, public direction bucket and
// source freshness are retained. This fixture is intentionally incomplete
// (top five rows per horizon) and must never be accepted as a production V2 wire.

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
    universe_count: 88,
    signals: [
      row('EGX:UEGC', 1, 'positive_model_signal'),
      row('EGX:GSSC', 2, 'neutral_model_signal'),
      row('EGX:CEFM', 3, 'positive_model_signal'),
      row('EGX:MILS', 4, 'positive_model_signal'),
      row('EGX:ASCM', 5, 'positive_model_signal')
    ]
  },
  '3': {
    horizon: '3',
    universe_count: 88,
    signals: [
      row('EGX:UEGC', 1, 'neutral_model_signal'),
      row('EGX:ELSH', 2, 'neutral_model_signal'),
      row('EGX:GSSC', 3, 'negative_model_signal'),
      row('EGX:AFDI', 4, 'positive_model_signal'),
      row('EGX:MILS', 5, 'neutral_model_signal')
    ]
  },
  '5': {
    horizon: '5',
    universe_count: 88,
    signals: [
      row('EGX:AFDI', 1, 'neutral_model_signal'),
      row('EGX:UEGC', 2, 'neutral_model_signal'),
      row('EGX:MILS', 3, 'negative_model_signal'),
      row('EGX:ELSH', 4, 'neutral_model_signal'),
      row('EGX:CEFM', 5, 'negative_model_signal')
    ]
  },
  '10': {
    horizon: '10',
    universe_count: 88,
    signals: [
      row('EGX:UEGC', 1, 'neutral_model_signal'),
      row('EGX:ELSH', 2, 'neutral_model_signal'),
      row('EGX:GGCC', 3, 'negative_model_signal'),
      row('EGX:CSAG', 4, 'neutral_model_signal'),
      row('EGX:AFDI', 5, 'neutral_model_signal')
    ]
  }
};

export const realMultiHorizonExcerpt = {
  schema_version: 'egx_alpha_public_wire_v2',
  domain: 'EGXResearch',
  signal_name: 'EGX /Alpha signal',
  audience: 'public',
  trading_date: '2026-08-16',
  primary_horizon: '5',
  universe_count: 88,
  record_origin: 'live',
  signals: windows['5'].signals,
  forecast_windows: windows,
  research_evidence: {
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
    live_validation: {
      status: 'evidence_accumulating',
      governance_threshold_days: 60,
      total_matured_outcomes: 7873,
      scored_prediction_days: 26,
      pending_outcomes: 1763,
      by_horizon: {
        '1': { matured_outcomes: 2308, matured_prediction_days: 26, live_metrics_ready: false, live_mean_rank_ic: null, live_top_bottom_spread_return: null },
        '3': { matured_outcomes: 2126, matured_prediction_days: 24, live_metrics_ready: false, live_mean_rank_ic: null, live_top_bottom_spread_return: null },
        '5': { matured_outcomes: 1944, matured_prediction_days: 22, live_metrics_ready: false, live_mean_rank_ic: null, live_top_bottom_spread_return: null },
        '10': { matured_outcomes: 1495, matured_prediction_days: 17, live_metrics_ready: false, live_mean_rank_ic: null, live_top_bottom_spread_return: null }
      }
    },
    governance: {
      outcomes_scored_after_horizon_maturity: true,
      live_metrics_maturity_gated: true,
      automatic_retraining: false,
      automatic_promotion: false,
      human_review_required: true
    }
  },
  disclaimer: {
    market_use: 'research_and_information_only',
    investment_advice: false,
    execution_instruction: false
  },
  integrity: {}
};

// Genuine prior-session observation used only to prove horizon-specific movement:
// UEGC was #3 on the 1-session horizon on 2026-08-13.
export const realPreviousExcerpt = {
  trading_date: '2026-08-13',
  primary_horizon: '5',
  forecast_windows: {
    '1': {
      horizon: '1',
      universe_count: 88,
      signals: [row('EGX:UEGC', 3, 'positive_model_signal')]
    }
  }
};
