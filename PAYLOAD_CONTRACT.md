# Public payload contract

The public PWA accepts only `egx_alpha_public_wire_v1`.

## Required payload

```json
{
  "schema_version": "egx_alpha_public_wire_v1",
  "domain": "EGXResearch",
  "signal_name": "EGX /Alpha signal",
  "audience": "public",
  "trading_date": "2026-07-09",
  "published_at": "2026-07-09T13:30:00Z",
  "signal": {
    "stock_symbol": "EGX:XXXX",
    "rank_label": "third-ranked public signal",
    "rank_within_horizon": 3,
    "horizon": "5D",
    "direction_bucket": "positive_model_signal",
    "source_freshness_status": "live_observation_completed"
  },
  "context": {
    "trust_state": "weak_but_usable",
    "source_quality_status": "source_healthy",
    "prediction_status": "live_predictions_written"
  },
  "disclaimer": {
    "market_use": "research_and_information_only",
    "investment_advice": false,
    "execution_instruction": false
  },
  "integrity": {
    "source_payload_hash": "sha256:...",
    "public_wire_hash": "sha256:..."
  }
}
```

## Forbidden keys

The validator rejects these keys anywhere in the payload:

```text
paid_subscriber
creator_full
system_state
predictions
ranking_score
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
```

## Public meaning

The public signal is a limited preview. It is research-only. It is not personalised investment advice and is not an instruction to buy, sell, or hold any security.
