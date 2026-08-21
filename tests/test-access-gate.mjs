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
  'ADVANCED DEEP-LEARNING RESEARCH ON THE EGYPTIAN EXCHANGE',
  'بحث متقدم بالتعلم العميق حول البورصة المصرية',
  'Purpose-built quantitative intelligence designed to broaden international understanding and research visibility of the Egyptian market.',
  'ذكاء كمي متخصص طُوّر لتوسيع الفهم الدولي للسوق المصري وتعزيز حضوره البحثي خارج مصر.',
  'TERRITORIAL ACCESS &amp; REGULATORY STATUS',
  'نطاق الوصول والصفة التنظيمية',
  'EGX Research is an independent research publication and educational website produced and operated outside the Arab Republic of Egypt by entities that maintain no establishment or branch in Egypt for the conduct of this activity.',
  'EGX /Alpha uses purpose-built deep-learning models to publish general, non-personalised quantitative research on the Egyptian Exchange.',
  'The website does not execute transactions, hold client funds, manage portfolios or provide personalised investment advice.',
  'The service does not hold or claim a licence or approval from the Egyptian Financial Regulatory Authority and is not offered or directed to persons located in Egypt.',
  'Its technical accessibility over the public internet is not intended to constitute an offering of the service into Egypt.',
  'EGX Research منشور بحثي وموقع تعليمي مستقل يُنتج ويُدار من خارج جمهورية مصر العربية بواسطة جهات لا تملك منشأة أو فرعًا في مصر لمزاولة هذا النشاط.',
  'يستخدم EGX /Alpha نماذج تعلم عميق متخصصة لنشر بحث كمي عام وغير شخصي عن البورصة المصرية.',
  'ولا ينفذ الموقع معاملات، أو يحتفظ بأموال العملاء، أو يدير محافظ، أو يقدم استشارات استثمارية شخصية.',
  'الخدمة لا تحمل ولا تدّعي الحصول على ترخيص أو اعتماد من الهيئة العامة للرقابة المالية المصرية، ولا تُعرض أو تُوجَّه إلى أشخاص موجودين داخل مصر.',
  'ولا يُقصد من مجرد إتاحتها التقنية عبر شبكة الإنترنت أن يمثل ذلك عرضًا للخدمة داخل جمهورية مصر العربية.',
  'I confirm that I am physically located outside the Arab Republic of Egypt and am accessing EGX Research from outside Egypt.',
  'أقر بأنني موجود فعليًا خارج جمهورية مصر العربية وأنني أدخل إلى EGX Research من خارجها.',
  'If you are physically located in Egypt, do not confirm the statement below or continue.',
  'إذا كنت موجودًا فعليًا داخل جمهورية مصر العربية، فلا تؤكد الإقرار التالي ولا تتابع الدخول.',
  'CONTINUE TO EGX /ALPHA',
  'المتابعة إلى EGX /ALPHA'
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
  'button.innerHTML = bilingualPair(en, ar)'
]) assert.ok(gate.includes(required), `access gate should include ${required}`);

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
  '.egx-access-gate [lang="ar"]{direction:rtl;unicode-bidi:isolate',
  '.egx-access-gate [lang="en"]{direction:ltr;unicode-bidi:isolate}',
  '.egx-access-gate bdi[dir="ltr"]{direction:ltr;unicode-bidi:isolate}',
  '.egx-bidi-pair{display:inline-flex',
  '@media(max-width:860px){.egx-gate-bilingual{grid-template-columns:1fr',
  '.egx-gate-confirmation',
  '.egx-gate-continue',
  '@media(max-width:700px)'
]) assert.ok(css.includes(required), `access gate CSS should include ${required}`);

assert.ok(sw.includes("'/assets/access-gate.js'"), 'service worker should precache the access-gate module');

console.log('test-access-gate passed');
