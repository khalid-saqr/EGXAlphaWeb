import assert from 'node:assert/strict';
import fs from 'node:fs';

process.env.EGX_BASE_PATH = '/';
process.env.EGX_SITE_URL = 'https://egxresearch.com';
const { htmlShell, siteFooter } = await import('../src/templates.mjs');

const render = locale => htmlShell({
  title: 'Footer QA',
  description: 'Footer QA',
  canonicalPath: '/',
  body: siteFooter(),
  locale
});

const en = render('en');
const ar = render('ar');

for (const token of ['__F1__','__F2__','__F3__','__F4__','__F5__','__F6__','__F7__','__F8__','__F9__','__F10__','__F11__','__F12__','__F13__','__F14__','__F15__','__F16__']) {
  assert.equal(en.includes(token), false, `English footer should resolve ${token}`);
  assert.equal(ar.includes(token), false, `Arabic footer should resolve ${token}`);
}

for (const required of [
  'RESEARCH CLOSE',
  'A daily order of priority for the Egyptian market.',
  'Start with what the model ranks highest. Then do your research.',
  'USE /ALPHA',
  'Today&#39;s Ranking',
  'Search Stocks',
  'Ranking History',
  'UNDERSTAND /ALPHA',
  'Investor Guide',
  'Research Methodology',
  'ACCESS',
  'Institutional Access',
  'VERIFY PUBLIC RECORD',
  'JSON · MACHINE-READABLE',
  'PROVENANCE'
]) assert.ok(en.includes(required), `English research close should include ${required}`);

assert.ok(en.includes('<a class="footer-record-link" href="/data/latest.json"><strong>VERIFY PUBLIC RECORD</strong><span class="footer-record-meta">JSON · MACHINE-READABLE</span></a>'), 'verification action must preserve the exact public JSON target while hiding the implementation filename from the label');
assert.equal(en.includes('Public quantitative research for the Egyptian Exchange.'), false, 'generic footer identity copy should be retired');
assert.equal(en.includes('<span class="footer-label">RESEARCH</span>'), false, 'duplicated generic RESEARCH directory should be retired');

for (const required of [
  '<html lang="ar" dir="rtl">',
  'خلاصة البحث',
  'ترتيب يومي للأولوية في السوق المصري.',
  'ابدأ بما يضعه النموذج في أعلى الترتيب، ثم ابدأ بحثك.',
  'استخدم /ALPHA',
  'ترتيب اليوم',
  'ابحث عن الأسهم',
  'سجل الترتيب',
  'افهم /ALPHA',
  'دليل المستثمر',
  'منهجية البحث',
  'الوصول',
  'الوصول المؤسسي',
  'تحقق من السجل العام',
  'JSON · قابل للقراءة آلياً',
  '>التطبيق<',
  'المصدر'
]) assert.ok(ar.includes(required), `Arabic research close should include ${required}`);
assert.ok(ar.includes('href="/data/latest.json"'), 'Arabic footer must verify the shared root public JSON');
assert.equal(ar.includes('href="/ar/data/latest.json"'), false, 'Arabic footer must not invent a localized data path');
assert.ok(ar.includes('EGX Research Community LLP'));
assert.ok(ar.includes('KNOWDYN'));
assert.ok(ar.includes('60Arabia'));

const shellCss = fs.readFileSync('assets/shell.css', 'utf8');
const rtlCss = fs.readFileSync('assets/i18n.css', 'utf8');
const footerCss = fs.readFileSync('assets/fine-tune.css', 'utf8');
const compact = value => value.replace(/\s+/g, '');
const compactFooter = compact(footerCss);

assert.equal(shellCss.includes('.footer-grid'), false, 'legacy shell CSS must not define footer grid tracks');
assert.equal(rtlCss.includes('.research-footer .footer-grid'), false, 'i18n CSS must not define global footer grid tracks');
assert.ok(rtlCss.includes('html[dir="rtl"] .footer-close-meta,html[dir="rtl"] .footer-record-meta'), 'footer-specific RTL treatment must be explicitly scoped');
assert.ok(compactFooter.includes('.footer-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));'), 'desktop footer must use exactly three canonical columns');
assert.ok(compactFooter.includes('@media(max-width:980px){') && compactFooter.includes('.footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))}'), 'tablet footer must reduce to two columns');
assert.ok(compactFooter.includes('@media(max-width:620px){') && compactFooter.includes('.footer-grid{grid-template-columns:1fr}'), 'mobile footer must reduce to one column');
assert.equal(footerCss.includes('.footer-app.pwa-install-button{'), false, 'PWA install selector must retain its descendant combinator');
assert.ok(compactFooter.includes('.footer-app.pwa-install-button{width:auto'), 'PWA install must be a secondary access action, not a full-width product panel');
assert.equal(footerCss.includes('↗'), false, 'internal footer links must not use external-link arrows');
assert.equal(footerCss.includes('.footer-links a::after'), false, 'internal footer links must not synthesize external-link affordances');

const closeIndex = en.indexOf('class="footer-close"');
const gridIndex = en.indexOf('class="footer-grid"');
const provenanceIndex = en.indexOf('class="footer-provenance"');
assert.ok(closeIndex >= 0 && gridIndex > closeIndex && provenanceIndex > gridIndex, 'footer should close with value, then intent paths, then provenance');

console.log('test-footer passed');
