(function () {
  const configText = document.getElementById('site-config')?.textContent?.trim();
  let siteConfig = { basePath: '/EGXAlphaWeb' };
  try { if (configText) siteConfig = JSON.parse(configText); } catch (_) {}
  const basePath = String(siteConfig.basePath || '/EGXAlphaWeb').replace(/\/$/, '');

  const json = document.getElementById('beacon-payload')?.textContent?.trim();
  let payload = null;
  try { if (json) payload = JSON.parse(json); } catch (_) { payload = null; }

  function absoluteUrl(pathname) {
    return new URL(pathname || window.location.pathname, window.location.origin).href;
  }

  function setTheme(theme) {
    const resolved = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = resolved;
    localStorage.setItem('egxalpha-theme', resolved);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', resolved === 'light' ? 'true' : 'false');
    });
    document.querySelectorAll('[data-theme-label]').forEach(label => {
      label.textContent = resolved === 'light' ? 'Light' : 'Dark';
    });
  }

  function initTheme() {
    const saved = localStorage.getItem('egxalpha-theme');
    setTheme(saved || 'dark');
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));
    });
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

  async function copyUrl() {
    const url = absoluteUrl(window.location.pathname);
    try {
      await navigator.clipboard.writeText(url);
      const status = document.querySelector('[data-copy-status]');
      if (status) status.textContent = 'Link copied. Share today’s public signal with your network.';
    } catch (_) {
      window.prompt('Copy this link', url);
    }
  }

  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', copyUrl));
  updateShareLinks();
  initTheme();

  async function initSearch() {
    const input = document.querySelector('[data-search-input]');
    const output = document.querySelector('[data-search-results]');
    if (!input || !output) return;
    let rows = [];
    try {
      const res = await fetch(`${basePath}/data/index.json`, { cache: 'no-cache' });
      rows = await res.json();
    } catch (_) {
      output.innerHTML = '<p class="small-note">Search index is unavailable.</p>';
      return;
    }
    function label(value) { return String(value || '').replaceAll('_', ' '); }
    function render() {
      const q = input.value.trim().toLowerCase();
      const filtered = rows.filter(row => !q || Object.values(row).join(' ').toLowerCase().includes(q)).slice(0, 50);
      output.innerHTML = filtered.length ? filtered.map(row => `<a class="archive-row" href="${basePath}${row.url}">
        <span>${row.date}</span><strong>${row.symbol}</strong><em>${row.horizon}</em><small>${label(row.direction_bucket)}</small>
      </a>`).join('') : '<p class="small-note">No matching public signals.</p>';
    }
    input.addEventListener('input', render);
    render();
  }
  initSearch();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {}));
  }
})();
