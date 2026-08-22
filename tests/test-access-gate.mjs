import assert from 'node:assert/strict';
import fs from 'node:fs';

const gate = fs.readFileSync('assets/access-gate.js', 'utf8');
const visibleGate = gate.replace(/<[^>]+>/g, '');
const builtGate = fs.readFileSync('_site/assets/access-gate.js', 'utf8');
const pwa = fs.readFileSync('assets/pwa.js', 'utf8');
const app = fs.readFileSync('assets/app.js', 'utf8');
const css = fs.readFileSync('assets/pwa.css', 'utf8');
const sw = fs.readFileSync('assets/sw.js', 'utf8');

assert.equal(builtGate, gate, 'Pages artifact must ship the exact access-gate module');

for (const required of [
  'PUBLIC QUANTITATIVE RESEARCH ENVIRONMENT',
  'بيئة عامة للبحث الكمي',
  'A research digital twin of the Egyptian equity market',
  'توأم رقمي بحثي لسوق الأسهم المصري',
  'EGX /Alpha is a continuously updated research digital twin of the Egyptian equity market.',
  'for quantitative market research, financial literacy and reproducible study.',
  'RESEARCH STATUS',
  'الصفة البحثية',
  'TERRITORIAL ACCESS',
  'نطاق الوصول',
  'EGX Research is an independent research publication produced and operated outside the Arab Republic of Egypt by entities that maintain no establishment or branch in Egypt for this activity.',
  'The website does not execute transactions, hold client funds, manage portfolios or provide personalised investment advice.',
  'Relative Rank, Model Direction and related outputs are general model-generated research classifications; they are not Buy, Hold or Sell recommendations.',
  'EGX Research does not hold or claim a licence or approval from the Egyptian Financial Regulatory Authority',
  'this public research environment is not offered or directed to persons physically located in Egypt.',
  'Technical accessibility through the public internet is not intended to constitute an offering into Egypt.',
  'منشور بحثي مستقل يُنتج ويُدار من خارج جمهورية مصر العربية',
  'وليست توصيات شراء أو احتفاظ أو بيع.',
  'ولا تُعرض هذه البيئة البحثية العامة أو تُوجَّه إلى أشخاص موجودين فعلياً داخل مصر.',
  'I confirm that I am physically located outside the Arab Republic of Egypt and am accessing EGX Research from outside Egypt.',
  'أؤكد أنني موجود فعلياً خارج جمهورية مصر العربية، وأنني أدخل إلى EGX Research من خارج مصر.',
  'If you are physically located in Egypt, do not confirm this statement or continue into the public research environment.',
  'إذا كنت موجوداً فعلياً داخل مصر، فلا تؤكد هذه العبارة ولا تتابع الدخول إلى بيئة البحث العامة.',
  'ENTER RESEARCH ENVIRONMENT',
  'الدخول إلى البيئة البحثية'
]) assert.ok(visibleGate.includes(required), `visible access gate copy should include ${required}`);

for (const required of [
  'egxalpha-access-ack-v1',
  'egxalpha-storage-optout-v1',
  'aria-modal="true"',
  'data-egx-territorial-confirmation',
  'data-egx-gate-continue disabled',
  'shell.inert = true',
  'Privacy &amp; Device Storage',
  'الخصوصية والتخزين على الجهاز',
  'function bilingualPair(en, ar)',
  '<bdi dir="ltr">EGX /Alpha</bdi>',
  '<bdi dir="ltr">EGX Research</bdi>',
  'button.innerHTML = bilingualPair(en, ar)',
  'class="egx-gate-language-block" lang="en" dir="ltr"',
  'class="egx-gate-language-block" lang="ar" dir="rtl"',
  'id="egx-gate-territorial-title-en"',
  'id="egx-gate-territorial-title-ar"',
  'id="egx-gate-privacy-title-en"',
  'id="egx-gate-privacy-title-ar"',
  'localStorage.setItem(key, value)',
  'sessionStorage.setItem(key, value)'
]) assert.ok(gate.includes(required), `access gate should include ${required}`);

assert.equal(gate.includes('PUBLIC FINANCIAL-LITERACY RESEARCH ENVIRONMENT'), false, 'financial literacy must remain a purpose rather than the primary product label');
assert.equal(gate.includes('foreign investors'), false, 'territorial gate must not target a foreign-investor class');
assert.equal(gate.includes('المستثمرين الأجانب'), false, 'Arabic territorial gate must not target a foreign-investor class');

for (const required of [
  "import(`${basePath || ''}/assets/access-gate.js`)",
  'await gateModule.initAccessGate()',
  'persistentDeviceStorageEnabled()',
  "window.addEventListener('egx-storage-mode-changed'",
  'registerServiceWorker'
]) assert.ok(pwa.includes(required), `PWA bootstrap should include ${required}`);

for (const required of [
  "const STORAGE_OPTOUT_KEY = 'egxalpha-storage-optout-v1'",
  'persistentDeviceStorageEnabled()',
  "setTheme(storedTheme() || 'dark', { persist: false })",
  "window.addEventListener('egx-storage-mode-changed'"
]) assert.ok(app.includes(required), `theme client should include ${required}`);

for (const required of [
  'html:not(.egx-access-granted) .site-shell{filter:blur(7px)',
  '.egx-access-gate{position:fixed;z-index:10000',
  '.egx-access-card{position:relative;width:min(820px,100%)',
  '.egx-gate-bilingual{display:grid;grid-template-columns:1fr 1fr',
  '.egx-gate-language-block{min-width:0}',
  '.egx-gate-language-block>.egx-gate-kicker{margin-bottom:10px}',
  '.egx-access-gate [lang="ar"]{direction:rtl;unicode-bidi:isolate',
  '.egx-access-gate [lang="en"]{direction:ltr;unicode-bidi:isolate}',
  '.egx-access-gate bdi[dir="ltr"]{direction:ltr;unicode-bidi:isolate}',
  '.egx-bidi-pair{display:inline-flex',
  '.egx-gate-storage-status{flex:1 1 100%;width:100%;display:flex;justify-content:center;text-align:center',
  '.egx-gate-storage-status>.egx-bidi-pair{display:grid;justify-items:center',
  '.egx-gate-storage-status>.egx-bidi-pair>[lang]{text-align:center}',
  '.egx-gate-storage-status .egx-bidi-separator{display:none}',
  '.egx-gate-storage-action{flex:1 1 100%;width:100%;display:flex;justify-content:center;text-align:center',
  '.egx-gate-storage-action>.egx-bidi-pair{display:grid;justify-items:center',
  '@media(max-width:860px){.egx-gate-bilingual{grid-template-columns:1fr',
  '.egx-gate-language-block[lang="ar"]{padding-top:12px;border-top:1px solid',
  '.egx-gate-confirmation',
  '.egx-gate-continue',
  '@media(max-width:700px)'
]) assert.ok(css.includes(required), `access gate CSS should include ${required}`);

for (const required of [
  "const VERSION = 'egx-alpha-pwa-v3'",
  "const criticalGateAssets = new Set(['/assets/access-gate.js', '/assets/pwa.css'])",
  'criticalGateAssets.has(relative)',
  "'/assets/access-gate.js'"
]) assert.ok(sw.includes(required), `service worker should include ${required}`);

console.log('test-access-gate passed');
