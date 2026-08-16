export const PUBLIC_HORIZONS = ['1', '3', '5', '10'];

export function normaliseHorizon(value, fallback = '5') {
  const text = String(value ?? '').trim().replace(/\.0+$/, '');
  return text || fallback;
}

function displaySignalFromLegacy(payload) {
  const signal = payload?.public_signal || payload?.signal || {};
  if (!signal.stock_symbol) return [];
  const asset = payload?.asset || {};
  return [{
    stock_symbol: signal.stock_symbol,
    rank_within_horizon: signal.rank_within_horizon,
    horizon: signal.horizon,
    direction_bucket: signal.direction_bucket,
    source_freshness_status: signal.source_freshness_status,
    company_name: asset.company_name || null,
    sector: asset.sector || null,
    latest_close: payload?.market_snapshot?.latest_close ?? null,
    daily_change_pct: payload?.market_snapshot?.daily_change_pct ?? null,
    plain_direction: signal.plain_direction || null,
    rank_label: signal.rank_label || null,
    horizon_label: signal.horizon_label || null
  }];
}

export function topLevelSignals(payload) {
  if (Array.isArray(payload?.signals)) {
    return [...payload.signals].sort((a, b) => Number(a.rank_within_horizon) - Number(b.rank_within_horizon));
  }
  return displaySignalFromLegacy(payload);
}

export function primaryHorizon(payload, rows = topLevelSignals(payload)) {
  return normaliseHorizon(
    payload?.primary_horizon ||
    rows?.[0]?.horizon ||
    payload?.public_signal?.horizon ||
    payload?.signal?.horizon ||
    '5'
  );
}

function fallbackUniverseCount(payload) {
  const value = Number(payload?.universe_count ?? payload?.ranking_context?.comparison_count);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export function forecastWindows(payload) {
  if (payload?.forecast_windows && typeof payload.forecast_windows === 'object' && !Array.isArray(payload.forecast_windows)) {
    const result = {};
    for (const horizon of PUBLIC_HORIZONS) {
      const window = payload.forecast_windows[horizon];
      if (!window || !Array.isArray(window.signals)) continue;
      result[horizon] = {
        horizon,
        universe_count: Number.isInteger(Number(window.universe_count)) ? Number(window.universe_count) : null,
        signals: [...window.signals].sort((a, b) => Number(a.rank_within_horizon) - Number(b.rank_within_horizon))
      };
    }
    if (Object.keys(result).length) return result;
  }

  const rows = topLevelSignals(payload);
  const horizon = primaryHorizon(payload, rows);
  return {
    [horizon]: {
      horizon,
      universe_count: fallbackUniverseCount(payload),
      signals: rows
    }
  };
}

export function availableHorizons(payload) {
  const windows = forecastWindows(payload);
  return PUBLIC_HORIZONS.filter(horizon => windows[horizon]).concat(
    Object.keys(windows).filter(horizon => !PUBLIC_HORIZONS.includes(horizon))
  );
}

export function rowsForHorizon(payload, horizon = primaryHorizon(payload)) {
  return forecastWindows(payload)[normaliseHorizon(horizon)]?.signals || [];
}

export function universeForHorizon(payload, horizon = primaryHorizon(payload)) {
  const window = forecastWindows(payload)[normaliseHorizon(horizon)];
  if (window) {
    const value = Number(window.universe_count);
    if (Number.isInteger(value) && value > 0) return value;
  }
  return fallbackUniverseCount(payload);
}

export function hasMultiHorizon(payload) {
  return availableHorizons(payload).length > 1;
}

export function historicalEvidenceFor(payload, horizon) {
  return payload?.research_evidence?.historical_validation?.by_horizon?.[normaliseHorizon(horizon)] || null;
}

export function liveEvidenceFor(payload, horizon) {
  return payload?.research_evidence?.live_validation?.by_horizon?.[normaliseHorizon(horizon)] || null;
}
