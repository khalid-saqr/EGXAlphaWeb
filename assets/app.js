(function () {
  const basePath = '/EGXResearch';
  const json = document.getElementById('beacon-payload')?.textContent?.trim();
  let payload = null;
  try { if (json) payload = JSON.parse(json); } catch (_) { payload = null; }

  function absoluteUrl(pathname) {
    return new URL(pathname || window.location.pathname, window.location.origin).href;
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
      if (status) status.textContent = 'Link copied.';
    } catch (_) {
      window.prompt('Copy this link', url);
    }
  }

  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', copyUrl));
  updateShareLinks();

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
    function render() {
      const q = input.value.trim().toLowerCase();
      const filtered = rows.filter(row => !q || Object.values(row).join(' ').toLowerCase().includes(q)).slice(0, 50);
      output.innerHTML = filtered.length ? filtered.map(row => `<a class="archive-row" href="${basePath}${row.url}">
        <span>${row.date}</span><strong>${row.symbol}</strong><em>${row.horizon}</em><small>${String(row.direction_bucket || '').replaceAll('_', ' ')}</small>
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
