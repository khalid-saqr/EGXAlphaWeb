import assert from 'node:assert/strict';
import fs from 'node:fs';

const target = '_site/methodology/index.html';
assert.equal(fs.existsSync(target), true, 'methodology page must be built before layout validation');
const html = fs.readFileSync(target, 'utf8');

for (const required of [
  'Public methodology white paper',
  'ranking-first deep-learning and real-time monitoring system',
  'Real-time monitoring layer: availability before prediction',
  'Market representation: sequence, structure and regime',
  'Deep-learning ranking layer',
  'Validation and promotion protocol',
  'Matured-outcome follow-up, evidence state and drift',
  'What is explained and what remains private',
  'paper-section-copy',
  'methodology-document-styles'
]) {
  assert.ok(html.includes(required), `methodology page should include: ${required}`);
}

const sectionCount = (html.match(/class="paper-section"/g) || []).length;
assert.equal(sectionCount, 9, 'methodology paper should contain nine numbered sections');
assert.equal(
  /<section class="paper-section"[^>]*>\s*<p class="paper-number"/.test(html),
  false,
  'section text must not auto-flow into the narrow number column'
);
assert.ok(
  /<section class="paper-section"[^>]*>[\s\S]*?<div class="paper-section-index"[\s\S]*?<div class="paper-section-copy">/.test(html),
  'each methodology section should use a stable index-and-copy wrapper'
);

for (const privateTerm of [
  'ranking_score',
  'direction_logit',
  'x_seq',
  'symbol_idx',
  'pairwise_logistic_ranking_loss',
  'models/egxalpha_v1',
  'memory/foresight',
  '.onnx.data'
]) {
  assert.equal(html.includes(privateTerm), false, `private implementation term leaked into methodology: ${privateTerm}`);
}

assert.ok(html.includes('@page { size: A4;'), 'methodology page should include A4 print rules');
assert.ok(html.includes('break-inside: avoid'), 'methodology page should protect print section integrity');

console.log('test-methodology-layout passed');
