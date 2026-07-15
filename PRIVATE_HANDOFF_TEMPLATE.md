# Private EGXResearch → public EGXAlphaWeb handoff

This repository never reads the private repository directly. The private workflow transforms the latest free-funnel Beacon payload into the bounded public-wire schema, then commits only public JSON.

## Source in the private repository

```text
memory/beacon/latest_free_funnel.json
```

## Destination repository

```text
khalid-saqr/EGXAlphaWeb
```

## Files permitted to cross the boundary

```text
data/latest.json
data/archive/YYYY-MM-DD.json
```

No other path should be staged or pushed.

## Private repository secret

```text
EGX_ALPHA_WEB_PUSH_TOKEN
```

Keep the token only in the private `EGXResearch` repository. It needs the minimum permission required to push the two public JSON paths to `EGXAlphaWeb`.

## Implemented flow

```text
EGX Alpha Beacon Payload succeeds on main
  → checkout private EGXResearch
  → checkout public EGXAlphaWeb using EGX_ALPHA_WEB_PUSH_TOKEN
  → run scripts/export_public_wire.py
  → validate egx_alpha_public_wire_v1 and forbidden-key rules
  → write data/latest.json
  → write data/archive/YYYY-MM-DD.json
  → commit and push only those files
  → EGXAlphaWeb validates, builds and deploys itself
```

The private implementation is `.github/workflows/egxalpha_publish_public_wire.yml` and `scripts/export_public_wire.py` in `EGXResearch`.

## Anti-leak boundary

Never commit any of these private areas into `EGXAlphaWeb`:

```text
memory/beacon/paid_subscriber
memory/beacon/creator_full
memory/foresight
memory/evolution
memory/observation
models
```

The public repository validator independently rejects private keys before building the site.
