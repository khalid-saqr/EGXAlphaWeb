# EGX /Alpha public payload contract

## Production contract

`egx_alpha_public_wire_v2` is the canonical public production wire.

The public site still understands bounded V1 records for legacy compatibility, but normal automatic publication must use V2. The browser never receives private prediction internals and does not derive additional model scores.

Core V2 invariants:

1. `audience` is `public`.
2. `primary_horizon` is `"5"`.
3. Top-level `signals` are the complete 5-session eligible universe.
4. `forecast_windows` contains exactly `1`, `3`, `5`, and `10` for the complete production research view.
5. Every horizon independently contains a complete, uniquely ranked eligible symbol set.
6. The 5D forecast window exactly matches the canonical top-level `signals` and `universe_count`.
7. Public direction is one of `positive_model_signal`, `neutral_model_signal`, or `negative_model_signal`.
8. `record_origin` distinguishes live records from `historical_backfill`.
9. Public evidence uses strict allowlists and preserves historical-vs-live maturity semantics.
10. The disclaimer remains research/information only, not investment advice or an execution instruction.

## Public signal row

A bounded public ranking row contains only approved public fields, principally:

```json
{
  "stock_symbol": "EGX:COMI",
  "rank_within_horizon": 1,
  "direction_bucket": "positive_model_signal",
  "source_freshness_status": "live_observation_completed"
}
```

The site treats **Relative Rank** and **Model Direction** as separate signals. Rank movement is derived publicly only by comparing the same symbol and horizon with the previous completed public session.

## Four-horizon publication

The production research view is:

```text
1D
3D
5D  ← primary research view
10D
```

The public interface never fabricates a missing horizon or fills an incomplete universe. Validation fails instead.

## Research evidence

`research_evidence` may expose only the approved public evidence surface, including system scale, historical held-out validation and maturity-gated live validation. Historical held-out evidence and live realised evidence must remain visibly distinct.

Live RankIC/spread values remain unavailable while the private evidence policy says they are not mature. The public UI must not convert missing or immature evidence into a confidence claim.

## Historical provenance

`record_origin = historical_backfill` means the dated model record was reconstructed into the public contract from validated historical /Alpha prediction memory. It must not be described as though that public page was necessarily visible on the original date.

## Public integrity fields

V2 records may expose approved integrity hashes used by the **Verify Public Record** disclosure. They support public-record verification only; they do not expose private model or run identifiers.

## Forbidden private/internal material

The validator recursively rejects private/internal fields including, among others:

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
raw_observation_rows
feature_audit
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

Private objects must be serialized into this approved public contract at the private boundary; they must never be copied wholesale into the public repository and cleaned afterward.

## Publication immutability

A normal private-to-public run may write only:

```text
data/latest.json
data/archive/YYYY-MM-DD.json
```

The public site regenerates search, dossiers, English/Arabic routes and the PWA artifact from those files. Daily publication does not require a UI-source commit.

## Public meaning

EGX /Alpha is cross-sectional quantitative research for the Egyptian Exchange. Public rankings, direction buckets, evidence and historical records are information/research outputs, not personalised investment advice, a target price, a solicitation, or an instruction to buy, sell or hold a security.
