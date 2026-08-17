(function () {
  const configText = document.getElementById('site-config')?.textContent?.trim();
  const payloadText = document.getElementById('beacon-payload')?.textContent?.trim();
  let siteConfig = { basePath: '' };
  let pagePayload = {};
  try { if (configText) siteConfig = JSON.parse(configText); } catch (_) {}
  try { if (payloadText) pagePayload = JSON.parse(payloadText); } catch (_) {}
  const basePath = String(siteConfig.basePath ?? '').replace(/\/$/, '');

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
  function signalTone(value) {
    if (value === 'positive_model_signal' || value === 'positive') return 'positive';
    if (value === 'negative_model_signal' || value === 'negative') return 'negative';
    return 'neutral';
  }
  function signalLabel(value) {
    const tone = signalTone(value);
    if (tone === 'positive') return 'Positive';
    if (tone === 'negative') return 'Negative';
    return 'Neutral';
  }
  function horizonLabel(value) {
    const raw = String(value ?? '').trim().replace(/\.0+$/, '');
    return raw ? `${raw}D` : '—';
  }
  function percentile(rank, universe) {
    const r = Number(rank);
    const n = Number(universe);
    if (!Number.isFinite(r) || !Number.isFinite(n) || n <= 0 || r < 1 || r > n) return null;
    return (100 * (n - r + 1)) / n;
  }
  function formatPercentile(rank, universe) {
    const value = percentile(rank, universe);
    return value == null ? '—' : value.toFixed(1);
  }
  function setTheme(theme) {
    const resolved = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = resolved;
    localStorage.setItem('egxalpha-theme', resolved);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => button.setAttribute('aria-pressed', resolved === 'light' ? 'true' : 'false'));
  }

  setTheme(localStorage.getItem('egxalpha-theme') || 'dark');
  document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light')));

  function initRankingController() {
    const horizonButtons = [...document.querySelectorAll('[data-horizon-select]')];
    if (!horizonButtons.length) return;
    const filterButtons = [...document.querySelectorAll('[data-model-filter]')];
    const search = document.querySelector('[data-model-search]');
    const rows = [...document.querySelectorAll('[data-model-row]')];
    const empty = document.querySelector('[data-model-empty]');
    const initial = horizonButtons.find(button => button.classList.contains('active'))?.dataset.horizonSelect || horizonButtons[0]?.dataset.horizonSelect || '5';
    const state = { horizon: String(initial), direction: 'all', query: '' };
    function panelHorizon(row) { return row.closest('[data-horizon-panel]')?.dataset.horizonPanel || state.horizon; }
    function activeRows() { return rows.filter(row => panelHorizon(row) === state.horizon); }
    function updateFilterCounts() {
      const counts = { all: 0, positive: 0, neutral: 0, negative: 0 };
      activeRows().forEach(row => {
        const tone = row.dataset.direction || 'neutral';
        counts.all += 1;
        if (Object.hasOwn(counts, tone)) counts[tone] += 1;
      });
      filterButtons.forEach(button => {
        const key = button.dataset.modelFilter || 'all';
        const node = button.querySelector('[data-filter-count]');
        if (node) node.textContent = String(counts[key] ?? 0);
      });
    }
    function render() {
      horizonButtons.forEach(button => {
        const selected = button.dataset.horizonSelect === state.horizon;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      document.querySelectorAll('[data-horizon-panel]').forEach(panel => { panel.hidden = panel.dataset.horizonPanel !== state.horizon; });
      document.querySelectorAll('[data-active-horizon]').forEach(node => { node.textContent = state.horizon; });
      const source = horizonButtons.find(button => button.dataset.horizonSelect === state.horizon);
      if (source?.dataset.universe) {
        document.querySelectorAll('[data-active-universe]').forEach(node => { node.textContent = source.dataset.universe; });
        document.querySelectorAll('[data-output-count-context]').forEach(node => { node.textContent = `OF ${source.dataset.universe} STOCKS`; });
      }
      filterButtons.forEach(button => {
        const selected = (button.dataset.modelFilter || 'all') === state.direction;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      let visible = 0;
      activeRows().forEach(row => {
        const direction = row.dataset.direction || 'neutral';
        const text = row.dataset.searchText || '';
        const show = (state.direction === 'all' || direction === state.direction) && (!state.query || text.includes(state.query));
        row.hidden = !show;
        if (show) visible += 1;
      });
      rows.filter(row => panelHorizon(row) !== state.horizon).forEach(row => { row.hidden = false; });
      document.querySelectorAll('[data-active-visible]').forEach(node => { node.textContent = String(visible); });
      updateFilterCounts();
      if (empty) {
        empty.hidden = visible !== 0;
        if (!empty.hidden) {
          const label = state.direction === 'all' ? 'matching' : signalLabel(state.direction).toLowerCase();
          empty.innerHTML = `No ${escapeHtml(label)} stocks in the selected ${escapeHtml(horizonLabel(state.horizon))} outlook.${state.direction !== 'all' ? ' <button type="button" data-show-all>Show all</button>' : ''}`;
          empty.querySelector('[data-show-all]')?.addEventListener('click', () => { state.direction = 'all'; render(); });
        }
      }
    }
    horizonButtons.forEach(button => button.addEventListener('click', () => { state.horizon = button.dataset.horizonSelect || state.horizon; render(); }));
    filterButtons.forEach(button => button.addEventListener('click', () => { state.direction = button.dataset.modelFilter || 'all'; render(); }));
    search?.addEventListener('input', () => { state.query = search.value.trim().toLowerCase(); render(); });
    render();
  }

  let indexPromise;
  function publicIndex() {
    if (!indexPromise) indexPromise = fetch(`${basePath}/data/index.json`, { cache: 'no-cache' }).then(response => { if (!response.ok) throw new Error('index unavailable'); return response.json(); });
    return indexPromise;
  }
  function chartSvg(rows, { compact = false } = {}) {
    const points = rows.map(row => ({ ...row, p: percentile(row.rank_within_horizon ?? row.rank, row.universe_count) })).filter(row => row.p != null);
    if (points.length < 2) return '<p class="chart-empty">Not enough public history yet.</p>';
    const width = compact ? 620 : 720;
    const height = compact ? 210 : 260;
    const left = 38, right = 14, top = 16, bottom = 34;
    const innerW = width - left - right;
    const innerH = height - top - bottom;
    const x = i => left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = p => top + ((100 - p) / 100) * innerH;
    const path = points.map((point, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(point.p).toFixed(1)}`).join(' ');
    const circles = points.map((point, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(point.p).toFixed(1)}" r="${i === points.length - 1 ? 4.5 : 2.5}"><title>${escapeHtml(point.date)} · ${point.p.toFixed(1)} percentile · rank #${escapeHtml(point.rank_within_horizon ?? point.rank)}</title></circle>`).join('');
    const first = points[0]?.date || '';
    const last = points.at(-1)?.date || '';
    return `<svg class="rank-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Historical rank percentile chart"><g class="chart-grid"><line x1="${left}" y1="${y(100)}" x2="${width-right}" y2="${y(100)}"/><line x1="${left}" y1="${y(50)}" x2="${width-right}" y2="${y(50)}"/><line x1="${left}" y1="${y(0)}" x2="${width-right}" y2="${y(0)}"/></g><g class="chart-axis"><text x="4" y="${y(100)+4}">100</text><text x="10" y="${y(50)+4}">50</text><text x="16" y="${y(0)+4}">0</text><text x="${left}" y="${height-8}">${escapeHtml(first)}</text><text text-anchor="end" x="${width-right}" y="${height-8}">${escapeHtml(last)}</text></g><path class="chart-line" d="${path}"/>${circles}</svg>`;
  }
  async function initHeroChart() {
    const target = document.querySelector('[data-hero-chart]');
    if (!target) return;
    const symbol = target.dataset.heroSymbol || '';
    const horizon = target.dataset.heroHorizon || '5';
    const asOf = target.dataset.heroAsOf || pagePayload.trading_date || '';
    try {
      const rows = (await publicIndex()).filter(row => (row.display_symbol || String(row.symbol || '').split(':').pop()) === symbol && String(row.horizon) === String(horizon) && (!asOf || row.date <= asOf)).sort((a, b) => a.date.localeCompare(b.date)).slice(-20);
      target.innerHTML = chartSvg(rows);
    } catch (_) { target.innerHTML = '<p class="chart-empty">Historical chart unavailable.</p>'; }
  }
  async function initDossierCharts() {
    const targets = [...document.querySelectorAll('[data-rank-chart]')];
    if (!targets.length) return;
    try {
      const index = await publicIndex();
      targets.forEach(target => {
        const symbol = target.dataset.rankChartSymbol || '';
        const horizon = target.dataset.rankChartHorizon || '5';
        const rows = index.filter(row => (row.display_symbol || String(row.symbol || '').split(':').pop()) === symbol && String(row.horizon) === String(horizon)).sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
        target.innerHTML = chartSvg(rows, { compact: true });
      });
    } catch (_) { targets.forEach(target => { target.innerHTML = '<p class="chart-empty">Historical chart unavailable.</p>'; }); }
  }
  async function initSearch() {
    const input = document.querySelector('[data-search-input]');
    const output = document.querySelector('[data-search-results]');
    const count = document.querySelector('[data-search-count]');
    if (!input || !output) return;
    let rows = [];
    try { rows = await publicIndex(); }
    catch (_) { output.innerHTML = '<p class="small-note">Search index is unavailable.</p>'; if (count) count.textContent = 'UNAVAILABLE'; return; }
    function searchableText(row) { return [...Object.values(row), signalLabel(row.direction_bucket || row.plain_direction), row.horizon ? `${horizonLabel(row.horizon)} outlook` : ''].join(' ').toLowerCase(); }
    function render() {
      const q = input.value.trim().toLowerCase();
      if (!q) { output.innerHTML = '<p class="small-note">Enter a ticker, analysis date, outlook or signal.</p>'; if (count) count.textContent = 'READY'; return; }
      const matching = rows.filter(row => searchableText(row).includes(q));
      const filtered = matching.slice(0, 50);
      if (count) count.textContent = `${matching.length} MATCH${matching.length === 1 ? '' : 'ES'}${matching.length > 50 ? ' · SHOWING 50' : ''}`;
      output.innerHTML = filtered.length ? filtered.map(row => {
        const direction = row.direction_bucket || row.plain_direction || 'neutral_model_signal';
        const rank = Number(row.rank_within_horizon);
        const universe = Number(row.universe_count);
        const rankText = Number.isInteger(rank) ? `#${rank}${Number.isInteger(universe) ? ` / ${universe}` : ''}` : 'Rank —';
        return `<a class="search-result" href="${basePath}${escapeHtml(row.symbol_url || row.url || '/')}"><span class="result-date">${escapeHtml(row.date || '')}</span><strong class="result-symbol">${escapeHtml(row.display_symbol || row.symbol || '')}</strong><em class="result-rank">${escapeHtml(rankText)}</em><span class="result-horizon">${escapeHtml(horizonLabel(row.horizon))}</span><span class="result-percentile">${escapeHtml(formatPercentile(rank, universe))} percentile</span><small class="result-view tone-${signalTone(direction)}">${escapeHtml(signalLabel(direction))}</small></a>`;
      }).join('') : '<p class="small-note">No matching public model records.</p>';
    }
    input.addEventListener('input', render);
    render();
  }

  initRankingController();
  initHeroChart();
  initDossierCharts();
  initSearch();
  if ('serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.getRegistrations?.().then(registrations => registrations.forEach(registration => registration.unregister())).catch(() => {}); });
})();
