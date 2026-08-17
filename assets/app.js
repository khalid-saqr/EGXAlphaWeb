(function () {
  const configText = document.getElementById('site-config')?.textContent?.trim();
  let siteConfig = { basePath: '' };
  try { if (configText) siteConfig = JSON.parse(configText); } catch (_) {}
  const basePath = String(siteConfig.basePath ?? '').replace(/\/$/, '');

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function prettyDirection(value) {
    if (value === 'positive_model_signal' || value === 'positive') return 'Constructive';
    if (value === 'negative_model_signal' || value === 'negative') return 'Caution';
    return 'Neutral';
  }

  function directionTone(value) {
    if (value === 'positive_model_signal' || value === 'positive') return 'positive';
    if (value === 'negative_model_signal' || value === 'negative') return 'negative';
    return 'neutral';
  }

  function setTheme(theme) {
    const resolved = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = resolved;
    localStorage.setItem('egxalpha-theme', resolved);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', resolved === 'light' ? 'true' : 'false');
    });
  }

  setTheme(localStorage.getItem('egxalpha-theme') || 'dark');
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));
  });

  let rerenderModelOutput = () => {};

  function initHorizonSelector() {
    const buttons = [...document.querySelectorAll('[data-horizon-select]')];
    if (!buttons.length) return;

    function select(horizon) {
      buttons.forEach(button => {
        const active = button.dataset.horizonSelect === horizon;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      document.querySelectorAll('[data-horizon-panel]').forEach(panel => {
        panel.hidden = panel.dataset.horizonPanel !== horizon;
      });
      document.querySelectorAll('[data-active-horizon]').forEach(node => { node.textContent = horizon; });

      const source = buttons.find(button => button.dataset.horizonSelect === horizon);
      if (source?.dataset.universe) {
        document.querySelectorAll('[data-active-universe]').forEach(node => { node.textContent = source.dataset.universe; });
      }
      if (source?.dataset.published) {
        document.querySelectorAll('[data-active-published]').forEach(node => { node.textContent = source.dataset.published; });
      }
      if (source?.dataset.universe) {
        document.querySelectorAll('[data-output-count-context]').forEach(node => {
          node.textContent = `OF ${source.dataset.universe} SECURITIES`;
        });
      }
      rerenderModelOutput();
    }

    buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.horizonSelect || '5')));
    const initial = buttons.find(button => button.classList.contains('active'))?.dataset.horizonSelect || buttons[0].dataset.horizonSelect;
    if (initial) select(initial);
  }

  function initModelOutput() {
    const search = document.querySelector('[data-model-search]');
    const filters = [...document.querySelectorAll('[data-model-filter]')];
    const rows = [...document.querySelectorAll('[data-model-row]')];
    const empty = document.querySelector('[data-model-empty]');
    if (!rows.length) return;

    let active = 'all';
    function render() {
      const q = (search?.value || '').trim().toLowerCase();
      let visible = 0;
      rows.forEach(row => {
        const direction = row.dataset.direction || 'neutral';
        const text = row.dataset.searchText || '';
        const panel = row.closest('[data-horizon-panel]');
        const inActiveHorizon = !panel || !panel.hidden;
        const show = inActiveHorizon && (active === 'all' || direction === active) && (!q || text.includes(q));
        row.hidden = !show;
        if (show) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    }

    rerenderModelOutput = render;
    search?.addEventListener('input', render);
    filters.forEach(button => button.addEventListener('click', () => {
      active = button.dataset.modelFilter || 'all';
      filters.forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      render();
    }));
    render();
  }

  initModelOutput();
  initHorizonSelector();

  async function initSearch() {
    const input = document.querySelector('[data-search-input]');
    const output = document.querySelector('[data-search-results]');
    const count = document.querySelector('[data-search-count]');
    if (!input || !output) return;
    let rows = [];
    try {
      const response = await fetch(`${basePath}/data/index.json`, { cache: 'no-cache' });
      if (!response.ok) throw new Error();
      rows = await response.json();
    } catch (_) {
      output.innerHTML = '<p class="small-note">Search index is unavailable.</p>';
      if (count) count.textContent = 'UNAVAILABLE';
      return;
    }

    function searchableText(row) {
      return [
        ...Object.values(row),
        prettyDirection(row.direction_bucket || row.plain_direction),
        row.horizon ? `${row.horizon}S forecast` : ''
      ].join(' ').toLowerCase();
    }

    function render() {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        output.innerHTML = '<p class="small-note">Enter a ticker, analysis date, forecast window or public model view.</p>';
        if (count) count.textContent = 'READY';
        return;
      }
      const matching = rows.filter(row => searchableText(row).includes(q));
      const filtered = matching.slice(0, 50);
      if (count) count.textContent = `${matching.length} MATCH${matching.length === 1 ? '' : 'ES'}${matching.length > 50 ? ' · SHOWING 50' : ''}`;
      output.innerHTML = filtered.length
        ? filtered.map(row => {
            const direction = row.direction_bucket || row.plain_direction || 'neutral_model_signal';
            const label = prettyDirection(direction);
            const tone = directionTone(direction);
            const rank = Number(row.rank_within_horizon);
            const rankText = Number.isInteger(rank) ? `RANK #${rank}${row.universe_count ? ` / ${row.universe_count}` : ''}` : 'Rank unavailable';
            const horizon = row.horizon ? `${row.horizon}S forecast` : (row.horizon_label || 'Primary horizon');
            return `<a class="search-result" href="${basePath}${escapeHtml(row.url || '/')}"><span class="result-date">${escapeHtml(row.date || '')}</span><strong class="result-symbol">${escapeHtml(row.display_symbol || row.symbol || '')}</strong><em class="result-rank">${escapeHtml(rankText)}</em><span class="result-horizon">${escapeHtml(horizon)}</span><small class="result-view tone-${tone}">${escapeHtml(label)}</small></a>`;
          }).join('')
        : '<p class="small-note">No matching public model records.</p>';
    }
    input.addEventListener('input', render);
    render();
  }

  initSearch();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations?.().then(registrations => registrations.forEach(registration => registration.unregister())).catch(() => {});
    });
  }
})();
