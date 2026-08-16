(function () {
  const configText = document.getElementById('site-config')?.textContent?.trim();
  let siteConfig = { basePath: '' };
  try { if (configText) siteConfig = JSON.parse(configText); } catch (_) {}
  const basePath = String(siteConfig.basePath ?? '').replace(/\/$/, '');

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
      filters.forEach(item => item.classList.toggle('active', item === button));
      render();
    }));
    render();
  }

  initModelOutput();
  initHorizonSelector();

  async function initSearch() {
    const input = document.querySelector('[data-search-input]');
    const output = document.querySelector('[data-search-results]');
    if (!input || !output) return;
    let rows = [];
    try {
      const response = await fetch(`${basePath}/data/index.json`, { cache: 'no-cache' });
      if (!response.ok) throw new Error();
      rows = await response.json();
    } catch (_) {
      output.innerHTML = '<p class="small-note">Search index is unavailable.</p>';
      return;
    }

    function render() {
      const q = input.value.trim().toLowerCase();
      const filtered = rows.filter(row => !q || Object.values(row).join(' ').toLowerCase().includes(q)).slice(0, 50);
      output.innerHTML = filtered.length
        ? filtered.map(row => `<a class="archive-row" href="${basePath}${row.url}"><span>${row.date || ''}</span><strong>${row.display_symbol || row.symbol || ''}</strong><em>${row.horizon ? `${row.horizon}S forecast` : (row.company_name || row.sector || '')}</em><small>${String(row.plain_direction || row.direction_bucket || '').replaceAll('_', ' ')}</small></a>`).join('')
        : '<p class="small-note">No matching records.</p>';
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
