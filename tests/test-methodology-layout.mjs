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
  'EGX /Alpha Case Studies',
  'EGX /Alpha Rank 1 vs. Rank 1+: A Comparative 1D/3D Exit-Discipline Trading Simulation',
  'EGX /Alpha Rank 1 vs. Rank 1+: Comparative Next-Session Whole-Share Trading Simulations',
  'Positive-Filtered vs. Raw-Rank Five-Sleeve Portfolios',
  'A tightly controlled ex-ante test:',
  'The preserved ex-ante signal choice reshaped the entire trading path:',
  'A capacity-aware portfolio stress test delivered the uncomfortable result:',
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
  'دراسات حالة EGX /Alpha',
  'اختبار ex-ante محكوم:',
  'غيّر اختيار الإشارة ex-ante المحفوظ مسار التداول بالكامل:',
  'اختبار محفظة يراعي سعة التداول كشف نتيجة معاكسة للتوقع:',
  'التسلسل الزمني', 'الآفاق الأربعة', 'الترتيب والاتجاه إشارتان منفصلتان', 'طبقة التعلم العميق', 'التحقق زمني'
]) assert.ok(ar.includes(required), `Arabic methodology should include ${required}`);

const enQuestionIndex = en.indexOf('THE QUESTION /ALPHA ANSWERS');
const enCaseStudiesIndex = en.indexOf('EGX /Alpha Case Studies');
const enProblemIndex = en.indexOf('01 / THE PROBLEM');
assert.ok(enQuestionIndex >= 0 && enCaseStudiesIndex > enQuestionIndex && enProblemIndex > enCaseStudiesIndex, 'English case studies should sit in the hero after the methodology question and before section 01');

const arQuestionIndex = ar.indexOf('السؤال الذي يجيب عنه EGX /Alpha');
const arCaseStudiesIndex = ar.indexOf('دراسات حالة EGX /Alpha');
const arProblemIndex = ar.indexOf('01 / المشكلة');
assert.ok(arQuestionIndex >= 0 && arCaseStudiesIndex > arQuestionIndex && arProblemIndex > arCaseStudiesIndex, 'Arabic case studies should sit in the hero after the methodology question and before section 01');

for (const href of [
  'https://www.egx.com.eg/en/indexrulesmethodologyegx70-ewi.aspx?nav=16',
  'https://academic.oup.com/rfs/article/33/5/2223/5758276',
  'https://pubsonline.informs.com/doi/10.1287/mnsc.2023.4695'
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

const caseStudyFiles = [
  'EGX_Alpha_Case_Study_1.pdf',
  'EGX_Alpha_Case_Study_2.pdf',
  'EGX_Alpha_Case_Study_3.pdf'
];
for (const file of caseStudyFiles) {
  const href = `/assets/case-studies/${file}`;
  assert.ok(en.includes(`href="${href}"`), `English methodology should link ${href}`);
  assert.ok(ar.includes(`href="${href}"`), `Arabic methodology should link ${href}`);
  assert.equal(fs.existsSync(`_site${href}`), true, `${href} should be present in Pages artifact`);
}
assert.equal((en.match(/class="case-study-record"/g) || []).length, 3, 'English methodology should expose exactly three case-study accordions');
assert.equal((ar.match(/class="case-study-record"/g) || []).length, 3, 'Arabic methodology should expose exactly three case-study accordions');
assert.ok(en.includes(' download>DOWNLOAD CASE STUDY · PDF'), 'English case-study links should download PDFs');
assert.ok(ar.includes(' download>تنزيل دراسة الحالة · PDF'), 'Arabic case-study links should download PDFs');
assert.equal(en.includes('An index gives you the average. /Alpha gives you the order.'), false, 'retired English closing copy should be removed');
assert.equal(ar.includes('المؤشر يعطيك المتوسط. EGX /Alpha يعطيك الترتيب.'), false, 'retired Arabic closing copy should be removed');

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
