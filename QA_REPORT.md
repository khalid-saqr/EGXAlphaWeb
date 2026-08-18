# EGXResearch public application — final QA report

## Release scope

This report describes the completed six-commit public-interface program on `EGXAlphaWeb`:

- Midnight Lapis / Papyrus application shell
- unified 1D/3D/5D/10D research terminal with 5D primary
- Market Pulse and full relative ranking
- research evidence, Public Model Memory, search and stock dossiers
- public-record verification
- complete Arabic/RTL route parity
- installable offline-capable PWA
- final publication/deployment hardening

No private model, Beacon, exporter, execution, registration or subscriber system is part of the browser application.

## Automated acceptance

Run:

```bash
npm test
```

The release suite covers:

```text
public-wire validation
production payload identity
V2 complete-universe rendering
next-session publication compatibility
homepage/layout fixtures
multi-horizon evidence
historical provenance
methodology
research-depth surfaces
English/Arabic localization parity
PWA install/offline/freshness contract
final route/link/accessibility/release hardening
Pages artifact verification
private-field leakage boundary
restricted PWA-icon binary allowlist
```

The release-hardening gate additionally crawls every generated HTML artifact, checks internal route targets, detects duplicate IDs and unnamed buttons, verifies EN/AR counterparts, enforces the 44px interaction override, and performs a synthetic next-EGX-session publication through the finished EN/AR + PWA build.

## Production acceptance

Every `main` deployment captures the built `trading_date`. After GitHub Pages deploys, CI retries the custom domain until:

1. `https://egxresearch.com/data/latest.json` reports that same `trading_date`;
2. the PWA manifest is reachable; and
3. `/sw.js` contains the final `egx-alpha-pwa-v2` cache generation.

The workflow fails if production does not converge.

## Publication boundary

Normal private-to-public publication remains restricted to:

```text
data/latest.json
data/archive/YYYY-MM-DD.json
```

The public repository rebuilds the entire application automatically from those bounded records. No daily UI code change is required.

## PWA boundary

Included:

- native install prompt where supported
- iOS/iPadOS Add to Home Screen guidance
- network-first current views/data
- cache-first immutable dated archives
- explicit offline state
- freshness checks on open/resume/focus/reconnect

Excluded intentionally:

- push notifications
- notification permissions
- background/periodic sync
- closed-app scheduling
- account registration

## Release status

Commit 6 is accepted only when its final squashed PR SHA passes the complete GitHub Actions suite against the current `main` payload and the generated PR artifact is structurally inspected.
