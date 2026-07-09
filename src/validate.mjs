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
  'daily_bars_path'
]);

const REQUIRED_TOP = [
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

const REQUIRED_SIGNAL = [
  'stock_symbol',
  'rank_label',
  'rank_within_horizon',
  'horizon',
  'direction_bucket',
  'source_freshness_status'
];

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

export function validatePublicWire(payload) {
  const errors = [];
  const forbidden = findForbiddenKeys(payload);
  if (forbidden.length) errors.push(`Forbidden private/internal keys found: ${forbidden.join(', ')}`);
  for (const key of REQUIRED_TOP) {
    if (!(key in payload)) errors.push(`Missing required top-level key: ${key}`);
  }
  if (payload.schema_version !== 'egx_alpha_public_wire_v1') errors.push('schema_version must equal egx_alpha_public_wire_v1');
  if (payload.domain !== 'EGXResearch') errors.push('domain must equal EGXResearch');
  if (payload.signal_name !== 'EGX /Alpha signal') errors.push('signal_name must equal EGX /Alpha signal');
  if (payload.audience !== 'public') errors.push('audience must equal public');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(payload.trading_date || ''))) errors.push('trading_date must be YYYY-MM-DD');
  if (Number.isNaN(Date.parse(String(payload.published_at || '')))) errors.push('published_at must be an ISO timestamp');

  const signal = payload.signal || {};
  for (const key of REQUIRED_SIGNAL) {
    if (!(key in signal)) errors.push(`Missing required signal key: ${key}`);
  }
  if (signal.rank_within_horizon !== 3) errors.push('free public signal must have rank_within_horizon = 3');
  if (!String(signal.stock_symbol || '').startsWith('EGX:')) errors.push('stock_symbol must use EGX: prefix');

  const disclaimer = payload.disclaimer || {};
  if (disclaimer.investment_advice !== false) errors.push('disclaimer.investment_advice must be false');
  if (disclaimer.execution_instruction !== false) errors.push('disclaimer.execution_instruction must be false');
  if (disclaimer.market_use !== 'research_and_information_only') errors.push('disclaimer.market_use must be research_and_information_only');

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
