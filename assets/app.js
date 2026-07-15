(function () {
  const configText = document.getElementById('site-config')?.textContent?.trim();
  let siteConfig = { basePath: '' };
  try { if (configText) siteConfig = JSON.parse(configText); } catch (_) {}
  const basePath = String(siteConfig.basePath ?? '').replace(/\/$/, '');

  const json = document.getElementById('beacon-payload')?.textContent?.trim();
  let payload = null;
  try { if (json) payload = JSON.parse(json); } catch (_) { payload = null; }

  const bulbSvg = `<svg class="theme-bulb" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M9 18h6M10 22h4M8.3 14.5A6 6 0 1 1 15.7 14.5c-.95.72-1.35 1.42-1.45 2.5h-4.5c-.1-1.08-.5-1.78-1.45-2.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  function installThemeControls() {
    if (!document.getElementById('theme-control-style')) {
      const style = document.createElement('style');
      style.id = 'theme-control-style';
      style.textContent = `
        .theme-icon-button{width:42px!important;min-width:42px!important;height:42px!important;min-height:42px!important;padding:0!important;border-radius:50%!important;font-size:0!important}
        .theme-icon-button .theme-bulb{width:20px;height:20px;display:block;transition:transform 160ms ease,filter 160ms ease}
        .theme-icon-button:hover .theme-bulb{transform:rotate(-8deg) scale(1.06)}
        :root[data-theme="light"] .theme-icon-button{color:#d78b00;background:rgba(255,193,7,.12)}
        :root[data-theme="light"] .theme-icon-button .theme-bulb{filter:drop-shadow(0 0 5px rgba(255,193,7,.45))}
      `;
      document.head.appendChild(style);
    }
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.classList.add('theme-icon-button');
      button.innerHTML = bulbSvg;
      button.setAttribute('aria-label', 'Toggle light and dark theme');
    });
  }

  function absoluteUrl(pathname) {
    return new URL(pathname || window.location.pathname, window.location.origin).href;
  }

  function signalSymbol() {
    return payload?.asset?.display_symbol || payload?.asset?.symbol || payload?.public_signal?.stock_symbol || payload?.signal?.stock_symbol || 'EGX signal';
  }

  function signalTitle() {
    return payload ? `${payload.signal_name || 'EGX /Alpha signal'} — ${signalSymbol()}` : document.title;
  }

  function signalText() {
    if (!payload) return document.title;
    const read = payload.public_copy?.investor_read || payload.public_signal?.plain_direction || payload.signal?.rank_label || 'EGX /Alpha signal';
    return `${String(read).replace(/\.$/, '')}. Research-only.`;
  }

  function setTheme(theme) {
    const resolved = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = resolved;
    localStorage.setItem('egxalpha-theme', resolved);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', resolved === 'light' ? 'true' : 'false');
      button.title = resolved === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    });
  }

  function initTheme() {
    installThemeControls();
    const saved = localStorage.getItem('egxalpha-theme');
    setTheme(saved || 'dark');
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));
    });
  }

  async function copyUrl() {
    const url = absoluteUrl(window.location.pathname);
    try {
      await navigator.clipboard.writeText(url);
      document.querySelectorAll('[data-copy-status]').forEach(status => { status.textContent = 'Link copied.'; });
    } catch (_) {
      window.prompt('Copy this link', url);
    }
  }

  function updateShareLinks() {
    const url = absoluteUrl(window.location.pathname);
    const title = signalTitle();
    const text = signalText();
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

  function initPrint() {
    document.querySelectorAll('[data-print]').forEach(button => {
      button.addEventListener('click', () => window.print());
    });
  }

  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', copyUrl));
  updateShareLinks();
  initPrint();
  initTheme();

  async function initSearch() {
    const input = document.querySelector('[data-search-input]');
    const output = document.querySelector('[data-search-results]');
    if (!input || !output) return;
    let rows = [];
    try {
      const res = await fetch(`${basePath}/data/index.json`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Search index returned ${res.status}`);
      rows = await res.json();
    } catch (_) {
      output.innerHTML = '<p class="small-note">Search index is unavailable.</p>';
      return;
    }
    function label(value) { return String(value || '').replaceAll('_', ' '); }
    function horizon(row) {
      const raw = String(row.horizon || '').trim();
      if (/^\d+(\.0+)?$/.test(raw)) return `Next ${parseInt(raw, 10)} EGX sessions`;
      const fromLabel = String(row.horizon_label || '').trim();
      const match = fromLabel.match(/(\d+)/);
      return match ? `Next ${parseInt(match[1], 10)} EGX sessions` : fromLabel || raw;
    }
    function render() {
      const q = input.value.trim().toLowerCase();
      const filtered = rows.filter(row => !q || Object.values(row).join(' ').toLowerCase().includes(q)).slice(0, 50);
      output.innerHTML = filtered.length ? filtered.map(row => `<a class="archive-row" href="${basePath}${row.url}">
        <span>${row.date || ''}</span>
        <strong>${row.display_symbol || row.symbol || ''}</strong>
        <em>${row.company_name || row.sector || horizon(row)}</em>
        <small>${label(row.plain_direction || row.direction_bucket)}</small>
      </a>`).join('') : '<p class="small-note">No matching signals.</p>';
    }
    input.addEventListener('input', render);
    render();
  }
  initSearch();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations?.().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      }).catch(() => {});
    });
  }
})();
