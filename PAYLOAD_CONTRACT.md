# EGX /Alpha public payload contract

The public site accepts two schema versions during the migration:

- `egx_alpha_public_wire_v1` — temporary compatibility for the existing single rank-#3 production wire.
- `egx_alpha_public_wire_v2` — canonical complete-universe public wire.

V2 retains the 5-session ranking as its canonical top-level/default view. During Commit 3B the site also understands an optional paired extension for the engine's native 1/3/5/10-session research windows and public-safe model evidence. Commit 4 will be responsible for exporting that extension from the private repo.

## V2 canonical payload

```json
{
  "schema_version": "egx_alpha_public_wire_v2",
  "domain": "EGXResearch",
  "signal_name": "EGX /Alpha signal",
  "audience": "public",
  "trading_date": "2026-08-16",
  "primary_horizon": "5",
  "universe_count": 88,
  "record_origin": "live",
  "signals": [
    {
      "stock_symbol": "EGX:COMI",
      "rank_within_horizon": 1,
      "direction_bucket": "positive_model_signal",
      "source_freshness_status": "live_observation_completed"
    }
  ],
  "disclaimer": {
    "market_use": "research_and_information_only",
    "investment_advice": false,
    "execution_instruction": false
  },
  "integrity": {}
}
```

For a historical reconstruction, `record_origin` is `historical_backfill`. A backfilled record represents validated dated /Alpha prediction memory reconstructed into the public contract; it must not be described as having been publicly visible on the original analysis date.

## Optional multi-horizon V2 extension

`forecast_windows` and `research_evidence` are a pair: either both are absent for compatibility or both are present.

```json
{
  "forecast_windows": {
    "1": { "horizon": "1", "universe_count": 88, "signals": [] },
    "3": { "horizon": "3", "universe_count": 88, "signals": [] },
    "5": { "horizon": "5", "universe_count": 88, "signals": [] },
    "10": { "horizon": "10", "universe_count": 88, "signals": [] }
  },
  "research_evidence": {
    "system_scale": {
      "historical_model_samples": 435954,
      "training_universe_count": 91,
      "training_dates": 4129,
      "validation_dates": 915,
      "heldout_test_dates": 906
    },
    "historical_validation": {
      "status": "historical_validation_passed",
      "heldout_test_dates": 906,
      "by_horizon": {}
    },
    "live_validation": {
      "status": "evidence_accumulating",
      "governance_threshold_days": 60,
      "total_matured_outcomes": 7873,
      "scored_prediction_days": 26,
      "pending_outcomes": 1763,
      "by_horizon": {}
    },
    "governance": {
      "outcomes_scored_after_horizon_maturity": true,
      "live_metrics_maturity_gated": true,
      "automatic_retraining": false,
      "automatic_promotion": false,
      "human_review_required": true
    }
  }
}
```

The values above illustrate the contracted shape; production values come from the private Beacon snapshot and are not hard-coded by the site.

## V2 completeness rules

For every V2 trading date:

1. `primary_horizon` remains exactly `"5"`.
2. Top-level `universe_count` is derived from the session, never a hard-coded constant.
3. Top-level `signals.length` equals `universe_count`.
4. Symbols and ranks are unique and ranks cover exactly `1..universe_count`.
5. Every signal row contains only `stock_symbol`, `rank_within_horizon`, `direction_bucket`, and `source_freshness_status`.
6. Direction is one of `positive_model_signal`, `neutral_model_signal`, or `negative_model_signal`.
7. `record_origin` is either `live` or `historical_backfill`.
8. When the multi-horizon extension is present, `forecast_windows` contains exactly `1`, `3`, `5`, and `10`.
9. Every forecast window is independently complete and all four windows contain the same eligible symbol set.
10. The 5-session window exactly matches the canonical top-level `signals` and `universe_count`.
11. `research_evidence` uses strict allowlists. Live RankIC/spread must remain `null` while `live_metrics_ready` is false.
12. The V2 top-level object and disclaimer use strict allowlists; uncontracted fields are rejected.

The renderer orders rows by `rank_within_horizon` after validation. Rank movement is calculated only against the previous completed session at the same horizon.

## V1 compatibility

V1 keeps its existing contract while migration is in progress. The existing V1 wire still requires `signal.rank_within_horizon == 3`. The public UI renders only the row actually present in V1 and never synthesizes the unpublished remainder of the universe.

V1 compatibility will be removed only after the V2 exporter, historical cutover, and at least one normal automatic V2 production cycle have been verified.

## Public-boundary protection

The validator recursively rejects private/internal fields including:

```text
paid_subscriber
creator_full
system_state
predictions
ranking_score
return_forecast
direction_logit
latest_predictions
model_evidence_state
model_trust_state
drift_state
retraining_request
source_status
raw_observation_rows
feature_audit
bars_written
source_status_path
daily_bars_path
model_version
prediction_id
feature_builder_version
run_id
input_cutoff
raw_features
feature_names
weights
embeddings
normalizer
training_loss
validation_loss
hit_rate
```

Private prediction/evidence objects must be serialized into the public contract from approved fields. They must never be copied wholesale and cleaned up afterward.

## Public meaning

The public ranking is cross-sectional research output, not personalised investment advice and not an instruction to buy, sell, or hold a security. The four forecast windows are independent model rankings over 1, 3, 5, and 10 EGX trading sessions. Historical held-out validation and live realised evidence are presented separately. Live ranking metrics are maturity-gated by the private engine's existing evidence policy.
