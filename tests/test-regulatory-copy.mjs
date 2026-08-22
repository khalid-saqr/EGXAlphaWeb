import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

if (!fs.existsSync('_site')) execSync('node src/build.mjs', { stdio: 'inherit' });

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) files.push(...walk(p));
    else if (p.endsWith('.html')) files.push(p);
  }
  return files;
}

const pages = walk('_site');
assert.ok(pages.length > 0, 'built site should contain HTML pages');

const forbidden = [
  'Which EGX stocks deserve your attention tomorrow?',
  'A daily order of priority for the Egyptian market.',
  'Start with what the model ranks highest. Then do your research.',
  'RETAIL INVESTOR GUIDE',
  'help investors decide where to start looking',
  'daily priority list',
  'Start near the top of that ranking.',
  'Then do the investment work.',
  'different decision layer — cross-sectional priority',
  'what deserves attention first',
  'signal distribution',
  'POST-CLOSE · CAIRO',
  'Quantitative investment research',
  'How can I use it as an investor?',
  'دليل المستثمر الفرد',
  'من أين يقول النموذج إن بحثك يجب أن يبدأ؟',
  'ابدأ من المراكز العليا',
  'ثم اتخذ قرارك أنت',
  'طبقة قرار مختلفة',
  'ماذا يستحق الانتباه أولاً',
  'توزيع الإشارة',
  'بعد الإغلاق · القاهرة',
  'كمستثمر يدير محفظته بنفسه'
];

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  for (const phrase of forbidden) {
    assert.equal(html.includes(phrase), false, `regulatory-risk copy "${phrase}" remains in ${file}`);
  }
}

const home = fs.readFileSync('_site/index.html', 'utf8');
const arHome = fs.readFileSync('_site/ar/index.html', 'utf8');
const guide = fs.readFileSync('_site/investor-guide/index.html', 'utf8');
const arGuide = fs.readFileSync('_site/ar/investor-guide/index.html', 'utf8');
const faq = fs.readFileSync('_site/faq/index.html', 'utf8');
const institutional = fs.readFileSync('_site/institutional/index.html', 'utf8');
const methodology = fs.readFileSync('_site/methodology/index.html', 'utf8');

for (const required of [
  'How does EGX /Alpha rank the eligible EGX universe for the sessions ahead?',
  'general model outputs intended for research and informational use',
  'not recommendations to buy, sell or hold any security',
  'A daily cross-sectional research ranking of the Egyptian market.',
  'not offered or directed to persons located in Egypt'
]) assert.ok(home.includes(required), `homepage should include ${required}`);

for (const required of [
  'كيف يرتب EGX /Alpha أسهم EGX المؤهلة للجلسات المقبلة؟',
  'مخرجات نموذجية عامة مخصصة للبحث والمعلومات',
  'توصيات بشراء أي ورقة مالية',
  'ترتيب بحثي نسبي يومي للسوق المصري.',
  'لا يُعرض أو يُوجَّه إلى أشخاص موجودين داخل مصر'
]) assert.ok(arHome.includes(required), `Arabic homepage should include ${required}`);

assert.ok(guide.includes('PUBLIC RESEARCH INTERPRETATION GUIDE'));
assert.ok(guide.includes('How the fields can be read together'));
assert.ok(arGuide.includes('دليل تفسير المخرجات البحثية العامة'));
assert.ok(arGuide.includes('كيف تُقرأ الحقول معاً؟'));

assert.ok(faq.includes('how should its public ranking be interpreted?'));
assert.ok(faq.includes('market-relative model classifications rather than Buy, Hold or Sell labels'));

assert.ok(institutional.includes('For research collaboration, research publication, research-data formats, technology or other institutional enquiries:'));
assert.ok(institutional.includes('do not constitute an offer of investment advisory, brokerage, execution, portfolio-management or custody services'));

assert.ok(methodology.includes('From a broad market to a cross-sectional ranking.'));
assert.ok(methodology.includes('HYPOTHETICAL RESEARCH SIMULATIONS'));
assert.equal(methodology.includes('EGP 1m to +56.74%'), false, 'promotional simulated-return teaser should not remain on methodology page');

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const isArabic = file.includes(`${path.sep}ar${path.sep}`);
  if (isArabic) {
    assert.ok(html.includes('لا تمثل توصيات بشراء أي ورقة مالية أو بيعها أو الاحتفاظ بها'), `Arabic footer classification notice missing from ${file}`);
  } else {
    assert.ok(html.includes('do not constitute recommendations to buy, sell or hold any security'), `footer classification notice missing from ${file}`);
  }
}

console.log('test-regulatory-copy passed');
