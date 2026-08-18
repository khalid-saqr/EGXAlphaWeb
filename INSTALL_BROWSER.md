# Production deployment and browser acceptance

`EGXAlphaWeb` deploys automatically through GitHub Actions to:

```text
https://egxresearch.com/
```

## GitHub Pages configuration

1. In **Settings → Pages**, use **GitHub Actions** as the build/deployment source.
2. Keep the custom domain set to `egxresearch.com`.
3. Keep HTTPS enforcement enabled.
4. Use **Deploy EGXResearch Public Site** as the release signal.

Pull requests validate only. A push or merged pull request on `main` builds and deploys `_site/`.

## Production acceptance routes

After a release, verify:

```text
/
/today/
/archive/
/search/
/methodology/
/investor-guide/
/institutional/
/ar/
/ar/today/
/ar/archive/
/ar/search/
/manifest.webmanifest
/sw.js
/data/latest.json
/data/index.json
```

For the current `trading_date` in `/data/latest.json`, also verify:

```text
/archive/YYYY-MM-DD/
/ar/archive/YYYY-MM-DD/
/data/archive/YYYY-MM-DD.json
```

Open at least one `/symbol/TICKER/` and `/ar/symbol/TICKER/` route from the current ranking.

## PWA acceptance

The mega-footer exposes **INSTALL EGX /ALPHA** / **تثبيت EGX /ALPHA**.

- Chromium browsers use the native install prompt when available.
- iPhone/iPad users receive Add to Home Screen guidance.
- Standalone mode respects safe-area insets.
- Current views/data are network-first.
- Dated immutable archive records are cache-first.
- Offline mode visibly states that the last cached public record is being shown.
- Reopening, focusing, resuming or reconnecting checks for a newer public trading date.
- No push notifications, periodic sync or closed-app background scheduler are expected.

The final release uses service-worker cache generation `egx-alpha-pwa-v2`. Activation removes prior `egx-alpha-*` and legacy `egxresearch-public-pwa-*` cache generations.

## Daily publication acceptance

The private publisher must change only:

```text
data/latest.json
data/archive/YYYY-MM-DD.json
```

No manual UI edit is required for a normal session.

The public workflow validates the new wire, rebuilds all English/Arabic pages and dossiers, updates `/data/index.json`, deploys Pages, then verifies that production `/data/latest.json` reports the same trading date that was built. It also checks that the manifest and final service worker are reachable.

If the post-deploy production verification fails, treat the workflow as a release failure even if the Pages deployment action itself completed.

## Browser recovery

If a browser is visibly stale:

1. Confirm the latest GitHub Pages workflow is green, including **Verify production publication after Pages deploy**.
2. Reopen the site online so the PWA freshness check can run.
3. Hard-refresh once if needed.
4. If a pre-release installation remains corrupted, remove the installed app/site data and reinstall from the production domain.

Routine daily publication should not require manual cache clearing.
