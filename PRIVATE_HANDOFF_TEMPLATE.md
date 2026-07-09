# Private EGXResearch → Public EGXResearch handoff template

This document describes the intended private-repo workflow. Do not put private tokens or secrets in the public PWA repo.

## Goal

The private EGXResearch repo should read:

```text
memory/beacon/latest_free_funnel.json
```

Then produce a small public wire payload and commit only:

```text
data/latest.json
data/archive/YYYY-MM-DD.json
```

to the public repo:

```text
<owner>/EGXResearch
```

## Required private repo secret

```text
PUBLIC_REPO_TOKEN
```

The token should have permission to commit to the public repo. Keep it only in the private repo secrets.

## Private workflow logic

Pseudo-flow:

```text
1. Run after EGX/Alpha Beacon payload generation.
2. Read memory/beacon/latest_free_funnel.json.
3. Extract only public-safe fields.
4. Build egx_alpha_public_wire_v1.
5. Validate no forbidden keys exist.
6. Commit public JSON into the public repo.
7. Let the public repo deploy itself through GitHub Pages.
```

## Mapping from free_funnel to public wire

```text
free_funnel.trading_date -> trading_date
free_funnel.created_at -> published_at
free_funnel.free_teaser.stock_symbol -> signal.stock_symbol
free_funnel.free_teaser.rank_within_horizon -> signal.rank_within_horizon
free_funnel.free_teaser.horizon -> signal.horizon
free_funnel.free_teaser.direction_bucket -> signal.direction_bucket
free_funnel.free_teaser.source_freshness_status -> signal.source_freshness_status
free_funnel.model_context.trust_state -> context.trust_state
free_funnel.model_context.source_quality_status -> context.source_quality_status
free_funnel.model_context.prediction_status -> context.prediction_status
```

## Anti-leak rule

Never commit these into the public repo:

```text
memory/beacon/paid_subscriber
memory/beacon/creator_full
memory/foresight
memory/evolution
memory/observation
models
```

## Minimal git operation

The private workflow should update only:

```text
data/latest.json
data/archive/YYYY-MM-DD.json
```

The public repo deployment workflow will validate and build the website on push.
