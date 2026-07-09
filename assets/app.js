(function () {
  const configJson = document.getElementById('site-config')?.textContent?.trim();
  const json = document.getElementById('beacon-payload')?.textContent?.trim();
  let config = {};
  let payload = null;
  try { if (configJson) config = JSON.parse(configJson); } catch (_) { config = {}; }
  try { if (json) payload = JSON.parse(json); } catch (_) { payload = null; }
  const basePath = normalizeBasePath(config.basePath || '');

  function absoluteUrl(pathname) {
    return new URL(pathname || window.location.pathname, window.location.origin).href;
  }

  function normalizeBasePath(path) {
    const cleaned = String(path || '').trim();
    if (!cleaned || cleaned === '/') return '';
    return `/${cleaned.replace(/^\/+|\/+$/g, '')}`;
  }

  function withBasePath(path) {
    const normalizedPath = String(path || '/').startsWith('/') ? String(path || '/') : `/${path}`;
    return `${basePath}${normalizedPath}`;
  }

  function prettyState(value) {
    return String(value || '').replaceAll('_', ' ');
  }

  function updateShareLinks() {
    const url = absoluteUrl(window.location.pathname);
    const title = payload ? `${payload.signal_name} — ${payload.signal.stock_symbol}` : document.title;
    const text = payload ? `${payload.signal.rank_label} for ${payload.signal.horizon}. Research-only.` : document.title;
    document.querySelectorAll('[data-share-link="linkedin"]').forEach(a => {
      a.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
    document.querySelectorAll('[data-share-link="facebook"]').forEach(a => {
      a.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
    document.querySelectorAll('[data-share]').forEach(button => {
      button.addEventListener('click', async () => {
        if (navigator.share) {
          try { await navigator.share({ title, text, url }); return; } catch (_) {}
        }
        await copyUrl();
      });
    });
  }

  function initThemeToggle() {
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    if (!toggles.length) return;
    const storedTheme = localStorage.getItem('egx-theme');
    const preferredTheme = window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const initialTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : preferredTheme;

    function applyTheme(theme) {
      document.documentElement.dataset.theme = theme;
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f4f7fb' : '#09111f');
      toggles.forEach(toggle => {
        toggle.setAttribute('aria-pressed', String(theme === 'light'));
        const label = toggle.querySelector('[data-theme-label]');
        if (label) label.textContent = theme === 'light' ? 'Light' : 'Dark';
      });
    }

    applyTheme(initialTheme);
    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('egx-theme', nextTheme);
        applyTheme(nextTheme);
      });
    });
  }

  async function copyUrl() {
    const url = absoluteUrl(window.location.pathname);
    try {
      await navigator.clipboard.writeText(url);
      const status = document.querySelector('[data-copy-status]');
      if (status) status.textContent = 'Link copied.';
    } catch (_) {
      window.prompt('Copy this link', url);
    }
  }

  initThemeToggle();
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', copyUrl));
  updateShareLinks();

  function renderMessage(output, message) {
    output.replaceChildren();
    const note = document.createElement('p');
    note.className = 'small-note';
    note.textContent = message;
    output.append(note);
  }

  function renderSearchRow(row) {
    const link = document.createElement('a');
    link.className = 'archive-row';
    link.href = withBasePath(row.url || '/archive/');

    const date = document.createElement('span');
    date.textContent = row.date || '';
    const symbol = document.createElement('strong');
    symbol.textContent = row.symbol || '';
    const horizon = document.createElement('em');
    horizon.textContent = row.horizon || '';
    const direction = document.createElement('small');
    direction.textContent = prettyState(row.direction_bucket);

    link.append(date, symbol, horizon, direction);
    return link;
  }

  async function initSearch() {
    const input = document.querySelector('[data-search-input]');
    const output = document.querySelector('[data-search-results]');
    if (!input || !output) return;
    let rows = [];
    try {
      const res = await fetch(withBasePath('/data/index.json'), { cache: 'no-cache' });
      rows = await res.json();
    } catch (_) {
      renderMessage(output, 'Search index is unavailable.');
      return;
    }
    function render() {
      const q = input.value.trim().toLowerCase();
      const filtered = rows.filter(row => !q || Object.values(row).join(' ').toLowerCase().includes(q)).slice(0, 50);
      output.replaceChildren();
      if (!filtered.length) {
        renderMessage(output, 'No matching public signals.');
        return;
      }
      output.append(...filtered.map(renderSearchRow));
    }
    input.addEventListener('input', render);
    render();
  }
  initSearch();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register(withBasePath('/sw.js')).catch(() => {}));
  }
})();
