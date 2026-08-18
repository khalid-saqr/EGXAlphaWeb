# Private EGXResearch → public EGXAlphaWeb handoff

`EGXAlphaWeb` never reads the private engine directly. The private repository is responsible for converting approved /Alpha output into the bounded public wire before anything crosses repositories.

## Destination

```text
khalid-saqr/EGXAlphaWeb
```

## Only permitted publication paths

```text
data/latest.json
data/archive/YYYY-MM-DD.json
```

No other public-repository path should be staged by the private publisher.

## Canonical production contract

Normal publication uses:

```text
schema_version = egx_alpha_public_wire_v2
primary_horizon = "5"
forecast_windows = 1 / 3 / 5 / 10
```

Each published horizon contains the complete eligible public universe for that session. The 5D window is the canonical top-level/default research view. The public exporter/sanitizer must continue to remove private model internals before commit.

V1 is retained by the public validator only for bounded legacy compatibility; it is not the normal daily publication target.

## Implemented flow

```text
private EGX /Alpha daily chain completes
→ private public-safe research snapshot is prepared
→ export_public_wire.py applies the bounded public contract
→ data/latest.json is written
→ data/archive/YYYY-MM-DD.json is written
→ only those public JSON paths are committed/pushed
→ EGXAlphaWeb validates with its independent public-boundary rules
→ all EN/AR research routes and PWA assets are rebuilt
→ GitHub Pages deploys
→ public CI confirms production data/latest.json matches the built trading_date
```

The public redesign does not require any change to the private publisher or Beacon to keep this cycle working.

## Secret boundary

The private push credential remains private to `EGXResearch` and should have only the minimum repository permission needed for the permitted publication operation. No token belongs in `EGXAlphaWeb` source or generated Pages artifacts.

## Anti-leak boundary

Never publish private areas or fields such as:

```text
paid_subscriber
creator_full
memory/foresight
memory/evolution
memory/observation
models
ranking_score
return_forecast
direction_logit
model_version
prediction_id
run_id
feature names
weights
losses
private trust/drift state
```

The public repository validator independently rejects forbidden fields before rendering.

## Operational rule

A normal trading-day publication is a **data-only change**. If a routine signal release appears to require a manual UI, PWA, Arabic, or methodology edit, stop and investigate rather than widening the private publisher's write scope.
