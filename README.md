# EGXResearch — EGX /Alpha signal

A payload-first static GitHub Pages site for publishing the bounded public **EGX /Alpha signal** and its methodology.

The repository is the public shell for the private `khalid-saqr/EGXResearch` engine. It receives only the validated public wire, builds static pages, and deploys them to GitHub Pages.

## Public routes

- Latest signal: `/` and `/today/`
- Dated records: `/archive/YYYY-MM-DD/`
- Archive index: `/archive/`
- Symbol/date search: `/search/`
- Public methodology: `/methodology/`
- Public JSON: `/data/latest.json` and `/data/archive/YYYY-MM-DD.json`

## Payload boundary

The site accepts only `egx_alpha_public_wire_v1`. The validator rejects private or subscriber fields, including model scores, logits, full predictions, private memory and operational paths.

The private repository publishes only:

```text
data/latest.json
data/archive/YYYY-MM-DD.json
```

No token or private-repository content belongs in this repository.

## Build

Requirements: Node.js 20 or later.

```bash
npm test
```

`npm test` validates the public payload, builds `_site/`, verifies the production Pages artifact, checks for private-field leakage and rejects binary files.

## Production deployment

The production site is served from the custom-domain root:

```text
https://egxresearch.com/
```

Production URLs are root-relative. CSS is inlined into generated HTML, the small client script is emitted at `/assets/app.js`, and PWA installation is disabled. A cleanup-only `/sw.js` is retained temporarily to remove legacy service workers and caches from earlier deployments.

The workflow validates pull requests without deploying them. Pushes to `main` build and deploy `_site/` through GitHub Pages.

## Explicit preview builds

A prefixed preview remains possible only when deliberately configured:

```bash
EGX_BASE_PATH=/EGXAlphaWeb \
EGX_SITE_URL=https://khalid-saqr.github.io/EGXAlphaWeb \
node src/build.mjs
```

The production workflow does not use a repository subpath.

## Early access

The public CTA is static:

```text
mailto:access@egxresearch.com
```
