# Browser-only deployment checks

`EGXAlphaWeb` deploys automatically through GitHub Actions. The production destination is:

```text
https://egxresearch.com/
```

## GitHub Pages settings

1. Open **Settings → Pages** in `khalid-saqr/EGXAlphaWeb`.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Confirm the custom domain is `egxresearch.com` and HTTPS enforcement is enabled when available.
4. Open the **Actions** tab and inspect **Deploy EGXResearch Public Site**.

Pull requests run validation only. A merge or direct push to `main` creates and deploys `_site/`.

## Production acceptance routes

Check these paths after deployment:

```text
/
/today/
/archive/
/search/
/methodology/
/data/latest.json
/data/index.json
```

Also open the dated route matching `trading_date` in `/data/latest.json`:

```text
/archive/YYYY-MM-DD/
/data/archive/YYYY-MM-DD.json
```

Verify navigation, search by symbol and date, copy/share controls, theme switching, methodology printing, mobile layout and the early-access mail link.

## Legacy PWA cleanup

PWA installation is disabled. The generated `/sw.js` exists only to unregister old service workers and delete caches left by earlier deployments.

When a browser still shows a stale or unstyled version:

1. Hard refresh `https://egxresearch.com/`.
2. Remove any previously installed EGXResearch shortcut.
3. Clear site data for `egxresearch.com`.
4. Unregister any remaining service worker in browser site/developer settings.
5. Reopen the production URL.

## Private-repository handoff

The private `EGXResearch` workflow pushes only:

```text
data/latest.json
data/archive/YYYY-MM-DD.json
```

See `PRIVATE_HANDOFF_TEMPLATE.md` for the current boundary and secret name.
