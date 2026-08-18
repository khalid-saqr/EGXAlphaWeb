# EGXResearch — EGX /Alpha

Static GitHub Pages research application for the bounded public **EGX /Alpha** signal.

This repository is the public presentation and distribution boundary for the private `khalid-saqr/EGXResearch` engine. It receives only validated public-wire JSON, renders English and Arabic research surfaces, and deploys the resulting static artifact to GitHub Pages. It does not read private model state directly.

## Production product

Production is served from:

```text
https://egxresearch.com/
```

The public application includes:

- current research terminal: `/` and `/today/`
- complete dated model memory: `/archive/` and `/archive/YYYY-MM-DD/`
- ticker/date research search: `/search/`
- stock dossiers: `/symbol/TICKER/`
- methodology: `/methodology/`
- investor guide: `/investor-guide/`
- institutional research page: `/institutional/`
- full Arabic/RTL equivalents under `/ar/`
- installable `EGX /Alpha` PWA
- public JSON at `/data/latest.json`, `/data/index.json`, and `/data/archive/YYYY-MM-DD.json`

The interface defaults to the canonical 5-session research horizon and also exposes the bounded public 1D, 3D, 5D and 10D windows supplied by V2.

## Publication boundary

The private repository is permitted to publish only:

```text
data/latest.json
data/archive/YYYY-MM-DD.json
```

No UI source, service-worker file, model artifact, token, private memory, prediction internals or operational path should cross that boundary.

`egx_alpha_public_wire_v2` is the canonical production contract. The public validator independently rejects non-public/private fields before the site builds. V1 remains accepted only as a bounded compatibility input for legacy records and tests; new normal publication is V2.

## Build and release gates

Requirements: Node.js 20 or later.

```bash
npm test
```

The full suite validates:

- V1/V2 public-wire boundaries
- exact payload identity through the static build
- complete-universe and multi-horizon rendering
- automatic next-session publication without UI edits
- English/Arabic route and metadata parity
- research evidence and historical provenance
- installable PWA/offline/freshness behavior
- final route/link/accessibility/release hardening
- Pages artifact integrity
- private-field leakage protection
- the four-file PWA icon binary allowlist

Pull requests are validated against the **current `main` public payload**, so UI work cannot silently rely on a stale signal snapshot.

## Daily production deployment

Every push to `main` builds and deploys `_site/` through GitHub Pages. The normal private-to-public daily cycle is therefore:

```text
private /Alpha completes
→ bounded V2 JSON is exported
→ public data/latest.json + dated archive JSON are committed
→ EGXAlphaWeb validates and builds
→ GitHub Pages deploys the complete EN/AR + PWA artifact
→ production verification confirms live data/latest.json matches the built trading_date
```

The post-deploy verification also confirms the production manifest and final service worker are reachable. A deployment workflow is not considered green if the public custom domain does not converge to the newly built trading date.

## PWA freshness contract

The PWA does not require an account.

Current views and current data are network-first:

```text
/
/today/
/ar/
/ar/today/
/data/latest.json
/data/index.json
```

Only immutable **dated** archive pages and archive JSON are cache-first. The mutable History index remains network-first.

When the application opens, focuses, resumes or reconnects, it checks `/data/latest.json`. If a newer trading date exists, the client first verifies that the matching HTML release is already available, then refreshes the current view. This avoids a reload race during Pages/CDN propagation. Offline mode clearly identifies that the last cached public record is being shown.

The PWA intentionally has no push notifications, notification permission request, periodic/background sync, or closed-app scheduler.

## Design/release invariants

- dark Midnight Lapis default; light Papyrus theme
- English and Arabic/RTL parity
- branded names `EGX Research` and `EGX /Alpha` remain Latin-script
- minimum 44px interaction floor on core navigation, horizon controls, language/theme and install controls
- no registration
- no execution or investment-advice workflow
- no private repo/Beacon dependency in the browser
- no synthetic confidence score or fabricated model metric

## Explicit preview builds

A prefixed preview is still possible when deliberately configured:

```bash
EGX_BASE_PATH=/EGXAlphaWeb \
EGX_SITE_URL=https://khalid-saqr.github.io/EGXAlphaWeb \
node src/build.mjs
```

Production itself uses root-relative custom-domain URLs.
