export function horizonLabel(value) {
  const raw = String(value ?? '').trim().replace(/\.0+$/, '');
  return raw ? `${raw}D` : '—';
}

export function signalTone(bucket) {
  if (bucket === 'positive_model_signal' || bucket === 'positive') return 'positive';
  if (bucket === 'negative_model_signal' || bucket === 'negative') return 'negative';
  return 'neutral';
}

export function signalLabel(bucket) {
  const tone = signalTone(bucket);
  if (tone === 'positive') return 'Positive';
  if (tone === 'negative') return 'Negative';
  return 'Neutral';
}

export function rankPercentile(rank, universe) {
  const r = Number(rank);
  const n = Number(universe);
  if (!Number.isFinite(r) || !Number.isFinite(n) || n <= 0 || r < 1 || r > n) return null;
  return (100 * (n - r + 1)) / n;
}

export function formatPercentile(rank, universe) {
  const value = rankPercentile(rank, universe);
  return value == null ? '—' : value.toFixed(1);
}

export function displaySymbol(symbol) {
  const text = String(symbol || '').trim();
  return text.includes(':') ? text.split(':').pop() : text || 'EGX';
}

export function movementLabel(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return '—';
  return `${n > 0 ? '+' : ''}${n}`;
}
