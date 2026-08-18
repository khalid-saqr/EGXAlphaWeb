import assert from 'node:assert/strict';
import fs from 'node:fs';

const latest = JSON.parse(fs.readFileSync('data/latest.json', 'utf8'));
const date = latest.trading_date;
const primary = String(latest.primary_horizon || '5');
const firstSignal = latest.forecast_windows?.[primary]?.signals?.[0] || latest.signals?.[0] || {};
const symbol = String(firstSignal.stock_symbol || '').split(':').pop();
assert.ok(date && symbol, 'production payload should provide a date and at least one public symbol');

const requiredEnglish = [
  '_site/index.html', '_site/today/index.html', '_site/archive/index.html', '_site/search/index.html',
  '_site/methodology/index.html', '_site/investor-guide/index.html', '_site/institutional/index.html',
  `_site/archive/${date}/index.html`, `_site/symbol/${symbol}/index.html`
];
const requiredArabic = [
  '_site/ar/index.html', '_site/ar/today/index.html', '_site/ar/archive/index.html', '_site/ar/search/index.html',
  '_site/ar/methodology/index.html', '_site/ar/investor-guide/index.html', '_site/ar/institutional/index.html',
  `_site/ar/archive/${date}/index.html`, `_site/ar/symbol/${symbol}/index.html`
];
for (const file of [...requiredEnglish, ...requiredArabic]) assert.equal(fs.existsSync(file), true, `${file} should exist`);

const read = file => fs.readFileSync(file, 'utf8');
const enHome = read('_site/index.html');
const arHome = read('_site/ar/index.html');
assert.ok(enHome.includes('<html lang="en" dir="ltr">'));
assert.ok(arHome.includes('<html lang="ar" dir="rtl">'));
assert.ok(enHome.includes('"locale":"en"'));
assert.ok(arHome.includes('"locale":"ar"'));
assert.ok(arHome.includes('<link rel="canonical" href="https://egxresearch.com/ar/">'));
assert.ok(arHome.includes('<link rel="alternate" hreflang="en" href="https://egxresearch.com/">'));
assert.ok(arHome.includes('<link rel="alternate" hreflang="ar" href="https://egxresearch.com/ar/">'));
assert.ok(arHome.includes('<link rel="alternate" hreflang="x-default" href="https://egxresearch.com/">'));
assert.ok(enHome.includes('<link rel="alternate" hreflang="ar" href="https://egxresearch.com/ar/">'));

for (const required of ['EGX Research', 'ALPHA', 'الترتيب النسبي', 'اتجاه النموذج', 'تغير الترتيب', 'إيجابي', 'محايد', 'سلبي', 'اللغة', 'EN', 'تثبيت EGX /ALPHA', '>التطبيق<']) {
  assert.ok(arHome.includes(required), `Arabic homepage should include ${required}`);
}
for (const bad of ['السهمS', 'stocks analysed', '>Positive<', '>Neutral<', '>Negative<', '>Today<', '>History<', '>Guide<', '>Institutional<', '>LANGUAGE<', '>APP<']) {
  assert.equal(arHome.includes(bad), false, `Arabic homepage should not contain ${bad}`);
}
assert.ok(arHome.includes('href="/ar/today/"'));
assert.ok(arHome.includes('href="/ar/archive/"'));
assert.ok(arHome.includes('href="/ar/search/"'));
assert.ok(/class="language-action" href="\/" aria-label="(?:تغيير اللغة|Switch language)"/.test(arHome), 'Arabic header should link back to the English counterpart');
assert.ok(arHome.includes('href="/data/latest.json"'), 'Arabic verification should use the shared root public JSON');
assert.equal(arHome.includes('href="/ar/data/latest.json"'), false, 'Arabic pages must not duplicate or rewrite public data paths');
assert.equal(fs.existsSync('_site/ar/data/latest.json'), false, 'Arabic route tree must not duplicate the public data tree');
assert.deepEqual(JSON.parse(read('_site/data/latest.json')), latest, 'localization must not mutate the production public wire');
assert.ok(arHome.includes('rel="manifest" href="/manifest.webmanifest"'), 'Arabic pages should use the same root PWA manifest');
assert.ok(arHome.includes('src="/assets/pwa.js"'), 'Arabic pages should use the same PWA runtime');

const arArchive = read('_site/ar/archive/index.html');
for (const required of ['السجل العام للنموذج', 'الجلسات العامة', 'السجلات الحية', 'السجلات التاريخية', 'فتح الجلسة']) assert.ok(arArchive.includes(required), `Arabic archive should include ${required}`);
assert.equal(arArchive.includes('stocks analysed'), false);
assert.ok(arArchive.includes(`href="/ar/archive/${date}/"`));

const arSearch = read('_site/ar/search/index.html');
for (const required of ['البحث في السجل العام للنموذج', 'ابحث عن سهم أو جلسة أو أفق للنموذج.', 'رمز السهم', 'اتجاه النموذج']) assert.ok(arSearch.includes(required), `Arabic search should include ${required}`);
assert.ok(arSearch.includes('"locale":"ar"'));

const arMethodology = read('_site/ar/methodology/index.html');
for (const required of ['ورقة بحثية كمية عامة', 'التسلسل الزمني', 'الآفاق الأربعة', 'الترتيب والاتجاه إشارتان منفصلتان', 'طبقة التعلم العميق', 'التحقق زمني']) assert.ok(arMethodology.includes(required), `Arabic methodology should include ${required}`);
assert.equal(arMethodology.includes('HERO FOCUS'), false, 'methodology must remain aligned with the unified 5D-primary terminal');
assert.equal(arMethodology.includes('default hero lens'), false);
assert.ok(arMethodology.includes('href="/methodology/"') || arMethodology.includes('href="/"'), 'Arabic methodology should expose an English counterpart link');

const enGuide = read('_site/investor-guide/index.html');
for (const required of ['What EGX /Alpha Answers — and How to Read the Daily Ranking', 'The question the engine is built to answer', 'How to read the daily ranking', 'market-relative forward return']) assert.ok(enGuide.includes(required), `English investor guide should include ${required}`);

const arGuide = read('_site/ar/investor-guide/index.html');
for (const required of ['دليل المستثمر الفرد', 'ما السؤال الذي يجيب عنه EGX /Alpha؟ وكيف تقرأ ترتيب كل يوم؟', 'البورصة المصرية', 'اتجاه النموذج', 'تغير الترتيب']) assert.ok(arGuide.includes(required), `Arabic investor guide should include ${required}`);
assert.equal(arGuide.includes('INVESTOR الدليل'), false, 'investor-guide context should be fully localized');
assert.equal(arGuide.includes('كيف يستخدم المستثمر الفرد EGX /Alpha في دعم قراره'), false, 'investor-guide localization test should not require the retired guide heading');
const schemaMatch = arGuide.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(schemaMatch, 'Arabic investor guide should retain Article structured data');
const schema = JSON.parse(schemaMatch[1]);
assert.equal(schema.inLanguage, 'ar');
assert.ok(String(schema.url).endsWith('/ar/investor-guide/'));
assert.ok(String(schema.mainEntityOfPage).endsWith('/ar/investor-guide/'));
assert.ok(String(schema.headline).includes('EGX /Alpha'));

const arInstitutional = read('_site/ar/institutional/index.html');
for (const required of ['ذكاء كمي لأسهم البورصة المصرية', 'القدرات', 'التواصل المؤسسي']) assert.ok(arInstitutional.includes(required), `Arabic institutional page should include ${required}`);

const arDossier = read(`_site/ar/symbol/${symbol}/index.html`);
for (const required of [symbol, 'بحث سهم EGX /ALPHA', 'الرؤية الحالية عبر الآفاق', 'سجل الترتيب النسبي', 'المئين للترتيب', `<title>${symbol} — سجل نموذج EGX /Alpha</title>`]) assert.ok(arDossier.includes(required), `Arabic dossier should include ${required}`);
assert.equal(arDossier.includes('EGX /Alpha model history'), false, 'Arabic dossier metadata should not retain the English model-history label');
assert.ok(arDossier.includes(`href="/symbol/${symbol}/"`), 'Arabic dossier language control should return to the English counterpart');
assert.ok(arDossier.includes(`href="/ar/symbol/${symbol}/"`) || arHome.includes(`href="/ar/symbol/${symbol}/"`), 'Arabic content links should preserve locale when opening stock research');

const arDated = read(`_site/ar/archive/${date}/index.html`);
assert.ok(arDated.includes(`<link rel="canonical" href="https://egxresearch.com/ar/archive/${date}/">`));
assert.ok(arDated.includes(`href="/data/archive/${date}.json"`));
assert.equal(arDated.includes(`/ar/data/archive/${date}.json`), false);

const rtlCss = fs.readFileSync('assets/i18n.css', 'utf8');
for (const required of ['html[dir="rtl"]', 'margin-inline-start', 'padding-inline-start', 'direction:ltr', 'unicode-bidi:isolate', '@media(max-width:520px)', '@media(max-width:360px)']) assert.ok(rtlCss.includes(required), `RTL CSS should include ${required}`);
const client = fs.readFileSync('assets/app.js', 'utf8');
for (const required of ['siteConfig.locale', 'siteConfig.strings', 'localizedContentPath', '/data/index.json']) assert.ok(client.includes(required), `client localization should include ${required}`);
assert.equal(client.includes('serviceWorker.register'), false, 'service-worker registration should remain isolated in the PWA runtime');
const pwa = fs.readFileSync('assets/pwa.js', 'utf8');
assert.ok(pwa.includes("locale === 'ar'"), 'PWA runtime should localize dynamic install/offline states');
assert.ok(fs.existsSync('_site/manifest.webmanifest'), 'Commit 5 should emit the PWA manifest');

console.log('test-localization passed');
