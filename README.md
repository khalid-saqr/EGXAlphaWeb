# EGXResearch — EGX /Alpha signal

A static GitHub Pages site for publishing a compact public **EGX /Alpha signal** dashboard and methodology page.

This repository is designed as the public shell. It receives only a tiny public signal payload from the private EGXResearch system, validates it, builds static pages, and deploys to GitHub Pages.

## What it publishes

- Latest public signal at `/today/`
- Permanent daily signal pages at `/archive/YYYY-MM-DD/`
- Search by symbol/date at `/search/`
- Public methodology white paper at `/methodology/`
- Static JSON at `/data/latest.json` and `/data/archive/YYYY-MM-DD.json`

## What it never contains

- paid subscriber payloads
- creator/internal payloads
- raw predictions
- model scores or logits
- private memory files
- tokens or secrets
- images or binary files

## Early access CTA

The public site uses a static email CTA only:

```text
mailto:access@egxresearch.com
```

## Local commands

```bash
npm test
npm run build
```

The generated site appears in `_site/`.

## Production URL

The live public site is served from the custom-domain root:

```text
https://egxresearch.com/
```

Production assets are root-relative, for example `/assets/app.css`, `/assets/app.js`, and `/manifest.webmanifest`.

## Alternate preview URL

For a GitHub Pages preview without the custom domain, set `EGX_BASE_PATH` and `EGX_SITE_URL` during the build, for example:

```text
EGX_BASE_PATH=/EGXResearch
EGX_SITE_URL=https://<owner>.github.io/EGXResearch
```

Production renders critical CSS inline so the page does not depend on an external stylesheet. The small client script remains root-relative at `/assets/app.js`.

## Alternate preview URL

For a GitHub Pages preview without the custom domain, set `EGX_BASE_PATH` and `EGX_SITE_URL` during the build, for example:

```text
EGX_BASE_PATH=/EGXResearch
EGX_SITE_URL=https://<owner>.github.io/EGXResearch
```

Read `INSTALL_BROWSER.md` for browser-only deployment checks. PWA installability is intentionally disabled until the live site is visually stable.
