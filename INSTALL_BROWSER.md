# Browser-only installation guide

Use this when you have the ZIP package and want to launch the public PWA through the GitHub website only.

## 1. Create the public repo

1. Open GitHub in your browser.
2. Create a new **public** repository.
3. Name it exactly:

```text
EGXResearch
```

4. Do not add a README from GitHub. The ZIP already includes one.

## 2. Upload the files

1. Extract the ZIP on your computer or phone file manager.
2. Open the new GitHub repo in the browser.
3. Choose **Add file → Upload files**.
4. Upload all extracted files and folders.
5. Commit to `main`.

## 3. Enable GitHub Pages

1. Go to **Settings → Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Go to the **Actions** tab.
4. Run or wait for **Deploy EGXResearch Public PWA**.
5. Open the deployment URL.

Production URL:

```text
https://egxresearch.com/
```

If you test a GitHub Pages preview without the custom domain, configure `EGX_BASE_PATH` for that preview path before deployment.

## 4. Test the public PWA

Open:

```text
/
/today/
/archive/
/archive/2026-07-09/
/search/
```

Check:

- the signal card appears
- the archive opens
- search works by `EGX:DEMO` and `2026-07`
- copy-link works
- Facebook/LinkedIn share buttons open share pages
- the layout works on mobile and desktop

## 5. Install from browser

On Android Chrome/Edge:

1. Open `https://egxresearch.com/`.
2. Tap the browser menu.
3. Choose **Add to Home screen** or **Install app** if offered.
4. Open the installed EGXResearch shortcut.

Because this package intentionally includes no images or binary icon files, the installed app may use a generic browser icon.

If the page ever appears as plain unstyled HTML after a deployment, hard refresh the page. If it stays unstyled in an installed PWA, remove the installed shortcut or unregister the old service worker from the browser's site settings, then reopen the GitHub Pages URL so the browser installs the latest cache version.

## 6. Connect the private repo later

After the public PWA is working, follow `PRIVATE_HANDOFF_TEMPLATE.md` from the private EGXResearch repo. The private repo should push only `data/latest.json` and `data/archive/YYYY-MM-DD.json` into this public repo.
