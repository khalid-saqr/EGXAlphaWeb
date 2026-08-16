import fs from 'node:fs';
import path from 'node:path';

export const FORBIDDEN_KEYS = new Set([
  'paid_subscriber',
  'creator_full',
  'system_state',
  'predictions',
  'ranking_score',
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
  'raw_features'
]);

export const SCHEMA_V1 = 'egx_alpha_public_wire_v1';
export const SCHEMA_V2 = 'egx_alpha_public_wire_v2';

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

const V2_TOP_KEYS = new Set(V2_REQUIRED_TOP);
const V2_SIGNAL_KEY_SET = new Set(V2_SIGNAL_KEYS);
const DISCLAIMER_KEYS = new Set(['market_use', 'investment_advice', 'execution_instruction']);

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

  const universeCount = Number(payload.universe_count);
  if (!Number.isInteger(universeCount) || universeCount <= 0) errors.push('V2 universe_count must be a positive integer');
  if (!['live', 'historical_backfill'].includes(payload.record_origin)) errors.push('V2 record_origin must be live or historical_backfill');
  if (!payload.integrity || typeof payload.integrity !== 'object' || Array.isArray(payload.integrity)) errors.push('V2 integrity must be an object');

  if (!Array.isArray(payload.signals) || payload.signals.length === 0) {
    errors.push('V2 signals must be a non-empty array');
    return;
  }

  if (Number.isInteger(universeCount) && payload.signals.length !== universeCount) {
    errors.push(`V2 signals length (${payload.signals.length}) must equal universe_count (${universeCount})`);
  }

  const symbols = [];
  const ranks = [];
  payload.signals.forEach((signal, index) => {
    const label = `signals[${index}]`;
    requireKeys(signal, V2_SIGNAL_KEYS, label, errors);
    rejectUnexpectedKeys(signal, V2_SIGNAL_KEY_SET, label, errors);
    if (!signal || typeof signal !== 'object' || Array.isArray(signal)) return;

    const symbol = String(signal.stock_symbol || '');
    const rank = Number(signal.rank_within_horizon);
    if (!/^EGX:[A-Z0-9][A-Z0-9._-]*$/.test(symbol)) errors.push(`${label}.stock_symbol must use a valid EGX: symbol`);
    if (!Number.isInteger(rank) || rank <= 0) errors.push(`${label}.rank_within_horizon must be a positive integer`);
    if (!DIRECTION_BUCKETS.has(signal.direction_bucket)) errors.push(`${label}.direction_bucket is invalid`);
    if (typeof signal.source_freshness_status !== 'string' || !signal.source_freshness_status.trim()) errors.push(`${label}.source_freshness_status must be a non-empty string`);
    symbols.push(symbol);
    ranks.push(rank);
  });

  if (new Set(symbols).size !== symbols.length) errors.push('V2 stock symbols must be unique within a trading date');
  if (new Set(ranks).size !== ranks.length) errors.push('V2 ranks must be unique within a trading date');

  if (Number.isInteger(universeCount) && universeCount > 0 && ranks.every(Number.isInteger)) {
    const ordered = [...ranks].sort((a, b) => a - b);
    const complete = ordered.length === universeCount && ordered.every((rank, index) => rank === index + 1);
    if (!complete) errors.push(`V2 ranks must cover exactly 1..${universeCount}`);
  }
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
