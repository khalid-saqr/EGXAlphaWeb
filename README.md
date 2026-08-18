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
- Arabic presentation tree: `/ar/` and localized equivalents of the public research routes

## Payload boundary

The site accepts the bounded public EGX /Alpha wire and rejects private or subscriber fields, including model scores, logits, full predictions, private memory and operational paths.

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

`npm test` validates the public payload, builds `_site/`, verifies the production Pages artifact, tests English/Arabic parity and the PWA contract, checks for private-field leakage, and rejects binary files except for the four explicitly allowlisted PWA icons.

## Production deployment

The production site is served from the custom-domain root:

```text
https://egxresearch.com/
```

Production URLs are root-relative. CSS is mostly inlined into generated HTML, with the small PWA stylesheet and client runtimes emitted under `/assets/`.

The site is installable as **EGX /Alpha** without an account. The service worker uses network-first retrieval for the current homepage, Today view, `/data/latest.json`, and `/data/index.json`; dated archive records are cached more aggressively because their public contents are immutable. When the site or installed app opens or resumes online, the client checks the latest public trading date and refreshes the current view when a newer deployed record exists. Offline mode displays the last cached public record and visibly identifies the offline state.

The PWA intentionally does **not** use push notifications, notification permissions, periodic background sync, or a closed-app background scheduler. Freshness is checked when the web app is opened, focused, resumed, or returns online.

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
