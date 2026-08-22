import assert from 'node:assert/strict';
import fs from 'node:fs';

const en = fs.readFileSync('_site/methodology/index.html', 'utf8');
const ar = fs.readFileSync('_site/ar/methodology/index.html', 'utf8');

for (const required of [
  'PUBLIC QUANTITATIVE RESEARCH PAPER',
  'Building a research digital twin of the Egyptian equity market.',
  'THE RESEARCH QUESTION',
  'The index tells you how a basket moved. The twin studies how eligible stocks differ inside that market.',
  'A learned analytical representation that updates after completed market sessions.',
  'Because market relationships are nonlinear, conditional and time-varying.',
  'Where does each eligible stock sit relative to the others at a selected forward horizon?',
  'The future must remain future during testing.',
  'Observe → publish → wait → score → learn → challenge → review.',
  'A twin should preserve its earlier states.',
  'Research credibility grows when forecasts can be checked after they mature.',
  'Hypothetical experiments for studying ranking rules, not client performance.',
  'EX-ANTE FORECASTS · HYPOTHETICAL RESEARCH SIMULATIONS',
  'EGX /Alpha Case Studies',
  'EGX /Alpha Rank 1 vs. Rank 1+: A Comparative 1D/3D Exit-Discipline Trading Simulation',
  'EGX /Alpha Rank 1 vs. Rank 1+: Comparative Next-Session Whole-Share Trading Simulations',
  'Positive-Filtered vs. Raw-Rank Five-Sleeve Portfolios',
  '1D', '3D', '5D', '10D',
  'Relative Rank', 'Model Direction',
  'References and verification.'
]) assert.ok(en.includes(required), `English methodology should include ${required}`);

for (const required of [
  'ورقة بحثية كمية عامة',
  'بناء توأم رقمي بحثي لسوق الأسهم المصري.',
  'السؤال البحثي',
  'المؤشر يخبرك كيف تحركت سلة من الأسهم؛ أما التوأم الرقمي فيدرس كيف تختلف الأسهم المؤهلة داخل السوق.',
  'تمثيل تحليلي متعلم يتجدد بعد الجلسات المكتملة.',
  'لأن علاقات السوق غير خطية ومشروطة ومتغيرة بمرور الوقت.',
  'أين يقع كل سهم مؤهل مقارنة ببقية الأسهم عند أفق مستقبلي محدد؟',
  'يجب أن يظل المستقبل مستقبلاً أثناء الاختبار.',
  'رصد ← نشر ← انتظار ← قياس ← تعلم ← تحدٍّ ← مراجعة.',
  'التوأم الرقمي الجيد يحتفظ بحالاته السابقة.',
  'تزداد مصداقية البحث عندما يمكن فحص التوقعات بعد اكتمالها.',
  'تجارب افتراضية لدراسة قواعد الترتيب، وليست أداءً فعلياً لعملاء.',
  'توقعات EX-ANTE · محاكاة بحثية افتراضية',
  'دراسات حالة EGX /Alpha',
  'EGX /Alpha Rank 1 vs. Rank 1+: A Comparative 1D/3D Exit-Discipline Trading Simulation',
  'EGX /Alpha Rank 1 vs. Rank 1+: Comparative Next-Session Whole-Share Trading Simulations',
  'Positive-Filtered vs. Raw-Rank Five-Sleeve Portfolios',
  'الترتيب النسبي', 'اتجاه النموذج', 'المراجعة البشرية'
]) assert.ok(ar.includes(required), `Arabic methodology should include ${required}`);

for (const href of [
  'https://www.egx.com.eg/en/indexrulesmethodologyegx70-ewi.aspx?nav=16',
  'https://academic.oup.com/rfs/article/33/5/2223/5758276'
]) {
  assert.ok(en.includes(`href="${href}"`), `English methodology should link ${href}`);
  assert.ok(ar.includes(`href="${href}"`), `Arabic methodology should link ${href}`);
}
for (const html of [en, ar]) {
  assert.ok(html.includes('pubsonline.informs.org'), 'methodology should preserve the Chen, Pelger & Zhu external reference host');
  assert.ok(html.includes('Deep Learning in Asset Pricing'), 'methodology should preserve the Chen, Pelger & Zhu reference title');
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
assert.equal((en.match(/class="case-study-toggle"/g) || []).length, 3, 'English case-study accordions should restore the original toggle affordances');
assert.equal((ar.match(/class="case-study-toggle"/g) || []).length, 3, 'Arabic case-study accordions should restore the original toggle affordances');
assert.ok(en.includes(' download>DOWNLOAD CASE STUDY · PDF <span aria-hidden="true">↓</span>'), 'English case-study links should download PDFs with the original download affordance');
assert.ok(ar.includes(' download>تنزيل دراسة الحالة · PDF <span aria-hidden="true">↓</span>'), 'Arabic case-study links should download PDFs with the original download affordance');

for (const [html, label] of [[en, 'English'], [ar, 'Arabic']]) {
  const articleStart = html.indexOf('<article class="methodology-story"');
  const questionIndex = html.indexOf('<div class="methodology-question"', articleStart);
  const caseIndex = html.indexOf('<aside class="methodology-closing methodology-case-studies"', questionIndex);
  const firstSectionIndex = html.indexOf('<section class="methodology-section"', questionIndex);
  assert.ok(questionIndex >= 0 && caseIndex > questionIndex && firstSectionIndex > caseIndex, `${label} case-study box should sit in the methodology hero immediately after the research question`);
  const sectionNineIndex = html.indexOf(label === 'English' ? '09 / RESEARCH SIMULATIONS' : '09 / المحاكاة البحثية', firstSectionIndex);
  const sectionTenIndex = html.indexOf(label === 'English' ? '10 / RESEARCH AGENDA' : '10 / أجندة البحث', sectionNineIndex);
  assert.ok(sectionNineIndex >= 0 && sectionTenIndex > sectionNineIndex, `${label} methodology should preserve sections 09 and 10`);
  assert.equal(html.slice(sectionNineIndex, sectionTenIndex).includes('methodology-case-studies'), false, `${label} case-study box should no longer be buried inside section 09`);
}

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
