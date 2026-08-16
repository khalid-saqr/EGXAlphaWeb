# EGX /Alpha public payload contract

The public site accepts two schema versions during the migration:

- `egx_alpha_public_wire_v1` — temporary compatibility for the existing single rank-#3 production wire.
- `egx_alpha_public_wire_v2` — canonical complete-universe public wire for the primary 5-session /Alpha horizon.

New complete-ranking publication must use V2. V1 remains accepted only so the redesigned site can be deployed before the private exporter is cut over.

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

For a historical reconstruction, `record_origin` is `historical_backfill`. A backfilled record represents the validated dated /Alpha prediction memory reconstructed into the public V2 contract; it must not be described as having been publicly visible on the original analysis date.

## V2 completeness rules

For every V2 trading date:

1. `primary_horizon` is exactly `"5"`.
2. `universe_count` is a positive integer derived from that session, never a hard-coded constant.
3. `signals.length` equals `universe_count`.
4. Stock symbols are unique.
5. Ranks are unique and cover exactly `1..universe_count`.
6. Every row contains only the four contracted signal fields shown above.
7. Direction is one of `positive_model_signal`, `neutral_model_signal`, or `negative_model_signal`.
8. `record_origin` is either `live` or `historical_backfill`.
9. The V2 top-level object and disclaimer use strict allowlists; uncontracted fields are rejected.

The array does not need to be trusted for display ordering: the static renderer orders rows by `rank_within_horizon` after validation.

## V1 compatibility

V1 keeps its existing contract while migration is in progress. In particular, the existing V1 wire still requires `signal.rank_within_horizon == 3`. The public UI must render only the row actually present in V1; it must never synthesize the unpublished remainder of the universe.

V1 compatibility will be removed only after the V2 exporter, historical cutover, and at least one normal automatic V2 production cycle have been verified.

## Public-boundary protection

The validator recursively rejects private/internal fields including:

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
model_version
prediction_id
feature_builder_version
run_id
input_cutoff
raw_features
```

V2 adds a strict field allowlist on top of this denylist. Private prediction records must be serialized into the public contract from approved fields; they must never be copied wholesale and cleaned up afterward.

## Public meaning

The V2 ranking is the complete eligible EGX cross-section for the canonical 5-session /Alpha research horizon on a completed analysis date. Rank and direction are public research outputs, not personalised investment advice and not an instruction to buy, sell, or hold any security.
