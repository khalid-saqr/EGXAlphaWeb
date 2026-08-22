const ACCESS_ACK_KEY = 'egxalpha-access-ack-v1';
const ACCESS_ACK_VALUE = 'outside-egypt-confirmed';
const STORAGE_OPTOUT_KEY = 'egxalpha-storage-optout-v1';
const THEME_KEY = 'egxalpha-theme';
const CACHE_PREFIXES = ['egx-alpha-', 'egxresearch-public-pwa-'];

function safeSessionGet(key) {
  try { return sessionStorage.getItem(key); } catch (_) { return null; }
}
function safeSessionSet(key, value) {
  try { sessionStorage.setItem(key, value); } catch (_) {}
}
function safeLocalGet(key) {
  try { return localStorage.getItem(key); } catch (_) { return null; }
}
function safeLocalSet(key, value) {
  try { sessionStorage.setItem(key, value); } catch (_) {}
}
function safeLocalRemove(key) {
  try { localStorage.removeItem(key); } catch (_) {}
}

export function persistentDeviceStorageEnabled() {
  return safeLocalGet(STORAGE_OPTOUT_KEY) !== '1';
}

async function clearFunctionalStorage() {
  safeLocalRemove(THEME_KEY);
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    } catch (_) {}
  }
  if ('caches' in window) {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter(key => CACHE_PREFIXES.some(prefix => key.startsWith(prefix))).map(key => caches.delete(key)));
    } catch (_) {}
  }
}

async function setPersistentStorageEnabled(enabled) {
  if (enabled) safeLocalRemove(STORAGE_OPTOUT_KEY);
  else {
    safeLocalSet(STORAGE_OPTOUT_KEY, '1');
    await clearFunctionalStorage();
  }
  window.dispatchEvent(new CustomEvent('egx-storage-mode-changed', { detail: { enabled } }));
  return persistentDeviceStorageEnabled();
}

function shellLock(locked) {
  const shell = document.querySelector('.site-shell');
  if (!shell) return;
  if (locked) {
    shell.inert = true;
    shell.setAttribute('aria-hidden', 'true');
  } else {
    shell.inert = false;
    shell.removeAttribute('aria-hidden');
  }
}

function bilingualPair(en, ar) {
  return `<span class="egx-bidi-pair"><span lang="en" dir="ltr">${en}</span><span class="egx-bidi-separator" aria-hidden="true">·</span><span lang="ar" dir="rtl">${ar}</span></span>`;
}

function bilingualLegalCopy() {
  return `<section class="egx-gate-legal" aria-labelledby="egx-gate-territorial-title-en egx-gate-territorial-title-ar">
    <div class="egx-gate-bilingual egx-gate-language-sections">
      <div class="egx-gate-language-block" lang="en" dir="ltr">
        <span class="egx-gate-kicker" id="egx-gate-territorial-title-en">RESEARCH STATUS</span>
        <p><strong>EGX Research</strong> is an independent research publication produced and operated outside the Arab Republic of Egypt by entities that maintain no establishment or branch in Egypt for this activity. The website does not execute transactions, hold client funds, manage portfolios or provide personalised investment advice. Relative Rank, Model Direction and related outputs are general model-generated research classifications; they are not Buy, Hold or Sell recommendations.</p>
        <span class="egx-gate-kicker">TERRITORIAL ACCESS</span>
        <p>EGX Research does not hold or claim a licence or approval from the Egyptian Financial Regulatory Authority, and this public research environment is not offered or directed to persons physically located in Egypt. Technical accessibility through the public internet is not intended to constitute an offering into Egypt.</p>
      </div>
      <div class="egx-gate-language-block" lang="ar" dir="rtl">
        <span class="egx-gate-kicker" id="egx-gate-territorial-title-ar">الصفة البحثية</span>
        <p><strong><bdi dir="ltr">EGX Research</bdi></strong> منشور بحثي مستقل يُنتج ويُدار من خارج جمهورية مصر العربية بواسطة جهات لا تملك منشأة أو فرعاً في مصر لمزاولة هذا النشاط. ولا ينفذ الموقع معاملات، أو يحتفظ بأموال العملاء، أو يدير محافظ، أو يقدم استشارات استثمارية شخصية. ويُعد الترتيب النسبي واتجاه النموذج والمخرجات ذات الصلة تصنيفات بحثية عامة مولدة بواسطة النموذج، وليست توصيات شراء أو احتفاظ أو بيع.</p>
        <span class="egx-gate-kicker">نطاق الوصول</span>
        <p>لا تحمل <bdi dir="ltr">EGX Research</bdi> ولا تدعي ترخيصاً أو اعتماداً من الهيئة العامة للرقابة المالية المصرية، ولا تُعرض هذه البيئة البحثية العامة أو تُوجَّه إلى أشخاص موجودين فعلياً داخل مصر. ولا يُقصد من الإتاحة التقنية عبر الإنترنت العام أن تمثل عرضاً للخدمة داخل مصر.</p>
      </div>
    </div>
  </section>`;
}

function privacyCopy() {
  return `<section class="egx-gate-privacy" aria-labelledby="egx-gate-privacy-title-en egx-gate-privacy-title-ar">
    <div class="egx-gate-bilingual egx-gate-bilingual-compact egx-gate-language-sections">
      <div class="egx-gate-language-block" lang="en" dir="ltr">
        <span class="egx-gate-kicker" id="egx-gate-privacy-title-en">PRIVACY &amp; DEVICE STORAGE</span>
        <p>This website does not use advertising, behavioural-tracking or profiling cookies. It may remember functional preferences such as appearance and may cache first-party public content to support the installable web application. Access acknowledgement is session-based.</p>
      </div>
      <div class="egx-gate-language-block" lang="ar" dir="rtl">
        <span class="egx-gate-kicker" id="egx-gate-privacy-title-ar">الخصوصية والتخزين على الجهاز</span>
        <p>لا يستخدم الموقع ملفات تعريف ارتباط إعلانية أو للتتبع السلوكي أو بناء الملفات الشخصية. وقد يتذكر بعض التفضيلات الوظيفية مثل المظهر، كما قد يحفظ محتوى عاماً من الطرف الأول لدعم تطبيق الويب القابل للتثبيت. ويقتصر تأكيد الدخول على جلسة الاستخدام الحالية.</p>
      </div>
    </div>
    <div class="egx-gate-storage-row">
      <span class="egx-gate-storage-status" data-egx-storage-status></span>
      <button class="egx-gate-storage-action" type="button" data-egx-storage-toggle></button>
    </div>
  </section>`;
}

function fullGateMarkup() {
  return `<div class="egx-access-gate" data-egx-access-gate role="presentation">
    <section class="egx-access-card" role="dialog" aria-modal="true" aria-labelledby="egx-gate-title" aria-describedby="egx-gate-intro">
      <header class="egx-gate-header">
        <div class="egx-gate-mark" aria-hidden="true"><span>/</span><strong>A</strong></div>
        <div>
          <span class="egx-gate-eyebrow"><span lang="en" dir="ltr">PUBLIC QUANTITATIVE RESEARCH ENVIRONMENT</span><span lang="ar" dir="rtl">بيئة عامة للبحث الكمي</span></span>
          <h1 id="egx-gate-title"><span lang="en" dir="ltr">A research digital twin of the Egyptian equity market</span><span lang="ar" dir="rtl">توأم رقمي بحثي لسوق الأسهم المصري</span></h1>
          <p id="egx-gate-intro"><span lang="en" dir="ltr">EGX /Alpha is a continuously updated research digital twin of the Egyptian equity market. Its purpose-built deep-learning engine publishes a general, non-personalised representation of relative behaviour across the eligible equity universe after each completed EGX session, for quantitative market research, financial literacy and reproducible study.</span><span lang="ar" dir="rtl"><bdi dir="ltr">EGX /Alpha</bdi> توأم رقمي بحثي متجدد لسوق الأسهم المصري. وينشر محرك التعلم العميق المتخصص تمثيلاً بحثياً عاماً وغير شخصي للسلوك النسبي لمجموعة الأسهم المؤهلة بعد كل جلسة مكتملة في البورصة المصرية، للبحث الكمي في السوق ودعم الثقافة المالية والدراسة القابلة لإعادة التحقق.</span></p>
        </div>
      </header>
      ${bilingualLegalCopy()}
      ${privacyCopy()}
      <label class="egx-gate-confirmation" for="egx-outside-egypt-confirmation">
        <input id="egx-outside-egypt-confirmation" type="checkbox" data-egx-territorial-confirmation>
        <span class="egx-gate-checkmark" aria-hidden="true"></span>
        <span class="egx-gate-confirmation-copy">
          <strong lang="en" dir="ltr">I confirm that I am physically located outside the Arab Republic of Egypt and am accessing EGX Research from outside Egypt.</strong>
          <strong lang="ar" dir="rtl">أؤكد أنني موجود فعلياً خارج جمهورية مصر العربية، وأنني أدخل إلى <bdi dir="ltr">EGX Research</bdi> من خارج مصر.</strong>
        </span>
      </label>
      <p class="egx-gate-egypt-note"><span lang="en" dir="ltr">If you are physically located in Egypt, do not confirm this statement or continue into the public research environment.</span><span lang="ar" dir="rtl">إذا كنت موجوداً فعلياً داخل مصر، فلا تؤكد هذه العبارة ولا تتابع الدخول إلى بيئة البحث العامة.</span></p>
      <button class="egx-gate-continue" type="button" data-egx-gate-continue disabled>
        <span lang="en" dir="ltr">ENTER RESEARCH ENVIRONMENT</span>
        <span lang="ar" dir="rtl">الدخول إلى البيئة البحثية</span>
      </button>
    </section>
  </div>`;
}

function settingsMarkup() {
  return `<div class="egx-access-gate egx-storage-settings" data-egx-storage-dialog role="presentation">
    <section class="egx-access-card egx-storage-card" role="dialog" aria-modal="true" aria-labelledby="egx-storage-title">
      <header class="egx-gate-header">
        <div class="egx-gate-mark" aria-hidden="true"><span>/</span><strong>A</strong></div>
        <div><span class="egx-gate-eyebrow">EGX RESEARCH · /ALPHA</span><h1 id="egx-storage-title"><span lang="en" dir="ltr">Privacy &amp; Device Storage</span><span lang="ar" dir="rtl">الخصوصية والتخزين على الجهاز</span></h1></div>
      </header>
      ${privacyCopy()}
      <button class="egx-gate-continue egx-storage-close" type="button" data-egx-storage-close><span lang="en" dir="ltr">CLOSE SETTINGS</span><span lang="ar" dir="rtl">إغلاق الإعدادات</span></button>
    </section>
  </div>`;
}

function updateStorageControls(root) {
  const enabled = persistentDeviceStorageEnabled();
  root.querySelectorAll('[data-egx-storage-status]').forEach(node => {
    const en = enabled ? 'Functional storage enabled' : 'Persistent functional storage disabled';
    const ar = enabled ? 'التخزين الوظيفي مفعّل' : 'التخزين الوظيفي المستمر معطّل';
    node.innerHTML = bilingualPair(en, ar);
  });
  root.querySelectorAll('[data-egx-storage-toggle]').forEach(button => {
    const en = enabled ? 'Use without persistent device storage' : 'Enable functional device storage';
    const ar = enabled ? 'استخدام الموقع دون تخزين مستمر' : 'تفعيل التخزين الوظيفي على الجهاز';
    button.innerHTML = bilingualPair(en, ar);
    button.setAttribute('aria-label', `${en} · ${ar}`);
    button.dataset.storageEnabled = enabled ? 'true' : 'false';
  });
}

function bindStorageControls(root) {
  updateStorageControls(root);
  root.querySelectorAll('[data-egx-storage-toggle]').forEach(button => {
    button.addEventListener('click', async () => {
      button.disabled = true;
      const nextEnabled = !persistentDeviceStorageEnabled();
      await setPersistentStorageEnabled(nextEnabled);
      updateStorageControls(root);
      button.disabled = false;
    });
  });
}

function trapFocus(dialog, closeHandler) {
  const keyHandler = event => {
    if (event.key === 'Escape') {
      if (closeHandler) closeHandler();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  document.addEventListener('keydown', keyHandler);
  return () => document.removeEventListener('keydown', keyHandler);
}

function addPersistentSettingsControl() {
  if (document.querySelector('[data-egx-open-storage-settings]')) return;
  const footer = document.querySelector('.footer-provenance');
  if (!footer) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'egx-footer-storage-settings';
  button.dataset.egxOpenStorageSettings = '';
  button.innerHTML = bilingualPair('Privacy &amp; storage', 'الخصوصية والتخزين');
  button.setAttribute('aria-label', 'Privacy & storage · الخصوصية والتخزين');
  const rights = footer.querySelector('.footer-rights');
  if (rights) rights.insertAdjacentElement('beforebegin', button);
  else footer.appendChild(button);
  button.addEventListener('click', openStorageSettings);
}

function openStorageSettings() {
  if (document.querySelector('[data-egx-storage-dialog]')) return;
  document.body.insertAdjacentHTML('beforeend', settingsMarkup());
  const overlay = document.querySelector('[data-egx-storage-dialog]');
  const card = overlay?.querySelector('.egx-storage-card');
  if (!overlay || !card) return;
  document.documentElement.classList.add('egx-settings-open');
  bindStorageControls(overlay);
  const close = () => {
    cleanupTrap();
    overlay.remove();
    document.documentElement.classList.remove('egx-settings-open');
    document.querySelector('[data-egx-open-storage-settings]')?.focus();
  };
  const cleanupTrap = trapFocus(card, close);
  overlay.querySelector('[data-egx-storage-close]')?.addEventListener('click', close);
  overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
  card.querySelector('button')?.focus();
}

export async function initAccessGate() {
  const acknowledged = safeSessionGet(ACCESS_ACK_KEY) === ACCESS_ACK_VALUE;
  if (acknowledged) {
    document.documentElement.classList.add('egx-access-granted');
    document.documentElement.classList.remove('egx-access-gated');
    shellLock(false);
    addPersistentSettingsControl();
    return { granted: true, storageAllowed: persistentDeviceStorageEnabled() };
  }

  document.documentElement.classList.add('egx-access-gated');
  document.documentElement.classList.remove('egx-access-granted');
  shellLock(true);
  document.body.insertAdjacentHTML('beforeend', fullGateMarkup());
  const overlay = document.querySelector('[data-egx-access-gate]');
  const card = overlay?.querySelector('.egx-access-card');
  const checkbox = overlay?.querySelector('[data-egx-territorial-confirmation]');
  const continueButton = overlay?.querySelector('[data-egx-gate-continue]');
  if (!overlay || !card || !checkbox || !continueButton) return new Promise(() => {});

  bindStorageControls(overlay);
  checkbox.addEventListener('change', () => { continueButton.disabled = !checkbox.checked; });
  const cleanupTrap = trapFocus(card, null);

  return new Promise(resolve => {
    continueButton.addEventListener('click', () => {
      if (!checkbox.checked) return;
      safeSessionSet(ACCESS_ACK_KEY, ACCESS_ACK_VALUE);
      cleanupTrap();
      overlay.remove();
      shellLock(false);
      document.documentElement.classList.remove('egx-access-gated');
      document.documentElement.classList.add('egx-access-granted');
      addPersistentSettingsControl();
      resolve({ granted: true, storageAllowed: persistentDeviceStorageEnabled() });
    });
    checkbox.focus();
  });
}