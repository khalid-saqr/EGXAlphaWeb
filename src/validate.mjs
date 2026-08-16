import fs from 'node:fs';
import path from 'node:path';

export const FORBIDDEN_KEYS = new Set([
  'paid_subscriber',
  'creator_full',
  'system_state',
  'predictions',
  'ranking_score',
  'return_forecast',
  'direction_logit',
  'latest_predictions',
  'model_evidence_state',
  'model_trust_state',
  'drift_state',
  'retraining_request',
  'source_status',
  'raw_observation_rows',
  'feature_audit',
  'bars_written',
  'source_status_path',
  'daily_bars_path',
  'model_version',
  'prediction_id',
  'feature_builder_version',
  'run_id',
  'input_cutoff',
  'raw_features',
  'feature_names',
  'weights',
  'embeddings',
  'normalizer',
  'training_loss',
  'validation_loss',
  'hit_rate'
]);

export const SCHEMA_V1 = 'egx_alpha_public_wire_v1';
export const SCHEMA_V2 = 'egx_alpha_public_wire_v2';
export const PUBLIC_HORIZONS = ['1', '3', '5', '10'];

const DIRECTION_BUCKETS = new Set([
  'positive_model_signal',
  'neutral_model_signal',
  'negative_model_signal'
]);

const V1_REQUIRED_TOP = [
  'schema_version',
  'domain',
  'signal_name',
  'audience',
  'trading_date',
  'published_at',
  'signal',
  'context',
  'disclaimer',
  'integrity'
];

const V1_REQUIRED_SIGNAL = [
  'stock_symbol',
  'rank_label',
  'rank_within_horizon',
  'horizon',
  'direction_bucket',
  'source_freshness_status'
];

const V2_REQUIRED_TOP = [
  'schema_version',
  'domain',
  'signal_name',
  'audience',
  'trading_date',
  'primary_horizon',
  'universe_count',
  'record_origin',
  'signals',
  'disclaimer',
  'integrity'
];

const V2_SIGNAL_KEYS = [
  'stock_symbol',
  'rank_within_horizon',
  'direction_bucket',
  'source_freshness_status'
];

const V2_TOP_KEYS = new Set([...V2_REQUIRED_TOP, 'forecast_windows', 'research_evidence']);
const V2_SIGNAL_KEY_SET = new Set(V2_SIGNAL_KEYS);
const WINDOW_KEYS = new Set(['horizon', 'universe_count', 'signals']);
const DISCLAIMER_KEYS = new Set(['market_use', 'investment_advice', 'execution_instruction']);

const SYSTEM_SCALE_KEYS = new Set([
  'historical_model_samples',
  'training_universe_count',
  'training_dates',
  'validation_dates',
  'heldout_test_dates'
]);
const HISTORICAL_VALIDATION_KEYS = new Set(['status', 'heldout_test_dates', 'by_horizon']);
const HISTORICAL_HORIZON_KEYS = new Set(['heldout_mean_date_rank_ic', 'heldout_top_bottom_spread_return']);
const LIVE_VALIDATION_KEYS = new Set([
  'status',
  'governance_threshold_days',
  'total_matured_outcomes',
  'scored_prediction_days',
  'pending_outcomes',
  'by_horizon'
]);
const LIVE_HORIZON_KEYS = new Set([
  'matured_outcomes',
  'matured_prediction_days',
  'live_metrics_ready',
  'live_mean_rank_ic',
  'live_top_bottom_spread_return'
]);
const GOVERNANCE_KEYS = new Set([
  'outcomes_scored_after_horizon_maturity',
  'live_metrics_maturity_gated',
  'automatic_retraining',
  'automatic_promotion',
  'human_review_required'
]);
const RESEARCH_EVIDENCE_KEYS = new Set([
  'system_scale',
  'historical_validation',
  'live_validation',
  'governance'
]);

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function findForbiddenKeys(value, trail = []) {
  const found = [];
  if (Array.isArray(value)) {
    value.forEach((item, idx) => found.push(...findForbiddenKeys(item, [...trail, String(idx)])));
    return found;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const nextTrail = [...trail, key];
      if (FORBIDDEN_KEYS.has(key)) found.push(nextTrail.join('.'));
      found.push(...findForbiddenKeys(child, nextTrail));
    }
  }
  return found;
}

function requireKeys(value, keys, label, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${label} must be an object`);
    return;
  }
  for (const key of keys) {
    if (!(key in value)) errors.push(`Missing required ${label} key: ${key}`);
  }
}

function rejectUnexpectedKeys(value, allowed, label, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) errors.push(`Unexpected ${label} key: ${key}`);
  }
}

function positiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function finiteNumberOrNull(value) {
  return value === null || (typeof value === 'number' && Number.isFinite(value));
}

function validateIdentity(payload, errors) {
  if (payload.domain !== 'EGXResearch') errors.push('domain must equal EGXResearch');
  if (payload.signal_name !== 'EGX /Alpha signal') errors.push('signal_name must equal EGX /Alpha signal');
  if (payload.audience !== 'public') errors.push('audience must equal public');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(payload.trading_date || ''))) errors.push('trading_date must be YYYY-MM-DD');
}

function validateDisclaimer(disclaimer, errors, { strictKeys = false } = {}) {
  requireKeys(disclaimer, ['market_use', 'investment_advice', 'execution_instruction'], 'disclaimer', errors);
  if (!disclaimer || typeof disclaimer !== 'object' || Array.isArray(disclaimer)) return;
  if (strictKeys) rejectUnexpectedKeys(disclaimer, DISCLAIMER_KEYS, 'disclaimer', errors);
  if (disclaimer.investment_advice !== false) errors.push('disclaimer.investment_advice must be false');
  if (disclaimer.execution_instruction !== false) errors.push('disclaimer.execution_instruction must be false');
  if (disclaimer.market_use !== 'research_and_information_only') errors.push('disclaimer.market_use must be research_and_information_only');
}

function validateSignalArray(signals, universeCount, label, errors) {
  if (!Array.isArray(signals) || signals.length === 0) {
    errors.push(`${label} must be a non-empty array`);
    return { symbols: [], ranks: [] };
  }

  if (Number.isInteger(universeCount) && signals.length !== universeCount) {
    errors.push(`${label} length (${signals.length}) must equal universe_count (${universeCount})`);
  }

  const symbols = [];
  const ranks = [];
  signals.forEach((signal, index) => {
    const rowLabel = `${label}[${index}]`;
    requireKeys(signal, V2_SIGNAL_KEYS, rowLabel, errors);
    rejectUnexpectedKeys(signal, V2_SIGNAL_KEY_SET, rowLabel, errors);
    if (!signal || typeof signal !== 'object' || Array.isArray(signal)) return;

    const symbol = String(signal.stock_symbol || '');
    const rank = Number(signal.rank_within_horizon);
    if (!/^EGX:[A-Z0-9][A-Z0-9._-]*$/.test(symbol)) errors.push(`${rowLabel}.stock_symbol must use a valid EGX: symbol`);
    if (!Number.isInteger(rank) || rank <= 0) errors.push(`${rowLabel}.rank_within_horizon must be a positive integer`);
    if (!DIRECTION_BUCKETS.has(signal.direction_bucket)) errors.push(`${rowLabel}.direction_bucket is invalid`);
    if (typeof signal.source_freshness_status !== 'string' || !signal.source_freshness_status.trim()) errors.push(`${rowLabel}.source_freshness_status must be a non-empty string`);
    symbols.push(symbol);
    ranks.push(rank);
  });

  if (new Set(symbols).size !== symbols.length) errors.push(`${label} stock symbols must be unique`);
  if (new Set(ranks).size !== ranks.length) errors.push(`${label} ranks must be unique`);

  if (Number.isInteger(universeCount) && universeCount > 0 && ranks.every(Number.isInteger)) {
    const ordered = [...ranks].sort((a, b) => a - b);
    const complete = ordered.length === universeCount && ordered.every((rank, index) => rank === index + 1);
    if (!complete) errors.push(`${label} ranks must cover exactly 1..${universeCount}`);
  }
  return { symbols, ranks };
}

function canonicalSignals(signals) {
  return [...(signals || [])]
    .sort((a, b) => Number(a.rank_within_horizon) - Number(b.rank_within_horizon))
    .map(row => ({
      stock_symbol: row.stock_symbol,
      rank_within_horizon: Number(row.rank_within_horizon),
      direction_bucket: row.direction_bucket,
      source_freshness_status: row.source_freshness_status
    }));
}

function validateForecastWindows(payload, errors) {
  const windows = payload.forecast_windows;
  if (!windows || typeof windows !== 'object' || Array.isArray(windows)) {
    errors.push('forecast_windows must be an object');
    return;
  }
  const keys = Object.keys(windows).sort((a, b) => Number(a) - Number(b));
  if (keys.join(',') !== PUBLIC_HORIZONS.join(',')) {
    errors.push('forecast_windows must contain exactly 1, 3, 5 and 10');
  }

  let baselineSymbols = null;
  for (const horizon of PUBLIC_HORIZONS) {
    const window = windows[horizon];
    requireKeys(window, ['horizon', 'universe_count', 'signals'], `forecast_windows.${horizon}`, errors);
    rejectUnexpectedKeys(window, WINDOW_KEYS, `forecast_windows.${horizon}`, errors);
    if (!window || typeof window !== 'object' || Array.isArray(window)) continue;
    if (String(window.horizon) !== horizon) errors.push(`forecast_windows.${horizon}.horizon must equal ${horizon}`);
    const count = positiveInteger(window.universe_count);
    if (!count) errors.push(`forecast_windows.${horizon}.universe_count must be a positive integer`);
    const { symbols } = validateSignalArray(window.signals, count, `forecast_windows.${horizon}.signals`, errors);
    const set = new Set(symbols);
    if (baselineSymbols === null) baselineSymbols = set;
    else if (set.size !== baselineSymbols.size || [...set].some(symbol => !baselineSymbols.has(symbol))) {
      errors.push('forecast_windows must contain the same eligible symbol set at every horizon');
    }
  }

  const five = windows['5'];
  if (five && Number(five.universe_count) !== Number(payload.universe_count)) {
    errors.push('forecast_windows.5.universe_count must equal top-level universe_count');
  }
  if (five && JSON.stringify(canonicalSignals(five.signals)) !== JSON.stringify(canonicalSignals(payload.signals))) {
    errors.push('forecast_windows.5.signals must exactly match top-level signals');
  }
}

function requirePositiveIntegerField(object, key, label, errors) {
  if (!positiveInteger(object?.[key])) errors.push(`${label}.${key} must be a positive integer`);
}

function validateResearchEvidence(evidence, errors, { allowNullLiveValidation = false } = {}) {
  requireKeys(evidence, ['system_scale', 'historical_validation', 'live_validation', 'governance'], 'research_evidence', errors);
  rejectUnexpectedKeys(evidence, RESEARCH_EVIDENCE_KEYS, 'research_evidence', errors);
  if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence)) return;

  const scale = evidence.system_scale || {};
  requireKeys(scale, [...SYSTEM_SCALE_KEYS], 'research_evidence.system_scale', errors);
  rejectUnexpectedKeys(scale, SYSTEM_SCALE_KEYS, 'research_evidence.system_scale', errors);
  for (const key of SYSTEM_SCALE_KEYS) requirePositiveIntegerField(scale, key, 'research_evidence.system_scale', errors);

  const historical = evidence.historical_validation || {};
  requireKeys(historical, ['status', 'heldout_test_dates', 'by_horizon'], 'research_evidence.historical_validation', errors);
  rejectUnexpectedKeys(historical, HISTORICAL_VALIDATION_KEYS, 'research_evidence.historical_validation', errors);
  if (historical.status !== 'historical_validation_passed') errors.push('research_evidence.historical_validation.status must equal historical_validation_passed');
  requirePositiveIntegerField(historical, 'heldout_test_dates', 'research_evidence.historical_validation', errors);
  const historicalByHorizon = historical.by_horizon || {};
  if (Object.keys(historicalByHorizon).sort((a, b) => Number(a) - Number(b)).join(',') !== PUBLIC_HORIZONS.join(',')) {
    errors.push('research_evidence.historical_validation.by_horizon must contain exactly 1, 3, 5 and 10');
  }
  for (const horizon of PUBLIC_HORIZONS) {
    const row = historicalByHorizon[horizon] || {};
    requireKeys(row, [...HISTORICAL_HORIZON_KEYS], `research_evidence.historical_validation.by_horizon.${horizon}`, errors);
    rejectUnexpectedKeys(row, HISTORICAL_HORIZON_KEYS, `research_evidence.historical_validation.by_horizon.${horizon}`, errors);
    for (const key of HISTORICAL_HORIZON_KEYS) {
      if (typeof row[key] !== 'number' || !Number.isFinite(row[key])) errors.push(`research_evidence.historical_validation.by_horizon.${horizon}.${key} must be a finite number`);
    }
  }

  const live = evidence.live_validation;
  if (live === null) {
    if (!allowNullLiveValidation) {
      errors.push('research_evidence.live_validation may be null only for historical_backfill records');
    }
  } else {
    requireKeys(live, ['status', 'governance_threshold_days', 'total_matured_outcomes', 'scored_prediction_days', 'pending_outcomes', 'by_horizon'], 'research_evidence.live_validation', errors);
    rejectUnexpectedKeys(live, LIVE_VALIDATION_KEYS, 'research_evidence.live_validation', errors);
    if (live && typeof live === 'object' && !Array.isArray(live)) {
      if (typeof live.status !== 'string' || !live.status.trim()) errors.push('research_evidence.live_validation.status must be a non-empty string');
      requirePositiveIntegerField(live, 'governance_threshold_days', 'research_evidence.live_validation', errors);
      for (const key of ['total_matured_outcomes', 'scored_prediction_days', 'pending_outcomes']) {
        const value = Number(live[key]);
        if (!Number.isInteger(value) || value < 0) errors.push(`research_evidence.live_validation.${key} must be a non-negative integer`);
      }
      const liveByHorizon = live.by_horizon || {};
      if (Object.keys(liveByHorizon).sort((a, b) => Number(a) - Number(b)).join(',') !== PUBLIC_HORIZONS.join(',')) {
        errors.push('research_evidence.live_validation.by_horizon must contain exactly 1, 3, 5 and 10');
      }
      for (const horizon of PUBLIC_HORIZONS) {
        const row = liveByHorizon[horizon] || {};
        requireKeys(row, [...LIVE_HORIZON_KEYS], `research_evidence.live_validation.by_horizon.${horizon}`, errors);
        rejectUnexpectedKeys(row, LIVE_HORIZON_KEYS, `research_evidence.live_validation.by_horizon.${horizon}`, errors);
        for (const key of ['matured_outcomes', 'matured_prediction_days']) {
          const value = Number(row[key]);
          if (!Number.isInteger(value) || value < 0) errors.push(`research_evidence.live_validation.by_horizon.${horizon}.${key} must be a non-negative integer`);
        }
        if (typeof row.live_metrics_ready !== 'boolean') errors.push(`research_evidence.live_validation.by_horizon.${horizon}.live_metrics_ready must be boolean`);
        for (const key of ['live_mean_rank_ic', 'live_top_bottom_spread_return']) {
          if (!finiteNumberOrNull(row[key])) errors.push(`research_evidence.live_validation.by_horizon.${horizon}.${key} must be a finite number or null`);
          if (row.live_metrics_ready === false && row[key] !== null) errors.push(`research_evidence.live_validation.by_horizon.${horizon}.${key} must remain null before maturity`);
          if (row.live_metrics_ready === true && row[key] === null) errors.push(`research_evidence.live_validation.by_horizon.${horizon}.${key} is required after maturity`);
        }
      }
    }
  }

  const governance = evidence.governance || {};
  requireKeys(governance, [...GOVERNANCE_KEYS], 'research_evidence.governance', errors);
  rejectUnexpectedKeys(governance, GOVERNANCE_KEYS, 'research_evidence.governance', errors);
  for (const key of GOVERNANCE_KEYS) {
    if (typeof governance[key] !== 'boolean') errors.push(`research_evidence.governance.${key} must be boolean`);
  }
  if (governance.outcomes_scored_after_horizon_maturity !== true) errors.push('research_evidence.governance.outcomes_scored_after_horizon_maturity must be true');
  if (governance.live_metrics_maturity_gated !== true) errors.push('research_evidence.governance.live_metrics_maturity_gated must be true');
  if (governance.automatic_retraining !== false) errors.push('research_evidence.governance.automatic_retraining must be false');
  if (governance.automatic_promotion !== false) errors.push('research_evidence.governance.automatic_promotion must be false');
  if (governance.human_review_required !== true) errors.push('research_evidence.governance.human_review_required must be true');
}

function validateV1(payload, errors) {
  requireKeys(payload, V1_REQUIRED_TOP, 'top-level', errors);
  validateIdentity(payload, errors);
  if (Number.isNaN(Date.parse(String(payload.published_at || '')))) errors.push('published_at must be an ISO timestamp');

  const signal = payload.signal || {};
  requireKeys(signal, V1_REQUIRED_SIGNAL, 'signal', errors);
  if (signal.rank_within_horizon !== 3) errors.push('V1 public signal must have rank_within_horizon = 3');
  if (!String(signal.stock_symbol || '').startsWith('EGX:')) errors.push('stock_symbol must use EGX: prefix');

  validateDisclaimer(payload.disclaimer || {}, errors);
}

function validateV2(payload, errors) {
  requireKeys(payload, V2_REQUIRED_TOP, 'top-level', errors);
  rejectUnexpectedKeys(payload, V2_TOP_KEYS, 'top-level V2', errors);
  validateIdentity(payload, errors);
  validateDisclaimer(payload.disclaimer || {}, errors, { strictKeys: true });

  if (String(payload.primary_horizon) !== '5') errors.push('V2 primary_horizon must equal 5');

  const universeCount = positiveInteger(payload.universe_count);
  if (!universeCount) errors.push('V2 universe_count must be a positive integer');
  if (!['live', 'historical_backfill'].includes(payload.record_origin)) errors.push('V2 record_origin must be live or historical_backfill');
  if (!payload.integrity || typeof payload.integrity !== 'object' || Array.isArray(payload.integrity)) errors.push('V2 integrity must be an object');

  validateSignalArray(payload.signals, universeCount, 'signals', errors);

  const hasWindows = Object.prototype.hasOwnProperty.call(payload, 'forecast_windows');
  const hasEvidence = Object.prototype.hasOwnProperty.call(payload, 'research_evidence');
  if (hasWindows !== hasEvidence) errors.push('V2 forecast_windows and research_evidence must be published together');
  if (hasWindows) validateForecastWindows(payload, errors);
  if (hasEvidence) validateResearchEvidence(payload.research_evidence, errors, { allowNullLiveValidation: payload.record_origin === 'historical_backfill' });
}

export function validatePublicWire(payload) {
  const errors = [];
  const forbidden = findForbiddenKeys(payload);
  if (forbidden.length) errors.push(`Forbidden private/internal keys found: ${forbidden.join(', ')}`);

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, errors: [...errors, 'payload must be an object'] };
  }

  if (payload.schema_version === SCHEMA_V1) validateV1(payload, errors);
  else if (payload.schema_version === SCHEMA_V2) validateV2(payload, errors);
  else errors.push(`schema_version must equal ${SCHEMA_V1} or ${SCHEMA_V2}`);

  return { ok: errors.length === 0, errors };
}

export function assertValidPublicWire(payload, label = 'payload') {
  const result = validatePublicWire(payload);
  if (!result.ok) {
    throw new Error(`${label} failed validation:\n- ${result.errors.join('\n- ')}`);
  }
  return payload;
}

export function loadAndValidate(filePath) {
  const payload = readJson(filePath);
  return assertValidPublicWire(payload, filePath);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2] || path.join('data', 'latest.json');
  loadAndValidate(file);
  console.log(`Valid public wire: ${file}`);
}
