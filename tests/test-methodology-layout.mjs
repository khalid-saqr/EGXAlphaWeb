import assert from 'node:assert/strict';
import fs from 'node:fs';

const en = fs.readFileSync('_site/methodology/index.html', 'utf8');
const ar = fs.readFileSync('_site/ar/methodology/index.html', 'utf8');

for (const required of [
  'WHY /ALPHA EXISTS',
  'The index tells you how the market moved. /Alpha tells you where to look.',
  'THE QUESTION /ALPHA ANSWERS',
  'The market average is useful. It is also incomplete.',
  'From market noise to an order of priority.',
  'Why deep learning? Because markets are interactions, not checklists.',
  'Every forecast becomes future evidence. Every new generation must earn promotion.',
  'The public website is the research surface, not the engine room.',
  'More depth. More evidence. No novelty for its own sake.',
  'An index gives you the average. /Alpha gives you the order.',
  '1D', '3D', '5D', '10D',
  'Relative Rank', 'Model Direction',
  'progressive, generational learning',
  'References and verification.',
  'Today’s EGX /Alpha ranking',
  'Public model memory',
  'Machine-readable public record'
]) assert.ok(en.includes(required), `English methodology should include ${required}`);

for (const required of [
  'ورقة بحثية كمية عامة',
  'المؤشر يخبرك كيف تحرك السوق. EGX /Alpha يخبرك أين تبدأ البحث داخله.',
  'السؤال الذي يجيب عنه EGX /Alpha',
  'متوسط السوق مهم. لكنه لا يكفي لاتخاذ قرار بين الأسهم.',
  'من ضوضاء السوق إلى ترتيب واضح للأولوية.',
  'لماذا التعلم العميق؟ لأن السوق علاقات متغيرة، لا قائمة شروط ثابتة.',
  'كل توقع يتحول لاحقاً إلى دليل. وكل جيل جديد يجب أن يستحق مكانه.',
  'ما تراه على الموقع هو سطح البحث، وليس غرفة المحرك.',
  'عمق أكبر. أدلة أكثر. بلا تعقيد لمجرد الاستعراض.',
  'المؤشر يعطيك المتوسط. EGX /Alpha يعطيك الترتيب.',
  'التسلسل الزمني', 'الآفاق الأربعة', 'الترتيب والاتجاه إشارتان منفصلتان', 'طبقة التعلم العميق', 'التحقق زمني'
]) assert.ok(ar.includes(required), `Arabic methodology should include ${required}`);

for (const href of [
  'https://www.egx.com.eg/en/indexrulesmethodologyegx70-ewi.aspx?nav=16',
  'https://academic.oup.com/rfs/article/33/5/2223/5758276',
  'https://pubsonline.informs.org/doi/10.1287/mnsc.2023.4695'
]) {
  assert.ok(en.includes(`href="${href}"`), `English methodology should link ${href}`);
  assert.ok(ar.includes(`href="${href}"`), `Arabic methodology should link ${href}`);
}

for (const href of ['/today/', '/investor-guide/', '/archive/', '/data/latest.json', '/institutional/']) {
  assert.ok(en.includes(`href="${href}"`), `English methodology should expose ${href}`);
}
for (const href of ['/ar/today/', '/ar/investor-guide/', '/ar/archive/', '/data/latest.json', '/ar/institutional/']) {
  assert.ok(ar.includes(`href="${href}"`), `Arabic methodology should expose ${href}`);
}
assert.equal(ar.includes('href="/ar/data/latest.json"'), false, 'Arabic methodology must preserve the shared public-data path');

for (const privateTerm of [
  'ranking_score', 'direction_logit', 'return_forecast', 'x_seq', 'symbol_idx',
  'memory/foresight', '.onnx.data', 'GRU', 'pairwise_logistic', 'return_loss_weight',
  'direction_loss_weight', 'ranking_loss_weight', 'lookback: 32'
]) {
  assert.equal(en.includes(privateTerm), false, `private implementation term leaked in English: ${privateTerm}`);
  assert.equal(ar.includes(privateTerm), false, `private implementation term leaked in Arabic: ${privateTerm}`);
}

assert.equal(en.includes('generative AI system'), false, 'methodology must not mislabel /Alpha as a generative model');
assert.ok(en.includes('human-governed promotion decision'), 'progressive learning must retain human governance');
assert.ok(ar.includes('المراجعة البشرية'), 'Arabic progressive learning must retain human governance');
assert.ok(en.includes('@page{size:A4'));
assert.ok(en.includes('@media(max-width:700px)'));
assert.ok(en.includes('@media(max-width:520px)'));
assert.ok(en.includes('methodology-document-styles'));
assert.ok(en.includes('EGX Research Community LLP'));
assert.ok(en.includes('KNOWDYN'));
assert.ok(en.includes('60Arabia'));

console.log('test-methodology-layout passed');
