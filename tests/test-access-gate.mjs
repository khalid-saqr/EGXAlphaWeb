import assert from 'node:assert/strict';
import fs from 'node:fs';

const gate = fs.readFileSync('assets/access-gate.js', 'utf8');
const builtGate = fs.readFileSync('_site/assets/access-gate.js', 'utf8');
const pwa = fs.readFileSync('assets/pwa.js', 'utf8');
const app = fs.readFileSync('assets/app.js', 'utf8');
const css = fs.readFileSync('assets/pwa.css', 'utf8');
const sw = fs.readFileSync('assets/sw.js', 'utf8');

assert.equal(builtGate, gate, 'Pages artifact must ship the exact access-gate module');

for (const required of [
  'EGX Research is an independent research and educational website operated outside the Arab Republic of Egypt.',
  'It aims to strengthen the international visibility and understanding of the Egyptian Exchange by making independent, advanced quantitative market research accessible to audiences outside Egypt.',
  'The service is not licensed by the Egyptian Financial Regulatory Authority and is not offered or directed to persons accessing it from within Egypt.',
  'EGX Research موقع مستقل للبحث والتعليم يُدار من خارج جمهورية مصر العربية.',
  'ويهدف إلى تعزيز الحضور الدولي للبورصة المصرية وتوسيع فهمها لدى الجمهور خارج مصر من خلال إتاحة بحث كمي مستقل ومتقدم عن السوق.',
  'الخدمة غير مرخصة من الهيئة العامة للرقابة المالية المصرية، ولا تُعرض أو تُوجَّه إلى الأشخاص الذين يدخلون إليها من داخل مصر.',
  'I confirm that I am currently accessing EGX Research from outside the Arab Republic of Egypt.',
  'أؤكد أنني أدخل حاليًا إلى EGX Research من خارج جمهورية مصر العربية.',
  'CONTINUE TO EGX /ALPHA',
  'المتابعة إلى EGX /ALPHA',
  'egxalpha-access-ack-v1',
  'egxalpha-storage-optout-v1',
  'aria-modal="true"',
  'data-egx-territorial-confirmation',
  'data-egx-gate-continue disabled',
  'shell.inert = true',
  'Privacy &amp; Device Storage',
  'الخصوصية والتخزين على الجهاز'
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
  '.egx-gate-confirmation',
  '.egx-gate-continue',
  '@media(max-width:700px)'
]) assert.ok(css.includes(required), `access gate CSS should include ${required}`);

assert.ok(sw.includes("'/assets/access-gate.js'"), 'service worker should precache the access-gate module');

console.log('test-access-gate passed');
