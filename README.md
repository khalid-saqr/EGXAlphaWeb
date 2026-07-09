# EGXResearch — EGX /Alpha signal

A static, text-only GitHub Pages PWA for publishing the daily public **EGX /Alpha signal**.

This repository is designed as the public shell. It receives only a tiny public signal payload from the private EGXResearch system, validates it, builds static pages, and deploys to GitHub Pages.

## What it publishes

- Latest public signal at `/today/`
- Permanent daily signal pages at `/archive/YYYY-MM-DD/`
- Search by symbol/date at `/search/`
- Static JSON at `/data/latest.json` and `/data/archive/YYYY-MM-DD.json`

## What it never contains

- paid subscriber payloads
- creator/internal payloads
- raw predictions
- model scores or logits
- private memory files
- tokens or secrets
- images or binary files

## Local commands

```bash
npm test
npm run build
```

The generated site appears in `_site/`.

## Public URL after GitHub Pages

If your GitHub username is `<owner>` and the repo is named `EGXResearch`, the site URL will normally be:

```text
https://<owner>.github.io/EGXResearch/
```

Read `INSTALL_BROWSER.md` for browser-only installation steps.
