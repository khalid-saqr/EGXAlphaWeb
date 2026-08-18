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
  'PROVENANCE'
]) assert.ok(en.includes(required), `English research close should include ${required}`);

assert.ok(en.includes('<a class="footer-record-link" href="/data/latest.json"><strong>VERIFY PUBLIC RECORD</strong><span class="footer-record-meta">JSON · MACHINE-READABLE</span></a>'), 'verification action must preserve the exact public JSON target while hiding the implementation filename from the visible label');
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
  '>التطبيق<',
  'المصدر'
]) assert.ok(ar.includes(required), `Arabic research close should include ${required}`);
assert.ok(ar.includes('href="/data/latest.json"'), 'Arabic footer must verify the shared root public JSON');
assert.equal(ar.includes('href="/ar/data/latest.json"'), false, 'Arabic footer must not invent a localized data path');

const knowdynLink = '<a href="https://knowdyn.com" target="_blank" rel="noopener noreferrer">KNOWDYN</a>';
const sixtyArabiaLink = '<a href="https://60arabia.com" target="_blank" rel="noopener noreferrer">60Arabia</a>';
for (const html of [en, ar]) {
  assert.ok(html.includes(knowdynLink), 'footer must preserve the embedded KNOWDYN hyperlink');
  assert.ok(html.includes(sixtyArabiaLink), 'footer must preserve the embedded 60Arabia hyperlink');
}

const shellCss = fs.readFileSync('assets/shell.css', 'utf8');
const rtlCss = fs.readFileSync('assets/i18n.css', 'utf8');
const footerCss = fs.readFileSync('assets/fine-tune.css', 'utf8');
const compact = value => value.replace(/\s+/g, '');
const compactFooter = compact(footerCss);

assert.equal(shellCss.includes('.footer-grid'), false, 'legacy shell CSS must not define footer grid tracks');
assert.equal(rtlCss.includes('.research-footer .footer-grid'), false, 'i18n CSS must not define global footer grid tracks');
assert.ok(rtlCss.includes('html[dir="rtl"] .footer-close-meta,html[dir="rtl"] .footer-record-meta'), 'footer-specific RTL treatment must remain explicitly scoped');
assert.ok(compactFooter.includes('.footer-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));'), 'desktop footer must use exactly three canonical columns');
assert.ok(compactFooter.includes('@media(max-width:980px){') && compactFooter.includes('.footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))}'), 'tablet footer must reduce to two columns');
assert.ok(compactFooter.includes('@media(max-width:620px){') && compactFooter.includes('.footer-grid{grid-template-columns:1fr}'), 'mobile footer must reduce to one column');
assert.ok(footerCss.includes('.footer-links a::after,.footer-access-link::after,.footer-record-link::after,.footer-app .pwa-install-button::after{content:none!important;display:none!important}'), 'internal footer actions must explicitly suppress inherited arrow affordances');
assert.equal(footerCss.includes('↗'), false, 'internal footer links must not use external-link arrows');
assert.equal(footerCss.includes('content:"↓"'), false, 'PWA install must not regain a prominent download-arrow treatment');
assert.ok(compactFooter.includes('.footer-app{background:transparent}'), 'Access must not render as a special shaded product panel');
assert.ok(compactFooter.includes('.footer-app-kicker{display:none}'), 'APP kicker must not compete with the Access hierarchy');
assert.ok(compactFooter.includes('.footer-record-meta{display:none}'), 'Verify Public Record must remain the visible verification label');
assert.ok(footerCss.includes('.footer-app .pwa-install-button{'), 'PWA install must remain available as a secondary access action');
assert.ok(footerCss.includes('.footer-provenance-line a{color:var(--brand);'), 'provenance partner links must be visibly identifiable as links');
assert.ok(compactFooter.includes('.footer-disclaimer{grid-column:1;max-width:112ch;'), 'legal copy must use a readable line length');
assert.ok(footerCss.includes('.footer-close-meta span+span::before{content:"·";'), 'research metadata groups must retain an explicit separator');

const closeIndex = en.indexOf('class="footer-close"');
const gridIndex = en.indexOf('class="footer-grid"');
const provenanceIndex = en.indexOf('class="footer-provenance"');
assert.ok(closeIndex >= 0 && gridIndex > closeIndex && provenanceIndex > gridIndex, 'footer should close with value, then intent paths, then provenance');

console.log('test-footer passed');
