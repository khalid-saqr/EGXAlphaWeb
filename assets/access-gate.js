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
  try { localStorage.setItem(key, value); } catch (_) {}
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
  if (enabled) {
    safeLocalRemove(STORAGE_OPTOUT_KEY);
  } else {
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
        <span class="egx-gate-kicker" id="egx-gate-territorial-title-en">TERRITORIAL ACCESS &amp; REGULATORY STATUS</span>
        <p><strong>EGX Research</strong> is an independent research publication and educational website produced and operated outside the Arab Republic of Egypt by entities that maintain no establishment or branch in Egypt for the conduct of this activity. EGX /Alpha uses purpose-built deep-learning models to publish general, non-personalised quantitative research on the Egyptian Exchange. The website does not execute transactions, hold client funds, manage portfolios or provide personalised investment advice.<br><br>The service does not hold or claim a licence or approval from the Egyptian Financial Regulatory Authority and is not offered or directed to persons located in Egypt. Its technical accessibility over the public internet is not intended to constitute an offering of the service into Egypt.</p>
      </div>
      <div class="egx-gate-language-block" lang="ar" dir="rtl">
        <span class="egx-gate-kicker" id="egx-gate-territorial-title-ar">نطاق الوصول والصفة التنظيمية</span>
        <p><strong><bdi dir="ltr">EGX Research</bdi></strong> منشور بحثي وموقع تعليمي مستقل يُنتج ويُدار من خارج جمهورية مصر العربية بواسطة جهات لا تملك منشأة أو فرعًا في مصر لمزاولة هذا النشاط. يستخدم <bdi dir="ltr">EGX /Alpha</bdi> نماذج تعلم عميق متخصصة لنشر بحث كمي عام وغير شخصي عن البورصة المصرية. ولا ينفذ الموقع معاملات، أو يحتفظ بأموال العملاء، أو يدير محافظ، أو يقدم استشارات استثمارية شخصية.<br><br>الخدمة لا تحمل ولا تدّعي الحصول على ترخيص أو اعتماد من الهيئة العامة للرقابة المالية المصرية، ولا تُعرض أو تُوجَّه إلى أشخاص موجودين داخل مصر. ولا يُقصد من مجرد إتاحتها التقنية عبر شبكة الإنترنت أن يمثل ذلك عرضًا للخدمة داخل جمهورية مصر العربية.</p>
      </div>
    </div>
  </section>`;
}

function privacyCopy() {
  return `<section class="egx-gate-privacy" aria-labelledby="egx-gate-privacy-title-en egx-gate-privacy-title-ar">
    <div class="egx-gate-bilingual egx-gate-bilingual-compact egx-gate-language-sections">
      <div class="egx-gate-language-block" lang="en" dir="ltr">
        <span class="egx-gate-kicker" id="egx-gate-privacy-title-en">PRIVACY &amp; DEVICE STORAGE</span>
        <p>EGX Research uses no advertising, analytics or behavioural-tracking cookies. After access, the site may remember an appearance preference and cache first-party content for performance and offline/PWA functionality. A session-only access acknowledgement avoids repeating this gate during the same browser session. None of this is used to profile visitors or shared with advertisers.</p>
      </div>
      <div class="egx-gate-language-block" lang="ar" dir="rtl">
        <span class="egx-gate-kicker" id="egx-gate-privacy-title-ar">الخصوصية والتخزين على الجهاز</span>
        <p>لا تستخدم <bdi dir="ltr">EGX Research</bdi> ملفات تعريف ارتباط إعلانية أو تحليلية أو تقنيات لتتبع السلوك. بعد الدخول، قد يتذكر الموقع تفضيل المظهر ويخزن محتوى من الموقع نفسه لتحسين الأداء ودعم العمل دون اتصال وخصائص التطبيق. ويُستخدم إقرار وصول خاص بالجلسة فقط لتجنب تكرار هذه البوابة خلال جلسة المتصفح نفسها. ولا تُستخدم هذه البيانات لإنشاء ملف سلوكي للزوار أو مشاركتها مع المعلنين.</p>
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
          <span class="egx-gate-eyebrow">EGX RESEARCH · /ALPHA</span>
          <h1 id="egx-gate-title"><span lang="en" dir="ltr">ADVANCED DEEP-LEARNING RESEARCH ON THE EGYPTIAN EXCHANGE</span><span lang="ar" dir="rtl">بحث متقدم بالتعلم العميق حول البورصة المصرية</span></h1>
          <p id="egx-gate-intro"><span lang="en" dir="ltr">Purpose-built quantitative intelligence designed to broaden international understanding and research visibility of the Egyptian market.</span><span lang="ar" dir="rtl">ذكاء كمي متخصص طُوّر لتوسيع الفهم الدولي للسوق المصري وتعزيز حضوره البحثي خارج مصر.</span></p>
        </div>
      </header>
      ${bilingualLegalCopy()}
      ${privacyCopy()}
      <label class="egx-gate-confirmation" for="egx-outside-egypt-confirmation">
        <input id="egx-outside-egypt-confirmation" type="checkbox" data-egx-territorial-confirmation>
        <span class="egx-gate-checkmark" aria-hidden="true"></span>
        <span class="egx-gate-confirmation-copy">
          <strong lang="en" dir="ltr">I confirm that I am physically located outside the Arab Republic of Egypt and am accessing EGX Research from outside Egypt.</strong>
          <strong lang="ar" dir="rtl">أقر بأنني موجود فعليًا خارج جمهورية مصر العربية وأنني أدخل إلى <bdi dir="ltr">EGX Research</bdi> من خارجها.</strong>
        </span>
      </label>
      <p class="egx-gate-egypt-note"><span lang="en" dir="ltr">If you are physically located in Egypt, do not confirm the statement below or continue.</span><span lang="ar" dir="rtl">إذا كنت موجودًا فعليًا داخل جمهورية مصر العربية، فلا تؤكد الإقرار التالي ولا تتابع الدخول.</span></p>
      <button class="egx-gate-continue" type="button" data-egx-gate-continue disabled>
        <span lang="en" dir="ltr">CONTINUE TO EGX /ALPHA</span>
        <span lang="ar" dir="rtl">المتابعة إلى <bdi dir="ltr">EGX /ALPHA</bdi></span>
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
